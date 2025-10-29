-- Cloudflare D1 schema for JRPG Stats API

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  element TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  stats TEXT NOT NULL,
  equipment TEXT,
  skills TEXT,

  -- Commemoration metadata
  is_locked INTEGER DEFAULT 0, -- 0=false, 1=true
  locked_at TEXT,
  locked_by TEXT DEFAULT 'Tegar',
  commemoration_message TEXT,

  -- Tracking
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
  last_battle_at TEXT,
  total_battles INTEGER DEFAULT 0,

  -- Verification / approval workflow
  verification_code TEXT UNIQUE,
  is_pending INTEGER DEFAULT 1, -- 0=false, 1=true
  expires_at TEXT
);

-- Battle history table
CREATE TABLE IF NOT EXISTS battle_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attacker_id TEXT NOT NULL,
  defender_id TEXT NOT NULL,
  final_damage INTEGER NOT NULL,
  is_critical INTEGER,
  breakdown TEXT,
  timestamp TEXT DEFAULT (CURRENT_TIMESTAMP),

  FOREIGN KEY (attacker_id) REFERENCES characters(id),
  FOREIGN KEY (defender_id) REFERENCES characters(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_locked ON characters(is_locked);
CREATE INDEX IF NOT EXISTS idx_pending ON characters(is_pending);
CREATE INDEX IF NOT EXISTS idx_verification ON characters(verification_code);
CREATE INDEX IF NOT EXISTS idx_battles_timestamp ON battle_history(timestamp DESC);
