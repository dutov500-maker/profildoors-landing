import base64
import hashlib
import io
import json
import os
import re
import secrets
import uuid

import bcrypt
import boto3
import psycopg2
import psycopg2.extras
from PIL import Image

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}

SESSION_HOURS = 8
MAX_FAILS = 5
LOCK_MINUTES = 15
MAX_UPLOAD = 5 * 1024 * 1024
ALLOWED_FORMATS = {'JPEG', 'PNG', 'WEBP'}
QUIZ_TYPES = {'invisible', 'interior', 'glass', 'entry'}
STATUSES = {'published', 'draft'}


def reply(status: int, data: dict) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store'},
        'body': json.dumps(data, ensure_ascii=False, default=str),
    }


def q(v) -> str:
    return "'" + str(v).replace("'", "''") + "'"


def schema() -> str:
    return os.environ.get('MAIN_DB_SCHEMA', 'public')


class Db:
    def __init__(self):
        self.conn = psycopg2.connect(os.environ['DATABASE_URL'])
        self.conn.autocommit = True
        self.cur = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    def all(self, sql: str):
        self.cur.execute(sql)
        return self.cur.fetchall()

    def one(self, sql: str):
        self.cur.execute(sql)
        return self.cur.fetchone() if self.cur.description else None

    def run(self, sql: str):
        self.cur.execute(sql)

    def close(self):
        self.conn.close()


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def client_ip(event: dict) -> str:
    return str(((event.get('requestContext') or {}).get('identity') or {}).get('sourceIp') or 'unknown')[:64]


def bootstrap_admin(db: Db):
    s = schema()
    if db.one(f'SELECT id FROM {s}.admins LIMIT 1'):
        return
    login = os.environ.get('ADMIN_LOGIN', '').strip()
    password = os.environ.get('ADMIN_PASSWORD', '')
    if not login or len(password) < 8:
        return
    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()
    db.run(f'INSERT INTO {s}.admins (login, password_hash) VALUES ({q(login)}, {q(pw_hash)}) ON CONFLICT (login) DO NOTHING')


def do_login(db: Db, event: dict, body: dict) -> dict:
    s = schema()
    ip = client_ip(event)
    login = str(body.get('login', '')).strip()[:80]
    password = str(body.get('password', ''))[:200]

    fails = db.one(
        f"SELECT COUNT(*) AS n, MAX(created_at) AS last FROM {s}.login_attempts "
        f"WHERE success = FALSE AND (ip = {q(ip)} OR login = {q(login)}) "
        f"AND created_at > NOW() - INTERVAL '{LOCK_MINUTES} minutes'"
    )
    if fails and fails['n'] >= MAX_FAILS:
        return reply(429, {'error': f'Слишком много попыток. Вход заблокирован на {LOCK_MINUTES} минут.'})

    bootstrap_admin(db)
    admin = db.one(f'SELECT id, password_hash FROM {s}.admins WHERE login = {q(login)}')
    ok = bool(admin) and bcrypt.checkpw(password.encode(), admin['password_hash'].encode())
    if not admin:
        bcrypt.checkpw(b'dummy', bcrypt.hashpw(b'x', bcrypt.gensalt(rounds=4)))

    db.run(f'INSERT INTO {s}.login_attempts (ip, login, success) VALUES ({q(ip)}, {q(login)}, {"TRUE" if ok else "FALSE"})')
    if not ok:
        left = MAX_FAILS - (fails['n'] if fails else 0) - 1
        msg = 'Неверный логин или пароль.'
        if left <= 0:
            msg += f' Вход заблокирован на {LOCK_MINUTES} минут.'
        else:
            msg += f' Осталось попыток: {left}.'
        return reply(401, {'error': msg})

    db.run(f"DELETE FROM {s}.admin_sessions WHERE expires_at < NOW()")
    db.run(f"DELETE FROM {s}.login_attempts WHERE created_at < NOW() - INTERVAL '1 day'")
    token = secrets.token_urlsafe(48)
    db.run(
        f"INSERT INTO {s}.admin_sessions (admin_id, token_hash, expires_at) "
        f"VALUES ({int(admin['id'])}, {q(token_hash(token))}, NOW() + INTERVAL '{SESSION_HOURS} hours')"
    )
    return reply(200, {'token': token, 'login': login, 'expiresInHours': SESSION_HOURS})


def current_admin(db: Db, event: dict):
    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    token = headers.get('x-auth-token', '')
    if not token or len(token) > 200:
        return None
    return db.one(
        f"SELECT a.id, a.login FROM {schema()}.admin_sessions s JOIN {schema()}.admins a ON a.id = s.admin_id "
        f"WHERE s.token_hash = {q(token_hash(token))} AND s.expires_at > NOW()"
    )


def slugify(name: str) -> str:
    base = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    return (base or 'cat')[:40] + '-' + uuid.uuid4().hex[:6]


def all_data(db: Db) -> dict:
    s = schema()
    return {
        'categories': db.all(f'SELECT id, slug, name, quiz_type, sort_order FROM {s}.categories ORDER BY sort_order, id'),
        'products': db.all(
            f'SELECT id, category_id, name, series, badge, description, price, image_url, status, sort_order, updated_at '
            f'FROM {s}.products ORDER BY sort_order, id'
        ),
    }


def save_category(db: Db, body: dict) -> dict:
    s = schema()
    name = str(body.get('name', '')).strip()[:120]
    quiz = str(body.get('quiz_type', 'interior'))
    if len(name) < 2:
        return reply(400, {'error': 'Название категории — минимум 2 символа'})
    if quiz not in QUIZ_TYPES:
        quiz = 'interior'
    cid = body.get('id')
    if cid:
        db.run(f'UPDATE {s}.categories SET name = {q(name)}, quiz_type = {q(quiz)} WHERE id = {int(cid)}')
    else:
        nxt = db.one(f'SELECT COALESCE(MAX(sort_order), 0) + 10 AS n FROM {s}.categories')['n']
        db.run(
            f'INSERT INTO {s}.categories (slug, name, quiz_type, sort_order) '
            f'VALUES ({q(slugify(name))}, {q(name)}, {q(quiz)}, {int(nxt)})'
        )
    return reply(200, all_data(db))


def delete_category(db: Db, body: dict) -> dict:
    s = schema()
    cid = int(body.get('id', 0))
    used = db.one(f'SELECT COUNT(*) AS n FROM {s}.products WHERE category_id = {cid}')['n']
    if used:
        return reply(409, {'error': f'В категории {used} мод. — сначала перенесите или удалите их'})
    db.run(f'DELETE FROM {s}.categories WHERE id = {cid}')
    return reply(200, all_data(db))


def reorder(db: Db, table: str, body: dict) -> dict:
    ids = [int(i) for i in (body.get('ids') or [])][:500]
    for pos, i in enumerate(ids):
        db.run(f'UPDATE {schema()}.{table} SET sort_order = {(pos + 1) * 10} WHERE id = {i}')
    return reply(200, all_data(db))


def save_product(db: Db, body: dict) -> dict:
    s = schema()
    name = str(body.get('name', '')).strip()[:160]
    if len(name) < 2:
        return reply(400, {'error': 'Укажите название модели'})
    cat = body.get('category_id')
    if not cat or not db.one(f'SELECT id FROM {s}.categories WHERE id = {int(cat)}'):
        return reply(400, {'error': 'Выберите категорию'})
    try:
        price = max(0, min(int(float(body.get('price') or 0)), 100_000_000))
        sort_order = int(body.get('sort_order') or 0)
    except (TypeError, ValueError):
        return reply(400, {'error': 'Цена и порядок должны быть числами'})
    status = body.get('status') if body.get('status') in STATUSES else 'draft'
    image = str(body.get('image_url', '')).strip()[:500]
    cdn_prefix = f"https://cdn.poehali.dev/projects/{os.environ.get('AWS_ACCESS_KEY_ID', '')}/"
    if image and not (image.startswith('/img/') or image.startswith(cdn_prefix)):
        return reply(400, {'error': 'Фото нужно загрузить через форму'})
    fields = {
        'category_id': str(int(cat)),
        'name': q(name),
        'series': q(str(body.get('series', '')).strip()[:160]),
        'badge': q(str(body.get('badge', '')).strip()[:60]),
        'description': q(str(body.get('description', '')).strip()[:600]),
        'price': str(price),
        'image_url': q(image),
        'status': q(status),
        'sort_order': str(sort_order),
    }
    pid = body.get('id')
    if pid:
        sets = ', '.join(f'{k} = {v}' for k, v in fields.items())
        db.run(f'UPDATE {s}.products SET {sets}, updated_at = NOW() WHERE id = {int(pid)}')
    else:
        db.run(f"INSERT INTO {s}.products ({', '.join(fields)}) VALUES ({', '.join(fields.values())})")
    return reply(200, all_data(db))


def delete_product(db: Db, body: dict) -> dict:
    db.run(f'DELETE FROM {schema()}.products WHERE id = {int(body.get("id", 0))}')
    return reply(200, all_data(db))


def upload_image(body: dict) -> dict:
    mime = str(body.get('mime', ''))
    if mime not in ('image/jpeg', 'image/png', 'image/webp'):
        return reply(400, {'error': 'Можно загружать только JPEG, PNG или WEBP'})
    raw_b64 = str(body.get('data', ''))
    if ',' in raw_b64[:100]:
        raw_b64 = raw_b64.split(',', 1)[1]
    if len(raw_b64) > MAX_UPLOAD * 4 // 3 + 8:
        return reply(413, {'error': 'Файл больше 5 МБ'})
    try:
        raw = base64.b64decode(raw_b64, validate=True)
    except ValueError:
        return reply(400, {'error': 'Файл повреждён'})
    if len(raw) > MAX_UPLOAD:
        return reply(413, {'error': 'Файл больше 5 МБ'})
    try:
        img = Image.open(io.BytesIO(raw))
        fmt = img.format
        img.verify()
        img = Image.open(io.BytesIO(raw))
    except Exception:
        return reply(400, {'error': 'Это не изображение'})
    if fmt not in ALLOWED_FORMATS:
        return reply(400, {'error': 'Можно загружать только JPEG, PNG или WEBP'})

    img = img.convert('RGB')
    img.thumbnail((1400, 1400), Image.LANCZOS)
    out = io.BytesIO()
    img.save(out, format='WEBP', quality=82, method=6)

    key = f'catalog/{uuid.uuid4().hex}.webp'
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=out.getvalue(), ContentType='image/webp')
    url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
    return reply(200, {'url': url, 'width': img.width, 'height': img.height})


def handler(event: dict, context) -> dict:
    """Защищённая панель управления каталогом: вход администратора, категории, модели дверей, загрузка фото."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    action = (event.get('queryStringParameters') or {}).get('action', '')
    method = event.get('httpMethod')
    body = {}
    if method == 'POST':
        try:
            body = json.loads(event.get('body') or '{}')
        except ValueError:
            return reply(400, {'error': 'Некорректный запрос'})

    db = Db()
    try:
        if action == 'login' and method == 'POST':
            return do_login(db, event, body)

        admin = current_admin(db, event)
        if not admin:
            return reply(401, {'error': 'Требуется вход'})

        if action == 'me':
            return reply(200, {'login': admin['login']})
        if action == 'logout' and method == 'POST':
            headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
            db.run(f"DELETE FROM {schema()}.admin_sessions WHERE token_hash = {q(token_hash(headers.get('x-auth-token', '')))}")
            return reply(200, {'ok': True})
        if action == 'data':
            return reply(200, all_data(db))
        if method != 'POST':
            return reply(405, {'error': 'Метод не поддерживается'})

        routes = {
            'category_save': lambda: save_category(db, body),
            'category_delete': lambda: delete_category(db, body),
            'category_reorder': lambda: reorder(db, 'categories', body),
            'product_save': lambda: save_product(db, body),
            'product_delete': lambda: delete_product(db, body),
            'product_reorder': lambda: reorder(db, 'products', body),
            'upload': lambda: upload_image(body),
        }
        fn = routes.get(action)
        return fn() if fn else reply(404, {'error': 'Неизвестное действие'})
    finally:
        db.close()
