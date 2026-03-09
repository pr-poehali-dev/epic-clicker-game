import { useEffect, useState } from 'react';
import { apiGetLeaderboard, Leader } from '@/api/leaderboard';
import { formatNumber } from '@/game/gameState';
import { useAuth } from '@/context/AuthContext';

const RANK_STYLES: Record<number, { bg: string; border: string; color: string; emoji: string }> = {
  1: { bg: 'rgba(212,160,23,0.15)', border: 'rgba(212,160,23,0.5)', color: '#F5C842', emoji: '👑' },
  2: { bg: 'rgba(180,180,200,0.1)', border: 'rgba(180,180,200,0.4)', color: '#C0C0D0', emoji: '🥈' },
  3: { bg: 'rgba(180,100,40,0.12)', border: 'rgba(180,100,40,0.4)', color: '#CD7F32', emoji: '🥉' },
};

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = () => {
    setLoading(true);
    apiGetLeaderboard().then(data => {
      setLeaders(data);
      setLastUpdated(new Date());
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const myRank = user ? leaders.findIndex(l => l.username === user.username) + 1 : 0;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="font-cinzel text-xl font-bold text-gold-light glow-text-gold mb-1 text-center">🏆 ЛИДЕРЫ</div>
      <div className="font-rajdhani text-center text-sm mb-4" style={{ color: 'rgba(212,160,23,0.6)' }}>
        Величайшие герои всех времён
      </div>

      {/* My rank card */}
      {myRank > 0 && (
        <div className="rounded-xl p-3 mb-4 flex items-center gap-3"
          style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.3)' }}>
          <div className="font-cinzel text-2xl font-bold text-gold-light w-10 text-center">#{myRank}</div>
          <div>
            <div className="font-cinzel text-sm font-bold text-gold-light">Ты в рейтинге!</div>
            <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.6)' }}>
              Продолжай сражаться, чтобы подняться выше
            </div>
          </div>
        </div>
      )}

      {/* Refresh */}
      <div className="flex items-center justify-between mb-3">
        {lastUpdated && (
          <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.4)' }}>
            Обновлено: {lastUpdated.toLocaleTimeString('ru')}
          </div>
        )}
        <button
          onClick={load}
          disabled={loading}
          className="ml-auto font-rajdhani text-xs px-3 py-1 rounded-lg transition-all"
          style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.25)', color: loading ? 'rgba(212,160,23,0.3)' : '#D4A017' }}>
          {loading ? '...' : '↻ Обновить'}
        </button>
      </div>

      {loading && leaders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3 animate-float">⚔️</div>
          <div className="font-cinzel text-gold-light text-sm tracking-widest">Загружаю летопись...</div>
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📜</div>
          <div className="font-cinzel text-gold-light text-sm">Летопись пуста</div>
          <div className="font-rajdhani text-xs mt-1" style={{ color: 'rgba(212,160,23,0.5)' }}>Будь первым легендарным героем!</div>
        </div>
      ) : (
        <div className="space-y-2">
          {leaders.map(leader => {
            const style = RANK_STYLES[leader.rank];
            const isMe = user?.username === leader.username;
            return (
              <div key={leader.rank}
                className="rounded-xl p-3 flex items-center gap-3 transition-all"
                style={{
                  background: isMe ? 'rgba(212,160,23,0.12)' : (style?.bg || 'rgba(255,255,255,0.03)'),
                  border: `1px solid ${isMe ? 'rgba(212,160,23,0.5)' : (style?.border || 'rgba(255,255,255,0.06)')}`,
                }}>
                {/* Rank */}
                <div className="w-9 text-center flex-shrink-0">
                  {style?.emoji ? (
                    <span className="text-xl">{style.emoji}</span>
                  ) : (
                    <span className="font-cinzel text-sm font-bold" style={{ color: 'rgba(212,160,23,0.5)' }}>
                      #{leader.rank}
                    </span>
                  )}
                </div>

                {/* Name + stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-cinzel text-sm font-bold truncate"
                      style={{ color: isMe ? '#F5C842' : (style?.color || '#D4A017') }}>
                      {leader.username}
                    </span>
                    {isMe && <span className="font-rajdhani text-xs px-1.5 rounded" style={{ background: 'rgba(212,160,23,0.2)', color: '#F5C842' }}>ты</span>}
                    {leader.prestige > 0 && (
                      <span className="font-rajdhani text-xs" style={{ color: '#A78BFA' }}>✦{leader.prestige}</span>
                    )}
                  </div>
                  <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.5)' }}>
                    Уровень {leader.level}
                  </div>
                </div>

                {/* Gold */}
                <div className="text-right flex-shrink-0">
                  <div className="font-cinzel text-sm font-bold" style={{ color: style?.color || '#D4A017' }}>
                    {formatNumber(leader.totalGold)}
                  </div>
                  <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.4)' }}>💰 всего</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
