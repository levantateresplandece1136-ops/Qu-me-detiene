import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

export interface GuidedExplorationFlowProps {
  bloquesDiagnostico: Record<string, {
    title: string;
    screeningPhrase: string;
    description?: string;
  }>;
  currentSelectedRegion: string;
  screeningAnswers: Record<string, number>;
  isAnswering: boolean;
  answeringFeedback: string;
  userXp: number;
  getExploradorLevel: (xp: number) => { title: string; lvl: number; nextXp: number };
  onAnswer: (regionId: string, valor: number) => void;
  onContinue: () => void;
  onSelectRegion: (id: string) => void;
}

export const GuidedExplorationFlow: React.FC<GuidedExplorationFlowProps> = ({
  bloquesDiagnostico,
  currentSelectedRegion,
  screeningAnswers,
  isAnswering,
  answeringFeedback,
  userXp,
  getExploradorLevel,
  onAnswer,
  onContinue,
  onSelectRegion,
}) => {
  const regionKeys = Object.keys(bloquesDiagnostico);
  const currentIdx = regionKeys.indexOf(currentSelectedRegion);
  const areaNumber = currentIdx !== -1 ? currentIdx + 1 : 1;
  const answeredCount = Object.keys(screeningAnswers).length;
  const progressPercent = Math.min(100, Math.round((answeredCount / 9) * 100));

  const currentLevel = getExploradorLevel(userXp);
  const currentBlock = bloquesDiagnostico[currentSelectedRegion] || {
    title: 'Capacidad & Identidad',
    screeningPhrase: 'Temo no estar a la altura de lo que se espera de mí.',
  };

  const currentScore = screeningAnswers[currentSelectedRegion];

  const likertOptions = [
    { val: 1, desc: 'Nunca' },
    { val: 2, desc: 'Rara vez' },
    { val: 3, desc: 'A veces' },
    { val: 4, desc: 'A menudo' },
    { val: 5, desc: 'Total' },
  ];

  return (
    <motion.div
      key={`guided-flow-${currentSelectedRegion}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto space-y-5 px-3 sm:px-0"
    >
      {/* 1. Header con progreso y nivel */}
      <div className="bg-[#121212]/90 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#C9A84C] font-bold block">
              EXPLORACIÓN 01 · LO QUE HACES
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-white text-sm sm:text-base font-bold font-sans tracking-tight">
                Área {areaNumber} de 9
              </h3>
              <span className="text-white/30 text-xs font-mono">
                ({answeredCount}/9 completadas)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#C9A84C]/20 px-3 py-1 rounded-full shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono text-white/80 font-medium">
              Nivel {currentLevel.lvl} · {currentLevel.title}
            </span>
          </div>
        </div>

        {/* Barra fina de progreso */}
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-600 via-[#C9A84C] to-yellow-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 2. Tarjeta central con la pregunta/frase de screening */}
      <div className="bg-[#121212] border border-[#C9A84C]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Sutil halo ambiental dorado */}
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A84C] font-bold block">
            {currentBlock.title}
          </span>
          <p className="text-lg sm:text-2xl text-white font-serif italic leading-relaxed sm:leading-loose max-w-xl mx-auto py-1 sm:py-2">
            "{currentBlock.screeningPhrase}"
          </p>
        </div>

        {/* 3. Escala 1–5: ¿Cuánto resuena contigo? */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block text-center font-bold">
            ¿Cuánto resuena contigo?
          </span>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
            {likertOptions.map((opt) => {
              const isSelected = currentScore === opt.val;
              return (
                <button
                  key={opt.val}
                  id={`likert-btn-${opt.val}`}
                  type="button"
                  onClick={() => onAnswer(currentSelectedRegion, opt.val)}
                  className={`py-3 px-1 rounded-xl text-center group transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C] font-bold shadow-[0_0_12px_rgba(201,168,76,0.35)] scale-[1.03]'
                      : 'bg-[#181818] border-white/5 hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/10 text-white'
                  }`}
                >
                  <span
                    className={`block text-sm sm:text-base font-bold leading-none mb-1 ${
                      isSelected ? 'text-[#0A0A0A]' : 'text-white/60 group-hover:text-[#C9A84C]'
                    }`}
                  >
                    {opt.val}
                  </span>
                  <span className="block text-[7px] sm:text-[8px] font-bold tracking-tight uppercase leading-none opacity-85">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-white/30 px-1">
            <span>← No resuena</span>
            <span>Resuena de lleno →</span>
          </div>
        </div>

        {/* 4. Feedback pastoral animado y Botón CONTINUAR */}
        <AnimatePresence>
          {isAnswering && answeringFeedback && (
            <motion.div
              key="guided-feedback-box"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4 pt-3 border-t border-white/5"
            >
              <div className="bg-[#181818] border border-[#C9A84C]/35 p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center relative overflow-hidden shadow-xl">
                <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
                  <Sparkles className="w-4 h-4 text-[#C9A84C] animate-pulse" />
                </div>
                <p className="text-xs sm:text-sm text-white italic leading-relaxed px-1 whitespace-pre-line font-sans">
                  "{answeringFeedback}"
                </p>
              </div>

              <button
                type="button"
                id="screening-btn-continue"
                onClick={onContinue}
                className="w-full bg-gradient-to-r from-[#C9A84C] to-yellow-600 hover:from-[#d8b556] hover:to-yellow-500 text-[#0D0D0D] font-bold py-3.5 px-5 rounded-xl transition-all shadow-[0_0_18px_rgba(201,168,76,0.3)] flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wider font-mono hover:scale-[1.01] active:scale-95"
              >
                <span>CONTINUAR →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Fila de 9 puntos de navegación (uno por área) */}
      <div className="bg-[#121212]/80 border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {regionKeys.map((key, idx) => {
            const isAnswered = screeningAnswers[key] !== undefined;
            const isCurrent = currentSelectedRegion === key;
            const blockInfo = bloquesDiagnostico[key];

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectRegion(key)}
                title={`${idx + 1}. ${blockInfo?.title || key}${isAnswered ? ' (Respondida)' : ''}`}
                className="group relative p-1.5 sm:p-2 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                aria-label={`Ir al área ${idx + 1}: ${blockInfo?.title || key}`}
              >
                <div
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all flex items-center justify-center text-[8px] font-mono ${
                    isCurrent
                      ? isAnswered
                        ? 'bg-[#C9A84C] ring-2 ring-[#C9A84C] ring-offset-2 ring-offset-[#121212] shadow-[0_0_10px_#C9A84C]'
                        : 'bg-transparent border-2 border-[#C9A84C] ring-2 ring-[#C9A84C]/40 ring-offset-1 ring-offset-[#121212]'
                      : isAnswered
                      ? 'bg-[#C9A84C] opacity-90 hover:opacity-100'
                      : 'bg-white/15 border border-white/10 hover:bg-white/30'
                  }`}
                >
                  {isAnswered && !isCurrent && (
                    <span className="w-1 h-1 rounded-full bg-[#0A0A0A]" />
                  )}
                  {isAnswered && isCurrent && (
                    <Check className="w-2.5 h-2.5 text-[#0A0A0A] stroke-[3]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <span className="text-[10px] font-mono text-white/30">
          Toca cualquier punto para revisar o cambiar una respuesta
        </span>
      </div>
    </motion.div>
  );
};

export default GuidedExplorationFlow;
