export enum CharacterClass {
    WARRIOR = 'WARRIOR',
    MAGE = 'MAGE',
    ROGUE = 'ROGUE',
    CLERIC = 'CLERIC',
    RANGER = 'RANGER',
    PALADIN = 'PALADIN'
}

export enum Element {
    FIRE = 'FIRE',
    ICE = 'ICE',
    LIGHTNING = 'LIGHTNING',
    EARTH = 'EARTH',
    HOLY = 'HOLY',
    DARK = 'DARK',
    NEUTRAL = 'NEUTRAL'
}

export interface BaseStats {
    hp: number;
    mp: number;
    strength: number;
    intelligence: number;
    dexterity: number;
    vitality: number;
    luck: number;
}

export interface Equipment {
    weapon?: string;
    armor?: string;
    accessory?: string;
}

export interface Character {
    id: string;
    name: string;
    class: CharacterClass;
    level: number;
    baseStats: BaseStats;
    element: Element;
    equipment: Equipment;
    skills: string[];
    createdAt: string;
    updatedAt: string;
}

export interface DamageCalculationRequest {
    attackerId: string;
    defenderId: string;
    skillName?: string;
    isCritical?: boolean;
}

export interface DamageCalculationResult {
    rawDamage: number;
    finalDamage: number;
    isCritical: boolean;
    criticalMultiplier: number;
    elementModifier: number;
    breakdown: {
        baseDamage: number;
        statModifier: number;
        levelModifier: number;
        elementalBonus: number;
        defenseReduction: number;
    };
}
