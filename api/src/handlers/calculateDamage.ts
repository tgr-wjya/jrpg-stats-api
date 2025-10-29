import {
    Character,
    CharacterClass,
    DamageCalculationRequest,
    DamageCalculationResult,
    Element
} from '../../models/Character';

// Element effectiveness matrix (attacker -> defender)
const ELEMENT_MATRIX: Record<Element, Record<Element, number>> = {
  FIRE: { FIRE: 0.5, ICE: 2.0, LIGHTNING: 1.0, EARTH: 1.5, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0 },
  ICE: { FIRE: 0.5, ICE: 0.5, LIGHTNING: 1.5, EARTH: 1.0, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0 },
  LIGHTNING: { FIRE: 1.0, ICE: 1.5, LIGHTNING: 0.5, EARTH: 0.5, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0 },
  EARTH: { FIRE: 1.0, ICE: 1.0, LIGHTNING: 2.0, EARTH: 0.5, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0 },
  HOLY: { FIRE: 1.0, ICE: 1.0, LIGHTNING: 1.0, EARTH: 1.0, HOLY: 0.5, DARK: 2.0, NEUTRAL: 1.0 },
  DARK: { FIRE: 1.0, ICE: 1.0, LIGHTNING: 1.0, EARTH: 1.0, HOLY: 2.0, DARK: 0.5, NEUTRAL: 1.0 },
  NEUTRAL: { FIRE: 1.0, ICE: 1.0, LIGHTNING: 1.0, EARTH: 1.0, HOLY: 1.0, DARK: 1.0, NEUTRAL: 1.0 }
};

function getCharacterById(id: string): Character | null {
  // Mock implementation - replace with actual data source
  const mockCharacters: Character[] = [
    {
      id: '1',
      name: 'Cloud Strife',
      class: CharacterClass.WARRIOR,
      level: 50,
      baseStats: {
        hp: 4500,
        mp: 250,
        strength: 95,
        intelligence: 45,
        dexterity: 75,
        vitality: 85,
        luck: 60
      },
      element: Element.NEUTRAL,
      equipment: {
        weapon: 'Buster Sword',
        armor: 'Soldier Armor',
        accessory: 'Champion Belt'
      },
      skills: ['Cross-Slash', 'Braver', 'Omnislash'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Vivi Ornitier',
      class: CharacterClass.MAGE,
      level: 48,
      baseStats: {
        hp: 2800,
        mp: 850,
        strength: 35,
        intelligence: 120,
        dexterity: 55,
        vitality: 45,
        luck: 70
      },
      element: Element.FIRE,
      equipment: {
        weapon: 'Mace of Zeus',
        armor: 'Black Robe',
        accessory: 'Magic Armlet'
      },
      skills: ['Fire', 'Fira', 'Firaga', 'Flare'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  return mockCharacters.find(c => c.id === id) || null;
}

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

  // Elemental effectiveness
  const elementalModifier = ELEMENT_MATRIX[attacker.element][defender.element];
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
  corsHeaders: Record<string, string>
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

    const attacker = getCharacterById(body.attackerId);
    const defender = getCharacterById(body.defenderId);

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

    return new Response(
      JSON.stringify({
        attacker: { id: attacker.id, name: attacker.name, level: attacker.level },
        defender: { id: defender.id, name: defender.name, level: defender.level },
        result
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
