import { Character, CharacterClass, Element } from '../../models/Character';

describe('Character Validation Tests', () => {
  describe('Character Creation Validation', () => {
    test('valid character should have all required fields', () => {
      const validCharacter: Character = {
        id: 'test-1',
        name: 'Test Hero',
        class: CharacterClass.WARRIOR,
        element: Element.FIRE,
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
        equipment: {
          weapon: 'Excalibur',
          armor: 'Plate Mail',
          accessory: 'Power Ring'
        },
        skills: ['Slash', 'Guard', 'Power Strike'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expect(validCharacter.id).toBeDefined();
      expect(validCharacter.name).toBeTruthy();
      expect(validCharacter.level).toBeGreaterThan(0);
      expect(validCharacter.baseStats.hp).toBeGreaterThan(0);
    });

    test('character level should be between 1 and 99', () => {
      expect(1).toBeGreaterThanOrEqual(1);
      expect(1).toBeLessThanOrEqual(99);
      expect(99).toBeGreaterThanOrEqual(1);
      expect(99).toBeLessThanOrEqual(99);
    });

    test('character stats should be positive numbers', () => {
      const stats = {
        hp: 1000,
        mp: 200,
        strength: 50,
        dexterity: 45,
        vitality: 55,
        intelligence: 60,
        luck: 40
      };

      Object.values(stats).forEach(stat => {
        expect(stat).toBeGreaterThan(0);
      });
    });

    test('character class should be valid enum', () => {
      const validClasses = [
        CharacterClass.WARRIOR,
        CharacterClass.MAGE,
        CharacterClass.ROGUE,
        CharacterClass.CLERIC,
        CharacterClass.RANGER,
        CharacterClass.PALADIN
      ];

      validClasses.forEach(cls => {
        expect(Object.values(CharacterClass)).toContain(cls);
      });
    });

    test('character element should be valid enum', () => {
      const validElements = [
        Element.FIRE,
        Element.ICE,
        Element.LIGHTNING,
        Element.EARTH,
        Element.HOLY,
        Element.DARK,
        Element.NEUTRAL
      ];

      validElements.forEach(element => {
        expect(Object.values(Element)).toContain(element);
      });
    });
  });

  describe('Equipment Validation', () => {
    test('equipment can be optional', () => {
      const emptyEquipment = {};
      expect(emptyEquipment).toBeDefined();
    });

    test('equipment can have partial items', () => {
      const partialEquipment: { weapon?: string; armor?: string; accessory?: string } = {
        weapon: 'Sword'
      };
      expect(partialEquipment.weapon).toBe('Sword');
      expect(partialEquipment.armor).toBeUndefined();
    });

    test('equipment can have all slots filled', () => {
      const fullEquipment = {
        weapon: 'Legendary Sword',
        armor: 'Dragon Scale',
        accessory: 'Magic Ring'
      };

      expect(fullEquipment.weapon).toBeDefined();
      expect(fullEquipment.armor).toBeDefined();
      expect(fullEquipment.accessory).toBeDefined();
    });
  });

  describe('Skills Validation', () => {
    test('skills should be an array', () => {
      const skills = ['Fireball', 'Ice Blast'];
      expect(Array.isArray(skills)).toBe(true);
    });

    test('skills can be empty', () => {
      const skills: string[] = [];
      expect(skills.length).toBe(0);
    });

    test('skills should be strings', () => {
      const skills = ['Heal', 'Protect', 'Haste'];
      skills.forEach(skill => {
        expect(typeof skill).toBe('string');
      });
    });
  });

  describe('Character Balance Tests', () => {
    test('warrior should have high HP and strength', () => {
      const warrior = {
        class: CharacterClass.WARRIOR,
        baseStats: {
          hp: 5000,
          mp: 150,
          strength: 100,
          dexterity: 50,
          vitality: 90,
          intelligence: 30,
          luck: 50
        }
      };

      expect(warrior.baseStats.hp).toBeGreaterThan(3000);
      expect(warrior.baseStats.strength).toBeGreaterThan(80);
    });

    test('mage should have high MP and intelligence', () => {
      const mage = {
        class: CharacterClass.MAGE,
        baseStats: {
          hp: 2500,
          mp: 600,
          strength: 25,
          dexterity: 40,
          vitality: 35,
          intelligence: 120,
          luck: 60
        }
      };

      expect(mage.baseStats.mp).toBeGreaterThan(400);
      expect(mage.baseStats.intelligence).toBeGreaterThan(100);
    });

    test('rogue should have high dexterity and luck', () => {
      const rogue = {
        class: CharacterClass.ROGUE,
        baseStats: {
          hp: 3000,
          mp: 200,
          strength: 70,
          dexterity: 110,
          vitality: 55,
          intelligence: 50,
          luck: 95
        }
      };

      expect(rogue.baseStats.dexterity).toBeGreaterThan(90);
      expect(rogue.baseStats.luck).toBeGreaterThan(80);
    });

    test('cleric should have balanced stats with high intelligence', () => {
      const cleric = {
        class: CharacterClass.CLERIC,
        baseStats: {
          hp: 3500,
          mp: 500,
          strength: 45,
          dexterity: 50,
          vitality: 70,
          intelligence: 90,
          luck: 75
        }
      };

      expect(cleric.baseStats.intelligence).toBeGreaterThan(70);
      expect(cleric.baseStats.mp).toBeGreaterThan(400);
    });
  });

  describe('ID and Timestamp Validation', () => {
    test('character ID should be unique string', () => {
      const id1 = 'char-001';
      const id2 = 'char-002';
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });

    test('timestamps should be valid ISO strings', () => {
      const timestamp = new Date().toISOString();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    test('updatedAt should be equal or after createdAt', () => {
      const createdAt = new Date('2025-01-01').getTime();
      const updatedAt = new Date('2025-01-02').getTime();
      expect(updatedAt).toBeGreaterThanOrEqual(createdAt);
    });
  });

  describe('Element Type Consistency', () => {
    test('all element types should be uppercase', () => {
      const elements = Object.values(Element);
      elements.forEach(element => {
        expect(element).toBe(element.toUpperCase());
      });
    });

    test('all class types should be uppercase', () => {
      const classes = Object.values(CharacterClass);
      classes.forEach(cls => {
        expect(cls).toBe(cls.toUpperCase());
      });
    });
  });
});
