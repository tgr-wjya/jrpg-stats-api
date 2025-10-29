import { approveCharacterHandler, deletePendingCharacterHandler, listPendingCharactersHandler } from './handlers/admin';
import { calculateDamageHandler } from './handlers/calculateDamage';
import { createCharacterHandler } from './handlers/createCharacter';
import { getBattlesHandler } from './handlers/getBattles';
import { getCharactersHandler } from './handlers/getCharacters';
import { getHeroesHandler } from './handlers/getHeroes';
import type { Env } from './types';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route: POST /api/CalculateDamage
      if (url.pathname === '/api/CalculateDamage' && request.method === 'POST') {
        return await calculateDamageHandler(request, corsHeaders, env);
      }

      // Route: GET /api/GetCharacters
      if (url.pathname === '/api/GetCharacters' && request.method === 'GET') {
        return await getCharactersHandler(request, corsHeaders, env);
      }

      // Route: POST /api/Characters (Create Character)
      if (url.pathname === '/api/Characters' && request.method === 'POST') {
        return await createCharacterHandler(request, corsHeaders, env);
      }

      // Route: GET /api/Characters/heroes
      if (url.pathname === '/api/Characters/heroes' && request.method === 'GET') {
        return await getHeroesHandler(request, corsHeaders, env);
      }

      // Route: GET /api/Battles
      if (url.pathname === '/api/Battles' && request.method === 'GET') {
        return await getBattlesHandler(request, corsHeaders, env);
      }

      // Admin: GET /api/admin/Characters/pending
      if (url.pathname === '/api/admin/Characters/pending' && request.method === 'GET') {
        return await listPendingCharactersHandler(request, corsHeaders, env);
      }

      // Admin: POST /api/admin/Characters/:id/approve
      const approveMatch = url.pathname.match(/^\/api\/admin\/Characters\/([^/]+)\/approve$/);
      if (approveMatch && request.method === 'POST') {
        return await approveCharacterHandler(request, corsHeaders, env, approveMatch[1]);
      }

      // Admin: DELETE /api/admin/Characters/:id
      const deleteMatch = url.pathname.match(/^\/api\/admin\/Characters\/([^/]+)$/);
      if (deleteMatch && request.method === 'DELETE') {
        return await deletePendingCharacterHandler(request, corsHeaders, env, deleteMatch[1]);
      }

      // 404 Not Found
      return new Response(
        JSON.stringify({ error: 'Not Found', message: 'Endpoint does not exist' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  },
};
