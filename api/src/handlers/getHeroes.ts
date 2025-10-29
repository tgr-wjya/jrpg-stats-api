import { mapRowToCharacter } from '../db';
import type { Env } from '../types';

export async function getHeroesHandler(
  _request: Request,
  corsHeaders: Record<string, string>,
  env: Env
): Promise<Response> {
  try {
    const res = await env.DB.prepare(
      `SELECT * FROM characters WHERE is_locked = 1 ORDER BY locked_at DESC`
    ).all();
    const heroes = (res.results ?? []).map(mapRowToCharacter);
    return new Response(
      JSON.stringify({ count: heroes.length, heroes }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in GetHeroes:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
