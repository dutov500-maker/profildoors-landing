ALTER TABLE t_p43870329_profildoors_landing.leads ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'new';
ALTER TABLE t_p43870329_profildoors_landing.leads ADD COLUMN manager_note TEXT NOT NULL DEFAULT '';
UPDATE t_p43870329_profildoors_landing.leads SET status = 'spam' WHERE source = 'Тестовая заявка';