import { mapRowToCharacter } from '../db';
import type { Env } from '../types';
import { isAuthorized } from '../types';

export async function listPendingCharactersHandler(
  request: Request,
  corsHeaders: Record<string, string>,
  env: Env
): Promise<Response> {
  try {
    if (!isAuthorized(request, env)) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    // Cleanup expired pending characters
    await env.DB.prepare(`DELETE FROM characters WHERE is_pending = 1 AND expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP`).run();

    const res = await env.DB.prepare(
      `SELECT * FROM characters WHERE is_pending = 1 ORDER BY created_at DESC`
    ).all();
    const pending = (res.results ?? []).map((r: any) => ({
      id: String(r.id),
      name: String(r.name),
      class: String(r.class),
      element: String(r.element),
      stats: JSON.parse(r.stats),
      verificationCode: String(r.verification_code),
      createdAt: String(r.created_at),
      expiresAt: String(r.expires_at)
    }));

    return new Response(
      JSON.stringify({ count: pending.length, pending }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in Admin list pending:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function approveCharacterHandler(
  request: Request,
  corsHeaders: Record<string, string>,
  env: Env,
  id: string
): Promise<Response> {
  try {
    if (!isAuthorized(request, env)) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }
    const body = await request.json().catch(() => ({})) as { commemorationMessage?: string };
    const message = body.commemorationMessage ?? '';

    const res = await env.DB.prepare(
      `UPDATE characters SET is_locked = 1, is_pending = 0, locked_at = CURRENT_TIMESTAMP, locked_by = 'Tegar', commemoration_message = ?1, verification_code = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?2 AND is_pending = 1`
    ).bind(message, id).run();

    if ((res.meta.changes ?? 0) === 0) {
      return new Response(JSON.stringify({ error: 'Not Found', message: 'Character not found or not pending' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const row = await env.DB.prepare('SELECT * FROM characters WHERE id = ?1').bind(id).first();
    const character = mapRowToCharacter(row);
    return new Response(JSON.stringify({ success: true, character }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in Admin approve:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}

export async function deletePendingCharacterHandler(
  request: Request,
  corsHeaders: Record<string, string>,
  env: Env,
  id: string
): Promise<Response> {
  try {
    if (!isAuthorized(request, env)) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }
    const res = await env.DB.prepare(`DELETE FROM characters WHERE id = ?1 AND is_pending = 1`).bind(id).run();
    if ((res.meta.changes ?? 0) === 0) {
      return new Response(JSON.stringify({ error: 'Not Found', message: 'Character not found or not pending' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in Admin delete pending:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}
