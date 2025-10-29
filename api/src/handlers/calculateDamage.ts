import {
  Character,
  CharacterClass,
  DamageCalculationRequest,
  DamageCalculationResult
} from '../../models/Character';
import { getCharacterById } from '../db';
import type { Env } from '../types';

// Element effectiveness matrix (attacker -> defender)
const ELEMENT_MATRIX: Record<string, Record<string, number>> = {
  FIRE: { FIRE: 0.5, ICE: 2.0, LIGHTNING: 1.0, EARTH: 1.5, WATER: 0.5, WIND: 1.0, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0, LIGHT: 1.0 },
  ICE: { FIRE: 0.5, ICE: 0.5, LIGHTNING: 1.5, EARTH: 1.0, WATER: 1.5, WIND: 1.0, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0, LIGHT: 1.0 },
  LIGHTNING: { FIRE: 1.0, ICE: 1.5, LIGHTNING: 0.5, EARTH: 0.5, WATER: 2.0, WIND: 1.0, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0, LIGHT: 1.0 },
  EARTH: { FIRE: 1.0, ICE: 1.0, LIGHTNING: 2.0, EARTH: 0.5, WATER: 1.0, WIND: 0.5, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0, LIGHT: 1.0 },
  WATER: { FIRE: 2.0, ICE: 1.0, LIGHTNING: 0.5, EARTH: 1.0, WATER: 0.5, WIND: 1.0, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0, LIGHT: 1.0 },
  WIND: { FIRE: 1.0, ICE: 1.0, LIGHTNING: 1.0, EARTH: 2.0, WATER: 1.0, WIND: 0.5, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0, LIGHT: 1.0 },
  HOLY: { FIRE: 1.0, ICE: 1.0, LIGHTNING: 1.0, EARTH: 1.0, WATER: 1.0, WIND: 1.0, HOLY: 0.5, DARK: 2.0, NEUTRAL: 1.0, LIGHT: 0.5 },
  LIGHT: { FIRE: 1.0, ICE: 1.0, LIGHTNING: 1.0, EARTH: 1.0, WATER: 1.0, WIND: 1.0, HOLY: 0.5, DARK: 2.0, NEUTRAL: 1.0, LIGHT: 0.5 },
  DARK: { FIRE: 1.0, ICE: 1.0, LIGHTNING: 1.0, EARTH: 1.0, WATER: 1.0, WIND: 1.0, HOLY: 2.0, DARK: 0.5, NEUTRAL: 1.0, LIGHT: 2.0 },
  NEUTRAL: { FIRE: 1.0, ICE: 1.0, LIGHTNING: 1.0, EARTH: 1.0, WATER: 1.0, WIND: 1.0, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0, LIGHT: 1.0 }
};

// Removed mock getCharacterById; use D1 via db.ts

function calculateDamage(
  attacker: Character,
  defender: Character,
  isCritical: boolean = false
): DamageCalculationResult {
  // Base damage formula: (Attacker STR * 2) + (Attacker Level * 1.5)
  const baseDamage = (attacker.baseStats.strength * 2) + (attacker.level * 1.5);

  // Stat modifier based on class
  const statModifier = attacker.class === CharacterClass.WARRIOR || attacker.class === CharacterClass.PALADIN
    ? attacker.baseStats.strength * 0.5
    : attacker.baseStats.dexterity * 0.3;

  // Level difference modifier (±10% per 5 levels)
  const levelDiff = attacker.level - defender.level;
  const levelModifier = 1 + (levelDiff * 0.02);

  // Elemental effectiveness with safety fallback
  const attackerElement = String(attacker.element).toUpperCase();
  const defenderElement = String(defender.element).toUpperCase();
  const elementalModifier =
    ELEMENT_MATRIX[attackerElement]?.[defenderElement] ?? 1.0;
  const elementalBonus = baseDamage * (elementalModifier - 1);

  // Defense calculation: (Defender VIT * 0.8) + (Defender Level * 0.5)
  const defenseValue = (defender.baseStats.vitality * 0.8) + (defender.level * 0.5);
  const defenseReduction = Math.min(defenseValue * 0.5, baseDamage * 0.4); // Cap at 40% reduction

  // Critical hit calculation
  const criticalMultiplier = isCritical ? 1.5 + (attacker.baseStats.luck / 200) : 1.0;

  // Final damage calculation
  const rawDamage = (baseDamage + statModifier) * levelModifier + elementalBonus - defenseReduction;
  const finalDamage = Math.max(1, Math.floor(rawDamage * criticalMultiplier * elementalModifier));

  return {
    rawDamage: Math.floor(rawDamage),
    finalDamage,
    isCritical,
    criticalMultiplier,
    elementModifier: elementalModifier,
    breakdown: {
      baseDamage: Math.floor(baseDamage),
      statModifier: Math.floor(statModifier),
      levelModifier: Math.round(levelModifier * 100) / 100,
      elementalBonus: Math.floor(elementalBonus),
      defenseReduction: Math.floor(defenseReduction)
    }
  };
}

export async function calculateDamageHandler(
  request: Request,
  corsHeaders: Record<string, string>,
  env: Env
): Promise<Response> {
  try {
    const body: DamageCalculationRequest = await request.json() as DamageCalculationRequest;

    if (!body.attackerId || !body.defenderId) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: 'attackerId and defenderId are required'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  const attacker = await getCharacterById(env, body.attackerId);
  const defender = await getCharacterById(env, body.defenderId);

    if (!attacker || !defender) {
      return new Response(
        JSON.stringify({
          error: 'Not Found',
          message: 'One or both characters not found'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Determine if critical hit (15% base chance + luck modifier)
    const critChance = 0.15 + (attacker.baseStats.luck / 1000);
    const isCritical = body.isCritical ?? Math.random() < critChance;

    const result = calculateDamage(attacker, defender, isCritical);

    // Save battle history
    const breakdown = JSON.stringify(result.breakdown);
    const insertStmt = env.DB.prepare(
      `INSERT INTO battle_history (attacker_id, defender_id, final_damage, is_critical, breakdown)
       VALUES (?1, ?2, ?3, ?4, ?5)`
    ).bind(attacker.id, defender.id, result.finalDamage, isCritical ? 1 : 0, breakdown);
    const insertRes = await insertStmt.run();
    const battleId = insertRes.meta.last_row_id as number;

    // Update attacker battle stats
    await env.DB.prepare(
      `UPDATE characters SET total_battles = COALESCE(total_battles, 0) + 1, last_battle_at = CURRENT_TIMESTAMP WHERE id = ?1`
    ).bind(attacker.id).run();

    return new Response(
      JSON.stringify({
        attacker: { id: attacker.id, name: attacker.name, level: attacker.level },
        defender: { id: defender.id, name: defender.name, level: defender.level },
        result,
        battleId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in CalculateDamage:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}
