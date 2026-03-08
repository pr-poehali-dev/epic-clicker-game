import { rarityColors } from '@/game/gameState';

interface Props {
  engine: ReturnType<typeof import('@/game/useGameEngine').useGameEngine>;
}

const rarityLabel: Record<string, string> = {
  bronze: 'БРОНЗА',
  silver: 'СЕРЕБРО',
  gold: 'ЗОЛОТО',
  platinum: 'ПЛАТИНА',
};

const rarityBg: Record<string, string> = {
  bronze: 'rgba(205,127,50,0.1)',
  silver: 'rgba(192,192,192,0.1)',
  gold: 'rgba(212,160,23,0.15)',
  platinum: 'rgba(229,228,226,0.1)',
};

export default function AchievementsScreen({ engine }: Props) {
  const { state } = engine;
  const unlocked = state.achievements.filter(a => a.unlocked);
  const locked = state.achievements.filter(a => !a.unlocked);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="font-cinzel text-xl font-bold text-gold-light glow-text-gold mb-1 text-center">🏆 ДОСТИЖЕНИЯ</div>
      <div className="font-rajdhani text-center text-sm mb-4" style={{ color: 'rgba(212,160,23,0.6)' }}>
        Эпические свершения великих героев
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {['bronze', 'silver', 'gold', 'platinum'].map(rarity => {
          const count = state.achievements.filter(a => a.rarity === rarity && a.unlocked).length;
          const total = state.achievements.filter(a => a.rarity === rarity).length;
          return (
            <div key={rarity} className="rounded-xl p-2 text-center"
              style={{ background: rarityBg[rarity], border: `1px solid ${rarityColors[rarity]}33` }}>
              <div className="font-cinzel text-base font-bold" style={{ color: rarityColors[rarity] }}>{count}/{total}</div>
              <div className="font-rajdhani" style={{ color: rarityColors[rarity], fontSize: '9px' }}>{rarityLabel[rarity]}</div>
            </div>
          );
        })}
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div className="mb-4">
          <div className="font-cinzel text-sm font-bold mb-2" style={{ color: 'rgba(212,160,23,0.8)' }}>✦ ПОЛУЧЕНО ({unlocked.length})</div>
          <div className="grid grid-cols-1 gap-2">
            {unlocked.map(ach => (
              <div key={ach.id}
                className="rounded-xl p-3 flex items-center gap-3 transition-all"
                style={{
                  background: rarityBg[ach.rarity],
                  border: `1px solid ${rarityColors[ach.rarity]}44`,
                  boxShadow: `0 0 15px ${rarityColors[ach.rarity]}11`,
                }}>
                <div className="text-3xl flex-shrink-0">{ach.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-cinzel text-sm font-bold" style={{ color: rarityColors[ach.rarity] }}>{ach.name}</span>
                    <span className="font-rajdhani text-xs px-1 rounded"
                      style={{ background: `${rarityColors[ach.rarity]}22`, color: rarityColors[ach.rarity], fontSize: '9px' }}>
                      {rarityLabel[ach.rarity]}
                    </span>
                  </div>
                  <div className="font-rajdhani text-xs" style={{ color: '#9CA3AF' }}>{ach.description}</div>
                  <div className="font-rajdhani text-xs mt-1" style={{ color: '#22C55E' }}>+{ach.reward} 💰 получено</div>
                </div>
                <div className="text-2xl flex-shrink-0">✓</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      <div>
        <div className="font-cinzel text-sm font-bold mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>🔒 ЗАБЛОКИРОВАНО ({locked.length})</div>
        <div className="grid grid-cols-1 gap-2">
          {locked.map(ach => (
            <div key={ach.id}
              className="rounded-xl p-3 flex items-center gap-3 opacity-50"
              style={{ background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-3xl flex-shrink-0 grayscale">{ach.emoji}</div>
              <div className="flex-1">
                <div className="font-cinzel text-sm font-bold text-gray-500">{ach.name}</div>
                <div className="font-rajdhani text-xs text-gray-600">{ach.description}</div>
                <div className="font-rajdhani text-xs mt-1" style={{ color: 'rgba(212,160,23,0.3)' }}>Награда: {ach.reward} 💰</div>
              </div>
              <div className="text-xl flex-shrink-0 text-gray-600">🔒</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
