import { formatNumber } from '@/game/gameState';

interface Props {
  engine: ReturnType<typeof import('@/game/useGameEngine').useGameEngine>;
}

const shopItems = [
  {
    id: 'chest_common', name: 'Обычный Сундук', description: 'Случайный предмет обычного качества',
    emoji: '📦', cost: 100, type: 'chest', rarity: 'common', color: '#9CA3AF',
  },
  {
    id: 'chest_rare', name: 'Редкий Сундук', description: 'Гарантирован редкий или лучше предмет',
    emoji: '🎁', cost: 500, type: 'chest', rarity: 'rare', color: '#3B82F6',
  },
  {
    id: 'scroll_power_x5', name: '5× Свиток Силы', description: 'Пачка из 5 свитков удвоения клика',
    emoji: '📜', cost: 200, type: 'item', rarity: 'common', color: '#9CA3AF',
  },
  {
    id: 'potion_fury', name: 'Зелье Фурии', description: 'DPS ×5 на 15 секунд. Очень мощно!',
    emoji: '⚗️', cost: 350, type: 'item', rarity: 'rare', color: '#3B82F6',
  },
  {
    id: 'rune_eternal', name: 'Вечная Руна', description: 'Постоянный бонус +5% к золоту навсегда',
    emoji: '🔶', cost: 1000, type: 'upgrade', rarity: 'epic', color: '#8B5CF6',
  },
  {
    id: 'chest_legendary', name: 'Легендарный Сундук', description: 'Гарантирован эпический или легендарный предмет',
    emoji: '👑', cost: 2000, type: 'chest', rarity: 'legendary', color: '#D4A017',
  },
  {
    id: 'artifact_skull', name: 'Череп Тьмы', description: 'Артефакт: +25 к клику постоянно',
    emoji: '💀', cost: 3000, type: 'item', rarity: 'legendary', color: '#D4A017',
  },
  {
    id: 'prestige_token', name: 'Жетон Престижа', description: 'Позволяет сделать Престиж с бонусом',
    emoji: '🌟', cost: 50000, type: 'upgrade', rarity: 'legendary', color: '#D4A017',
  },
];

const rarityLabel: Record<string, string> = {
  common: 'ОБЫЧНЫЙ',
  rare: 'РЕДКИЙ',
  epic: 'ЭПИЧЕСКИЙ',
  legendary: 'ЛЕГЕНДАРНЫЙ',
};

const typeLabel: Record<string, string> = {
  chest: 'СУНДУК',
  item: 'ПРЕДМЕТ',
  upgrade: 'УЛУЧШ',
  character: 'ГЕРОЙ',
};

export default function ShopScreen({ engine }: Props) {
  const { state } = engine;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="font-cinzel text-xl font-bold text-gold-light glow-text-gold mb-1 text-center">🏪 МАГАЗИН</div>
      <div className="font-rajdhani text-center text-sm mb-2" style={{ color: 'rgba(212,160,23,0.6)' }}>
        Приобретай редкие артефакты и усиления
      </div>

      {/* Gold display */}
      <div className="card-epic rounded-xl p-3 mb-4 flex items-center justify-between">
        <div>
          <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.5)' }}>ВАШЕ ЗОЛОТО</div>
          <div className="font-cinzel font-bold text-xl text-gold-light">{formatNumber(state.gold)} 💰</div>
        </div>
        <div className="text-4xl animate-float">🏪</div>
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 gap-3">
        {shopItems.map(item => {
          const canAfford = state.gold >= item.cost;
          return (
            <div key={item.id}
              className="rounded-2xl p-3 transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(10,10,15,0.95) 100%)',
                border: `1px solid ${item.color}33`,
                boxShadow: item.rarity === 'legendary' ? `0 0 15px ${item.color}11` : 'none',
              }}>
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{
                    background: `${item.color}11`,
                    border: `1px solid ${item.color}44`,
                  }}>
                  {item.emoji}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-cinzel text-sm font-bold" style={{ color: item.color }}>{item.name}</span>
                  </div>
                  <div className="flex gap-1 mb-1">
                    <span className="font-rajdhani text-xs px-1.5 py-0.5 rounded"
                      style={{ background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}44`, fontSize: '9px' }}>
                      {rarityLabel[item.rarity]}
                    </span>
                    <span className="font-rajdhani text-xs px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.1)', fontSize: '9px' }}>
                      {typeLabel[item.type]}
                    </span>
                  </div>
                  <div className="font-rajdhani text-xs mb-2" style={{ color: '#6B7280' }}>{item.description}</div>

                  <div className="flex items-center justify-between">
                    <div className="font-cinzel font-bold" style={{ color: canAfford ? '#D4A017' : '#4B5563' }}>
                      {formatNumber(item.cost)} 💰
                    </div>
                    <button
                      disabled={!canAfford}
                      className="rounded-lg px-4 py-1.5 font-cinzel text-xs font-bold transition-all"
                      style={{
                        background: canAfford
                          ? `linear-gradient(135deg, ${item.color}88, ${item.color})`
                          : 'rgba(255,255,255,0.05)',
                        color: canAfford ? '#0A0A0F' : '#4B5563',
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                        border: canAfford
                          ? `1px solid ${item.color}88`
                          : '1px solid rgba(255,255,255,0.06)',
                      }}>
                      {canAfford ? '🛒 КУПИТЬ' : '🚫 МАЛО ЗОЛОТА'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
