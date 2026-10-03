CREATE TABLE t_p43870329_profildoors_landing.leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  comment TEXT,
  page VARCHAR(200),
  source VARCHAR(200),
  telegram_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);