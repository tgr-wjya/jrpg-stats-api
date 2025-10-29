import { getCharactersByIds } from '../db';
import type { Env } from '../types';

export async function getBattlesHandler(
  request: Request,
  corsHeaders: Record<string, string>,
  env: Env
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const characterId = url.searchParams.get('characterId');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10) || 10, 50);

    let query = `SELECT * FROM battle_history`;
    const params: any[] = [];
    if (characterId) {
      query += ` WHERE attacker_id = ?1 OR defender_id = ?1`;
      params.push(characterId);
    }
    query += ` ORDER BY timestamp DESC LIMIT ?${params.length + 1}`;
    params.push(limit);

    const stmt = env.DB.prepare(query).bind(...params);
    const res = await stmt.all();
    const rows = res.results ?? [];

    const ids = Array.from(new Set(rows.flatMap((r: any) => [String(r.attacker_id), String(r.defender_id)])));
    const charMap = await getCharactersByIds(env, ids);

    const battles = rows.map((r: any) => ({
      id: Number(r.id),
      attacker: { id: String(r.attacker_id), name: charMap[String(r.attacker_id)]?.name ?? 'Unknown' },
      defender: { id: String(r.defender_id), name: charMap[String(r.defender_id)]?.name ?? 'Unknown' },
      finalDamage: Number(r.final_damage),
      isCritical: Number(r.is_critical) === 1,
      timestamp: String(r.timestamp)
    }));

    return new Response(
      JSON.stringify({ total: battles.length, battles }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in GetBattles:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
