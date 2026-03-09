import { useState } from 'react';
import { useGameEngine } from '@/game/useGameEngine';
import HomeScreen from '@/components/game/HomeScreen';
import CharactersScreen from '@/components/game/CharactersScreen';
import UpgradesScreen from '@/components/game/UpgradesScreen';
import AchievementsScreen from '@/components/game/AchievementsScreen';
import InventoryScreen from '@/components/game/InventoryScreen';
import ShopScreen from '@/components/game/ShopScreen';
import StatsScreen from '@/components/game/StatsScreen';
import SettingsScreen from '@/components/game/SettingsScreen';
import NavBar from '@/components/game/NavBar';
import TopBar from '@/components/game/TopBar';

type Screen = 'home' | 'characters' | 'upgrades' | 'achievements' | 'inventory' | 'shop' | 'stats' | 'settings';

export default function Index() {
  const [screen, setScreen] = useState<Screen>('home');
  const engine = useGameEngine();

  if (!engine.dbLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at top, #1A1A2E 0%, #0A0A0F 70%)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">⚔️</div>
          <p className="font-cinzel text-gold-light text-lg tracking-widest glow-text-gold">Загружаю прогресс...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen engine={engine} />;
      case 'characters': return <CharactersScreen engine={engine} />;
      case 'upgrades': return <UpgradesScreen engine={engine} />;
      case 'achievements': return <AchievementsScreen engine={engine} />;
      case 'inventory': return <InventoryScreen engine={engine} />;
      case 'shop': return <ShopScreen engine={engine} />;
      case 'stats': return <StatsScreen engine={engine} />;
      case 'settings': return <SettingsScreen engine={engine} />;
      default: return <HomeScreen engine={engine} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #1A1A2E 0%, #0A0A0F 70%)' }}>
      <TopBar engine={engine} screen={screen} />
      <main className="flex-1 overflow-y-auto pb-20">
        <div key={screen} className="animate-slide-up">
          {renderScreen()}
        </div>
      </main>
      <NavBar current={screen} onChange={(s) => setScreen(s as Screen)} />
    </div>
  );
}