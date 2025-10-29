import { mapRowToCharacter } from '../db';
import type { Env } from '../types';

export async function getCharactersHandler(
  request: Request,
  corsHeaders: Record<string, string>,
  env: Env
): Promise<Response> {
  try {
    const url = new URL(request.url);

    // Query parameters for filtering
    const classFilter = url.searchParams.get('class');
    const minLevel = url.searchParams.get('minLevel');
    const element = url.searchParams.get('element');

    // Build SQL query with filters
    let query = 'SELECT * FROM characters WHERE is_pending = 0';
    const bindings: any[] = [];
    let bindIndex = 1;

    if (classFilter) {
      query += ` AND UPPER(class) = ?${bindIndex}`;
      bindings.push(classFilter.toUpperCase());
      bindIndex++;
    }

    if (minLevel) {
      const levelThreshold = parseInt(minLevel, 10);
      if (!isNaN(levelThreshold)) {
        query += ` AND level >= ?${bindIndex}`;
        bindings.push(levelThreshold);
        bindIndex++;
      }
    }

    if (element) {
      query += ` AND UPPER(element) = ?${bindIndex}`;
      bindings.push(element.toUpperCase());
      bindIndex++;
    }

    query += ' ORDER BY level DESC, name ASC';

    // Execute query
    const stmt = env.DB.prepare(query);
    const result = await stmt.bind(...bindings).all();

    // Map rows to Character objects
    const characters = (result.results || []).map(row => mapRowToCharacter(row));

    return new Response(
      JSON.stringify({
        count: characters.length,
        characters: characters
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
