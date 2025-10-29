import { Character, CharacterClass, Element } from '../models/Character';
import type { Env } from './types';

export function mapRowToCharacter(row: any): Character {
  return {
    id: String(row.id),
    name: String(row.name),
    class: String(row.class) as CharacterClass,
    element: String(row.element) as Element,
    level: Number(row.level) as number,
    baseStats: JSON.parse(row.stats),
    equipment: row.equipment ? JSON.parse(row.equipment) : {},
    skills: row.skills ? JSON.parse(row.skills) : [],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

export async function getCharacterById(env: Env, id: string): Promise<Character | null> {
  const row = await env.DB.prepare('SELECT * FROM characters WHERE id = ?1').bind(id).first();
  if (!row) return null;
  return mapRowToCharacter(row);
}

export async function getCharactersByIds(env: Env, ids: string[]): Promise<Record<string, Character>> {
  if (ids.length === 0) return {};
  const placeholders = ids.map((_, i) => `?${i + 1}`).join(',');
  const stmt = env.DB.prepare(`SELECT * FROM characters WHERE id IN (${placeholders})`);
  const res = await stmt.bind(...ids).all();
  const map: Record<string, Character> = {};
  for (const row of res.results ?? []) {
    const c = mapRowToCharacter(row);
    map[c.id] = c;
  }
  return map;
}
