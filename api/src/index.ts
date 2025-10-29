import { calculateDamageHandler } from './handlers/calculateDamage';
import { getCharactersHandler } from './handlers/getCharacters';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route: POST /api/CalculateDamage
      if (url.pathname === '/api/CalculateDamage' && request.method === 'POST') {
        return await calculateDamageHandler(request, corsHeaders);
      }

      // Route: GET /api/GetCharacters
      if (url.pathname === '/api/GetCharacters' && request.method === 'GET') {
        return await getCharactersHandler(request, corsHeaders);
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
