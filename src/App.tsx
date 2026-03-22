import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { Zone, GameState } from "./types";
import { RobloxButton } from "./components/RobloxButton";
import { FischGame, ForestGame, PrisonGame, AdivinanzasGame, SpotDifferenceGame, TicTacToeGame } from "./components/MiniGames";
import { X, MessageSquare, Gamepad2, Volume2, VolumeX, ShoppingBag } from "lucide-react";

const ZONES: { id: Zone; name: string; color: string; icon: string; message: string }[] = [
  { 
    id: 'brookhaven', 
    name: 'ADIVINANZAS', 
    color: 'border-neon-yellow', 
    icon: '🧩',
    message: "Hoy es un día especial, hay risas sin parar… soplas velas, pides un deseo… ¿sabes qué día es? 🎂 ¡Claro! ¡Tu cumpleaños! ¡Feliz día lleno de sorpresas!"
  },
  { 
    id: 'fnaf', 
    name: 'FIVE NIGHTS AT FREDDY\'S', 
    color: 'border-red-600', 
    icon: '🐻',
    message: "¡Feliz cumpleaños! 🎉\nEsta noche no hay sustos… solo celebración.\nQue los animatrónicos canten para ti y que cada nueva noche de tu vida venga con más emoción, más logros y menos jumpscares inesperados.\nHoy el turno es especial… porque el protagonista eres tú."
  },
  { 
    id: 'forest', 
    name: '99 NIGHTS IN THE FOREST', 
    color: 'border-neon-green', 
    icon: '🌲',
    message: "¡Feliz cumpleaños, explorador legendario!\nQue este nuevo año sea como sobrevivir 99 noches en el bosque: lleno de aventuras, desafíos superados y recompensas épicas.\nQue nunca te falte energía, estrategia y valentía para iluminar incluso las noches más oscuras. 🌙🔥\nHoy el bosque celebra contigo… ¡y tú eres el jefe final!"
  },
  { 
    id: 'prison', 
    name: 'PRISON LIFE', 
    color: 'border-red-600', 
    icon: '👮',
    message: "¡Feliz cumpleaños, estratega!\nQue siempre encuentres la salida correcta en cada laberinto que la vida te ponga enfrente.\nSi aparece un obstáculo… lo conviertes en atajo.\nSi aparece un muro… lo conviertes en impulso.\nHoy no estás escapando… estás avanzando hacia un año aún más grande. 🔓🔥"
  },
  { 
    id: 'fisch', 
    name: 'FISCH', 
    color: 'border-cobalt-blue', 
    icon: '🎣',
    message: "¡Feliz cumpleaños, campeón!\nQue este año piques grandes oportunidades y captures momentos inolvidables.\nQue cada intento traiga recompensa y que nunca falte paciencia para lograr tus metas.\nHoy el mejor premio no está en el agua… está en celebrar que cumples un nivel más. 🏆✨"
  },
  { 
    id: 'spot', 
    name: 'ENCUENTRA DIFERENCIAS', 
    color: 'border-neon-blue', 
    icon: '🔍',
    message: "¡Felicidades, maestro de los detalles!\nQue en este nuevo nivel de tu vida encuentres las oportunidades que otros no ven.\nQue detectes la felicidad incluso en los pequeños momentos.\nHoy no hay diferencias… porque todo está perfectamente alineado para celebrar tu cumpleaños. 🎂✨"
  },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    activeZone: null,
    isPlaying: false,
    score: 0
  });
  const [showModal, setShowModal] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [completedZones, setCompletedZones] = useState<Zone[]>([]);
  const [showEndGame, setShowEndGame] = useState(false);
  const [viewingMessage, setViewingMessage] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState<'skins' | 'trails' | 'pets'>('skins');

  const SKINS = [
    { id: 'default', name: 'Original', icon: '👤', price: 0 },
    { id: 'poppy', name: 'Poppy Playtime', icon: '🫂', price: 500 },
    { id: 'mario', name: 'Super Mario', icon: '🍄', price: 1000 },
    { id: 'barry', name: 'Barry (Clown)', icon: '🤡', price: 1500 },
    { id: 'police', name: 'Policía', icon: '👮', price: 2000 },
  ];

  const TRAILS = [
    { id: 'none', name: 'Ninguno', icon: '🚫', price: 0 },
    { id: 'neon', name: 'Rastro Neón', icon: '🌈', price: 800 },
    { id: 'fire', name: 'Rastro de Fuego', icon: '🔥', price: 1200 },
    { id: 'star', name: 'Rastro Estelar', icon: '⭐', price: 2000 },
  ];

  const PETS = [
    { id: 'none', name: 'Ninguna', icon: '🚫', price: 0 },
    { id: 'deer', name: 'Ciervo', icon: '🦌', price: 1500 },
    { id: 'robot', name: 'Mini-Robot', icon: '🤖', price: 2500 },
    { id: 'block', name: 'Bloque Animado', icon: '📦', price: 3000 },
  ];

  const handleBuySkin = (skinId: string, price: number) => {
    if (gameState.score >= price || gameState.selectedSkin === skinId) {
      setGameState(prev => ({ 
        ...prev, 
        score: prev.selectedSkin === skinId ? prev.score : prev.score - price, 
        selectedSkin: skinId 
      }));
    }
  };

  const handleBuyTrail = (trailId: string, price: number) => {
    if (gameState.score >= price || gameState.selectedTrail === trailId) {
      setGameState(prev => ({ 
        ...prev, 
        score: prev.selectedTrail === trailId ? prev.score : prev.score - price, 
        selectedTrail: trailId 
      }));
    }
  };

  const handleBuyPet = (petId: string, price: number) => {
    if (gameState.score >= price || gameState.selectedPet === petId) {
      setGameState(prev => ({ 
        ...prev, 
        score: prev.selectedPet === petId ? prev.score : prev.score - price, 
        selectedPet: petId 
      }));
    }
  };

  const handleZoneClick = (zone: Zone) => {
    setGameState(prev => ({ ...prev, activeZone: zone }));
    setShowModal(true);
    setViewingMessage(false);
  };

  const closeAll = () => {
    setShowModal(false);
    setShowGame(false);
    setViewingMessage(false);
    setGameState(prev => ({ ...prev, activeZone: null, isPlaying: false }));
  };

  const handleGameComplete = (score: number) => {
    const zone = gameState.activeZone;
    if (zone) {
      setGameState(p => ({ ...p, score: p.score + score }));
      if (!completedZones.includes(zone)) {
        const newCompleted = [...completedZones, zone];
        setCompletedZones(newCompleted);
        if (newCompleted.length === ZONES.length) {
          setShowEndGame(true);
        }
      }
    }
    closeAll();
  };

  const handleLevelComplete = (coins: number) => {
    setGameState(p => ({ ...p, score: p.score + coins }));
  };

  const renderGame = () => {
    switch (gameState.activeZone) {
      case 'fisch': return <FischGame onComplete={handleGameComplete} onLevelComplete={handleLevelComplete} />;
      case 'forest': return <ForestGame onComplete={handleGameComplete} onLevelComplete={handleLevelComplete} />;
      case 'prison': return <PrisonGame onComplete={handleGameComplete} onLevelComplete={handleLevelComplete} selectedSkin={gameState.selectedSkin} selectedTrail={gameState.selectedTrail} selectedPet={gameState.selectedPet} />;
      case 'brookhaven': return <AdivinanzasGame onComplete={handleGameComplete} onLevelComplete={handleLevelComplete} />;
      case 'spot': return <SpotDifferenceGame onComplete={handleGameComplete} onLevelComplete={handleLevelComplete} />;
      case 'fnaf': return <TicTacToeGame onComplete={handleGameComplete} onLevelComplete={handleLevelComplete} />;
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden selection:bg-neon-green selection:text-black">
      {/* Background Diorama Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Forest Fog */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-950" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://picsum.photos/seed/forest/1920/1080?blur=10')] bg-cover" />
        
        {/* Barry Silhouette */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-red-900/30 rounded-full blur-[100px]"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-12 text-center px-4 flex flex-col items-center gap-8">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-6 rounded-3xl neon-border-blue bg-slate-900/80 backdrop-blur-md"
        >
          <h1 className="text-4xl md:text-7xl font-black neon-text-green uppercase tracking-tighter italic">
            ¡FELIZ CUMPLE MARTÍN!
          </h1>
        </motion.div>

        {/* Central Avatar Area */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="relative w-64 h-64 md:w-80 md:h-80 avatar-glow rounded-3xl"
        >
          {/* Martín's Avatar Image */}
          <div className="absolute inset-0 bg-slate-900 rounded-3xl roblox-glossy border-4 border-neon-blue/30 flex flex-col items-center justify-center overflow-hidden">
            <img 
              src="https://images2.alphacoders.com/916/916198.jpg" 
              alt="Martín Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black/60 p-2 text-center">
              <span className="text-neon-blue font-bold text-sm uppercase">
                {SKINS.find(s => s.id === gameState.selectedSkin)?.name || 'FREDDY'}
              </span>
            </div>
            <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
              <div className="bg-neon-blue text-black px-2 py-1 rounded font-bold text-xs">
                {gameState.selectedSkin ? 'SKIN ACTIVA' : 'FNAF'}
              </div>
              {gameState.selectedPet && gameState.selectedPet !== 'none' && (
                <div className="bg-neon-yellow text-black px-2 py-1 rounded font-bold text-[10px] uppercase">
                  Mascota: {PETS.find(p => p.id === gameState.selectedPet)?.icon}
                </div>
              )}
            </div>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-4 -left-4 text-4xl"
            >
              {SKINS.find(s => s.id === gameState.selectedSkin)?.icon || '👑'}
            </motion.div>
            {/* Pet Display */}
            {gameState.selectedPet && gameState.selectedPet !== 'none' && (
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  x: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-2 -right-2 text-5xl z-20"
              >
                {PETS.find(p => p.id === gameState.selectedPet)?.icon}
              </motion.div>
            )}
          </div>
          
          {/* Floating Confetti */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-neon-green"
              initial={{ x: 0, y: 0 }}
              animate={{ 
                x: (Math.random() - 0.5) * 400, 
                y: (Math.random() - 0.5) * 400,
                rotate: 360,
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              style={{ backgroundColor: i % 3 === 0 ? '#39FF14' : i % 3 === 1 ? '#FF5F1F' : '#0047AB' }}
            />
          ))}
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="neon-text-green font-black text-2xl md:text-3xl text-stroke uppercase tracking-widest"
        >
          NIVEL 12 DESBLOQUEADO 🎮🔥
        </motion.p>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center py-12 gap-8">
        {/* Zone Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 max-w-4xl w-full">
          {ZONES.map((zone) => (
            <motion.button
              key={zone.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleZoneClick(zone.id)}
              className={`
                relative p-4 rounded-2xl glass-panel border-2 ${zone.color}
                flex flex-col items-center gap-2 transition-all group
                ${completedZones.includes(zone.id) ? 'opacity-50 grayscale-[0.5]' : ''}
              `}
            >
              <span className="text-4xl group-hover:scale-125 transition-transform">{zone.icon}</span>
              <span className="text-xs font-bold uppercase text-center leading-tight">{zone.name}</span>
              {completedZones.includes(zone.id) && <div className="absolute -top-2 -right-2 bg-neon-green text-black rounded-full p-1"><X size={12} className="rotate-45" /></div>}
              <div className="absolute inset-0 bg-slate-200/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            </motion.button>
          ))}
        </div>
      </main>

      {/* Footer Message */}
      <footer className="relative z-10 p-8 text-center max-w-3xl mx-auto">
        <div className="glass-panel p-6 rounded-3xl border-slate-800">
          <p className="text-slate-300 text-lg leading-relaxed italic">
            "¡Nivel 12 desbloqueado, Martín! 🎮🔥 Hoy tu servidor favorito está de fiesta. 
            Que tu día sea tan épico como un escape perfecto en Prison Life, 
            tan relajado como una tarde en Brookhaven y que tengas la suerte de pescar los mejores ejemplares en FISCH. 
            Ten cuidado con lo que acecha en 99 Nights in the Forest, ¡y no dejes que Barry te atrape hoy! 
            Disfruta de tu día al máximo de parte de Estefanía. 🎂✨"
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {showModal && gameState.activeZone && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="relative w-full max-w-md glass-panel p-8 rounded-3xl border-2 border-slate-200/20 shadow-2xl"
            >
              <button onClick={closeAll} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} />
              </button>

              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">
                  {ZONES.find(z => z.id === gameState.activeZone)?.icon}
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-neon-blue">
                  {ZONES.find(z => z.id === gameState.activeZone)?.name}
                </h2>
                
                {viewingMessage ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-lg italic text-slate-200"
                  >
                    {ZONES.find(z => z.id === gameState.activeZone)?.message}
                    <div className="mt-4">
                      <RobloxButton variant="secondary" onClick={() => setViewingMessage(false)}>VOLVER</RobloxButton>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <RobloxButton 
                      variant="primary" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => setViewingMessage(true)}
                    >
                      <MessageSquare size={20} /> LEER MENSAJE
                    </RobloxButton>
                    <RobloxButton 
                      variant="secondary" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        setShowGame(true);
                        setHasInteracted(true);
                        setIsMuted(false);
                      }}
                    >
                      <Gamepad2 size={20} /> JUGAR
                    </RobloxButton>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-2xl glass-panel rounded-3xl border-2 border-slate-200/20 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <span className="font-bold text-neon-blue uppercase tracking-widest">MODO JUEGO: {ZONES.find(z => z.id === gameState.activeZone)?.name}</span>
                <button onClick={() => setShowGame(false)} className="p-2 hover:bg-slate-800 rounded-full">
                  <X size={24} />
                </button>
              </div>
              <div className="bg-slate-950 min-h-[400px]">
                {renderGame()}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showEndGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
          >
            {/* Disco Lights Effect */}
            <motion.div 
              animate={{ 
                backgroundColor: [
                  'rgba(255, 0, 0, 0.4)', 
                  'rgba(0, 255, 0, 0.4)', 
                  'rgba(0, 0, 255, 0.4)', 
                  'rgba(255, 255, 0, 0.4)', 
                  'rgba(255, 0, 255, 0.4)'
                ] 
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute inset-0 z-0"
            />

            {/* Balloons */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: '110vh', x: `${Math.random() * 100}vw` }}
                animate={{ y: '-20vh' }}
                transition={{ 
                  duration: 5 + Math.random() * 5, 
                  repeat: Infinity, 
                  delay: Math.random() * 5 
                }}
                className="absolute text-6xl z-10"
                style={{ filter: `hue-rotate(${Math.random() * 360}deg)` }}
              >
                🎈
              </motion.div>
            ))}

            <motion.div 
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="relative z-20 glass-panel p-12 rounded-[3rem] border-4 border-white/30 shadow-[0_0_100px_rgba(255,255,255,0.2)] text-center space-y-8 max-w-2xl backdrop-blur-2xl"
            >
              <h2 className="text-6xl md:text-8xl font-black neon-text-green text-stroke italic tracking-tighter animate-bounce">
                ¡COMPLETASTE TODO!
              </h2>
              
              <div className="relative w-64 h-64 mx-auto rounded-3xl overflow-hidden border-4 border-neon-blue shadow-2xl">
                <img 
                  src="https://i.pinimg.com/originals/33/87/55/338755203228275314.jpg" 
                  alt="Final Celebration"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if Pinterest direct link fails
                    (e.target as HTMLImageElement).src = "https://images2.alphacoders.com/916/916198.jpg";
                  }}
                />
              </div>

              <p className="text-2xl font-bold text-white leading-relaxed drop-shadow-lg">
                ¡Eres una leyenda absoluta, Martín! 🏆🎂🔥<br/>
                Has conquistado todos los niveles de este año.<br/>
                ¡Disfruta de tus {gameState.score} ROBUX virtuales!
              </p>

              <div className="flex flex-col gap-4">
                <RobloxButton 
                  variant="success" 
                  className="text-2xl py-6"
                  onClick={() => {
                    setShowEndGame(false);
                    setCompletedZones([]);
                    setGameState(p => ({ ...p, score: 0 }));
                  }}
                >
                  VOLVER AL INICIO
                </RobloxButton>
              </div>

              {/* Festive Music for End Screen */}
              <iframe 
                width="0" 
                height="0" 
                src="https://www.youtube.com/embed/Vd09-_G_tD0?autoplay=1&loop=1&playlist=Vd09-_G_tD0" 
                allow="autoplay"
                className="hidden"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Controls */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        <button 
          onClick={() => setShowShop(true)}
          className="p-4 rounded-full roblox-glossy bg-neon-yellow text-black shadow-lg active:scale-90 transition-all mb-2"
        >
          <ShoppingBag size={24} />
        </button>
        {!hasInteracted && (
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg mb-2 animate-pulse"
          >
            ⚠️ HAZ CLIC PARA ACTIVAR SONIDO
          </motion.div>
        )}
        <button 
          onClick={() => {
            setIsMuted(!isMuted);
            setHasInteracted(true);
          }}
          className={`p-4 rounded-full roblox-glossy text-slate-200 shadow-lg active:scale-90 transition-all ${isMuted ? 'bg-slate-800' : 'bg-cobalt-blue'}`}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        
        {/* Hidden Audio Elements */}
        {!isMuted && hasInteracted && (
          <>
            {/* Main Theme: Recording_6 (MainTheme_99Nights) */}
            <iframe 
              width="0" 
              height="0" 
              src="https://www.youtube.com/embed/Vd09-_G_tD0?autoplay=1&loop=1&playlist=Vd09-_G_tD0" 
              allow="autoplay"
              className="hidden"
            />
            {/* Poppy Playtime Ambient / Mysterious Effect */}
            <iframe 
              width="0" 
              height="0" 
              src="https://www.youtube.com/embed/p1_v79E-p2M?autoplay=1&loop=1&playlist=p1_v79E-p2M&volume=50" 
              allow="autoplay"
              className="hidden"
            />
          </>
        )}
      </div>

      {/* Global Score Overlay */}
      <div className="fixed top-4 left-4 z-50 glass-panel px-4 py-2 rounded-full border-neon-blue/30 flex items-center gap-2">
        <span className="text-neon-blue font-bold">ROBUX: {gameState.score}</span>
        {gameState.selectedSkin && (
          <span className="text-xs bg-neon-blue text-black px-2 py-0.5 rounded-full font-black uppercase">
            {SKINS.find(s => s.id === gameState.selectedSkin)?.icon}
          </span>
        )}
      </div>

      {/* Shop Modal */}
      <AnimatePresence>
        {showShop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-lg glass-panel p-8 rounded-[2rem] border-2 border-neon-yellow/30"
            >
              <button onClick={() => setShowShop(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full">
                <X size={24} />
              </button>

              <div className="text-center mb-6">
                <h2 className="text-4xl font-black text-neon-yellow uppercase italic tracking-tighter">TIENDA ROBUX</h2>
                <div className="text-neon-blue font-bold">TU SALDO: {gameState.score} ROBUX</div>
              </div>

              {/* Shop Tabs */}
              <div className="flex gap-2 mb-6 bg-slate-900 p-1 rounded-xl">
                {(['skins', 'trails', 'pets'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setShopTab(tab)}
                    className={`flex-1 py-2 rounded-lg font-black text-xs uppercase transition-all ${shopTab === tab ? 'bg-neon-yellow text-black' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    {tab === 'skins' ? 'Skins' : tab === 'trails' ? 'Rastros' : 'Mascotas'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {shopTab === 'skins' && SKINS.map(skin => (
                  <button
                    key={skin.id}
                    onClick={() => handleBuySkin(skin.id, skin.price)}
                    disabled={gameState.selectedSkin === skin.id || (gameState.score < skin.price && gameState.selectedSkin !== skin.id)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all flex items-center gap-4
                      ${gameState.selectedSkin === skin.id 
                        ? 'border-neon-green bg-neon-green/10' 
                        : 'border-slate-800 bg-slate-900/50 hover:border-neon-yellow'}
                      ${gameState.score < skin.price && gameState.selectedSkin !== skin.id ? 'opacity-50 grayscale' : ''}
                    `}
                  >
                    <div className="text-4xl">{skin.icon}</div>
                    <div className="text-left">
                      <div className="font-black uppercase text-sm">{skin.name}</div>
                      <div className="text-xs font-bold text-neon-blue">
                        {gameState.selectedSkin === skin.id ? 'EQUIPADO' : `${skin.price} ROBUX`}
                      </div>
                    </div>
                  </button>
                ))}

                {shopTab === 'trails' && TRAILS.map(trail => (
                  <button
                    key={trail.id}
                    onClick={() => handleBuyTrail(trail.id, trail.price)}
                    disabled={gameState.selectedTrail === trail.id || (gameState.score < trail.price && gameState.selectedTrail !== trail.id)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all flex items-center gap-4
                      ${gameState.selectedTrail === trail.id 
                        ? 'border-neon-green bg-neon-green/10' 
                        : 'border-slate-800 bg-slate-900/50 hover:border-neon-yellow'}
                      ${gameState.score < trail.price && gameState.selectedTrail !== trail.id ? 'opacity-50 grayscale' : ''}
                    `}
                  >
                    <div className="text-4xl">{trail.icon}</div>
                    <div className="text-left">
                      <div className="font-black uppercase text-sm">{trail.name}</div>
                      <div className="text-xs font-bold text-neon-blue">
                        {gameState.selectedTrail === trail.id ? 'EQUIPADO' : `${trail.price} ROBUX`}
                      </div>
                    </div>
                  </button>
                ))}

                {shopTab === 'pets' && PETS.map(pet => (
                  <button
                    key={pet.id}
                    onClick={() => handleBuyPet(pet.id, pet.price)}
                    disabled={gameState.selectedPet === pet.id || (gameState.score < pet.price && gameState.selectedPet !== pet.id)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all flex items-center gap-4
                      ${gameState.selectedPet === pet.id 
                        ? 'border-neon-green bg-neon-green/10' 
                        : 'border-slate-800 bg-slate-900/50 hover:border-neon-yellow'}
                      ${gameState.score < pet.price && gameState.selectedPet !== pet.id ? 'opacity-50 grayscale' : ''}
                    `}
                  >
                    <div className="text-4xl">{pet.icon}</div>
                    <div className="text-left">
                      <div className="font-black uppercase text-sm">{pet.name}</div>
                      <div className="text-xs font-bold text-neon-blue">
                        {gameState.selectedPet === pet.id ? 'EQUIPADO' : `${pet.price} ROBUX`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-black/40 rounded-xl text-[10px] text-slate-400 uppercase text-center">
                Los artículos comprados se aplican a tu avatar y en los minijuegos compatibles.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
