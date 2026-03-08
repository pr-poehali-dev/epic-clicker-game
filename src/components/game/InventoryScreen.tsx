import { rarityColors } from '@/game/gameState';

interface Props {
  engine: ReturnType<typeof import('@/game/useGameEngine').useGameEngine>;
}

const typeLabel: Record<string, string> = {
  scroll: 'СВИТОК',
  rune: 'РУНА',
  potion: 'ЗЕЛЬЕ',
  artifact: 'АРТЕФАКТ',
};

const typeColor: Record<string, string> = {
  scroll: '#9CA3AF',
  rune: '#D4A017',
  potion: '#22C55E',
  artifact: '#7C3AED',
};

const rarityLabel: Record<string, string> = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный',
};

export default function InventoryScreen({ engine }: Props) {
  const { state, useInventoryItem: consumeItem } = engine;
  const items = state.inventory;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="font-cinzel text-xl font-bold text-gold-light glow-text-gold mb-1 text-center">🎒 ИНВЕНТАРЬ</div>
      <div className="font-rajdhani text-center text-sm mb-4" style={{ color: 'rgba(212,160,23,0.6)' }}>
        Артефакты и расходники для боевых ситуаций
      </div>

      {/* Capacity */}
      <div className="card-epic rounded-xl p-3 mb-4 text-center">
        <div className="font-cinzel text-xs font-bold text-gold-light">
          {items.reduce((a, i) => a + i.quantity, 0)} предметов в инвентаре
        </div>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 gap-3">
        {items.map(item => {
          const color = rarityColors[item.rarity];
          return (
            <div key={item.id}
              className="rounded-2xl p-3 transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(10,10,15,0.95) 100%)',
                border: `1px solid ${color}33`,
                boxShadow: item.rarity === 'legendary' ? `0 0 20px ${color}15` : 'none',
              }}>
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{
                      background: `${color}11`,
                      border: `1px solid ${color}44`,
                    }}>
                    {item.emoji}
                  </div>
                  {item.quantity > 1 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: color, color: '#0A0A0F', fontSize: '11px', fontFamily: 'Cinzel', fontWeight: 700 }}>
                      {item.quantity}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-cinzel text-sm font-bold" style={{ color }}>{item.name}</span>
                    <span className="font-rajdhani text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: `${typeColor[item.type]}22`,
                        color: typeColor[item.type],
                        border: `1px solid ${typeColor[item.type]}44`,
                        fontSize: '9px',
                      }}>
                      {typeLabel[item.type]}
                    </span>
                  </div>
                  <div className="font-rajdhani text-xs mb-1" style={{ color: '#6B7280' }}>{item.description}</div>
                  <div className="font-rajdhani text-xs mb-2" style={{ color: `${color}99`, fontSize: '10px' }}>
                    ✦ {rarityLabel[item.rarity]} · Кол-во: {item.quantity}
                  </div>

                  <button
                    onClick={() => consumeItem(item.id)}
                    disabled={item.quantity <= 0}
                    className="rounded-lg px-4 py-1.5 font-cinzel text-xs font-bold transition-all"
                    style={{
                      background: item.quantity > 0
                        ? `linear-gradient(135deg, ${color}88, ${color})`
                        : 'rgba(255,255,255,0.05)',
                      color: item.quantity > 0 ? '#0A0A0F' : '#4B5563',
                      cursor: item.quantity > 0 ? 'pointer' : 'not-allowed',
                      border: item.quantity > 0
                        ? `1px solid ${color}88`
                        : '1px solid rgba(255,255,255,0.06)',
                    }}>
                    {item.quantity > 0 ? '⚡ ИСПОЛЬЗОВАТЬ' : '✗ НЕТ'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12" style={{ color: 'rgba(212,160,23,0.3)' }}>
          <div className="text-6xl mb-4">🎒</div>
          <div className="font-cinzel text-lg">Инвентарь пуст</div>
          <div className="font-rajdhani text-sm mt-2">Посети магазин за артефактами</div>
        </div>
      )}
    </div>
  );
}