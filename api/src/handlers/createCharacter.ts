import { Character, CharacterClass, Element } from '../../models/Character';
import { daysFromNowIso, Env, genId, genVerificationCode, jsonResponse, nowIso } from '../types';

type CreateCharacterBody = {
  name: string;
  class: CharacterClass | string;
  element: Element | string;
  level?: number;
  baseStats: Character['baseStats'];
  equipment?: Character['equipment'];
  skills?: string[];
};

export async function createCharacterHandler(
  request: Request,
  corsHeaders: Record<string, string>,
  env: Env
): Promise<Response> {
  try {
    const body = await request.json() as CreateCharacterBody;

    if (!body?.name || !body?.class || !body?.element || !body?.baseStats) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'name, class, element, baseStats are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic validation for enums (tolerate string inputs)
    const cls = String(body.class).toUpperCase();
    const el = String(body.element).toUpperCase();

    const id = genId('user');
    const createdAt = nowIso();
    const updatedAt = createdAt;
    const verificationCode = genVerificationCode();
    const expiresAt = daysFromNowIso(7);
    const level = body.level ?? 1;

    const character: Character = {
      id,
      name: body.name,
      class: cls as CharacterClass,
      element: el as Element,
      level,
      baseStats: body.baseStats,
      equipment: body.equipment ?? {},
      skills: body.skills ?? [],
      createdAt,
      updatedAt
    };

    // Persist into D1
    const stmt = env.DB.prepare(
      `INSERT INTO characters (
        id, name, class, element, level, stats, equipment, skills,
        is_locked, locked_at, locked_by, commemoration_message,
        created_at, updated_at, last_battle_at, total_battles,
        verification_code, is_pending, expires_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 0, NULL, 'Tegar', NULL, ?9, ?10, NULL, 0, ?11, 1, ?12)`
    )
      .bind(
        character.id,
        character.name,
        character.class,
        character.element,
        character.level,
        JSON.stringify(character.baseStats),
        JSON.stringify(character.equipment),
        JSON.stringify(character.skills),
        character.createdAt,
        character.updatedAt,
        verificationCode,
        expiresAt
      );

    await stmt.run();

    return new Response(
      JSON.stringify({ character, verificationCode, expiresAt }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in CreateCharacter:', error);
    return jsonResponse({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500, headers: corsHeaders });
  }
}
