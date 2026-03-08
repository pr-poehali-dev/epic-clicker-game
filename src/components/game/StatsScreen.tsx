import { formatNumber } from '@/game/gameState';

interface Props {
  engine: ReturnType<typeof import('@/game/useGameEngine').useGameEngine>;
}

export default function StatsScreen({ engine }: Props) {
  const { state, getSynergyBonus } = engine;
  const synergy = getSynergyBonus();
  const unlockedAch = state.achievements.filter(a => a.unlocked).length;
  const defeatedBosses = state.bosses.filter(b => b.defeated).length;
  const purchasedUpgrades = state.upgrades.filter(u => u.purchased).length;
  const ownedChars = state.characters.filter(c => c.owned).length;

  const stats = [
    { label: 'Всего кликов', value: formatNumber(state.totalClicks), icon: '👆', color: '#D4A017' },
    { label: 'Всего золота', value: formatNumber(state.totalGold), icon: '💰', color: '#F5C842' },
    { label: 'Текущий уровень', value: state.level.toString(), icon: '⭐', color: '#F5C842' },
    { label: 'Опыт', value: `${Math.floor(state.xp)} / ${state.xpRequired}`, icon: '✨', color: '#A78BFA' },
    { label: 'Сила клика', value: formatNumber(Math.floor(state.clickPower * synergy)), icon: '⚔️', color: '#D4A017' },
    { label: 'DPS', value: formatNumber(Math.floor(state.dps * synergy)) + '/с', icon: '⚡', color: '#CC2200' },
    { label: 'Бонус синергии', value: `×${synergy.toFixed(2)}`, icon: '🔗', color: '#7C3AED' },
    { label: 'Герои в отряде', value: `${ownedChars} / ${state.characters.length}`, icon: '🦸', color: '#3B82F6' },
    { label: 'Боссы побеждены', value: `${defeatedBosses} / ${state.bosses.length}`, icon: '💀', color: '#CC2200' },
    { label: 'Улучшений куплено', value: `${purchasedUpgrades} / ${state.upgrades.length}`, icon: '⬆️', color: '#22C55E' },
    { label: 'Достижений', value: `${unlockedAch} / ${state.achievements.length}`, icon: '🏆', color: '#D4A017' },
    { label: 'Престиж', value: state.prestige.toString(), icon: '🌟', color: '#F5C842' },
  ];

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="font-cinzel text-xl font-bold text-gold-light glow-text-gold mb-1 text-center">📊 СТАТИСТИКА</div>
      <div className="font-rajdhani text-center text-sm mb-4" style={{ color: 'rgba(212,160,23,0.6)' }}>
        Летопись твоих эпических свершений
      </div>

      {/* Hero profile */}
      <div className="card-epic rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl"
            style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.05))', border: '1px solid rgba(212,160,23,0.3)' }}>
            👑
          </div>
          <div>
            <div className="font-cinzel text-lg font-bold text-gold-light">Легендарный Герой</div>
            <div className="font-rajdhani text-sm" style={{ color: 'rgba(212,160,23,0.6)' }}>Уровень {state.level} · Престиж {state.prestige}</div>
            <div className="font-rajdhani text-xs mt-1" style={{ color: '#6B7280' }}>
              Активных героев: {state.characters.filter(c => c.active && c.owned).length}
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-3">
          <div className="flex justify-between font-rajdhani text-xs mb-1" style={{ color: 'rgba(212,160,23,0.5)' }}>
            <span>Прогресс уровня</span>
            <span>{Math.round((state.xp / state.xpRequired) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full progress-bar-gold" style={{ width: `${(state.xp / state.xpRequired) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Boss progress */}
      <div className="card-boss rounded-xl p-3 mb-4">
        <div className="font-cinzel text-sm font-bold mb-2" style={{ color: '#FF6644' }}>💀 ПРОГРЕСС БОССОВ</div>
        <div className="space-y-2">
          {state.bosses.map(boss => (
            <div key={boss.id} className="flex items-center gap-2">
              <div className="text-lg">{boss.emoji}</div>
              <div className="flex-1">
                <div className="font-rajdhani text-xs font-bold" style={{ color: boss.defeated ? '#22C55E' : '#9CA3AF' }}>
                  {boss.name} — {boss.title}
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mt-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full"
                    style={{
                      width: boss.defeated ? '100%' : `${((boss.maxHp - boss.hp) / boss.maxHp) * 100}%`,
                      background: boss.defeated ? 'linear-gradient(90deg, #166534, #22C55E)' : 'linear-gradient(90deg, #8B0000, #CC2200)',
                    }} />
                </div>
              </div>
              <div className="font-rajdhani text-xs" style={{ color: boss.defeated ? '#22C55E' : '#6B7280' }}>
                {boss.defeated ? '✓' : '–'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map(stat => (
          <div key={stat.label}
            className="card-epic rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{stat.icon}</span>
              <span className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.5)' }}>{stat.label}</span>
            </div>
            <div className="font-cinzel font-bold text-base" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
