-- Seed data for JRPG Stats API
-- Run this to populate your database with initial characters

-- Insert Cloud Strife (Warrior)
INSERT INTO characters (
  id, name, class, element, level, stats, equipment, skills,
  is_locked, locked_at, locked_by, commemoration_message,
  created_at, updated_at, last_battle_at, total_battles,
  verification_code, is_pending, expires_at
) VALUES (
  'cloud-strife',
  'Cloud Strife',
  'WARRIOR',
  'NEUTRAL',
  50,
  '{"hp":4500,"mp":250,"strength":95,"intelligence":45,"dexterity":75,"vitality":85,"luck":60}',
  '{"weapon":"Buster Sword","armor":"Soldier Armor","accessory":"Champion Belt"}',
  '["Cross-Slash","Braver","Omnislash"]',
  0,
  NULL,
  'Tegar',
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  NULL,
  0,
  NULL,
  0,
  NULL
);

-- Insert Vivi Ornitier (Mage)
INSERT INTO characters (
  id, name, class, element, level, stats, equipment, skills,
  is_locked, locked_at, locked_by, commemoration_message,
  created_at, updated_at, last_battle_at, total_battles,
  verification_code, is_pending, expires_at
) VALUES (
  'vivi-ornitier',
  'Vivi Ornitier',
  'MAGE',
  'FIRE',
  48,
  '{"hp":2800,"mp":850,"strength":35,"intelligence":120,"dexterity":55,"vitality":45,"luck":70}',
  '{"weapon":"Mace of Zeus","armor":"Black Robe","accessory":"Magic Armlet"}',
  '["Fire","Fira","Firaga","Flare"]',
  0,
  NULL,
  'Tegar',
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  NULL,
  0,
  NULL,
  0,
  NULL
);

-- Insert Locke Cole (Rogue)
INSERT INTO characters (
  id, name, class, element, level, stats, equipment, skills,
  is_locked, locked_at, locked_by, commemoration_message,
  created_at, updated_at, last_battle_at, total_battles,
  verification_code, is_pending, expires_at
) VALUES (
  'locke-cole',
  'Locke Cole',
  'ROGUE',
  'WIND',
  46,
  '{"hp":3500,"mp":280,"strength":75,"intelligence":50,"dexterity":95,"vitality":60,"luck":85}',
  '{"weapon":"Thief''s Knife","armor":"Leather Armor","accessory":"Thief''s Glove"}',
  '["Steal","Mug","Sneak Attack","Backstab"]',
  0,
  NULL,
  'Tegar',
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  NULL,
  0,
  NULL,
  0,
  NULL
);

-- Insert Aerith Gainsborough (Cleric)
INSERT INTO characters (
  id, name, class, element, level, stats, equipment, skills,
  is_locked, locked_at, locked_by, commemoration_message,
  created_at, updated_at, last_battle_at, total_battles,
  verification_code, is_pending, expires_at
) VALUES (
  'aerith-gainsborough',
  'Aerith Gainsborough',
  'CLERIC',
  'LIGHT',
  47,
  '{"hp":3200,"mp":920,"strength":40,"intelligence":105,"dexterity":65,"vitality":55,"luck":80}',
  '{"weapon":"Guard Stick","armor":"White Robe","accessory":"Prayer Materia"}',
  '["Cure","Cura","Curaga","Holy"]',
  0,
  NULL,
  'Tegar',
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  NULL,
  0,
  NULL,
  0,
  NULL
);

-- Insert Sephiroth (Dark Warrior - Boss Character)
INSERT INTO characters (
  id, name, class, element, level, stats, equipment, skills,
  is_locked, locked_at, locked_by, commemoration_message,
  created_at, updated_at, last_battle_at, total_battles,
  verification_code, is_pending, expires_at
) VALUES (
  'sephiroth',
  'Sephiroth',
  'WARRIOR',
  'DARK',
  99,
  '{"hp":9999,"mp":999,"strength":150,"intelligence":140,"dexterity":120,"vitality":130,"luck":95}',
  '{"weapon":"Masamune","armor":"Black Materia","accessory":"Jenova Cell"}',
  '["Octaslash","Shadow Flare","Supernova","Heartless Angel"]',
  1,
  CURRENT_TIMESTAMP,
  'System',
  'The legendary One-Winged Angel - a truly formidable opponent',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  NULL,
  0,
  NULL,
  0,
  NULL
);
