const SAVE_URL = 'https://functions.poehali.dev/01fd6539-aefa-40ea-8f04-24fa2f2e1bca';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export async function apiSaveGame(saveData: object): Promise<void> {
  const token = getToken();
  if (!token) return;
  await fetch(SAVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify({ action: 'save', save_data: saveData }),
  });
}

export async function apiLoadGame(): Promise<object | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(SAVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify({ action: 'load' }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.save_data || null;
}
