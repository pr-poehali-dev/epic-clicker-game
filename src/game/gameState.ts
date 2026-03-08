export interface Character {
  id: string;
  name: string;
  title: string;
  class: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  emoji: string;
  level: number;
  maxLevel: number;
  owned: boolean;
  active: boolean;
  clickPower: number;
  dps: number;
  cost: number;
  synergy: string[];
  description: string;
  skill: string;
  skillDesc: string;
  element: string;
  color: string;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  emoji: string;
  type: 'click' | 'dps' | 'gold' | 'boss' | 'global';
  multiplier: number;
  purchased: boolean;
  requires?: string;
  level: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: (state: GameState) => boolean;
  unlocked: boolean;
  reward: number;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  image: string;
  emoji: string;
  hp: number;
  maxHp: number;
  reward: number;
  defeated: boolean;
  unlockAt: number;
  description: string;
  element: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  type: 'scroll' | 'rune' | 'potion' | 'artifact';
  effect: string;
  quantity: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cost: number;
  type: 'character' | 'upgrade' | 'item' | 'chest';
  available: boolean;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  emoji: string;
  active: boolean;
  timeLeft: number;
  multiplier: number;
  type: 'click' | 'dps' | 'gold';
}

export interface GameState {
  gold: number;
  totalGold: number;
  clickPower: number;
  dps: number;
  level: number;
  xp: number;
  xpRequired: number;
  prestige: number;
  totalClicks: number;
  characters: Character[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  bosses: Boss[];
  inventory: InventoryItem[];
  currentBoss: number;
  bossActive: boolean;
  activeEvent: Event | null;
  lastSave: number;
  settings: {
    soundEnabled: boolean;
    particlesEnabled: boolean;
    theme: 'dark';
    language: 'ru';
  };
}

export const WARRIOR_IMG = 'https://cdn.poehali.dev/projects/c08227df-27ea-40bf-a221-a87bc3b01e6d/files/b22616ba-af40-4030-a390-2495ec2669c1.jpg';
export const MAGE_IMG = 'https://cdn.poehali.dev/projects/c08227df-27ea-40bf-a221-a87bc3b01e6d/files/1784fc3c-5943-4d82-9005-080b7033222b.jpg';
export const BOSS_IMG = 'https://cdn.poehali.dev/projects/c08227df-27ea-40bf-a221-a87bc3b01e6d/files/e2266a3c-33f7-49a3-aecb-cf511f288ed7.jpg';

export const initialCharacters: Character[] = [
  {
    id: 'warrior',
    name: 'Кратос',
    title: 'Страж Рассвета',
    class: 'Воин',
    rarity: 'epic',
    image: WARRIOR_IMG,
    emoji: '⚔️',
    level: 1,
    maxLevel: 50,
    owned: true,
    active: true,
    clickPower: 5,
    dps: 2,
    cost: 0,
    synergy: ['paladin', 'berserker'],
    description: 'Непобедимый воин, закалённый в тысяче битв. Его клинок рассекает тьму.',
    skill: 'Удар Судьбы',
    skillDesc: 'Критический удар ×10 силы раз в 30 секунд',
    element: 'Огонь',
    color: '#D4A017',
  },
  {
    id: 'mage',
    name: 'Зараэль',
    title: 'Архимаг Бездны',
    class: 'Маг',
    rarity: 'legendary',
    image: MAGE_IMG,
    emoji: '🔮',
    level: 1,
    maxLevel: 50,
    owned: false,
    active: false,
    clickPower: 3,
    dps: 15,
    cost: 500,
    synergy: ['necromancer', 'druid'],
    description: 'Повелитель тёмной магии. Его заклинания разрывают пространство.',
    skill: 'Аркана Смерти',
    skillDesc: 'Автоматический DPS ×5 на 10 секунд',
    element: 'Тьма',
    color: '#8B2FC9',
  },
  {
    id: 'paladin',
    name: 'Аэлинор',
    title: 'Светлая Судья',
    class: 'Паладин',
    rarity: 'rare',
    image: WARRIOR_IMG,
    emoji: '🛡️',
    level: 1,
    maxLevel: 50,
    owned: false,
    active: false,
    clickPower: 4,
    dps: 5,
    cost: 200,
    synergy: ['warrior', 'priest'],
    description: 'Носительница священного света. Исцеляет союзников и карает демонов.',
    skill: 'Святой Щит',
    skillDesc: 'Удваивает урон отряда на 8 секунд',
    element: 'Свет',
    color: '#FFD700',
  },
  {
    id: 'berserker',
    name: 'Ульрих',
    title: 'Ярость Севера',
    class: 'Берсерк',
    rarity: 'rare',
    image: WARRIOR_IMG,
    emoji: '🪓',
    level: 1,
    maxLevel: 50,
    owned: false,
    active: false,
    clickPower: 12,
    dps: 3,
    cost: 350,
    synergy: ['warrior', 'shaman'],
    description: 'В битве впадает в ярость, многократно увеличивая силу удара.',
    skill: 'Кровавая Ярость',
    skillDesc: 'Клики ×8 силы при HP < 50%',
    element: 'Кровь',
    color: '#CC2200',
  },
  {
    id: 'necromancer',
    name: 'Мортис',
    title: 'Владыка Мёртвых',
    class: 'Некромант',
    rarity: 'epic',
    image: MAGE_IMG,
    emoji: '💀',
    level: 1,
    maxLevel: 50,
    owned: false,
    active: false,
    clickPower: 2,
    dps: 25,
    cost: 800,
    synergy: ['mage', 'druid'],
    description: 'Повелевает армиями нежити. Смерть врагов питает его силу.',
    skill: 'Армия Тьмы',
    skillDesc: 'Призывает скелетов, каждый даёт +5 DPS',
    element: 'Тьма',
    color: '#7C3AED',
  },
  {
    id: 'druid',
    name: 'Силваэль',
    title: 'Голос Леса',
    class: 'Друид',
    rarity: 'legendary',
    image: MAGE_IMG,
    emoji: '🌿',
    level: 1,
    maxLevel: 50,
    owned: false,
    active: false,
    clickPower: 6,
    dps: 20,
    cost: 1200,
    synergy: ['mage', 'necromancer'],
    description: 'Хранитель древней магии природы. Превращается в медведя в бою.',
    skill: 'Дух Природы',
    skillDesc: 'Пассивный бонус золота +20% для отряда',
    element: 'Природа',
    color: '#22C55E',
  },
];

export const initialUpgrades: Upgrade[] = [
  { id: 'sharp_blade', name: 'Острый клинок', description: 'Сила клика ×2', cost: 50, emoji: '⚔️', type: 'click', multiplier: 2, purchased: false, level: 1 },
  { id: 'battle_cry', name: 'Боевой клич', description: 'DPS ×2 для всего отряда', cost: 100, emoji: '📯', type: 'dps', multiplier: 2, purchased: false, level: 1 },
  { id: 'gold_rush', name: 'Золотая лихорадка', description: 'Бонус золота +50%', cost: 200, emoji: '💰', type: 'gold', multiplier: 1.5, purchased: false, level: 1 },
  { id: 'rune_power', name: 'Сила рун', description: 'Сила клика ×3', cost: 400, emoji: '🔮', type: 'click', multiplier: 3, purchased: false, level: 2 },
  { id: 'dark_pact', name: 'Тёмный пакт', description: 'DPS ×3 при убийстве босса', cost: 600, emoji: '💀', type: 'boss', multiplier: 3, purchased: false, level: 2 },
  { id: 'ancient_tome', name: 'Древний фолиант', description: 'Сила клика ×5', cost: 1000, emoji: '📖', type: 'click', multiplier: 5, purchased: false, requires: 'rune_power', level: 3 },
  { id: 'elemental_fury', name: 'Ярость стихий', description: 'DPS ×4 глобально', cost: 2000, emoji: '⚡', type: 'dps', multiplier: 4, purchased: false, level: 3 },
  { id: 'legendary_helm', name: 'Легендарный шлем', description: 'Сила клика ×10 + DPS ×2', cost: 5000, emoji: '👑', type: 'global', multiplier: 10, purchased: false, requires: 'ancient_tome', level: 4 },
  { id: 'soul_harvest', name: 'Жатва душ', description: 'Бонус золота ×2', cost: 3000, emoji: '💫', type: 'gold', multiplier: 2, purchased: false, level: 3 },
  { id: 'void_blade', name: 'Клинок Пустоты', description: 'Сила клика ×15', cost: 10000, emoji: '🌑', type: 'click', multiplier: 15, purchased: false, level: 5 },
];

export const initialBosses: Boss[] = [
  {
    id: 'goblin_king', name: 'Горбрак', title: 'Король Гоблинов', image: BOSS_IMG, emoji: '👺',
    hp: 1000, maxHp: 1000, reward: 500, defeated: false, unlockAt: 0,
    description: 'Мелкий, но хитрый. Первый на пути к величию.', element: 'Земля',
  },
  {
    id: 'ice_wraith', name: 'Мразиэль', title: 'Ледяной Призрак', image: BOSS_IMG, emoji: '👻',
    hp: 5000, maxHp: 5000, reward: 2000, defeated: false, unlockAt: 1,
    description: 'Дух вечной зимы. Замораживает всё живое.', element: 'Лёд',
  },
  {
    id: 'demon_lord', name: 'Малфариус', title: 'Лорд Демонов', image: BOSS_IMG, emoji: '😈',
    hp: 25000, maxHp: 25000, reward: 10000, defeated: false, unlockAt: 2,
    description: 'Повелитель Преисподней. Его взгляд сжигает душу.', element: 'Огонь',
  },
  {
    id: 'ancient_dragon', name: 'Хаоракс', title: 'Древний Дракон', image: BOSS_IMG, emoji: '🐉',
    hp: 100000, maxHp: 100000, reward: 50000, defeated: false, unlockAt: 3,
    description: 'Живёт тысячелетия. Его дыхание испепеляет армии.', element: 'Хаос',
  },
];

export const initialAchievements: Achievement[] = [
  { id: 'first_click', name: 'Первый удар', description: 'Кликни впервые', emoji: '👆', condition: s => s.totalClicks >= 1, unlocked: false, reward: 10, rarity: 'bronze' },
  { id: 'clicker_100', name: 'Сотня ударов', description: '100 кликов', emoji: '💯', condition: s => s.totalClicks >= 100, unlocked: false, reward: 50, rarity: 'bronze' },
  { id: 'clicker_1000', name: 'Тысячник', description: '1000 кликов', emoji: '🔥', condition: s => s.totalClicks >= 1000, unlocked: false, reward: 200, rarity: 'silver' },
  { id: 'gold_100', name: 'Первое золото', description: 'Собери 100 золота', emoji: '💰', condition: s => s.totalGold >= 100, unlocked: false, reward: 25, rarity: 'bronze' },
  { id: 'gold_10000', name: 'Богач', description: 'Собери 10,000 золота', emoji: '💎', condition: s => s.totalGold >= 10000, unlocked: false, reward: 500, rarity: 'silver' },
  { id: 'first_boss', name: 'Охотник на боссов', description: 'Победи первого босса', emoji: '🏆', condition: s => s.bosses.some(b => b.defeated), unlocked: false, reward: 1000, rarity: 'gold' },
  { id: 'all_chars', name: 'Собиратель легенд', description: 'Открой всех персонажей', emoji: '👥', condition: s => s.characters.every(c => c.owned), unlocked: false, reward: 5000, rarity: 'platinum' },
  { id: 'upgrade_5', name: 'Мастер улучшений', description: 'Купи 5 улучшений', emoji: '⬆️', condition: s => s.upgrades.filter(u => u.purchased).length >= 5, unlocked: false, reward: 300, rarity: 'silver' },
  { id: 'level_10', name: 'Ветеран', description: 'Достигни 10 уровня', emoji: '⭐', condition: s => s.level >= 10, unlocked: false, reward: 2000, rarity: 'gold' },
];

export const initialInventory: InventoryItem[] = [
  { id: 'scroll_power', name: 'Свиток Силы', description: 'Удваивает клик на 60 секунд', emoji: '📜', type: 'scroll', effect: 'click_x2_60s', quantity: 3, rarity: 'common' },
  { id: 'rune_gold', name: 'Золотая Руна', description: 'Бонус золота +100% на 30 секунд', emoji: '🔸', type: 'rune', effect: 'gold_x2_30s', quantity: 1, rarity: 'rare' },
  { id: 'potion_rage', name: 'Зелье Ярости', description: 'DPS ×3 на 20 секунд', emoji: '⚗️', type: 'potion', effect: 'dps_x3_20s', quantity: 2, rarity: 'rare' },
  { id: 'artifact_eye', name: 'Глаз Хаоса', description: 'Постоянный бонус +10 к клику', emoji: '👁️', type: 'artifact', effect: 'click_plus_10', quantity: 1, rarity: 'legendary' },
];

export const createInitialState = (): GameState => ({
  gold: 0,
  totalGold: 0,
  clickPower: 5,
  dps: 2,
  level: 1,
  xp: 0,
  xpRequired: 100,
  prestige: 0,
  totalClicks: 0,
  characters: initialCharacters,
  upgrades: initialUpgrades,
  achievements: initialAchievements,
  bosses: initialBosses,
  inventory: initialInventory,
  currentBoss: 0,
  bossActive: false,
  activeEvent: null,
  lastSave: Date.now(),
  settings: {
    soundEnabled: true,
    particlesEnabled: true,
    theme: 'dark',
    language: 'ru',
  },
});

export const formatNumber = (n: number): string => {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
};

export const rarityColors: Record<string, string> = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#D4A017',
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#D4A017',
  platinum: '#E5E4E2',
};
