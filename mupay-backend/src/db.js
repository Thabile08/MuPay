import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    role          TEXT NOT NULL CHECK(role IN ('sender','receiver')),
    phone         TEXT NOT NULL,
    country       TEXT NOT NULL,
    verified      INTEGER NOT NULL DEFAULT 0,
    created_at    INTEGER NOT NULL,
    UNIQUE(role, phone)
  );

  CREATE TABLE IF NOT EXISTS otps (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    phone         TEXT NOT NULL,
    role          TEXT NOT NULL,
    code          TEXT NOT NULL,
    expires_at    INTEGER NOT NULL,
    consumed      INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS transfers (
    ref                 TEXT PRIMARY KEY,
    sender_id           TEXT NOT NULL REFERENCES users(id),
    receiver_phone      TEXT NOT NULL,
    receiver_country    TEXT NOT NULL,
    amount              REAL NOT NULL,
    fee                 REAL NOT NULL,
    rate                REAL NOT NULL,
    receiver_gets       REAL NOT NULL,
    send_currency       TEXT NOT NULL,
    receive_currency    TEXT NOT NULL,
    pin_hash            TEXT NOT NULL,
    status              TEXT NOT NULL DEFAULT 'SENT',
    attempts_left       INTEGER NOT NULL DEFAULT 3,
    unlocked_at         INTEGER,
    collected_at        INTEGER,
    collect_method      TEXT,
    bank_name           TEXT,
    bank_account        TEXT,
    created_at          INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS actions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    transfer    TEXT NOT NULL REFERENCES transfers(ref),
    actor       TEXT NOT NULL,
    action      TEXT NOT NULL,
    at          INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone, role);
  CREATE INDEX IF NOT EXISTS idx_transfers_receiver ON transfers(receiver_phone, status);
`);

export default db;