import { useEffect, useRef, useCallback } from 'react';
import { apiGetLeaderboard } from '@/api/leaderboard';
import { useAuth } from '@/context/AuthContext';

export interface RankUpEvent {
  oldRank: number;
  newRank: number;
}

export function useRankTracker(onRankUp: (event: RankUpEvent) => void) {
  const { user } = useAuth();
  const prevRankRef = useRef<number | null>(null);
  const onRankUpRef = useRef(onRankUp);
  onRankUpRef.current = onRankUp;

  const check = useCallback(async () => {
    if (!user) return;
    const leaders = await apiGetLeaderboard();
    const idx = leaders.findIndex(l => l.username === user.username);
    const rank = idx >= 0 ? idx + 1 : null;

    if (rank !== null && prevRankRef.current !== null && rank < prevRankRef.current) {
      onRankUpRef.current({ oldRank: prevRankRef.current, newRank: rank });
    }
    if (rank !== null) prevRankRef.current = rank;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // первичная проверка через 10 сек после старта (дать время сохраниться)
    const init = setTimeout(check, 10000);
    // затем каждые 2 минуты
    const interval = setInterval(check, 120000);
    return () => { clearTimeout(init); clearInterval(interval); };
  }, [user, check]);
}
