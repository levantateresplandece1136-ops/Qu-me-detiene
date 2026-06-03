import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Sparkles, Heart, CheckCircle, Calendar, GraduationCap } from 'lucide-react';

interface GoldenCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

interface Particle {
  id: number;
  x: number; // percentage left
  yStart: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  rotation: number;
  shape: 'star' | 'circle' | 'square' | 'sparkle';
  swayDistance: number;
}

export default function GoldenCelebration({ isOpen, onClose, userName }: GoldenCelebrationProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [isOpen]);

  // Pre-generate 100 random elegant confetti particles
  const particles = useMemo<Particle[]>(() => {
    const goldTones = [
      '#C9A84C', // core gold
      '#D4AF37', // metallic gold
      '#F59E0B', // amber-500
      '#EAB308', // yellow-500
      '#FCD34D', // amber-300
      '#FDE047', // yellow-300
      '#FFFFFF'  // pure light sparkle
    ];
    const shapes: ('star' | 'circle' | 'square' | 'sparkle')[] = ['star', 'circle', 'square', 'sparkle'];

    return Array.from({ length: 90 }, (_, idx) => {
      return {
        id: idx,
        x: Math.random() * 100, // % width
        yStart: -(Math.random() * 20 + 10), // start above screen
        size: Math.random() * 12 + 6, // 6px to 18px
        color: goldTones[Math.floor(Math.random() * goldTones.length)],
        duration: Math.random() * 4 + 3.5, // 3.5s to 7.5s falling
        delay: Math.random() * 4, // 0s to 4s stagger
        rotation: Math.random() * 360,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        swayDistance: Math.random() * 150 - 75 // -75px to 75px horizontal sway
      };
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black/90 p-4 backdrop-blur-md">
        
        {/* Soft elegant radial background light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.15)_0%,rgba(0,0,0,0)_100%)] pointer-events-none" />

        {/* Rain of Elegant Golden Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => {
            return (
              <motion.div
                key={p.id}
                initial={{ 
                  left: `${p.x}%`, 
                  top: `${p.yStart}vh`, 
                  rotate: p.rotation, 
                  opacity: 0,
                  scale: 0.5 
                }}
                animate={{ 
                  top: '105vh', 
                  rotate: p.rotation + 720,
                  opacity: [0, 1, 1, 0.8, 0],
                  scale: [0.5, 1, 1, 0.8, 0.4],
                  x: [0, p.swayDistance, p.swayDistance * -0.5, p.swayDistance]
                }}
                transition={{ 
                  duration: p.duration, 
                  delay: p.delay, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute shadow-sm pointer-events-none"
                style={{
                  width: p.size,
                  height: p.size,
                }}
              >
                {p.shape === 'star' && (
                  <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                )}
                {p.shape === 'sparkle' && (
                  <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full">
                    <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
                  </svg>
                )}
                {p.shape === 'circle' && (
                  <div 
                    className="w-full h-full rounded-full" 
                    style={{ backgroundColor: p.color }}
                  />
                )}
                {p.shape === 'square' && (
                  <div 
                    className="w-full h-full rotate-45" 
                    style={{ backgroundColor: p.color }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Celebratory Cinematic Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -30 }}
          transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.2 }}
          className="relative max-w-xl w-full bg-[#121212] border border-[#C9A84C]/35 rounded-[32px] p-8 sm:p-10 shadow-2xl text-center space-y-8 z-10 overflow-hidden"
        >
          {/* Top subtle gold line bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-600 via-[#C9A84C] to-amber-600" />
          
          {/* Glowing halo behind award block */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#C9A84C]/5 blur-xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            {/* Pulsing Outer Rings */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -inset-2 rounded-full border border-dashed border-[#C9A84C]/15"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A84C] to-amber-600 flex items-center justify-center text-[#0D0D0D] shadow-xl">
              <Award className="w-9 h-9" />
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-3">
            <span className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.25em] block font-bold">Consolidación de Identidad</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none font-display">
              ¡Plan Completado!
            </h2>
            <p className="text-white/50 text-xs sm:text-sm max-w-md mx-auto">
              Has perseverado con fe durante los 30 días de renovación neurocognitiva y espiritual.
            </p>
          </div>

          {/* Inspiring Statement Card */}
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl relative space-y-4 text-left">
            <div className="flex items-center gap-2 text-[#C9A84C] border-b border-white/5 pb-2.5">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Mensaje para {userName}</span>
            </div>
            
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
              Querido/a <strong className="text-[#C9A84C]">{userName}</strong>, hoy depones formalmente las mentiras del impostor, el perfeccionismo compulsivo y la culpa ajena. Tu mente ha sido impregnada con la verdad de que <strong>naces de un linaje real</strong>, eres calificado/a incondicionalmente por Cristo, y tu porvenir está gobernado por la abundancia soberana del Padre.
            </p>

            <div className="pt-2 border-t border-white/5 flex gap-3 text-white/50 items-start">
              <Heart className="w-4 h-4 text-rose-500/80 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] italic leading-relaxed text-white/60">
                "Mas gracias sean dadas a Dios, que nos da la victoria por medio de nuestro Señor Jesucristo."
                <span className="block not-italic text-[10px] font-mono text-[#C9A84C] font-bold mt-1">— 1 Corintios 15:57</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-[#C9A84C] to-amber-600 hover:from-[#d1b052] hover:to-amber-500 text-[#0d0d0d] font-bold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 flex-1 cursor-pointer hover:scale-[1.01] active:scale-95 shadow-lg shadow-[#C9A84C]/10"
            >
              <CheckCircle className="w-4 h-4" /> Seguir Caminando en Luz
            </button>
            <button
              onClick={() => {
                onClose();
                // We'll jump the user to the report tab where they can print their full report PDF!
                const reportTabBtn = document.querySelector('[id*="stats-grid"]');
                if (reportTabBtn) {
                  reportTabBtn.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[#1C1C1C] border border-white/10 hover:border-[#C9A84C]/45 hover:bg-[#252525] text-white/90 hover:text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 flex-1 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" /> Ir a Clausura & Reporte
            </button>
          </div>

          <p className="text-[10px] text-white/30 font-mono">
            Unción de victoria permanente • {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
