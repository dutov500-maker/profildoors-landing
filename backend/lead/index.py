import html
import json
import os
import re
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, wait

import psycopg2

BOTS = [
    ('TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'),
    ('TELEGRAM_BOT2_TOKEN', 'TELEGRAM_BOT2_CHAT_ID'),
]

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


def send_one(token: str, chat_id: str, text: str) -> bool:
    payload = json.dumps({'chat_id': chat_id, 'parse_mode': 'HTML', 'text': text}).encode()
    req = urllib.request.Request(
        f'https://api.telegram.org/bot{token}/sendMessage',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=2.5) as r:
            return r.status == 200
    except urllib.error.HTTPError as err:
        print('Telegram HTTP error', err.code, err.read().decode()[:200])
    except (urllib.error.URLError, TimeoutError, OSError) as err:
        print('Telegram error', str(err)[:200])
    return False


def notify(text: str) -> bool:
    targets = [
        (os.environ.get(t, '').strip(), os.environ.get(c, '').strip())
        for t, c in BOTS
    ]
    targets = [x for x in targets if x[0] and x[1]]
    if not targets:
        return False
    pool = ThreadPoolExecutor(max_workers=len(targets))
    futures = [pool.submit(send_one, t, c, text) for t, c in targets]
    done, _ = wait(futures, timeout=3)
    pool.shutdown(wait=False)
    return any(f.result() for f in done)


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта, сохраняет её в базу и пробует продублировать в Telegram-ботов."""
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
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(
        f'INSERT INTO {schema}.leads (name, phone, comment, page, source) '
        f'VALUES ({q(name)}, {q(phone)}, {q(comment)}, {q(page)}, {q(source)}) RETURNING id'
    )
    lead_id = cur.fetchone()[0]

    e = html.escape
    text = (
        f'🔥 <b>{e(source) or "Новая заявка"}</b> (№{lead_id})\n\n'
        f'👤 <b>Имя:</b> {e(name)}\n'
        f'📞 <b>Телефон:</b> {e(phone)}\n'
        f'📝 <b>Комментарий:</b> {e(comment) or "—"}\n'
        f'🌐 <b>Страница:</b> {e(page) or "—"}'
    )
    if notify(text):
        cur.execute(f'UPDATE {schema}.leads SET telegram_sent = TRUE WHERE id = {int(lead_id)}')
    conn.close()

    return reply(200, {'ok': True, 'id': lead_id})