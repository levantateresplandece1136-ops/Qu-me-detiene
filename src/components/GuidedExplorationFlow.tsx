import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { CreenciaRecord } from '../data/creencias';
import { HeartStageQuestion, fillStagePrompt } from '../data/heartStageQuestions';
import { DetectedInteraction } from '../data/blockDefinitions';

export interface GuidedExplorationFlowProps {
  mode?: 'screening' | 'deepDive' | 'stage' | 'validation' | 'transition';

  // Screening mode props
  bloquesDiagnostico?: Record<string, {
    title: string;
    screeningPhrase: string;
    description?: string;
  }>;
  currentSelectedRegion?: string;
  screeningAnswers?: Record<string, number>;
  onSelectRegion?: (id: string) => void;

  // Deep Dive mode props
  deepDiveQuestions?: CreenciaRecord[];
  deepDiveIndex?: number;
  deepDiveAnswers?: Record<number, number>;

  // Stage mode props (Etapas 03–06)
  stageQuestion?: HeartStageQuestion;
  selectedOptions?: string[];
  dominantAreaTitle?: string;
  onToggleOption?: (optionId: string) => void;

  // Validation mode props (Etapa 07)
  validationTarget?: DetectedInteraction;
  validationIndex?: number;
  validationTotal?: number;
  selectedValidationOption?: 'si' | 'parte' | 'no';
  onAnswerValidation?: (option: 'si' | 'parte' | 'no') => void;

  // Transition mode props (Fase 4A: cierre de etapa)
  transitionLabel?: string;
  transitionInsight?: string;
  transitionNext?: string;

  // Fase 4B: pausa de reflexión y patrón emergente
  reflectionPrompt?: string;
  reflectionKey?: string;
  emergingPattern?: string;

  // Navigation
  onBack?: () => void;

  // Shared props
  isAnswering?: boolean;
  answeringFeedback?: string;
  userXp?: number;
  getExploradorLevel?: (xp: number) => { title: string; lvl: number; nextXp: number };
  level?: { title: string; lvl: number; nextXp: number };
  onAnswer?: ((regionId: string, valor: number) => void) | ((score: number) => void);
  onContinue: () => void;
}

export const GuidedExplorationFlow: React.FC<GuidedExplorationFlowProps> = ({
  mode = 'screening',
  bloquesDiagnostico = {},
  currentSelectedRegion = 'capacidad-identidad',
  screeningAnswers = {},
  deepDiveQuestions = [],
  deepDiveIndex = 0,
  deepDiveAnswers = {},
  stageQuestion,
  selectedOptions = [],
  dominantAreaTitle = '',
  onToggleOption,
  validationTarget,
  validationIndex = 0,
  validationTotal = 1,
  selectedValidationOption,
  onAnswerValidation,
  transitionLabel = '',
  transitionInsight = '',
  transitionNext = '',
  reflectionPrompt,
  reflectionKey,
  emergingPattern = '',
  onBack,
  isAnswering = false,
  answeringFeedback = '',
  userXp = 0,
  getExploradorLevel,
  level,
  onAnswer,
  onContinue,
  onSelectRegion,
}) => {
  const currentLevel = level
    ? level
    : getExploradorLevel
    ? getExploradorLevel(userXp)
    : { title: 'Iniciando', lvl: 1, nextXp: 100 };

  // Fase 4B: pausas de reflexión ya descartadas (se muestran una sola vez por pregunta, sin espera obligatoria)
  const [dismissedReflections, setDismissedReflections] = useState<Record<string, boolean>>({});

  const renderReflectionPause = (key: string, text: string) => (
    <motion.div
      key={`reflection-${key}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="pt-2 border-t border-white/5 space-y-4 text-center"
    >
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-teal-300/80 font-bold block">
        Pausa de reflexión
      </span>
      <p className="text-sm sm:text-base text-white/85 font-serif italic leading-relaxed max-w-lg mx-auto">
        {text}
      </p>
      <button
        type="button"
        onClick={() => setDismissedReflections(prev => ({ ...prev, [key]: true }))}
        className="w-full py-3.5 px-5 rounded-xl font-bold font-mono tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer bg-[#0f1a1a] border border-teal-500/40 text-teal-200 hover:bg-teal-500/10"
      >
        <span>Ya la tengo en mente</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );

  // ==========================================
  // MODO: TRANSITION (CIERRE DE ETAPA CON MICRO-INSIGHT)
  // ==========================================
  if (mode === 'transition') {
    return (
      <motion.div
        key={`guided-transition-${transitionLabel}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-2xl mx-auto space-y-5 px-3 sm:px-0"
      >
        <div className="bg-[#121212] border border-[#C9A84C]/25 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#C9A84C] font-bold">
              {transitionLabel}
            </span>
          </div>

          <p className="text-lg sm:text-2xl text-white font-serif leading-relaxed max-w-xl mx-auto">
            {transitionInsight}
          </p>

          <p className="text-[11px] font-mono uppercase tracking-widest text-white/40">
            {transitionNext}
          </p>

          <button
            type="button"
            onClick={onContinue}
            className="w-full py-4 px-6 rounded-2xl font-bold font-mono tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-xl cursor-pointer bg-gradient-to-r from-yellow-500 via-[#C9A84C] to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black"
          >
            <span>CONTINUAR</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[10px] font-mono text-white/30">
            Nivel {currentLevel.lvl} · {currentLevel.title}
          </p>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // MODO: VALIDATION (EXPLORACIÓN 07)
  // ==========================================
  if (mode === 'validation' && validationTarget) {
    const questionNumber = validationIndex + 1;
    const totalQuestions = validationTotal || 1;
    const progressPercent = (questionNumber / totalQuestions) * 100;
    const canContinue = Boolean(selectedValidationOption);

    const validationOptions: Array<{ id: 'si' | 'parte' | 'no'; label: string }> = [
      { id: 'si', label: 'Sí, me describe' },
      { id: 'parte', label: 'En parte' },
      { id: 'no', label: 'No me describe' }
    ];

    return (
      <motion.div
        key={`guided-validation-${validationTarget.id}`}
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
                EXPLORACIÓN 07 · LO QUE NECESITAMOS EXPLORAR
              </span>
              <div className="flex items-center gap-2">
                <h3 className="text-white text-sm sm:text-base font-bold font-sans tracking-tight">
                  Pregunta {questionNumber} de {totalQuestions}
                </h3>
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

        {/* 2. Tarjeta central con la pregunta de validación */}
        <div className="bg-[#121212] border border-[#C9A84C]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

          <div className="text-center space-y-3">
            <div>
              <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-3 py-1 rounded-full font-bold">
                Posible conexión: {validationTarget.blockA.name} ↔ {validationTarget.blockB.name}
              </span>
            </div>

            <p className="text-lg sm:text-2xl text-white font-serif leading-relaxed max-w-xl mx-auto py-1 sm:py-2">
              "{validationTarget.preguntaClave}"
            </p>

            <p className="text-xs text-white/50 leading-relaxed max-w-md mx-auto">
              No es una conclusión: tu respuesta nos ayuda a saber si esto aplica a ti.
            </p>
          </div>

          {/* 3. Tres opciones */}
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            {validationOptions.map((opt) => {
              const isSelected = selectedValidationOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onAnswerValidation?.(opt.id)}
                  className={`w-full py-3.5 px-4 rounded-xl text-left transition-all duration-200 cursor-pointer border flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-white shadow-lg shadow-[#C9A84C]/10'
                      : 'bg-black/30 border-white/5 hover:border-white/20 text-white/80 hover:text-white'
                  }`}
                >
                  <span className="font-sans text-sm font-medium leading-relaxed">
                    {opt.label}
                  </span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? 'border-[#C9A84C] bg-[#C9A84C] text-black'
                      : 'border-white/20 bg-transparent'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 4. Botón Continuar */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!canContinue}
              onClick={onContinue}
              className={`w-full py-4 px-6 rounded-2xl font-bold font-mono tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-xl cursor-pointer ${
                canContinue
                  ? 'bg-gradient-to-r from-yellow-500 via-[#C9A84C] to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black shadow-[#C9A84C]/25 hover:shadow-[#C9A84C]/40 transform hover:-translate-y-0.5'
                  : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <span>CONTINUAR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5. Enlace discreto Atrás */}
          {onBack && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-mono text-white/40 hover:text-white/80 transition-colors inline-flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Atrás</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // MODO: STAGE (EXPLORACIÓN 03-06)
  // ==========================================
  if (mode === 'stage' && stageQuestion) {
    const showStagePause = Boolean(reflectionPrompt && reflectionKey && !dismissedReflections[reflectionKey] && selectedOptions.length === 0);
    const questionNumber = stageQuestion.stage - 2; // stage 3 -> 1, stage 4 -> 2, stage 5 -> 3, stage 6 -> 4
    const stageProgressPercent = (questionNumber / 4) * 100;
    const canContinue = selectedOptions.length > 0;
    const promptText = fillStagePrompt(stageQuestion.prompt, dominantAreaTitle || 'tu vida');

    return (
      <motion.div
        key={`guided-stage-${stageQuestion.stage}`}
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
                EXPLORACIÓN 0{stageQuestion.stage} · {stageQuestion.stageTitle}
              </span>
              <div className="flex items-center gap-2">
                <h3 className="text-white text-sm sm:text-base font-bold font-sans tracking-tight">
                  Pregunta {questionNumber} de 4
                </h3>
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
              animate={{ width: `${stageProgressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* 2. Tarjeta central con la pregunta */}
        <div className="bg-[#121212] border border-[#C9A84C]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Halo ambiental dorado */}
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

          <div className="text-center space-y-2">
            <p className="text-lg sm:text-2xl text-white font-serif leading-relaxed max-w-xl mx-auto py-1 sm:py-2">
              "{promptText}"
            </p>
            {dominantAreaTitle && (
              <div className="pt-1">
                <span className="inline-block text-[11px] font-mono text-white/50 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  Área: {dominantAreaTitle}
                </span>
              </div>
            )}
          </div>

          {/* 3. Opciones seleccionables apiladas en móvil */}
          {showStagePause && reflectionKey && reflectionPrompt ? renderReflectionPause(reflectionKey, reflectionPrompt) : (
          <div className="space-y-3 pt-2 border-t border-white/5">
            {stageQuestion.multi && (
              <div className="text-center">
                <span className="text-[11px] font-mono text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-3 py-1 rounded-full inline-block">
                  Elige hasta {stageQuestion.maxSelect}
                </span>
              </div>
            )}

            <div className="space-y-2.5">
              {stageQuestion.options.map((opt) => {
                const isSelected = selectedOptions.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onToggleOption?.(opt.id)}
                    className={`w-full py-3.5 px-4 rounded-xl text-left transition-all duration-200 cursor-pointer border flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-white shadow-[0_0_15px_rgba(201,168,76,0.2)]'
                        : 'bg-[#181818] border-white/5 hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 text-white/90'
                    }`}
                  >
                    <span className={`text-xs sm:text-sm font-medium leading-snug ${isSelected ? 'text-white font-semibold' : 'text-white/80'}`}>
                      {opt.label}
                    </span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors ${
                      isSelected 
                        ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0A]' 
                        : 'border-white/20 bg-white/5'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          )}

          {/* 4. Botón CONTINUAR */}
          <div className="pt-2 border-t border-white/5">
            <button
              type="button"
              id="stage-btn-continue"
              disabled={!canContinue}
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-[#C9A84C] to-yellow-600 hover:from-[#d8b556] hover:to-yellow-500 disabled:from-gray-800 disabled:to-gray-800 disabled:text-white/30 disabled:border-white/5 disabled:shadow-none disabled:cursor-not-allowed text-[#0D0D0D] font-bold py-3.5 px-5 rounded-xl transition-all shadow-[0_0_18px_rgba(201,168,76,0.3)] flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wider font-mono hover:scale-[1.01] active:scale-95"
            >
              <span>CONTINUAR →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5. Enlace discreto Atrás */}
        <div className="flex items-center justify-between px-2 pt-1">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-[#C9A84C] text-xs font-mono font-medium transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Atrás</span>
            </button>
          ) : (
            <div />
          )}

          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
            Etapa 0{stageQuestion.stage} de 06
          </span>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // MODO: DEEP DIVE (EXPLORACIÓN 02)
  // ==========================================
  if (mode === 'deepDive') {
    const showDeepPause = Boolean(reflectionPrompt && reflectionKey && !dismissedReflections[reflectionKey] && !isAnswering);
    const totalCount = deepDiveQuestions.length;
    const affirmationNumber = deepDiveIndex + 1;
    const currentQuestion = deepDiveQuestions[deepDiveIndex];
    const progressPercent = totalCount > 0
      ? Math.min(100, Math.round((affirmationNumber / totalCount) * 100))
      : 0;

    const currentScore = currentQuestion
      ? deepDiveAnswers[currentQuestion.id]
      : undefined;

    const deepDiveOptions = [
      {
        score: 2,
        id: 'deep-dive-yes',
        title: 'Prácticamente sí',
        desc: 'Siento total y constante afinidad',
      },
      {
        score: 1,
        id: 'deep-dive-sometimes',
        title: 'A veces',
        desc: 'Ocurre de manera intermitente',
      },
      {
        score: 0,
        id: 'deep-dive-no',
        title: 'En absoluto',
        desc: 'No coincide ni resuena conmigo',
      },
    ];

    const handleAnswerDeepDive = (scoreVal: number) => {
      (onAnswer as (score: number) => void)(scoreVal);
    };

    return (
      <motion.div
        key={`guided-deepdive-${deepDiveIndex}`}
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
                EXPLORACIÓN 02 · LO QUE PIENSAS
              </span>
              <div className="flex items-center gap-2">
                <h3 className="text-white text-sm sm:text-base font-bold font-sans tracking-tight">
                  Afirmación {affirmationNumber} de {totalCount}
                </h3>
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

        {/* 2. Tarjeta central con la afirmación */}
        <div className="bg-[#121212] border border-[#C9A84C]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Halo ambiental dorado */}
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A84C] font-bold block">
              Afirmación para reflexionar
            </span>
            <p className="text-lg sm:text-2xl text-white font-serif italic leading-relaxed sm:leading-loose max-w-xl mx-auto py-1 sm:py-2">
              "{currentQuestion?.afirmacionTest || ''}"
            </p>
            {currentQuestion?.bloque && (
              <div className="pt-1">
                <span className="inline-block text-[11px] font-mono text-white/50 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  Área: {currentQuestion.bloque}
                </span>
              </div>
            )}
          </div>

          {/* 3. Las 3 opciones (2, 1, 0) */}
          {showDeepPause && reflectionKey && reflectionPrompt ? renderReflectionPause(reflectionKey, reflectionPrompt) : (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block text-center font-bold">
              ¿Cuánto resuena contigo?
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {deepDiveOptions.map((opt) => {
                const isSelected = isAnswering && currentScore === opt.score;
                return (
                  <button
                    key={opt.id}
                    id={opt.id}
                    type="button"
                    onClick={() => handleAnswerDeepDive(opt.score)}
                    className={`py-3.5 px-3 rounded-xl text-center group transition-all duration-200 cursor-pointer border flex flex-col items-center justify-center min-h-[64px] ${
                      isSelected
                        ? 'bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C] font-bold shadow-[0_0_15px_rgba(201,168,76,0.35)] scale-[1.02]'
                        : 'bg-[#181818] border-white/5 hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/10 text-white'
                    }`}
                  >
                    <span
                      className={`block text-xs sm:text-sm font-extrabold tracking-wide uppercase leading-tight mb-1 ${
                        isSelected ? 'text-[#0A0A0A]' : 'text-white/90 group-hover:text-[#C9A84C]'
                      }`}
                    >
                      {opt.title}
                    </span>
                    <span
                      className={`block text-[9px] font-medium leading-snug ${
                        isSelected ? 'text-black/80 font-semibold' : 'text-white/50'
                      }`}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          )}

          {/* 4. Feedback animado y Botón CONTINUAR */}
          <AnimatePresence>
            {isAnswering && answeringFeedback && (
              <motion.div
                key="guided-deepdive-feedback-box"
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
                  id="deep-dive-btn-continue"
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

        {/* 5. Enlace discreto Atrás */}
        <div className="flex items-center justify-between px-2 pt-1">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-[#C9A84C] text-xs font-mono font-medium transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Atrás</span>
            </button>
          ) : (
            <div />
          )}

          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
            Capa 2 · Exploración Profunda
          </span>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // MODO: SCREENING (EXPLORACIÓN 01)
  // ==========================================
  const regionKeys = Object.keys(bloquesDiagnostico);
  const currentIdx = regionKeys.indexOf(currentSelectedRegion);
  const areaNumber = currentIdx !== -1 ? currentIdx + 1 : 1;
  const answeredCount = Object.keys(screeningAnswers).length;
  const progressPercent = Math.min(100, Math.round((answeredCount / 9) * 100));

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

  const handleAnswerScreening = (regId: string, val: number) => {
    (onAnswer as (regionId: string, valor: number) => void)(regId, val);
  };

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
                  onClick={() => handleAnswerScreening(currentSelectedRegion, opt.val)}
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

              {emergingPattern && (
                <div className="bg-[#0f1a1a] border border-teal-500/30 p-3.5 rounded-2xl text-left space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-teal-300 font-bold block">
                    Patrón emergente
                  </span>
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed">{emergingPattern}</p>
                </div>
              )}

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
                onClick={() => onSelectRegion?.(key)}
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
