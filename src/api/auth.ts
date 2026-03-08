const AUTH_URL = 'https://functions.poehali.dev/03046c55-59e5-4728-8c42-0ed0af241d4d';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

async function callAuth(body: Record<string, unknown>, token?: string): Promise<Response> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['X-Auth-Token'] = token;
  return fetch(AUTH_URL, { method: 'POST', headers, body: JSON.stringify(body) });
}

export async function apiRegister(username: string, email: string, password: string): Promise<AuthResponse> {
  const res = await callAuth({ action: 'register', username, email, password });
  const data = typeof res === 'string' ? JSON.parse(res) : await res.json();
  const parsed = typeof data === 'string' ? JSON.parse(data) : data;
  if (!res.ok) throw new Error(parsed.error || 'Ошибка регистрации');
  return parsed;
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await callAuth({ action: 'login', email, password });
  const data = await res.json();
  const parsed = typeof data === 'string' ? JSON.parse(data) : data;
  if (!res.ok) throw new Error(parsed.error || 'Ошибка входа');
  return parsed;
}

export async function apiMe(token: string): Promise<User> {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify({ action: 'me' }),
  });
  const data = await res.json();
  const parsed = typeof data === 'string' ? JSON.parse(data) : data;
  if (!res.ok) throw new Error(parsed.error || 'Не авторизован');
  return parsed.user;
}
