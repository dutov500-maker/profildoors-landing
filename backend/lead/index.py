import json
import os
import re
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


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта и сохраняет её в базу — менеджеры видят её в панели управления."""
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
    conn.close()

    return reply(200, {'ok': True, 'id': lead_id})
