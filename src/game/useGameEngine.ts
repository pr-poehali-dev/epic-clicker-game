import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, createInitialState, formatNumber } from './gameState';
import { apiSaveGame, apiLoadGame } from '@/api/gameSave';

const SAVE_KEY = 'epic_clicker_save_v1';

function mergeState(parsed: object): GameState {
  const initial = createInitialState();
  const achievements = initial.achievements.map(a => ({
    ...a,
    ...((parsed as GameState).achievements?.find((pa: { id: string }) => pa.id === a.id) || {}),
    condition: a.condition,
  }));
  return { ...initial, ...(parsed as GameState), achievements };
}

export const useGameEngine = () => {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) return mergeState(JSON.parse(saved));
    } catch (e) {
      console.warn('Save load failed', e);
    }
    return createInitialState();
  });

  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    apiLoadGame().then(data => {
      if (data) {
        setState(mergeState(data as object));
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      }
      setDbLoaded(true);
    }).catch(() => setDbLoaded(true));
  }, []);

  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; value: number }>>([]);
  const [bossShake, setBossShake] = useState(false);
  const particleId = useRef(0);

  const computedDps = useCallback((s: GameState) => {
    const ownedChars = s.characters.filter(c => c.owned && c.active);
    const dps = ownedChars.reduce((acc, c) => acc + c.dps * c.level, 0);
    const upgradeMult = s.upgrades
      .filter(u => u.purchased && (u.type === 'dps' || u.type === 'global'))
      .reduce((acc, u) => acc * u.multiplier, 1);
    return dps * upgradeMult;
  }, []);

  const computedClick = useCallback((s: GameState) => {
    const ownedChars = s.characters.filter(c => c.owned && c.active);
    const cp = ownedChars.reduce((acc, c) => acc + c.clickPower * c.level, 0);
    const upgradeMult = s.upgrades
      .filter(u => u.purchased && (u.type === 'click' || u.type === 'global'))
      .reduce((acc, u) => acc * u.multiplier, 1);
    return Math.max(1, cp) * upgradeMult;
  }, []);

  const checkSynergies = useCallback((s: GameState): number => {
    const owned = s.characters.filter(c => c.owned && c.active).map(c => c.id);
    let bonus = 1;
    s.characters.filter(c => c.owned && c.active).forEach(char => {
      const synCount = char.synergy.filter(id => owned.includes(id)).length;
      bonus += synCount * 0.15;
    });
    return bonus;
  }, []);

  const handleClick = useCallback((x?: number, y?: number) => {
    setState(prev => {
      const clickPow = computedClick(prev);
      const synergyBonus = checkSynergies(prev);
      const dmg = Math.floor(clickPow * synergyBonus);

      const newState = { ...prev };
      newState.totalClicks = prev.totalClicks + 1;
      newState.xp = prev.xp + 1;

      if (prev.bossActive && prev.currentBoss < prev.bosses.length) {
        const bosses = [...prev.bosses];
        const boss = { ...bosses[prev.currentBoss] };
        boss.hp = Math.max(0, boss.hp - dmg);

        if (boss.hp <= 0) {
          boss.defeated = true;
          newState.gold = prev.gold + boss.reward;
          newState.totalGold = prev.totalGold + boss.reward;
          newState.bossActive = false;
          const nextBossIdx = prev.currentBoss + 1;
          newState.currentBoss = nextBossIdx < prev.bosses.length ? nextBossIdx : prev.currentBoss;
        }
        bosses[prev.currentBoss] = boss;
        newState.bosses = bosses;
      } else {
        newState.gold = prev.gold + dmg;
        newState.totalGold = prev.totalGold + dmg;
      }

      if (newState.xp >= prev.xpRequired) {
        newState.level = prev.level + 1;
        newState.xp = newState.xp - prev.xpRequired;
        newState.xpRequired = Math.floor(prev.xpRequired * 1.5);
      }

      newState.achievements = prev.achievements.map(a =>
        !a.unlocked && a.condition(newState) ? { ...a, unlocked: true } : a
      );

      newState.clickPower = computedClick(newState);
      newState.dps = computedDps(newState);

      return newState;
    });

    if (x !== undefined && y !== undefined) {
      const id = ++particleId.current;
      setParticles(prev => [...prev, { id, x, y, value: Math.floor(computedClick(state) * checkSynergies(state)) }]);
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 1200);
    }
  }, [computedClick, computedDps, checkSynergies, state]);

  const buyCharacter = useCallback((charId: string) => {
    setState(prev => {
      const chars = prev.characters.map(c => {
        if (c.id === charId && !c.owned && prev.gold >= c.cost) {
          return { ...c, owned: true, active: true };
        }
        return c;
      });
      const char = prev.characters.find(c => c.id === charId);
      if (!char || char.owned || prev.gold < char.cost) return prev;

      const newState = {
        ...prev,
        characters: chars,
        gold: prev.gold - char.cost,
      };
      newState.clickPower = computedClick(newState);
      newState.dps = computedDps(newState);
      return newState;
    });
  }, [computedClick, computedDps]);

  const upgradeCharacter = useCallback((charId: string) => {
    setState(prev => {
      const char = prev.characters.find(c => c.id === charId);
      if (!char || !char.owned || char.level >= char.maxLevel) return prev;
      const upgCost = Math.floor(char.cost * char.level * 0.5 + 50);
      if (prev.gold < upgCost) return prev;

      const chars = prev.characters.map(c =>
        c.id === charId ? { ...c, level: c.level + 1 } : c
      );
      const newState = { ...prev, characters: chars, gold: prev.gold - upgCost };
      newState.clickPower = computedClick(newState);
      newState.dps = computedDps(newState);
      return newState;
    });
  }, [computedClick, computedDps]);

  const toggleCharacter = useCallback((charId: string) => {
    setState(prev => {
      const chars = prev.characters.map(c =>
        c.id === charId && c.owned ? { ...c, active: !c.active } : c
      );
      const newState = { ...prev, characters: chars };
      newState.clickPower = computedClick(newState);
      newState.dps = computedDps(newState);
      return newState;
    });
  }, [computedClick, computedDps]);

  const buyUpgrade = useCallback((upgradeId: string) => {
    setState(prev => {
      const upgrade = prev.upgrades.find(u => u.id === upgradeId);
      if (!upgrade || upgrade.purchased || prev.gold < upgrade.cost) return prev;
      if (upgrade.requires) {
        const req = prev.upgrades.find(u => u.id === upgrade.requires);
        if (!req?.purchased) return prev;
      }

      const upgrades = prev.upgrades.map(u =>
        u.id === upgradeId ? { ...u, purchased: true } : u
      );
      const newState = { ...prev, upgrades, gold: prev.gold - upgrade.cost };
      newState.clickPower = computedClick(newState);
      newState.dps = computedDps(newState);
      return newState;
    });
  }, [computedClick, computedDps]);

  const startBossFight = useCallback(() => {
    setState(prev => {
      const boss = prev.bosses[prev.currentBoss];
      if (!boss || boss.defeated) return prev;
      return { ...prev, bossActive: true };
    });
  }, []);

  const retreatBoss = useCallback(() => {
    setState(prev => ({ ...prev, bossActive: false }));
  }, []);

  const useInventoryItem = useCallback((itemId: string) => {
    setState(prev => {
      const item = prev.inventory.find(i => i.id === itemId);
      if (!item || item.quantity <= 0) return prev;
      const inventory = prev.inventory.map(i =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
      return { ...prev, inventory };
    });
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      setState(prev => {
        const toSave = { ...prev, lastSave: Date.now() };
        localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
        apiSaveGame(toSave);
        return prev;
      });
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    const fresh = createInitialState();
    apiSaveGame({ ...fresh, lastSave: Date.now() });
    setState(fresh);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const dps = computedDps(prev);
        const synergyBonus = checkSynergies(prev);
        const earned = dps * synergyBonus / 10;
        if (earned <= 0) return prev;

        const newGold = prev.gold + earned;
        const newTotal = prev.totalGold + earned;
        let newXp = prev.xp + earned * 0.1;
        let newLevel = prev.level;
        let newXpReq = prev.xpRequired;

        if (newXp >= prev.xpRequired) {
          newLevel = prev.level + 1;
          newXp = newXp - prev.xpRequired;
          newXpReq = Math.floor(prev.xpRequired * 1.5);
        }

        const achievements = prev.achievements.map(a =>
          !a.unlocked && a.condition({ ...prev, gold: newGold, totalGold: newTotal }) ? { ...a, unlocked: true } : a
        );

        return {
          ...prev,
          gold: newGold,
          totalGold: newTotal,
          xp: newXp,
          level: newLevel,
          xpRequired: newXpReq,
          achievements,
          dps: computedDps(prev),
          clickPower: computedClick(prev),
        };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [computedDps, computedClick, checkSynergies]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      setState(prev => {
        const toSave = { ...prev, lastSave: Date.now() };
        localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
        apiSaveGame(toSave);
        return prev;
      });
    }, 30000);
    return () => clearInterval(saveInterval);
  }, [dbLoaded]);

  const getSynergyBonus = useCallback(() => checkSynergies(state), [checkSynergies, state]);
  const getUpgradeCost = useCallback((charId: string) => {
    const char = state.characters.find(c => c.id === charId);
    if (!char) return 0;
    return Math.floor(char.cost * char.level * 0.5 + 50);
  }, [state]);

  return {
    state,
    particles,
    bossShake,
    dbLoaded,
    handleClick,
    buyCharacter,
    upgradeCharacter,
    toggleCharacter,
    buyUpgrade,
    startBossFight,
    retreatBoss,
    useInventoryItem,
    resetGame,
    getSynergyBonus,
    getUpgradeCost,
    formatNumber,
  };
};