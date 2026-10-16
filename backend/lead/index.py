import json
import os
import re
import html
import urllib.request
import urllib.error
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
}


def reply(status: int, data: dict) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False),
    }


def q(v: str) -> str:
    return "'" + v.replace("'", "''") + "'"


def db_query(sql: str):
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(sql)
    row = cur.fetchone() if cur.description else None
    conn.close()
    return row


def send_telegram(text: str) -> bool:
    token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
    if not token or not chat_id:
        print('Telegram не настроен')
        return False
    payload = json.dumps({'chat_id': chat_id, 'parse_mode': 'HTML', 'text': text}).encode()
    req = urllib.request.Request(
        f'https://api.telegram.org/bot{token}/sendMessage',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=3) as r:
            return r.status == 200
    except urllib.error.HTTPError as err:
        print('Telegram HTTP error', err.code, err.read().decode()[:300])
        return False
    except (urllib.error.URLError, TimeoutError, OSError) as err:
        print('Telegram error', str(err)[:300])
        return False


def lead_text(lead_id, name, phone, comment, page, source) -> str:
    e = html.escape
    title = e(source) if source else 'Новая заявка'
    return (
        f'🔥 <b>{title}</b> (№{lead_id})\n\n'
        f'👤 <b>Имя:</b> {e(name)}\n'
        f'📞 <b>Телефон:</b> {e(phone)}\n'
        f'📝 <b>Комментарий:</b> {e(comment or "") or "—"}\n'
        f'🌐 <b>Страница:</b> {e(page or "") or "—"}'
    )


def resend_pending(schema: str, limit: int = 5) -> int:
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(
        f'SELECT id, name, phone, comment, page, source FROM {schema}.leads '
        f'WHERE telegram_sent = FALSE ORDER BY id LIMIT {int(limit)}'
    )
    rows = cur.fetchall()
    sent = 0
    for row in rows:
        if not send_telegram(lead_text(*row)):
            break
        cur.execute(f'UPDATE {schema}.leads SET telegram_sent = TRUE WHERE id = {int(row[0])}')
        sent += 1
    conn.close()
    return sent


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта, сохраняет её в базу и дублирует в Telegram-чат салона."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}
    if event.get('httpMethod') != 'POST':
        return reply(405, {'ok': False, 'error': 'Метод не поддерживается'})

    body = json.loads(event.get('body') or '{}')
    name = str(body.get('name', '')).strip()[:100]
    phone = str(body.get('phone', '')).strip()[:40]
    comment = str(body.get('comment', '')).strip()[:1000]
    page = str(body.get('page', '')).strip()[:200]
    source = str(body.get('source', '')).strip()[:200]

    if len(name) < 2:
        return reply(400, {'ok': False, 'error': 'Укажите имя'})
    if len(re.sub(r'\D', '', phone)) < 10:
        return reply(400, {'ok': False, 'error': 'Телефон должен содержать минимум 10 цифр'})

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    lead_id = db_query(
        f'INSERT INTO {schema}.leads (name, phone, comment, page, source) '
        f'VALUES ({q(name)}, {q(phone)}, {q(comment)}, {q(page)}, {q(source)}) RETURNING id'
    )[0]

    sent = resend_pending(schema, limit=3)
    print('Telegram sent', sent)

    return reply(200, {'ok': True, 'id': lead_id})