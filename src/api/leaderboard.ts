const LEADERBOARD_URL = 'https://functions.poehali.dev/ab65b9b2-f168-43e5-af5d-f3234188b2bb';

export interface Leader {
  rank: number;
  username: string;
  totalGold: number;
  level: number;
  prestige: number;
}

export async function apiGetLeaderboard(): Promise<Leader[]> {
  const res = await fetch(LEADERBOARD_URL);
  const data = await res.json();
  return data.leaders || [];
}
