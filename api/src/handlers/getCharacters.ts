import { Character, CharacterClass, Element } from '../../models/Character';

// In-memory mock data (replace with KV storage or D1 database later)
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

export async function getCharactersHandler(
  request: Request,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const url = new URL(request.url);

    // Query parameters for filtering
    const classFilter = url.searchParams.get('class');
    const minLevel = url.searchParams.get('minLevel');
    const element = url.searchParams.get('element');

    let filteredCharacters = [...mockCharacters];

    // Apply filters
    if (classFilter) {
      filteredCharacters = filteredCharacters.filter(
        c => c.class.toLowerCase() === classFilter.toLowerCase()
      );
    }

    if (minLevel) {
      const levelThreshold = parseInt(minLevel, 10);
      if (!isNaN(levelThreshold)) {
        filteredCharacters = filteredCharacters.filter(c => c.level >= levelThreshold);
      }
    }

    if (element) {
      filteredCharacters = filteredCharacters.filter(
        c => c.element.toLowerCase() === element.toLowerCase()
      );
    }

    return new Response(
      JSON.stringify({
        count: filteredCharacters.length,
        characters: filteredCharacters
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in GetCharacters:', error);
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
