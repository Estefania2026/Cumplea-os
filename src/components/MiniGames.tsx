import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef } from "react";
import { RobloxButton } from "./RobloxButton";
import { X, ShoppingBag, User, Home, Sprout, Coins } from "lucide-react";

// --- 99 NIGHTS IN THE FOREST (MEMORY MATCH) ---
export const ForestGame: React.FC<{ onComplete: (score: number) => void, onLevelComplete: (coins: number) => void }> = ({ onComplete, onLevelComplete }) => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<{ id: number, icon: string, flipped: boolean, matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [showVictoryDeer, setShowVictoryDeer] = useState(false);

  const allIcons = ['🦌', '🦉', '👾', '🔥', '🌲', '🔦', '🪓', '🍄', '🌙', '🐺', '🕸️', '🕯️'];
  const levelConfig = [
    { pairs: 2, cols: 2 }, // Level 1: 4 cards
    { pairs: 4, cols: 4 }, // Level 2: 8 cards
    { pairs: 6, cols: 4 }, // Level 3: 12 cards
    { pairs: 8, cols: 4 }, // Level 4: 16 cards
    { pairs: 10, cols: 5 }, // Level 5: 20 cards
    { pairs: 12, cols: 6 }, // Level 6: 24 cards
  ];

  const initLevel = (lvl: number) => {
    const config = levelConfig[lvl - 1];
    const selectedIcons = allIcons.slice(0, config.pairs);
    const gameIcons = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5);
    
    setCards(gameIcons.map((icon, i) => ({ id: i, icon, flipped: false, matched: false })));
    setFlippedIndices([]);
    setMessage("");
  };

  useEffect(() => {
    initLevel(level);
  }, [level]);

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedIndices([]);

          if (matchedCards.every(c => c.matched)) {
            onLevelComplete(level * 100);
            if (level < 6) {
              setMessage(`¡Nivel ${level} Completado!`);
              setTimeout(() => setLevel(l => l + 1), 1500);
            } else {
              setMessage("¡Noche superada! Tus instintos de supervivencia están a otro nivel.");
              setShowVictoryDeer(true);
              setTimeout(() => onComplete(1000), 5000);
            }
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-slate-950 min-h-[400px]">
      <h3 className="text-2xl font-bold text-neon-green uppercase">99 Nights Memory</h3>
      <div className="flex gap-2 mb-2">
        {[1, 2, 3, 4, 5, 6].map(l => (
          <div key={l} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${level >= l ? 'bg-neon-green text-black' : 'bg-slate-800 text-slate-500'}`}>
            {l}
          </div>
        ))}
      </div>
      
      {showVictoryDeer && (
        <motion.div 
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          className="flex flex-col items-center gap-4 bg-slate-900/80 p-6 rounded-3xl border-2 border-neon-green shadow-[0_0_30px_rgba(57,255,20,0.3)]"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              y: [0, -20, 0, -20, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl"
          >
            🦌
          </motion.div>
          <div className="text-neon-green font-black text-xl uppercase italic text-center">
            ¡VICTORIA!<br/>EL CIERVO ESTÁ CELEBRANDO
          </div>
        </motion.div>
      )}

      <div 
        className="grid gap-2 p-4 bg-slate-900 rounded-xl border-2 border-slate-700"
        style={{ gridTemplateColumns: `repeat(${levelConfig[level - 1].cols}, minmax(0, 1fr))` }}
      >
        {cards.map((card, i) => (
          <motion.button
            key={card.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCardClick(i)}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-lg roblox-glossy flex items-center justify-center text-2xl transition-all duration-300 ${card.flipped || card.matched ? 'bg-slate-700' : 'bg-slate-800'}`}
          >
            {(card.flipped || card.matched) ? card.icon : '❓'}
          </motion.button>
        ))}
      </div>

      {message && (
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="text-neon-green font-bold text-center text-xl animate-bounce"
        >
          {message}
        </motion.div>
      )}
    </div>
  );
};

// --- FISCH ---

/**
 * Rarity levels for fish.
 */
type Rarity = 'Común' | 'Raro' | 'Épico' | 'Legendario' | 'Mítico' | 'Divino';

interface Fish {
  id: string;
  name: string;
  rarity: Rarity;
  value: number;
  icon: string;
}

interface Rod {
  id: string;
  name: string;
  price: number;
  luckBonus: number; // Multiplier for rare fish probability
  speedBonus: number; // Multiplier for progress bar speed
}

/**
 * Database of all catchable fish.
 */
const FISH_DATABASE: Fish[] = [
  { id: 'f1', name: 'Sardina', rarity: 'Común', value: 10, icon: '🐟' },
  { id: 'f2', name: 'Trucha', rarity: 'Común', value: 15, icon: '🐠' },
  { id: 'f3', name: 'Salmón', rarity: 'Raro', value: 50, icon: '🐡' },
  { id: 'f4', name: 'Atún', rarity: 'Raro', value: 75, icon: '🦈' },
  { id: 'f5', name: 'Pez Espada', rarity: 'Épico', value: 200, icon: '⚔️' },
  { id: 'f6', name: 'Manta Raya', rarity: 'Épico', value: 250, icon: '🪁' },
  { id: 'f7', name: 'Tiburón Blanco', rarity: 'Legendario', value: 1000, icon: '🦈' },
  { id: 'f8', name: 'Kraken Jr.', rarity: 'Legendario', value: 1500, icon: '🐙' },
  { id: 'f9', name: 'Leviatán', rarity: 'Mítico', value: 5000, icon: '🐉' },
  { id: 'f10', name: 'Pez de Oro Divino', rarity: 'Divino', value: 10000, icon: '✨' },
];

/**
 * Available fishing rods in the shop.
 */
const RODS: Rod[] = [
  { id: 'r1', name: 'Caña Básica', price: 0, luckBonus: 1, speedBonus: 1 },
  { id: 'r2', name: 'Caña de Madera', price: 500, luckBonus: 1.2, speedBonus: 1.1 },
  { id: 'r3', name: 'Caña Reforzada', price: 1500, luckBonus: 1.5, speedBonus: 1.3 },
  { id: 'r4', name: 'Caña Profesional', price: 5000, luckBonus: 2, speedBonus: 1.5 },
  { id: 'r5', name: 'Caña Élite', price: 15000, luckBonus: 3, speedBonus: 2 },
  { id: 'r6', name: 'Caña Legendaria', price: 50000, luckBonus: 5, speedBonus: 3 },
];

/**
 * Difficulty levels for the fishing game.
 */
const FISCH_LEVELS = [
  { name: 'Fácil', time: 30, difficulty: 1, maxRarity: 'Raro' },
  { name: 'Normal', time: 25, difficulty: 1.5, maxRarity: 'Épico' },
  { name: 'Medio', time: 20, difficulty: 2, maxRarity: 'Legendario' },
  { name: 'Difícil', time: 15, difficulty: 3, maxRarity: 'Mítico' },
  { name: 'Experto', time: 10, difficulty: 4, maxRarity: 'Divino' },
  { name: 'Maestro', time: 7, difficulty: 5, maxRarity: 'Divino' },
];

export const FischGame: React.FC<{ onComplete: (score: number) => void, onLevelComplete: (coins: number) => void }> = ({ onComplete, onLevelComplete }) => {
  // Persistence using localStorage
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('fisch_coins')) || 0);
  const [inventory, setInventory] = useState<Fish[]>(() => JSON.parse(localStorage.getItem('fisch_inventory') || '[]'));
  const [ownedRods, setOwnedRods] = useState<string[]>(() => JSON.parse(localStorage.getItem('fisch_rods') || '["r1"]'));
  const [equippedRodId, setEquippedRodId] = useState(() => localStorage.getItem('fisch_equipped_rod') || 'r1');

  // Game state
  const [levelIdx, setLevelIdx] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [position, setPosition] = useState(50);
  const [target, setTarget] = useState(50);
  const [progress, setProgress] = useState(0);
  const [isCatching, setIsCatching] = useState(false);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const equippedRod = RODS.find(r => r.id === equippedRodId) || RODS[0];
  const currentLevel = FISCH_LEVELS[levelIdx];

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('fisch_coins', coins.toString());
    localStorage.setItem('fisch_inventory', JSON.stringify(inventory));
    localStorage.setItem('fisch_rods', JSON.stringify(ownedRods));
    localStorage.setItem('fisch_equipped_rod', equippedRodId);
  }, [coins, inventory, ownedRods, equippedRodId]);

  // Logic to move the target area randomly
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setTarget(prev => {
        const moveRange = 10 * currentLevel.difficulty;
        const move = (Math.random() - 0.5) * moveRange;
        return Math.max(10, Math.min(90, prev + move));
      });
    }, 800 / currentLevel.difficulty);
    return () => clearInterval(interval);
  }, [gameActive, currentLevel]);

  // Logic to update progress bar when player is "pulling" within the target area
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      if (isCatching) {
        const diff = Math.abs(position - target);
        const catchRange = 15;
        if (diff < catchRange) {
          setProgress(p => Math.min(100, p + (1 * equippedRod.speedBonus)));
        } else {
          setProgress(p => Math.max(0, p - (0.5 * currentLevel.difficulty)));
        }
      } else {
        setProgress(p => Math.max(0, p - 0.2));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isCatching, position, target, equippedRod, currentLevel, gameActive]);

  // Countdown timer logic
  useEffect(() => {
    if (!gameActive) return;
    if (timeLeft <= 0) {
      setGameActive(false);
      setMessage("¡Se acabó el tiempo! El pez escapó.");
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive, timeLeft]);

  // Check if fish is caught
  useEffect(() => {
    if (progress >= 100 && gameActive) {
      setGameActive(false);
      handleCatch();
    }
  }, [progress, gameActive]);

  /**
   * Starts a new fishing attempt.
   */
  const startGame = () => {
    setProgress(0);
    setTimeLeft(currentLevel.time);
    setGameActive(true);
    setMessage("");
  };

  /**
   * Handles the logic for determining which fish was caught based on rarity and rod luck.
   */
  const handleCatch = () => {
    const rarities: Rarity[] = ['Común', 'Raro', 'Épico', 'Legendario', 'Mítico', 'Divino'];
    const maxRarityIdx = rarities.indexOf(currentLevel.maxRarity as Rarity);
    
    // Weighted random selection influenced by rod luck
    const luck = equippedRod.luckBonus;
    const roll = Math.random() * 100;
    
    let selectedRarity: Rarity = 'Común';
    if (roll < 0.1 * luck && maxRarityIdx >= 5) selectedRarity = 'Divino';
    else if (roll < 1 * luck && maxRarityIdx >= 4) selectedRarity = 'Mítico';
    else if (roll < 5 * luck && maxRarityIdx >= 3) selectedRarity = 'Legendario';
    else if (roll < 15 * luck && maxRarityIdx >= 2) selectedRarity = 'Épico';
    else if (roll < 40 * luck && maxRarityIdx >= 1) selectedRarity = 'Raro';
    
    const possibleFish = FISH_DATABASE.filter(f => f.rarity === selectedRarity);
    const caughtFish = possibleFish[Math.floor(Math.random() * possibleFish.length)];

    setInventory(prev => [...prev, caughtFish]);
    setCoins(c => c + caughtFish.value);
    onLevelComplete(caughtFish.value);
    setMessage(`¡Capturaste un ${caughtFish.name}! (${caughtFish.rarity}) +${caughtFish.value} monedas`);
    
    if (caughtFish.rarity === 'Divino') {
      setTimeout(() => onComplete(coins + 5000), 3000);
    }
  };

  /**
   * Handles purchasing a new rod from the shop.
   */
  const buyRod = (rod: Rod) => {
    if (coins >= rod.price && !ownedRods.includes(rod.id)) {
      setCoins(c => c - rod.price);
      setOwnedRods(prev => [...prev, rod.id]);
      setEquippedRodId(rod.id);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-slate-950 min-h-[500px] relative">
      {/* Header Stats */}
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-col">
          <div className="text-vibrant-orange font-bold flex items-center gap-2">
            <Coins size={16} /> {coins}
          </div>
          <div className="text-xs text-slate-400 uppercase font-bold">{equippedRod.name}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowInventory(true)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <User size={20} />
          </button>
          <button onClick={() => setShowShop(true)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>

      {/* Level Selector */}
      {!gameActive && (
        <div className="flex flex-wrap justify-center gap-2">
          {FISCH_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.name}
              onClick={() => setLevelIdx(idx)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${levelIdx === idx ? 'bg-vibrant-orange text-black' : 'bg-slate-800 text-slate-400'}`}
            >
              {lvl.name}
            </button>
          ))}
        </div>
      )}

      <h3 className="text-2xl font-black text-vibrant-orange uppercase tracking-tighter italic">FISCH PRO</h3>

      {gameActive ? (
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="text-xl font-mono text-red-500 font-bold">TIEMPO: {timeLeft}s</div>
          
          <div className="relative w-16 h-64 bg-slate-900 rounded-full border-4 border-slate-800 overflow-hidden shadow-2xl">
            {/* Target Area */}
            <motion.div 
              animate={{ top: `${target}%` }} 
              className="absolute left-0 w-full h-16 bg-neon-green/20 border-y-2 border-neon-green/50" 
              style={{ transform: 'translateY(-50%)' }} 
            />
            {/* Player Bar */}
            <div 
              className="absolute left-0 w-full h-10 bg-vibrant-orange border-y-2 border-white shadow-[0_0_15px_rgba(255,95,31,0.5)]" 
              style={{ top: `${position}%`, transform: 'translateY(-50%)' }} 
            />
          </div>
          
          <div className="w-full max-w-xs h-4 bg-slate-900 rounded-full border-2 border-slate-800 overflow-hidden">
            <motion.div 
              className="h-full bg-neon-green" 
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <div className="flex gap-4">
            <button 
              onMouseDown={() => setIsCatching(true)} 
              onMouseUp={() => setIsCatching(false)} 
              onTouchStart={() => setIsCatching(true)} 
              onTouchEnd={() => setIsCatching(false)} 
              className="w-24 h-24 rounded-full bg-vibrant-orange roblox-glossy flex items-center justify-center text-black font-black text-2xl shadow-lg active:scale-90 transition-transform"
            >
              PULL!
            </button>
            <div className="flex flex-col gap-2">
              <button onClick={() => setPosition(p => Math.max(5, p - 8))} className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700">⬆️</button>
              <button onClick={() => setPosition(p => Math.min(95, p + 8))} className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700">⬇️</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl animate-bounce">🎣</div>
          <RobloxButton variant="primary" onClick={startGame}>LANZAR ANZUELO</RobloxButton>
          {message && <div className="text-vibrant-orange font-bold text-center bg-slate-900 p-4 rounded-xl border border-vibrant-orange/30">{message}</div>}
        </div>
      )}

      {/* Shop Modal */}
      <AnimatePresence>
        {showShop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-6 rounded-3xl border-2 border-vibrant-orange w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-900 py-2">
                <h4 className="text-2xl font-black text-vibrant-orange">TIENDA DE CAÑAS</h4>
                <button onClick={() => setShowShop(false)} className="p-2 hover:bg-slate-800 rounded-full"><X /></button>
              </div>
              <div className="space-y-3">
                {RODS.map(rod => (
                  <div key={rod.id} className={`flex justify-between items-center p-4 rounded-2xl border-2 transition-all ${equippedRodId === rod.id ? 'border-neon-green bg-slate-800/50' : 'border-slate-800 bg-slate-800'}`}>
                    <div className="flex-1">
                      <div className="font-black text-lg">{rod.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase flex gap-2">
                        <span>🍀 x{rod.luckBonus}</span>
                        <span>⚡ x{rod.speedBonus}</span>
                      </div>
                    </div>
                    {ownedRods.includes(rod.id) ? (
                      <button 
                        onClick={() => setEquippedRodId(rod.id)}
                        disabled={equippedRodId === rod.id}
                        className={`px-4 py-2 rounded-xl font-bold text-xs ${equippedRodId === rod.id ? 'bg-neon-green text-black' : 'bg-slate-700 text-slate-300'}`}
                      >
                        {equippedRodId === rod.id ? 'EQUIPADA' : 'EQUIPAR'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => buyRod(rod)}
                        disabled={coins < rod.price}
                        className={`px-4 py-2 rounded-xl font-bold text-xs ${coins >= rod.price ? 'bg-vibrant-orange text-black' : 'bg-slate-700 text-slate-500'}`}
                      >
                        🪙 {rod.price}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Modal */}
      <AnimatePresence>
        {showInventory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-6 rounded-3xl border-2 border-neon-blue w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-900 py-2">
                <h4 className="text-2xl font-black text-neon-blue">MI INVENTARIO</h4>
                <button onClick={() => setShowInventory(false)} className="p-2 hover:bg-slate-800 rounded-full"><X /></button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {inventory.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-slate-500 font-bold uppercase">No has pescado nada aún...</div>
                ) : (
                  inventory.map((fish, i) => (
                    <div key={i} className="bg-slate-800 p-3 rounded-2xl border border-slate-700 flex flex-col items-center gap-1">
                      <div className="text-3xl">{fish.icon}</div>
                      <div className="font-bold text-xs text-center leading-tight">{fish.name}</div>
                      <div className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                        fish.rarity === 'Divino' ? 'bg-yellow-400 text-black' :
                        fish.rarity === 'Mítico' ? 'bg-purple-600 text-white' :
                        fish.rarity === 'Legendario' ? 'bg-orange-500 text-white' :
                        fish.rarity === 'Épico' ? 'bg-blue-600 text-white' :
                        fish.rarity === 'Raro' ? 'bg-green-600 text-white' :
                        'bg-slate-600 text-white'
                      }`}>
                        {fish.rarity}
                      </div>
                      <div className="text-[10px] text-neon-green font-bold">🪙 {fish.value}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- PRISON LIFE ---
export const PrisonGame: React.FC<{ onComplete: (score: number) => void, onLevelComplete: (coins: number) => void, selectedSkin?: string, selectedTrail?: string, selectedPet?: string }> = ({ onComplete, onLevelComplete, selectedSkin, selectedTrail, selectedPet }) => {
  const [mode, setMode] = useState<'doors' | 'runner'>('runner');
  const [doorLevel, setDoorLevel] = useState(1);
  const [doorMessage, setDoorMessage] = useState("");
  const [correctDoor, setCorrectDoor] = useState(Math.floor(Math.random() * 4) + 1);

  const handleDoorClick = (doorNum: number) => {
    if (doorMessage) return;

    if (doorNum === correctDoor) {
      if (doorLevel >= 5) {
        setDoorMessage("¡Has logrado escapar! 🏃‍♂️💨");
        onLevelComplete(5000);
        setTimeout(() => onComplete(5000), 3000);
      } else {
        setDoorMessage("¡Puerta correcta! Siguiente nivel...");
        setTimeout(() => {
          setDoorLevel(prev => prev + 1);
          setCorrectDoor(Math.floor(Math.random() * 4) + 1);
          setDoorMessage("");
        }, 1500);
      }
    } else {
      setDoorMessage("¡Atrapado por la policía! Reintentando...");
      setTimeout(() => {
        setDoorLevel(1);
        setCorrectDoor(Math.floor(Math.random() * 4) + 1);
        setDoorMessage("");
      }, 2000);
    }
  };

  // --- RUNNER LOGIC (Platformer) ---
  const [runnerLevel, setRunnerLevel] = useState(1);
  const [player, setPlayer] = useState({ x: 50, y: 0, vx: 0, vy: 0, width: 30, height: 30, isJumping: false, doubleJumpAvailable: true });
  const [worldX, setWorldX] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [runnerMessage, setRunnerMessage] = useState("");
  const [hasWon, setHasWon] = useState(false);
  const [powerUp, setPowerUp] = useState<{ active: boolean, type: 'star', timeLeft: number }>({ active: false, type: 'star', timeLeft: 0 });
  const [trailParticles, setTrailParticles] = useState<{ id: number, x: number, y: number, color: string }[]>([]);
  
  const RUNNER_LEVELS = [
    { name: 'Fácil', speed: 3, enemies: 2, platforms: 10, length: 2000 },
    { name: 'Medio', speed: 5, enemies: 4, platforms: 15, length: 3000 },
    { name: 'Difícil', speed: 7, enemies: 6, platforms: 20, length: 4000 },
    { name: 'Experto', speed: 9, enemies: 8, platforms: 25, length: 5000 },
  ];

  const currentRunnerLevel = RUNNER_LEVELS[runnerLevel - 1];

  interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'platform' | 'enemy_barry' | 'enemy_police' | 'star' | 'goal';
    id: number;
    vx?: number;
  }

  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);

  const initRunner = () => {
    const objects: GameObject[] = [];
    const config = currentRunnerLevel;
    
    // Platforms
    for (let i = 0; i < config.platforms; i++) {
      objects.push({
        id: Math.random(),
        type: 'platform',
        x: 400 + (i * (config.length / config.platforms)),
        y: 100 + Math.random() * 100,
        width: 150,
        height: 20
      });
    }

    // Enemies
    for (let i = 0; i < config.enemies; i++) {
      objects.push({
        id: Math.random(),
        type: Math.random() > 0.5 ? 'enemy_barry' : 'enemy_police',
        x: 600 + (i * (config.length / config.enemies)),
        y: 0,
        width: 40,
        height: 40,
        vx: (Math.random() - 0.5) * 2
      });
    }

    // Stars
    for (let i = 0; i < 3; i++) {
      const starX = 1000 + i * 1000;
      const starY = 150;
      objects.push({
        id: Math.random(),
        type: 'star',
        x: starX,
        y: starY,
        width: 30,
        height: 30
      });

      // Expert difficulty: Add NPCs on star platforms
      if (config.name === 'Experto') {
        objects.push({
          id: Math.random(),
          type: 'enemy_police',
          x: starX + 40,
          y: starY,
          width: 40,
          height: 40,
          vx: -1.5
        });
        objects.push({
          id: Math.random(),
          type: 'enemy_barry',
          x: starX - 40,
          y: starY,
          width: 40,
          height: 40,
          vx: 1.5
        });
      }
    }

    // Goal
    objects.push({
      id: 999,
      type: 'goal',
      x: config.length - 100,
      y: 0,
      width: 60,
      height: 100
    });

    setGameObjects(objects);
    setPlayer({ x: 50, y: 0, vx: 0, vy: 0, width: 30, height: 30, isJumping: false, doubleJumpAvailable: true });
    setWorldX(0);
    setGameActive(true);
    setRunnerMessage("");
    setHasWon(false);
    setPowerUp({ active: false, type: 'star', timeLeft: 0 });
  };

  // Keyboard controls
  const keys = useRef<{ [key: string]: boolean }>({});
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; if (e.code === 'Space') jump(); };
    const handleKeyUp = (e: KeyboardEvent) => keys.current[e.code] = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameActive, player.isJumping, player.doubleJumpAvailable]);

  const jump = () => {
    if (!gameActive) return;
    setPlayer(p => {
      if (!p.isJumping) return { ...p, vy: 15, isJumping: true, doubleJumpAvailable: true };
      if (p.doubleJumpAvailable) return { ...p, vy: 12, doubleJumpAvailable: false };
      return p;
    });
  };

  // Game Loop
  useEffect(() => {
    if (!gameActive || mode !== 'runner') return;

    const loop = setInterval(() => {
      setPlayer(p => {
        let nvx = 0;
        const speed = powerUp.active ? currentRunnerLevel.speed * 1.5 : currentRunnerLevel.speed;
        
        if (keys.current['ArrowLeft'] || keys.current['KeyA']) nvx = -speed;
        if (keys.current['ArrowRight'] || keys.current['KeyD']) nvx = speed;

        let nvy = p.vy - 0.8; // Gravity
        let nx = p.x + nvx;
        let ny = p.y + nvy;

        // Ground collision
        if (ny <= 0) {
          ny = 0;
          nvy = 0;
          p.isJumping = false;
          p.doubleJumpAvailable = true;
        }

        // Object collisions
        let finalY = ny;
        let finalVY = nvy;
        let finalIsJumping = p.isJumping;
        let finalDoubleJump = p.doubleJumpAvailable;

        gameObjects.forEach(obj => {
          const isColliding = nx < obj.x + obj.width && nx + p.width > obj.x && ny < obj.y + obj.height && ny + p.height > obj.y;
          
          if (isColliding) {
            if (obj.type === 'platform') {
              // Only collide if falling onto it
              if (p.vy < 0 && p.y >= obj.y + obj.height - 5) {
                finalY = obj.y + obj.height;
                finalVY = 0;
                finalIsJumping = false;
                finalDoubleJump = true;
              }
            } else if (obj.type === 'enemy_barry' || obj.type === 'enemy_police') {
              if (!powerUp.active) handleRunnerFail("¡Barry te atrapó!");
            } else if (obj.type === 'star') {
              setPowerUp({ active: true, type: 'star', timeLeft: 5 });
              setGameObjects(prev => prev.filter(o => o.id !== obj.id));
            } else if (obj.type === 'goal') {
              handleRunnerWin();
            }
          }
        });

        // Camera follow
        if (nx > 200) {
          setWorldX(nx - 200);
        }

        // Trail logic
        if (selectedTrail && selectedTrail !== 'none' && (nvx !== 0 || nvy !== 0)) {
          setTrailParticles(prev => {
            const newParticle = {
              id: Math.random(),
              x: nx + 15,
              y: ny + 15,
              color: selectedTrail === 'neon' ? `hsl(${Date.now() % 360}, 100%, 50%)` : 
                     selectedTrail === 'fire' ? (Math.random() > 0.5 ? '#FF4500' : '#FF8C00') : 
                     '#FFD700'
            };
            return [newParticle, ...prev].slice(0, 20);
          });
        }

        return { ...p, x: nx, y: finalY, vx: nvx, vy: finalVY, isJumping: finalIsJumping, doubleJumpAvailable: finalDoubleJump };
      });

      // Move enemies
      setGameObjects(prev => prev.map(obj => {
        if (obj.type === 'enemy_barry' || obj.type === 'enemy_police') {
          let nvx = obj.vx || 1;
          if (Math.random() < 0.02) nvx *= -1;
          return { ...obj, x: obj.x + nvx, vx: nvx };
        }
        return obj;
      }));

      // Power-up timer
      setPowerUp(p => p.active ? { ...p, timeLeft: Math.max(0, p.timeLeft - 0.03), active: p.timeLeft > 0 } : p);

    }, 30);

    return () => clearInterval(loop);
  }, [gameActive, mode, gameObjects, powerUp.active]);

  const handleRunnerFail = (msg: string) => {
    setGameActive(false);
    setRunnerMessage(msg);
    setTimeout(() => initRunner(), 2000);
  };

  const handleRunnerWin = () => {
    setGameActive(false);
    setHasWon(true);
    onLevelComplete(runnerLevel * 1000);
  };

  const nextRunnerLevel = () => {
    if (runnerLevel < 4) {
      setRunnerLevel(l => l + 1);
      setHasWon(false);
    } else {
      onComplete(10000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-slate-950 min-h-[500px] relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between w-full z-10">
        <div className="flex gap-2">
          <button 
            onClick={() => setMode('runner')} 
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${mode === 'runner' ? 'bg-red-600 text-slate-200' : 'bg-slate-800 text-slate-400'}`}
          >
            Runner
          </button>
          <button 
            onClick={() => setMode('doors')} 
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${mode === 'doors' ? 'bg-red-600 text-slate-200' : 'bg-slate-800 text-slate-400'}`}
          >
            Puertas
          </button>
        </div>
      </div>

      {mode === 'doors' ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <h3 className="text-2xl font-bold text-red-600 uppercase italic tracking-tighter">PUERTA DE LA SUERTE</h3>
          <div className="flex justify-between w-full text-xs font-bold">
            <div className="text-neon-yellow">NIVEL: {doorLevel}/5</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            {[1, 2, 3, 4].map(num => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDoorClick(num)}
                className="h-32 bg-slate-900 rounded-xl border-4 border-red-600 flex flex-col items-center justify-center gap-2 hover:bg-slate-800 transition-colors group"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">🚪</div>
                <div className="text-white font-black">PUERTA {num}</div>
              </motion.button>
            ))}
          </div>

          <div className="text-[10px] text-slate-500 uppercase text-center">
            Elige una puerta. ¡Solo una te lleva a la libertad!
          </div>

          {doorMessage && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center font-black text-lg p-4 bg-red-600 text-white rounded-xl border-4 border-yellow-400 rotate-2"
            >
              {doorMessage}
            </motion.div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full">
          <h3 className="text-2xl font-bold text-red-600 uppercase italic tracking-tighter">PRISON RUNNER</h3>
          
          {!gameActive && !hasWon ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="text-6xl mb-4">🏃‍♂️💨</div>
              <div className="flex gap-2 mb-4">
                {RUNNER_LEVELS.map((l, i) => (
                  <button 
                    key={l.name} 
                    onClick={() => setRunnerLevel(i + 1)}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${runnerLevel === i + 1 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
              <RobloxButton variant="primary" onClick={initRunner}>COMENZAR NIVEL {runnerLevel}</RobloxButton>
              {runnerMessage && <div className="text-red-500 font-bold text-center mt-4">{runnerMessage}</div>}
            </div>
          ) : hasWon ? (
            <div className="flex flex-col items-center gap-6 py-12 relative overflow-hidden w-full">
              <motion.h2 
                initial={{ scale: 0 }}
                animate={{ scale: 1.5 }}
                className="text-6xl font-black text-neon-green italic tracking-tighter z-10"
              >
                🎈 ¡GANASTE!
              </motion.h2>
              
              {/* Animated Balloons */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 400, x: (i * 40) - 200 }}
                  animate={{ y: -600 }}
                  transition={{ duration: 4, delay: i * 0.2, repeat: Infinity }}
                  className="absolute text-4xl"
                >
                  🎈
                </motion.div>
              ))}

              <div className="z-10 flex flex-col items-center gap-4">
                <div className="text-xl font-bold text-white">Nivel {runnerLevel} completado</div>
                <RobloxButton variant="success" onClick={nextRunnerLevel}>
                  {runnerLevel < 4 ? 'SIGUIENTE NIVEL' : 'FINALIZAR'}
                </RobloxButton>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-64 bg-slate-900 rounded-2xl border-4 border-slate-800 overflow-hidden shadow-2xl">
              {/* Background Parallax (Simple) */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" style={{ transform: `translateX(${-worldX * 0.2}px)` }} />
              
              <div className="absolute bottom-0 w-full h-8 bg-slate-800 border-t-2 border-slate-700" />
              
              {/* Game Objects */}
              <div style={{ transform: `translateX(${-worldX}px)` }} className="absolute inset-0 transition-transform duration-100 ease-linear">
                {/* Trail Particles */}
                {trailParticles.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 0, opacity: 0 }}
                    className="absolute w-2 h-2 rounded-full pointer-events-none z-0"
                    style={{ 
                      left: p.x, 
                      bottom: p.y + 32, 
                      backgroundColor: p.color,
                      boxShadow: `0 0 10px ${p.color}`
                    }}
                  />
                ))}

                {gameObjects.map(obj => (
                  <div 
                    key={obj.id} 
                    className={`absolute flex items-center justify-center ${
                      obj.type === 'platform' ? 'bg-slate-700 rounded-lg border-b-4 border-slate-900' : 
                      obj.type === 'enemy_barry' ? 'text-3xl' : 
                      obj.type === 'enemy_police' ? 'text-3xl' : 
                      obj.type === 'star' ? 'text-2xl animate-spin' : 
                      obj.type === 'goal' ? 'bg-neon-green/20 border-l-4 border-dashed border-neon-green flex flex-col' : ''
                    }`}
                    style={{ left: obj.x, bottom: obj.y + 32, width: obj.width, height: obj.height }}
                  >
                    {obj.type === 'enemy_barry' && '🤡'}
                    {obj.type === 'enemy_police' && '👮'}
                    {obj.type === 'star' && '⭐'}
                    {obj.type === 'goal' && <div className="text-4xl">🏁</div>}
                  </div>
                ))}

                {/* Player */}
                <motion.div 
                  className={`absolute w-10 h-10 bg-cobalt-blue rounded-lg roblox-glossy flex items-center justify-center text-[8px] font-black border-2 border-white/20 ${powerUp.active ? 'shadow-[0_0_20px_#FFD700]' : ''}`}
                  style={{ left: player.x, bottom: player.y + 32 }}
                >
                  {selectedSkin === 'poppy' && <div className="absolute -top-6 text-2xl">🫂</div>}
                  {selectedSkin === 'mario' && <div className="absolute -top-6 text-2xl">🍄</div>}
                  {selectedSkin === 'barry' && <div className="absolute -top-6 text-2xl">🤡</div>}
                  {selectedSkin === 'police' && <div className="absolute -top-6 text-2xl">👮</div>}
                  {powerUp.active && <div className="absolute -top-2 -right-2 text-xs">⭐</div>}
                  
                  {/* Pet in Game */}
                  {selectedPet && selectedPet !== 'none' && (
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-8 -right-8 text-2xl"
                    >
                      {selectedPet === 'deer' ? '🦌' : selectedPet === 'robot' ? '🤖' : '📦'}
                    </motion.div>
                  )}
                  
                  MARTÍN
                </motion.div>
              </div>

              {/* HUD */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">PROGRESO</div>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-full bg-red-600" style={{ width: `${(player.x / currentRunnerLevel.length) * 100}%` }} />
                </div>
              </div>
              {powerUp.active && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-[10px] font-bold animate-pulse">
                  ESTRELLA: {powerUp.timeLeft.toFixed(1)}s
                </div>
              )}
            </div>
          )}

          {gameActive && (
            <div className="flex gap-4 w-full max-w-xs">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <button 
                  onMouseDown={() => keys.current['ArrowLeft'] = true}
                  onMouseUp={() => keys.current['ArrowLeft'] = false}
                  onTouchStart={() => keys.current['ArrowLeft'] = true}
                  onTouchEnd={() => keys.current['ArrowLeft'] = false}
                  className="p-4 bg-slate-800 rounded-xl text-2xl"
                >
                  ⬅️
                </button>
                <button 
                  onMouseDown={() => keys.current['ArrowRight'] = true}
                  onMouseUp={() => keys.current['ArrowRight'] = false}
                  onTouchStart={() => keys.current['ArrowRight'] = true}
                  onTouchEnd={() => keys.current['ArrowRight'] = false}
                  className="p-4 bg-slate-800 rounded-xl text-2xl"
                >
                  ➡️
                </button>
              </div>
              <button 
                onClick={jump}
                className="flex-1 p-4 bg-red-600 rounded-xl font-black text-white shadow-lg active:scale-95"
              >
                SALTAR
              </button>
            </div>
          )}
          
          <div className="text-[10px] text-slate-500 uppercase text-center">
            Usa las flechas o botones para moverte y saltar. ¡Llega a la meta!
          </div>
        </div>
      )}
    </div>
  );
};

// --- ADIVINANZAS (TABBED GAMES) ---
export const AdivinanzasGame: React.FC<{ onComplete: (score: number) => void, onLevelComplete: (coins: number) => void }> = ({ onComplete, onLevelComplete }) => {
  const [activeTab, setActiveTab] = useState<'numero' | 'ahorcado'>('numero');

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-800 bg-slate-900 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('numero')}
          className={`flex-1 min-w-[100px] py-3 px-2 text-[10px] md:text-xs font-black uppercase transition-all ${activeTab === 'numero' ? 'bg-neon-yellow text-black' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          🔢 NÚMERO
        </button>
        <button 
          onClick={() => setActiveTab('ahorcado')}
          className={`flex-1 min-w-[100px] py-3 px-2 text-[10px] md:text-xs font-black uppercase transition-all ${activeTab === 'ahorcado' ? 'bg-neon-yellow text-black' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          💀 AHORCADO
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'numero' ? (
          <AdivinaNumero onComplete={onComplete} onLevelComplete={onLevelComplete} />
        ) : (
          <AhorcadoExtremo onComplete={onComplete} onLevelComplete={onLevelComplete} />
        )}
      </div>
    </div>
  );
};

// --- ADIVINA EL NÚMERO ---
const AdivinaNumero: React.FC<{ onComplete: (score: number) => void, onLevelComplete: (coins: number) => void }> = ({ onComplete, onLevelComplete }) => {
  const [secretNumber, setSecretNumber] = useState(Math.floor(Math.random() * 500) + 1);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState<{ val: number, result: 'high' | 'low' }[]>([]);
  const [message, setMessage] = useState("Adivina el número entre 1 y 500");
  const [hasWon, setHasWon] = useState(false);
  const [showPana, setShowPana] = useState(false);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 500) return;

    setAttempts(a => a + 1);
    setShowPana(true);
    setTimeout(() => setShowPana(false), 2000);

    if (num === secretNumber) {
      setHasWon(true);
      setMessage("🎉 ¡BRUTAL! ADIVINASTE EL NÚMERO.");
      onLevelComplete(50);
      setTimeout(() => onComplete(500), 3000);
    } else if (num < secretNumber) {
      setMessage("¡MÁS ALTO! ⬆️");
      setHistory(prev => [{ val: num, result: 'low' }, ...prev].slice(0, 5));
    } else {
      setMessage("¡MÁS BAJO! ⬇️");
      setHistory(prev => [{ val: num, result: 'high' }, ...prev].slice(0, 5));
    }
    setGuess("");
  };

  const reset = () => {
    setSecretNumber(Math.floor(Math.random() * 500) + 1);
    setGuess("");
    setAttempts(0);
    setHistory([]);
    setMessage("Adivina el número entre 1 y 500");
    setHasWon(false);
  };

  return (
    <div className="p-8 flex flex-col items-center gap-6 bg-slate-950 min-h-[500px]">
      <h3 className="text-2xl font-black text-neon-yellow italic tracking-tighter uppercase">ADIVINA EL NÚMERO</h3>

      <div className="flex gap-8 items-center justify-center w-full">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-500 font-bold">INTENTOS</span>
          <span className="text-3xl font-black text-neon-blue">{attempts}</span>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <input 
          type="number" 
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="???"
          className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 text-center text-2xl font-black text-neon-yellow focus:border-neon-yellow outline-none transition-all"
          onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
          disabled={hasWon}
        />
        <RobloxButton variant="primary" className="w-full py-4 text-xl" onClick={handleGuess} disabled={hasWon}>
          ADIVINAR
        </RobloxButton>
      </div>

      <AnimatePresence>
        {showPana && (
          <motion.div 
            initial={{ scale: 0, x: 50 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0, x: 50 }}
            className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border-2 border-neon-blue"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-neon-blue">
              <img src="https://images2.alphacoders.com/916/916198.jpg" alt="Pana Martín" className="w-full h-full object-cover" />
            </div>
            <div className="text-xs font-bold text-white">
              Pana Martín dice:<br/>
              <span className="text-neon-blue">{message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showPana && (
        <div className={`text-lg font-black uppercase italic ${message.includes('ALTO') ? 'text-neon-green' : message.includes('BAJO') ? 'text-red-500' : 'text-neon-yellow'}`}>
          {message}
        </div>
      )}

      <div className="w-full max-w-xs space-y-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase">HISTORIAL RECIENTE</span>
        <div className="flex flex-col gap-1">
          {history.map((h, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-300">{h.val}</span>
              <span className={`text-[10px] font-black ${h.result === 'high' ? 'text-red-500' : 'text-neon-green'}`}>
                {h.result === 'high' ? 'DEMASIADO ALTO' : 'DEMASIADO BAJO'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {hasWon && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="text-4xl">🎊🎊🎊</div>
          <RobloxButton variant="secondary" onClick={reset}>REINTENTAR</RobloxButton>
        </motion.div>
      )}
    </div>
  );
};

// --- AHORCADO EXTREMO ---
const AhorcadoExtremo: React.FC<{ onComplete: (score: number) => void, onLevelComplete: (coins: number) => void }> = ({ onComplete, onLevelComplete }) => {
  const [difficulty, setDifficulty] = useState<'Normal' | 'Difícil' | 'Muy Difícil' | 'Extremo'>('Normal');
  const [word, setWord] = useState("");
  const [category, setCategory] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const WORDS_DB = {
    Normal: [
      { word: "COCO", cat: "Disney/Pixar" },
      { word: "CARS", cat: "Disney/Pixar" },
      { word: "UP", cat: "Disney/Pixar" },
      { word: "POPPY", cat: "Poppy Playtime" },
      { word: "JUAN", cat: "Viral" },
      { word: "FROZEN", cat: "Disney" },
    ],
    Difícil: [
      { word: "RATATOUILLE", cat: "Disney/Pixar" },
      { word: "HUGGY WUGGY", cat: "Poppy Playtime" },
      { word: "KISSY MISSY", cat: "Poppy Playtime" },
      { word: "WALL-E", cat: "Disney/Pixar" },
      { word: "ENCANTO", cat: "Disney" },
    ],
    "Muy Difícil": [
      { word: "MOMMY LONG LEGS", cat: "Poppy Playtime" },
      { word: "SKIBIDI TOILET", cat: "Viral" },
      { word: "THE LION KING", cat: "Disney" },
      { word: "GRIMACE SHAKE", cat: "Viral" },
      { word: "FINDING NEMO", cat: "Disney/Pixar" },
    ],
    Extremo: [
      { word: "CATNAP", cat: "Poppy Playtime" },
      { word: "DOGDAY", cat: "Poppy Playtime" },
      { word: "SMURF CAT", cat: "Viral" },
      { word: "PINK ELEPHANT", cat: "Viral" },
      { word: "PROTOTYPE", cat: "Poppy Playtime" },
    ]
  };

  const initGame = () => {
    const list = WORDS_DB[difficulty];
    const item = list[Math.floor(Math.random() * list.length)];
    setWord(item.word.toUpperCase());
    setCategory(item.cat);
    setGuessedLetters([]);
    setErrors(0);
    setIsGameOver(false);
    setHasWon(false);
  };

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const handleLetterClick = (letter: string) => {
    if (isGameOver || hasWon || guessedLetters.includes(letter)) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const newErrors = errors + 1;
      setErrors(newErrors);
      if (newErrors >= 9) {
        setIsGameOver(true);
      }
    } else {
      // Check win
      const allGuessed = word.split("").every(char => char === " " || newGuessed.includes(char));
      if (allGuessed) {
        setHasWon(true);
        onLevelComplete(75);
        setTimeout(() => onComplete(750), 4000);
      }
    }
  };

  const renderStickman = () => {
    return (
      <div className="relative w-40 h-52 border-b-4 border-slate-700 flex items-center justify-center overflow-hidden">
        {/* Gallows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-slate-800" />
        
        <motion.div 
          animate={isGameOver ? { y: 200, rotate: 45, opacity: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <AnimatePresence>
            {errors >= 1 && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute top-8 w-12 h-12 rounded-full bg-slate-200 border-4 border-slate-400 flex items-center justify-center overflow-hidden"
                style={{ top: '32px' }}
              >
                {errors >= 2 && (
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>
                )}
                {errors >= 3 && (
                  <div className="absolute bottom-2 w-4 h-1 bg-black rounded-full" />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {errors >= 4 && <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="absolute top-[80px] w-1 h-4 bg-slate-400" />}
          {errors >= 5 && <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="absolute top-[96px] w-8 h-16 bg-cobalt-blue rounded-lg border-2 border-slate-400" />}
          {errors >= 6 && <motion.div initial={{ rotate: 45, originX: 1 }} animate={{ rotate: 135 }} className="absolute top-[100px] right-[50%] w-10 h-1.5 bg-slate-400 origin-right" />}
          {errors >= 7 && <motion.div initial={{ rotate: -45, originX: 0 }} animate={{ rotate: -135 }} className="absolute top-[100px] left-[50%] w-10 h-1.5 bg-slate-400 origin-left" />}
          {errors >= 8 && <motion.div initial={{ rotate: 30, originX: 1 }} animate={{ rotate: 150 }} className="absolute top-[160px] right-[50%] w-12 h-1.5 bg-slate-400 origin-right" />}
          {errors >= 9 && <motion.div initial={{ rotate: -30, originX: 0 }} animate={{ rotate: -150 }} className="absolute top-[160px] left-[50%] w-12 h-1.5 bg-slate-400 origin-left" />}
        </motion.div>

        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-red-600/20 pointer-events-none"
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6 bg-slate-950 min-h-[600px] relative">
      {/* Victory Star */}
      <AnimatePresence>
        {hasWon && (
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 4, rotate: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="text-neon-yellow drop-shadow-[0_0_30px_rgba(255,255,0,0.8)]">⭐</div>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-2xl font-black text-red-600 italic tracking-tighter uppercase">AHORCADO EXTREMO</h3>

      <div className="flex gap-2 flex-wrap justify-center">
        {(['Normal', 'Difícil', 'Muy Difícil', 'Extremo'] as const).map(l => (
          <button 
            key={l}
            onClick={() => setDifficulty(l)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${difficulty === l ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {renderStickman()}

      <div className="flex flex-col items-center gap-2">
        {difficulty === 'Normal' && (
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            CATEGORÍA: <span className="text-neon-blue">{category}</span>
          </div>
        )}
        <div className="flex gap-2 flex-wrap justify-center">
          {word.split("").map((char, i) => (
            <div key={i} className="w-8 h-10 border-b-4 border-neon-yellow flex items-center justify-center text-2xl font-black text-white">
              {char === " " ? " " : (guessedLetters.includes(char) ? char : "")}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 md:grid-cols-9 gap-1 max-w-md">
        {"ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("").map(letter => {
          const isUsed = guessedLetters.includes(letter);
          const isExtreme = difficulty === 'Extremo';
          return (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              disabled={isGameOver || hasWon || (isUsed && !isExtreme)}
              className={`w-10 h-10 rounded-lg font-black text-sm transition-all
                ${isUsed && !isExtreme 
                  ? 'bg-slate-900 text-slate-700 scale-90' 
                  : 'bg-slate-800 text-white hover:bg-slate-700 active:scale-90 border-b-4 border-slate-900'
                }
                ${isGameOver ? 'opacity-50' : ''}
              `}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {isGameOver && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="text-red-600 font-black text-xl uppercase italic">¡BARRY TE COLGÓ!</div>
          <div className="text-slate-400 text-xs">LA PALABRA ERA: <span className="text-white">{word}</span></div>
          <RobloxButton variant="secondary" onClick={initGame}>REINTENTAR</RobloxButton>
        </motion.div>
      )}

      {hasWon && (
        <div className="text-neon-green font-black text-xl uppercase italic animate-bounce">¡VICTORIA LEGENDARIA!</div>
      )}
    </div>
  );
};


// --- SPOT THE DIFFERENCE (BRAINROT) ---
export const SpotDifferenceGame: React.FC<{ onComplete: (score: number) => void, onLevelComplete: (coins: number) => void }> = ({ onComplete, onLevelComplete }) => {
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState<string[]>([]);
  const [diffIndex, setDiffIndex] = useState(-1);
  const [message, setMessage] = useState("");
  const [coins, setCoins] = useState(0);

  // Very similar looking emojis for higher difficulty
  const ICONS_GROUPS = [
    ['🌕', '🌖', '🌗', '🌘'],
    ['🌑', '🌒', '🌓', '🌔'],
    ['⬛', '🔳', '🔲', '◾'],
    ['🔴', '⭕', '🛑', '🏮'],
    ['🟢', '🈯', '💹', '❇️'],
    ['🔵', '💠', '🌀', '🌐'],
  ];

  const initLevel = (lvl: number) => {
    const size = lvl + 4; // Start with 5x5, Level 6: 10x10
    const total = size * size;
    const group = ICONS_GROUPS[Math.floor(Math.random() * ICONS_GROUPS.length)];
    const baseIcon = group[0];
    const diffIcon = group[1]; // Very subtle difference
    
    const newGrid = Array(total).fill(baseIcon);
    const randomIndex = Math.floor(Math.random() * total);
    newGrid[randomIndex] = diffIcon;
    setGrid(newGrid);
    setDiffIndex(randomIndex);
    setMessage("");
  };

  useEffect(() => {
    initLevel(level);
  }, [level]);

  const handleCellClick = (index: number) => {
    if (index === diffIndex) {
      const reward = level * 200;
      setCoins(c => c + reward);
      onLevelComplete(reward);
      if (level < 6) {
        setMessage("¡Diferencia Encontrada!");
        setTimeout(() => setLevel(l => l + 1), 1000);
      } else {
        setMessage("¡Maestro del Brainrot! Encontraste todo.");
        setTimeout(() => onComplete(coins + 2000), 2000);
      }
    } else {
      setMessage("¡Ese no es!");
      setTimeout(() => setMessage(""), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-slate-950 min-h-[400px]">
      <div className="flex justify-between w-full">
        <div className="text-neon-yellow font-bold">NIVEL: {level}/6</div>
        <div className="text-neon-blue font-bold">MONEDAS: {coins}</div>
      </div>
      <h3 className="text-xl font-bold text-neon-blue uppercase">Encuentra la Diferencia</h3>
      <div 
        className="grid gap-1 p-2 bg-slate-900 rounded-xl border-2 border-neon-blue"
        style={{ gridTemplateColumns: `repeat(${level + 2}, minmax(0, 1fr))` }}
      >
        {grid.map((icon, i) => (
          <button 
            key={i} 
            onClick={() => handleCellClick(i)}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-2xl hover:bg-slate-800 rounded transition-colors"
          >
            {icon}
          </button>
        ))}
      </div>
      {message && <div className="text-neon-yellow font-bold animate-bounce">{message}</div>}
    </div>
  );
};

// --- TIC TAC TOE (FNAF) ---
export const TicTacToeGame: React.FC<{ onComplete: (score: number) => void, onLevelComplete: (coins: number) => void }> = ({ onComplete, onLevelComplete }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard' | 'very-hard'>('normal');

  const PLAYER = '🦊'; // Foxy
  const AI = '🐻'; // Freddy

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(s => s !== null) ? 'draw' : null;
  };

  const handleMove = (i: number) => {
    if (board[i] || winner || !isXNext) return;
    const newBoard = [...board];
    newBoard[i] = PLAYER;
    setBoard(newBoard);
    setIsXNext(false);
    
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      handleEnd(win);
    } else {
      setTimeout(() => makeAIMove(newBoard), 500);
    }
  };

  const makeAIMove = (currentBoard: (string | null)[]) => {
    let moveIndex: number = -1;

    if (difficulty === 'easy') {
      moveIndex = getRandomMove(currentBoard);
    } else if (difficulty === 'normal') {
      moveIndex = getDefensiveMove(currentBoard) ?? getRandomMove(currentBoard);
    } else if (difficulty === 'hard') {
      moveIndex = getOffensiveMove(currentBoard) ?? getDefensiveMove(currentBoard) ?? getRandomMove(currentBoard);
    } else if (difficulty === 'very-hard') {
      moveIndex = getBestMove(currentBoard);
    }

    if (moveIndex === -1) return;

    const newBoard = [...currentBoard];
    newBoard[moveIndex] = AI;
    setBoard(newBoard);
    setIsXNext(true);
    
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      handleEnd(win);
    }
  };

  const getRandomMove = (squares: (string | null)[]) => {
    const emptyIndices = squares.map((s, i) => s === null ? i : null).filter(i => i !== null) as number[];
    if (emptyIndices.length === 0) return -1;
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  };

  const getDefensiveMove = (squares: (string | null)[]) => {
    return findWinningMove(squares, PLAYER);
  };

  const getOffensiveMove = (squares: (string | null)[]) => {
    return findWinningMove(squares, AI);
  };

  const findWinningMove = (squares: (string | null)[], mark: string) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] === mark && squares[b] === mark && squares[c] === null) return c;
      if (squares[a] === mark && squares[c] === mark && squares[b] === null) return b;
      if (squares[b] === mark && squares[c] === mark && squares[a] === null) return a;
    }
    return null;
  };

  const getBestMove = (squares: (string | null)[]) => {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = AI;
        let score = minimax(squares, 0, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const minimax = (squares: (string | null)[], depth: number, isMaximizing: boolean): number => {
    const result = checkWinner(squares);
    if (result === AI) return 10 - depth;
    if (result === PLAYER) return depth - 10;
    if (result === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = AI;
          let score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = PLAYER;
          let score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const handleEnd = (win: string) => {
    if (win === PLAYER) {
      onLevelComplete(500);
      setMessage("¡Ganaste, Rey!");
      setTimeout(() => onComplete(1000), 2000);
    } else if (win === AI) {
      setMessage("Freddy te atrapó...");
      setTimeout(() => reset(), 2000);
    } else {
      setMessage("Empate en la pizzería.");
      setTimeout(() => reset(), 2000);
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setMessage("");
    setIsXNext(true);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-slate-950 min-h-[400px]">
      <h3 className="text-2xl font-bold text-red-600 uppercase">FNAF Tic-Tac-Toe</h3>
      
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {(['easy', 'normal', 'hard', 'very-hard'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => { reset(); setDifficulty(lvl); }}
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${
              difficulty === lvl ? 'bg-red-600 text-slate-200' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {lvl.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 bg-slate-800 p-2 rounded-xl border-4 border-red-900">
        {board.map((cell, i) => (
          <button 
            key={i} 
            onClick={() => handleMove(i)}
            className="w-20 h-20 bg-slate-900 flex items-center justify-center text-4xl hover:bg-slate-700 rounded transition-colors"
          >
            {cell}
          </button>
        ))}
      </div>
      {message && <div className="text-xl font-bold text-red-500 animate-pulse uppercase">{message}</div>}
      <div className="text-xs text-slate-500">Tú: {PLAYER} | Freddy: {AI}</div>
    </div>
  );
};
