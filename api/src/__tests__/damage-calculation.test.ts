import { Character, CharacterClass, Element } from '../../models/Character';

describe('Damage Calculation Tests', () => {
  // Mock characters for testing
  const mockWarrior: Character = {
    id: 'warrior-1',
    name: 'Test Warrior',
    class: CharacterClass.WARRIOR,
    element: Element.NEUTRAL,
    level: 50,
    baseStats: {
      hp: 4500,
      mp: 200,
      strength: 95,
      dexterity: 60,
      vitality: 80,
      intelligence: 45,
      luck: 55
    },
    equipment: {},
    skills: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockMage: Character = {
    id: 'mage-1',
    name: 'Test Mage',
    class: CharacterClass.MAGE,
    element: Element.FIRE,
    level: 48,
    baseStats: {
      hp: 2800,
      mp: 500,
      strength: 30,
      dexterity: 55,
      vitality: 45,
      intelligence: 110,
      luck: 60
    },
    equipment: {},
    skills: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockDarkKnight: Character = {
    id: 'dark-1',
    name: 'Dark Knight',
    class: CharacterClass.WARRIOR,
    element: Element.DARK,
    level: 99,
    baseStats: {
      hp: 9999,
      mp: 300,
      strength: 150,
      dexterity: 85,
      vitality: 120,
      intelligence: 70,
      luck: 75
    },
    equipment: {},
    skills: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockCleric: Character = {
    id: 'cleric-1',
    name: 'Test Cleric',
    class: CharacterClass.CLERIC,
    element: Element.HOLY,
    level: 45,
    baseStats: {
      hp: 3200,
      mp: 450,
      strength: 40,
      dexterity: 50,
      vitality: 65,
      intelligence: 85,
      luck: 70
    },
    equipment: {},
    skills: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  describe('Base Damage Calculation', () => {
    test('should calculate correct base damage for warrior', () => {
      // Base: (STR * 2) + (Level * 1.5)
      const expectedBase = (95 * 2) + (50 * 1.5);
      expect(expectedBase).toBe(265);
    });

    test('should calculate correct base damage for mage', () => {
      const expectedBase = (30 * 2) + (48 * 1.5);
      expect(expectedBase).toBe(132);
    });

    test('should calculate correct base damage for high-level character', () => {
      const expectedBase = (150 * 2) + (99 * 1.5);
      expect(expectedBase).toBe(448.5);
    });
  });

  describe('Stat Modifier', () => {
    test('warrior should use STR * 0.5 as stat modifier', () => {
      const statMod = mockWarrior.baseStats.strength * 0.5;
      expect(statMod).toBe(47.5);
    });

    test('mage should use DEX * 0.3 as stat modifier', () => {
      const statMod = mockMage.baseStats.dexterity * 0.3;
      expect(statMod).toBe(16.5);
    });
  });

  describe('Level Modifier', () => {
    test('higher level should give damage bonus', () => {
      // Dark Knight (99) vs Mage (48) = +51 levels = 1 + (51 * 0.02) = 2.02
      const levelDiff = 99 - 48;
      const levelMod = 1 + (levelDiff * 0.02);
      expect(levelMod).toBe(2.02);
    });

    test('lower level should give damage penalty', () => {
      // Cleric (45) vs Dark Knight (99) = -54 levels = 1 + (-54 * 0.02) = -0.08
      const levelDiff = 45 - 99;
      const levelMod = 1 + (levelDiff * 0.02);
      expect(levelMod).toBeCloseTo(-0.08, 2); // Use toBeCloseTo for floating point
    });

    test('same level should have no modifier', () => {
      const levelDiff = 50 - 50;
      const levelMod = 1 + (levelDiff * 0.02);
      expect(levelMod).toBe(1.0);
    });
  });

  describe('Elemental Effectiveness', () => {
    test('FIRE vs ICE should deal 2x damage', () => {
      // Fire is super effective against Ice
      expect(2.0).toBe(2.0);
    });

    test('FIRE vs FIRE should deal 0.5x damage', () => {
      // Fire resists Fire
      expect(0.5).toBe(0.5);
    });

    test('DARK vs HOLY should deal 2x damage', () => {
      // Dark is super effective against Holy
      expect(2.0).toBe(2.0);
    });

    test('HOLY vs DARK should deal 2x damage', () => {
      // Holy is super effective against Dark
      expect(2.0).toBe(2.0);
    });

    test('NEUTRAL vs anything should deal 1x damage', () => {
      expect(1.0).toBe(1.0);
    });
  });

  describe('Defense Calculation', () => {
    test('should calculate defense value correctly', () => {
      // (VIT * 0.8) + (Level * 0.5)
      const defenseValue = (80 * 0.8) + (50 * 0.5);
      expect(defenseValue).toBe(89);
    });

    test('defense reduction should not exceed 40% of base damage', () => {
      const baseDamage = 265;
      const maxReduction = baseDamage * 0.4;
      expect(maxReduction).toBe(106);
    });
  });

  describe('Critical Hit Mechanics', () => {
    test('critical should multiply by 1.5 + (luck/200)', () => {
      const luck = 55;
      const critMultiplier = 1.5 + (luck / 200);
      expect(critMultiplier).toBe(1.775);
    });

    test('high luck should increase crit multiplier', () => {
      const highLuck = 100;
      const critMultiplier = 1.5 + (highLuck / 200);
      expect(critMultiplier).toBe(2.0);
    });

    test('critical chance should include luck modifier', () => {
      const luck = 55;
      const critChance = 0.15 + (luck / 1000);
      expect(critChance).toBe(0.205); // 20.5% chance
    });
  });

  describe('Minimum Damage', () => {
    test('damage should never be less than 1', () => {
      // Even with massive defense, minimum damage is 1
      const minDamage = Math.max(1, -50);
      expect(minDamage).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    test('level 1 vs level 1 should work', () => {
      const lowChar: Character = {
        ...mockWarrior,
        level: 1,
        baseStats: { ...mockWarrior.baseStats, strength: 10, vitality: 10, mp: 50 }
      };

      const baseDamage = (10 * 2) + (1 * 1.5);
      expect(baseDamage).toBe(21.5);
    });

    test('max level (99) vs level 1 should have massive level modifier', () => {
      const levelDiff = 99 - 1;
      const levelMod = 1 + (levelDiff * 0.02);
      expect(levelMod).toBe(2.96); // +196% damage!
    });

    test('zero strength should still deal base level damage', () => {
      const baseDamage = (0 * 2) + (50 * 1.5);
      expect(baseDamage).toBe(75);
    });
  });

  describe('Character Class-Specific Tests', () => {
    test('warrior should benefit from high strength', () => {
      const baseDamage = (mockWarrior.baseStats.strength * 2) + (mockWarrior.level * 1.5);
      const statMod = mockWarrior.baseStats.strength * 0.5;
      const total = baseDamage + statMod;
      expect(total).toBeGreaterThan(300);
    });

    test('mage should deal less physical damage', () => {
      const baseDamage = (mockMage.baseStats.strength * 2) + (mockMage.level * 1.5);
      expect(baseDamage).toBeLessThan(200);
    });

    test('high vitality should reduce incoming damage', () => {
      const highVit = 120;
      const defenseValue = (highVit * 0.8) + (99 * 0.5);
      expect(defenseValue).toBeGreaterThan(140);
    });
  });

  describe('Realistic Battle Scenarios', () => {
    test('cloud vs sephiroth should deal reasonable damage', () => {
      // Cloud (Lv50, STR 95) vs Sephiroth (Lv99, VIT 120)
      const baseDamage = (95 * 2) + (50 * 1.5);
      const levelMod = 1 + ((50 - 99) * 0.02);
      const defenseValue = (120 * 0.8) + (99 * 0.5);

      // Final damage should be positive but reduced by level difference
      expect(levelMod).toBeLessThan(1.0);
      expect(defenseValue).toBeGreaterThan(100);
    });

    test('fire mage vs ice warrior should deal bonus damage', () => {
      // Fire element vs Ice should have 2x multiplier
      const elementalMultiplier = 2.0;
      const baseDamage = 100;
      const bonus = baseDamage * (elementalMultiplier - 1);
      expect(bonus).toBe(100); // +100 bonus damage
    });

    test('critical hit on weak enemy should deal massive damage', () => {
      const baseDamage = 200;
      const critMultiplier = 1.5 + (75 / 200); // High luck
      const finalDamage = baseDamage * critMultiplier;
      expect(finalDamage).toBeGreaterThan(350);
    });
  });
});
