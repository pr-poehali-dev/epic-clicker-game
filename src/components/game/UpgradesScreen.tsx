import { formatNumber } from '@/game/gameState';

interface Props {
  engine: ReturnType<typeof import('@/game/useGameEngine').useGameEngine>;
}

const typeColors: Record<string, string> = {
  click: '#D4A017',
  dps: '#CC2200',
  gold: '#22C55E',
  boss: '#7C3AED',
  global: '#F59E0B',
};

const typeLabels: Record<string, string> = {
  click: 'КЛИК',
  dps: 'DPS',
  gold: 'ЗОЛОТО',
  boss: 'БОСС',
  global: 'ГЛОБАЛ',
};

const tierColors = ['#9CA3AF', '#3B82F6', '#8B5CF6', '#D4A017', '#FF4444'];
const tierNames = ['I', 'II', 'III', 'IV', 'V'];

export default function UpgradesScreen({ engine }: Props) {
  const { state, buyUpgrade } = engine;

  const purchased = state.upgrades.filter(u => u.purchased);
  const available = state.upgrades.filter(u => !u.purchased);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="font-cinzel text-xl font-bold text-gold-light glow-text-gold mb-1 text-center">⬆️ УЛУЧШЕНИЯ</div>
      <div className="font-rajdhani text-center text-sm mb-2" style={{ color: 'rgba(212,160,23,0.6)' }}>
        Усиль своих героев и приближай победу
      </div>

      {/* Progress */}
      <div className="card-epic rounded-xl p-3 mb-4 text-center">
        <div className="font-cinzel text-xs font-bold text-gold-light mb-1">
          {purchased.length} / {state.upgrades.length} УЛУЧШЕНИЙ
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full progress-bar-gold"
            style={{ width: `${(purchased.length / state.upgrades.length) * 100}%` }} />
        </div>
      </div>

      {/* Available upgrades */}
      <div className="mb-4">
        <div className="font-cinzel text-sm font-bold mb-2" style={{ color: 'rgba(212,160,23,0.8)' }}>✦ ДОСТУПНЫЕ</div>
        <div className="space-y-2">
          {available.map(upg => {
            const canAfford = state.gold >= upg.cost;
            const reqMet = !upg.requires || state.upgrades.find(u => u.id === upg.requires)?.purchased;
            const locked = !reqMet;

            return (
              <div key={upg.id}
                className="rounded-xl p-3 transition-all duration-200"
                style={{
                  background: locked ? 'rgba(10,10,15,0.6)' : 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(10,10,15,0.95) 100%)',
                  border: locked ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${typeColors[upg.type]}33`,
                  opacity: locked ? 0.5 : 1,
                }}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{upg.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-cinzel text-sm font-bold" style={{ color: locked ? '#4B5563' : '#F5C842' }}>
                        {upg.name}
                      </span>
                      <span className="font-rajdhani text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: `${typeColors[upg.type]}22`,
                          color: typeColors[upg.type],
                          border: `1px solid ${typeColors[upg.type]}44`,
                          fontSize: '9px',
                        }}>
                        {typeLabels[upg.type]}
                      </span>
                      <span className="font-rajdhani text-xs"
                        style={{ color: tierColors[upg.level - 1] || '#9CA3AF', fontSize: '10px' }}>
                        ТИР {tierNames[upg.level - 1] || 'I'}
                      </span>
                    </div>
                    <div className="font-rajdhani text-xs mb-2" style={{ color: '#6B7280' }}>{upg.description}</div>
                    {locked && (
                      <div className="font-rajdhani text-xs mb-2" style={{ color: 'rgba(204,34,0,0.7)' }}>
                        🔒 Требует: {state.upgrades.find(u => u.id === upg.requires)?.name}
                      </div>
                    )}
                    <button
                      onClick={() => buyUpgrade(upg.id)}
                      disabled={!canAfford || locked}
                      className="rounded-lg px-4 py-1.5 font-cinzel text-xs font-bold transition-all"
                      style={{
                        background: (canAfford && !locked)
                          ? `linear-gradient(135deg, ${typeColors[upg.type]}88, ${typeColors[upg.type]})`
                          : 'rgba(255,255,255,0.05)',
                        color: (canAfford && !locked) ? '#0A0A0F' : '#4B5563',
                        cursor: (canAfford && !locked) ? 'pointer' : 'not-allowed',
                        border: (canAfford && !locked)
                          ? `1px solid ${typeColors[upg.type]}88`
                          : '1px solid rgba(255,255,255,0.06)',
                      }}>
                      {locked ? '🔒 ЗАБЛОК' : canAfford ? `💰 ${formatNumber(upg.cost)}` : `🚫 ${formatNumber(upg.cost)}`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchased */}
      {purchased.length > 0 && (
        <div>
          <div className="font-cinzel text-sm font-bold mb-2" style={{ color: 'rgba(212,160,23,0.5)' }}>✓ КУПЛЕНО</div>
          <div className="grid grid-cols-2 gap-2">
            {purchased.map(upg => (
              <div key={upg.id}
                className="rounded-xl p-2 flex items-center gap-2"
                style={{
                  background: 'rgba(212,160,23,0.05)',
                  border: '1px solid rgba(212,160,23,0.15)',
                }}>
                <div className="text-lg">{upg.emoji}</div>
                <div>
                  <div className="font-cinzel text-xs font-bold" style={{ color: 'rgba(212,160,23,0.7)', fontSize: '10px' }}>
                    {upg.name}
                  </div>
                  <div className="font-rajdhani text-xs" style={{ color: 'rgba(74,222,128,0.7)', fontSize: '10px' }}>✓ Активно</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
