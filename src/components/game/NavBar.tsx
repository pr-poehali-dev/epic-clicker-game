interface NavItem {
  id: string;
  label: string;
  emoji: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Главная', emoji: '⚔️' },
  { id: 'characters', label: 'Герои', emoji: '🦸' },
  { id: 'upgrades', label: 'Улучш', emoji: '⬆️' },
  { id: 'achievements', label: 'Достиж', emoji: '🏆' },
  { id: 'leaderboard', label: 'Топ', emoji: '👑' },
  { id: 'inventory', label: 'Инвент', emoji: '🎒' },
  { id: 'shop', label: 'Магазин', emoji: '🏪' },
  { id: 'stats', label: 'Стат', emoji: '📊' },
  { id: 'settings', label: 'Настр', emoji: '⚙️' },
];

interface Props {
  current: string;
  onChange: (screen: string) => void;
}

export default function NavBar({ current, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'linear-gradient(0deg, rgba(5,5,10,0.99) 0%, rgba(10,10,20,0.97) 100%)',
        borderTop: '1px solid rgba(212,160,23,0.25)',
        backdropFilter: 'blur(16px)',
      }}>
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map(item => {
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1"
              style={{
                background: active ? 'linear-gradient(135deg, rgba(212,160,23,0.15), rgba(212,160,23,0.05))' : 'transparent',
                borderBottom: active ? '2px solid #D4A017' : '2px solid transparent',
              }}>
              <span className="text-lg leading-none" style={{ filter: active ? 'drop-shadow(0 0 6px rgba(212,160,23,0.8))' : 'none' }}>
                {item.emoji}
              </span>
              <span className="font-rajdhani text-xs font-semibold truncate w-full text-center"
                style={{ color: active ? '#F5C842' : 'rgba(160,140,100,0.7)', fontSize: '9px' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}