export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD: string;
}

export function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...(init ?? {}),
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });
}

export function isAuthorized(request: Request, env: Env): boolean {
  const auth = request.headers.get('Authorization');
  return !!env.ADMIN_PASSWORD && auth === `Bearer ${env.ADMIN_PASSWORD}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function daysFromNowIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function genId(prefix: string = 'user'): string {
  return `${prefix}-${Date.now()}`;
}

export function genVerificationCode(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}
