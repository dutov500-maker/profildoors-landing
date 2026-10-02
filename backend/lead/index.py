import json
import os
import re
import html
import urllib.request
import urllib.error

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


def handler(event: dict, context) -> dict:
    """Принимает заявку на вызов замерщика с сайта и отправляет её в Telegram-чат салона."""
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

    token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
    if not token or not chat_id:
        return reply(500, {'ok': False, 'error': 'Telegram не настроен'})

    e = html.escape
    text = (
        '🔥 <b>Новая заявка на вызов замерщика!</b>\n\n'
        f'👤 <b>Имя:</b> {e(name)}\n'
        f'📞 <b>Телефон:</b> {e(phone)}\n'
        f'📍 <b>Адрес / Комментарий:</b> {e(comment) or "—"}\n'
        f'🌐 <b>Страница:</b> {e(page) or "—"}'
    )
    if source:
        text += f'\n🏷 <b>Источник:</b> {e(source)}'

    payload = json.dumps({'chat_id': chat_id, 'parse_mode': 'HTML', 'text': text}).encode()
    req = urllib.request.Request(
        f'https://api.telegram.org/bot{token}/sendMessage',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            ok = r.status == 200
    except urllib.error.HTTPError as err:
        print('Telegram error', err.code, err.read().decode()[:300])
        return reply(502, {'ok': False, 'error': 'Не удалось отправить заявку'})

    return reply(200 if ok else 502, {'ok': ok})
