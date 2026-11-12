import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Lock, 
  Sparkles, 
  Download, 
  RefreshCcw, 
  BookOpen, 
  Brain, 
  Activity, 
  Shield, 
  Compass, 
  Heart, 
  Calendar, 
  MessageSquare, 
  User, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Info,
  Clock,
  Briefcase,
  Users,
  Flame,
  ArrowDown,
  Search,
  Layers,
  Zap,
  HelpCircle,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { creenciasDatabase, bloquesDiagnostico, CreenciaRecord } from './data/creencias';
import { practicalStepsByBlock } from './data/practicalSteps';
import { blockDefinitions, detectBlockInteractions, DetectedInteraction, BlockDefinition } from './data/blockDefinitions';
import { generateFallbackData, AIDiagnosis } from './utils/fallbackGenerator';
import { downloadPDFResults } from './utils/pdfGenerator';
import { PLAN_PROVERBIOS, CITA_BASE, TEXTO_CITA_BASE, elementForDay, elementLines } from './utils/planProverbios';
import GoldenCelebration from './components/GoldenCelebration';
import { SIMULATED_CASE_19 } from './data/counselingMovements';
import GuidedExplorationFlow from './components/GuidedExplorationFlow';
import { HEART_STAGE_QUESTIONS } from './data/heartStageQuestions';
import { 
  evaluateHypothesisConfidence, 
  getConfidenceBadgeProps, 
  ConfidenceLevel, 
  ConfidenceEvaluation 
} from './utils/confidenceScorer';

export interface UserResult extends CreenciaRecord {
  category: string;
  intensity: number;
  screeningScore?: number;
  score?: number;
}

type Step = 'welcome' | 'screening' | 'calculating_blocks' | 'deep_dive' | 'heart_stages' | 'validation' | 'stage_transition' | 'generating_results' | 'tiebreak' | 'results';

// Evaluación pastoral para el monitoreo de renovación mental (Romanos 12:2)
const getProgressEvaluation = (scores: Record<string, number>, name: string) => {
  const anxiety = scores.anxiety ?? 5;
  const confidence = scores.confidence ?? 5;
  const obedience = scores.obedience ?? 5;
  const hope = scores.hope ?? 5;
  const frequency = scores.frequency ?? 5;

  const scoreRaw = (11 - anxiety) + confidence + obedience + hope + (11 - frequency);
  const index = scoreRaw / 5;

  if (index >= 8) {
    return {
      status: "Paz Firme y Libertad en la Gracia",
      color: "bg-emerald-950/30 border-emerald-500/20 text-emerald-300",
      badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
      commentary: `Querido/a ${name}, tus respuestas reflejan una sintonía hermosa con la paz de Dios y una renovación constante de tu mente. Has aprendido a entregar las preocupaciones en oración, traduciendo tu fe en pasos firmes y tranquilos de obediencia. La verdad de Dios está guiando tus decisiones cotidianas. ¡Sigue adelante, su gracia es tu sustento!`
    };
  } else if (index >= 5) {
    return {
      status: "Renovación en Proceso",
      color: "bg-amber-950/20 border-amber-500/20 text-amber-300",
      badge: "bg-amber-500/10 text-amber-400 border border-amber-500/25",
      commentary: `Observación pastoral: ${name}, estás en un proceso genuino de cambio. Muestras avances valiosos en confianza y disposición, aunque en momentos de cansancio la preocupación intenta volver a tomar terreno. Esto es natural durante el proceso de renovación. No te desanimes: cada paso sincero de fe debilita viejos hábitos mentales y afirma tu confianza en Dios.`
    };
  } else {
    return {
      status: "Tensión y Sobrecarga Emocional",
      color: "bg-red-950/20 border-red-500/20 text-red-300",
      badge: "bg-red-500/10 text-red-400 border border-red-500/25",
      commentary: `Cuidado pastoral: ${name}, tus respuestas indican que estás experimentando una carga pesada de preocupación y cansancio. Cuando intentamos resolver todo con nuestras propias fuerzas, el cuerpo y el corazón se agotan. Recuerda la invitación de Jesús: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar" (Mateo 11:28). Te animamos con afecto a buscar acompañamiento pastoral para caminar con apoyo y desahogo.`
    };
  }
};

const getPastoralConversationalFeedback = (blockId: string, score: number, name: string) => {
  const formattedName = name ? name.trim() : "amigo/a";
  if (score >= 4) {
    return `Gracias por tu honestidad, ${formattedName}. Reconocer lo que sientes es siempre el primer paso hacia la libertad.`;
  } else if (score === 3) {
    return `Reconocer que esta situación ocurre a veces es un paso muy valioso, ${formattedName}. Poco a poco la verdad irá trayendo mayor claridad y descanso.`;
  } else {
    return `Qué bendición ver que cuentas con paz y equilibrio en esta área, ${formattedName}. Esta fortaleza es un punto de apoyo muy importante para tu vida diaria.`;
  }
};

const getDeepDivePastoralFeedback = (bloque: string, score: number, name: string) => {
  const formattedName = name ? name.trim() : "amigo/a";
  if (score === 2) {
    return `Gracias por tu sinceridad ante Dios, ${formattedName}. Poner luz sobre estos pensamientos temerosos es lo que comienza a quitarles fuerza.`;
  } else if (score === 1) {
    return `Notar cuándo aparece esta idea te ayuda a estar alerta, ${formattedName}. Con la ayuda de Dios podrás responder a esos pensamientos con serenidad y verdad.`;
  } else {
    return `¡Excelente! Es una gran alegría ver que esta creencia no tiene peso en tu vida, ${formattedName}. Sigamos avanzando con fe y paz.`;
  }
};

const getExploradorLevel = (xp: number) => {
  if (xp >= 600) return { title: "Mapa completo", lvl: 7, nextXp: 700 };
  if (xp >= 500) return { title: "Discerniendo", lvl: 6, nextXp: 600 };
  if (xp >= 400) return { title: "Conectando", lvl: 5, nextXp: 500 };
  if (xp >= 300) return { title: "Profundizando", lvl: 4, nextXp: 400 };
  if (xp >= 200) return { title: "Descubriendo patrones", lvl: 3, nextXp: 300 };
  if (xp >= 100) return { title: "Observando", lvl: 2, nextXp: 200 };
  return { title: "Primera mirada", lvl: 1, nextXp: 100 };
};

const USE_GUIDED_FLOW = true;
const SHOW_TEST_TOOLS = false;

export default function App() {
  const [step, setStep] = useState<Step>(() => {
    const saved = localStorage.getItem('ti_step');
    return (saved as Step) || 'welcome';
  });
  const [userName, setUserName] = useState(() => localStorage.getItem('ti_user_name') || '');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('ti_user_email') || '');
  const [userAge, setUserAge] = useState(() => localStorage.getItem('ti_user_age') || '');
  const [userXp, setUserXp] = useState<number>(() => {
    const saved = localStorage.getItem('ti_user_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [achievements, setAchievements] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ti_achievements');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentSelectedRegion, setCurrentSelectedRegion] = useState<string>(() => {
    return localStorage.getItem('ti_selected_region') || 'capacidad-identidad';
  });
  const [xpNotification, setXpNotification] = useState<{ xp: number; label: string } | null>(null);
  const [newAchievementAlert, setNewAchievementAlert] = useState<{ name: string; description: string } | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Capa 1: Screening Answers (blockId -> score 1 to 5)
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('ti_screening_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [screeningIndex, setScreeningIndex] = useState<number>(() => {
    const saved = localStorage.getItem('ti_screening_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Active Blocks calculated after Capa 1
  const [activeBlocks, setActiveBlocks] = useState<string[]>(() => {
    const saved = localStorage.getItem('ti_active_blocks');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Capa 2: Deep Dive Answers (creenciaId -> score 0 (No), 1 (A veces), 2 (Sí))
  const [deepDiveAnswers, setDeepDiveAnswers] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('ti_deep_dive_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [deepDiveQuestions, setDeepDiveQuestions] = useState<CreenciaRecord[]>(() => {
    const saved = localStorage.getItem('ti_deep_dive_questions');
    return saved ? JSON.parse(saved) : [];
  });
  const [deepDiveIndex, setDeepDiveIndex] = useState<number>(() => {
    const saved = localStorage.getItem('ti_deep_dive_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Capa 3: Heart Stages Answers (stageId -> optionIds[]) & Stage Index
  const [stageAnswers, setStageAnswers] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('ti_stage_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [stageIndex, setStageIndex] = useState<number>(() => {
    const saved = localStorage.getItem('ti_stage_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Capa 4: Validation (Etapa 07: Validación antes de los resultados)
  const [rejectedInteractions, setRejectedInteractions] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ti_rejected_interactions');
    return saved ? JSON.parse(saved) : {};
  });
  const [validationIndex, setValidationIndex] = useState<number>(() => {
    const saved = localStorage.getItem('ti_validation_index');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [validationAnswers, setValidationAnswers] = useState<Record<string, 'si' | 'parte' | 'no'>>(() => {
    const saved = localStorage.getItem('ti_validation_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const scoredValidationIdsRef = useRef<Set<string>>(new Set());
  // Fase 4B: patrón emergente durante el screening (solo cuando dos áreas llegan a >= 4)
  const [emergingPattern, setEmergingPattern] = useState<string>('');
  const shownPatternsRef = useRef<Set<string>>(new Set());
  // Fase 4A: cierre de etapa con micro-insight (1 = tras screening, 2 = tras deep dive, 6 = tras etapa 06)
  const [transitionFrom, setTransitionFrom] = useState<1 | 2 | 6 | null>(() => {
    const saved = localStorage.getItem('ti_transition_from');
    const n = saved ? parseInt(saved, 10) : NaN;
    return n === 1 || n === 2 || n === 6 ? (n as 1 | 2 | 6) : null;
  });

  const stageSummary = useMemo(() => {
    const summary: { busca: string[]; teme: string[]; protege: string[]; produce: string[] } = {
      busca: [],
      teme: [],
      protege: [],
      produce: []
    };

    HEART_STAGE_QUESTIONS.forEach(q => {
      const selectedIds = stageAnswers[q.id] || [];
      const labels = selectedIds
        .map(id => q.options.find(opt => opt.id === id)?.label)
        .filter((label): label is string => Boolean(label));
      summary[q.id] = labels;
    });

    return summary;
  }, [stageAnswers]);

  // Track belief IDs scored in current journey to prevent duplicate XP on Back navigation
  const scoredBeliefIdsRef = useRef<Set<number>>(new Set());

  // Track stage IDs completed to prevent duplicate XP on Back navigation
  const scoredStageIdsRef = useRef<Set<string>>(new Set());

  // Expandable sections in results
  const [expandedBelief, setExpandedBelief] = useState<number | null>(null);
  
  // Journal notes saved locally
  const [journalNotes, setJournalNotes] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem('ti_journal_notes');
    return saved ? JSON.parse(saved) : {};
  });
  
  // 30-Day Plan tick state
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ti_completed_days');
    return saved ? JSON.parse(saved) : {};
  });

  // Active results categories and calculations
  const [introParagraph, setIntroParagraph] = useState<string>(() => {
    const saved = localStorage.getItem('ti_intro_paragraph');
    return saved || '';
  });

  const [results, setResults] = useState<UserResult[]>(() => {
    const saved = localStorage.getItem('ti_results');
    return saved ? JSON.parse(saved) : [];
  });

  // Desempate de creencia principal (fix: "siempre sale la misma creencia").
  // El puntaje compuesto (screening x 10 + intensidad 0-2) empata con mucha
  // frecuencia porque la exploración profunda solo tiene 3 niveles; antes el
  // desempate lo resolvía el orden estable del arreglo, es decir, siempre la
  // primera creencia de la base de datos del bloque dominante. Cuando varias
  // creencias empatan en el puntaje máximo, se le pregunta a la persona cuál
  // le describe mejor en lugar de adivinarlo por orden de lista.
  const [tiebreakCandidates, setTiebreakCandidates] = useState<UserResult[]>([]);
  const [tiebreakBonusId, setTiebreakBonusId] = useState<number | null>(() => {
    const saved = localStorage.getItem('ti_tiebreak_bonus_id');
    return saved ? parseInt(saved, 10) : null;
  });

  const chooseTiebreakBelief = (beliefId: number) => {
    setTiebreakBonusId(beliefId);
    localStorage.setItem('ti_tiebreak_bonus_id', String(beliefId));
    setTiebreakCandidates([]);
    setStep('generating_results');
  };

  // New robust states for the 8-phase AI transformation kit
  const [aiDiagnosis, setAiDiagnosis] = useState<AIDiagnosis | null>(() => {
    const saved = localStorage.getItem('ti_ai_diagnosis');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedHypothesis, setSelectedHypothesis] = useState<string>(() => {
    return localStorage.getItem('ti_selected_hypothesis') || '';
  });

  const [confirmedHeartSteps, setConfirmedHeartSteps] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ti_confirmed_heart_steps');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleHeartStep = (key: string) => {
    setConfirmedHeartSteps(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('ti_confirmed_heart_steps', JSON.stringify(next));
      return next;
    });
  };

  const [validatedInteractions, setValidatedInteractions] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ti_validated_interactions');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleValidatedInteraction = (id: string) => {
    setValidatedInteractions(prev => {
      const willBeValidated = !prev[id];
      const next = { ...prev, [id]: willBeValidated };
      localStorage.setItem('ti_validated_interactions', JSON.stringify(next));

      if (willBeValidated) {
        setRejectedInteractions(rejPrev => {
          if (!rejPrev[id]) return rejPrev;
          const rejNext = { ...rejPrev, [id]: false };
          localStorage.setItem('ti_rejected_interactions', JSON.stringify(rejNext));
          return rejNext;
        });
      }
      return next;
    });
  };

  // Interacciones dinámicas detectadas entre bloques (siempre calculadas localmente)
  const detectedInteractions = useMemo(() => {
    return detectBlockInteractions(screeningAnswers);
  }, [screeningAnswers]);

  // Preguntas de validación: hasta 2 interacciones de detectedInteractions, primero las de nivel 'patron' y luego las de nivel 'senal'
  const validationTargets = useMemo<DetectedInteraction[]>(() => {
    if (!detectedInteractions || detectedInteractions.length === 0) return [];
    const patrones = detectedInteractions.filter(i => i.nivel === 'patron');
    const senales = detectedInteractions.filter(i => i.nivel === 'senal');
    return [...patrones, ...senales].slice(0, 2);
  }, [detectedInteractions]);

  const [selectedBlockModalId, setSelectedBlockModalId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<number>(() => {
    const saved = localStorage.getItem('ti_active_tab');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [progressScores, setProgressScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('ti_progress_scores');
    return saved ? JSON.parse(saved) : { anxiety: 5, confidence: 5, obedience: 5, hope: 5, frequency: 5 };
  });

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    const saved = localStorage.getItem('ti_selected_day_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Conversational counseling & revelation states
  const [isAnswering, setIsAnswering] = useState(false);
  const [answeringFeedback, setAnsweringFeedback] = useState('');
  const [isUnveiled, setIsUnveiled] = useState(() => {
    return localStorage.getItem('ti_is_unveiled') === 'true';
  });
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [barWidth, setBarWidth] = useState('0%');
  const [isSimulatedCase19, setIsSimulatedCase19] = useState(() => {
    return localStorage.getItem('ti_is_simulated_case_19') === 'true';
  });

  const handleLoadSimulatedCase19 = () => {
    const caseAnswers = SIMULATED_CASE_19.puntajes;
    setScreeningAnswers(caseAnswers);
    localStorage.setItem('ti_screening_answers', JSON.stringify(caseAnswers));

    const sorted = Object.entries(caseAnswers).sort((a, b) => b[1] - a[1]);
    const highBlocks = sorted.filter(([_, score]) => score >= 3).map(([id]) => id);
    setActiveBlocks(highBlocks);
    localStorage.setItem('ti_active_blocks', JSON.stringify(highBlocks));

    const fakePrimary: UserResult = {
      id: 9919,
      bloque: 'Control & Entorno',
      bloqueId: 'control-entorno',
      category: 'Control & Entorno',
      alias: 'Control y Vigilancia',
      creencia: 'Necesidad de control como estrategia de protección',
      afirmacionTest: 'Siento que si no tengo todo bajo control y no reviso cada detalle, algo saldrá mal y quedaré como insuficiente.',
      verdad: 'Nuestra competencia proviene de Dios (2 Corintios 3:5). Dios sustenta todas las cosas en Su soberana providencia.',
      declaracion: 'Descanso en la providencia de Dios; soy libre de la tiranía de la perfección porque Cristo es mi suficiencia y amparo.',
      impacto: 'Dificultad recurrente para delegar tareas, postergación por preparación excesiva y temor latente a la crítica o al error.',
      neuro: 'Hiperactivación prefrontal y del eje del estrés.',
      lenguaje: ['Tengo que asegurarme', 'Nadie lo hará bien'],
      conducta: ['Revisión compulsiva', 'Dificultad para delegar'],
      espiritu: 'Temor a la vulnerabilidad y a descansar en la soberanía de Dios.',
      versiculos: [
        { txt: 'No que seamos competentes por nosotros mismos para pensar algo como de nosotros mismos, sino que nuestra competencia proviene de Dios.', ref: '2 Corintios 3:5' },
        { txt: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.', ref: 'Filipenses 4:6' }
      ],
      intensity: 5,
      scoreMax: 5,
      screeningScore: 5
    };

    const simulatedDiag = generateFallbackData(
      fakePrimary,
      userName || 'Caso de Estudio Simulado',
      userEmail || 'simulacion@ejemplo.com',
      [fakePrimary],
      caseAnswers
    );

    setResults([fakePrimary]);
    localStorage.setItem('ti_results', JSON.stringify([fakePrimary]));
    setAiDiagnosis(simulatedDiag);
    localStorage.setItem('ti_ai_diagnosis', JSON.stringify(simulatedDiag));
    setIsUnveiled(true);
    localStorage.setItem('ti_is_unveiled', 'true');
    setIsSimulatedCase19(true);
    localStorage.setItem('ti_is_simulated_case_19', 'true');
    setActiveTab(0);
    setStep('results');
  };

  useEffect(() => {
    if (isAnswering) {
      setBarWidth('0%');
      const timer = setTimeout(() => {
        setBarWidth('100%');
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setBarWidth('0%');
    }
  }, [isAnswering]);

  const handleCopyToClipboard = (text: string, label = "la determinación") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedNotification(`¡Copiado ${label} al portapapeles con éxito!`);
      setTimeout(() => setCopiedNotification(null), 3500);
    }).catch(() => {
      alert("No se pudo copiar de forma nativa por el iframe, por favor selecciona el texto manualmente o usa el botón de descarga.");
    });
  };

  // Save progress automatically when values change
  useEffect(() => {
    localStorage.setItem('ti_step', step);
    localStorage.setItem('ti_screening_answers', JSON.stringify(screeningAnswers));
    localStorage.setItem('ti_screening_index', screeningIndex.toString());
    localStorage.setItem('ti_active_blocks', JSON.stringify(activeBlocks));
    localStorage.setItem('ti_deep_dive_answers', JSON.stringify(deepDiveAnswers));
    localStorage.setItem('ti_deep_dive_questions', JSON.stringify(deepDiveQuestions));
    localStorage.setItem('ti_deep_dive_index', deepDiveIndex.toString());
    localStorage.setItem('ti_stage_answers', JSON.stringify(stageAnswers));
    localStorage.setItem('ti_stage_index', stageIndex.toString());
    localStorage.setItem('ti_rejected_interactions', JSON.stringify(rejectedInteractions));
    localStorage.setItem('ti_validation_index', validationIndex.toString());
    if (transitionFrom) {
      localStorage.setItem('ti_transition_from', transitionFrom.toString());
    } else {
      localStorage.removeItem('ti_transition_from');
    }
    localStorage.setItem('ti_validation_answers', JSON.stringify(validationAnswers));
    localStorage.setItem('ti_results', JSON.stringify(results));
    localStorage.setItem('ti_intro_paragraph', introParagraph);
    localStorage.setItem('ti_completed_days', JSON.stringify(completedDays));
    localStorage.setItem('ti_journal_notes', JSON.stringify(journalNotes));
    localStorage.setItem('ti_user_age', userAge);
    localStorage.setItem('ti_user_xp', userXp.toString());
    localStorage.setItem('ti_achievements', JSON.stringify(achievements));
    localStorage.setItem('ti_selected_region', currentSelectedRegion);

    // AI Transformation kit serialization
    if (aiDiagnosis) {
      localStorage.setItem('ti_ai_diagnosis', JSON.stringify(aiDiagnosis));
    } else {
      localStorage.removeItem('ti_ai_diagnosis');
    }
    localStorage.setItem('ti_selected_hypothesis', selectedHypothesis);
    localStorage.setItem('ti_active_tab', activeTab.toString());
    localStorage.setItem('ti_progress_scores', JSON.stringify(progressScores));
    localStorage.setItem('ti_selected_day_index', selectedDayIndex.toString());
    localStorage.setItem('ti_is_unveiled', isUnveiled ? 'true' : 'false');
  }, [
    step,
    screeningAnswers,
    screeningIndex,
    activeBlocks,
    deepDiveAnswers,
    deepDiveQuestions,
    deepDiveIndex,
    stageAnswers,
    stageIndex,
    results,
    introParagraph,
    completedDays,
    journalNotes,
    aiDiagnosis,
    selectedHypothesis,
    activeTab,
    progressScores,
    selectedDayIndex,
    isUnveiled,
    userAge,
    userXp,
    achievements,
    currentSelectedRegion,
    validationIndex,
    transitionFrom
  ]);

  const screeningList = useMemo(() => {
    return Object.entries(bloquesDiagnostico).map(([id, info]) => ({
      id,
      ...info
    }));
  }, []);

  // Sync scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, screeningIndex, deepDiveIndex, stageIndex]);

  // Load profile from localStorage if they exist
  useEffect(() => {
    const savedName = localStorage.getItem('ti_user_name');
    const savedEmail = localStorage.getItem('ti_user_email');
    const savedAge = localStorage.getItem('ti_user_age');
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
    if (savedAge) setUserAge(savedAge);
  }, []);

  const handleStartScreening = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert('Por favor ingresa tu nombre para personalizar tu diagnóstico.');
      return;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      alert('Por favor ingresa un correo electrónico válido para registrar tu perfil.');
      return;
    }
    if (!userAge.trim()) {
      alert('Por favor ingresa tu edad.');
      return;
    }

    localStorage.setItem('ti_user_name', userName);
    localStorage.setItem('ti_user_email', userEmail);
    localStorage.setItem('ti_user_age', userAge);

    // Initial Onboarding XP & Achievement
    setUserXp(25);
    setAchievements(prev => ({
      ...prev,
      'primer-paso': true
    }));
    
    setXpNotification({ xp: 25, label: "Perfil de exploración listo" });
    setNewAchievementAlert({ 
      name: "PRIMERA MIRADA", 
      description: "Has comenzado tu exploración." 
    });

    setTimeout(() => {
      setXpNotification(null);
    }, 3200);

    setTimeout(() => {
      setNewAchievementAlert(null);
    }, 4500);

    setStep('screening');
  };

  const handleMapRegionAnswer = (regionId: string, score: number) => {
    const alreadyAnswered = screeningAnswers[regionId] !== undefined;

    setScreeningAnswers(prev => {
      const updated = {
        ...prev,
        [regionId]: score
      };

      // Award XP for first discovery of this region (only if not already answered)
      if (!alreadyAnswered) {
        setUserXp(currentXp => currentXp + 30);
        setXpNotification({
          xp: 30,
          label: "¡Región explorada!"
        });
        setTimeout(() => setXpNotification(null), 3000);
      }

      // Check for mid-journey Milestone achievement (4 regions completed)
      const completedCount = Object.keys(updated).length;
      if (completedCount === 4 && !alreadyAnswered) {
        setAchievements(ach => {
          if (ach['explorador-valiente']) return ach;
          const upd = { ...ach, 'explorador-valiente': true };
          localStorage.setItem('ti_achievements', JSON.stringify(upd));
          setNewAchievementAlert({ 
            name: "MITAD DEL CAMINO", 
            description: "Has explorado 4 de las 9 áreas." 
          });
          setTimeout(() => setNewAchievementAlert(null), 4500);
          return upd;
        });
        setUserXp(currentXp => currentXp + 40);
      }

      return updated;
    });

    // Generate clinical-pastoral feedback
    const feedback = getPastoralConversationalFeedback(regionId, score, userName);

    // Fase 4B: detectar un patrón emergente nuevo (ambas áreas >= 4) que involucre esta área
    const nextScores = { ...screeningAnswers, [regionId]: score };
    const newPattern = detectBlockInteractions(nextScores).find(i =>
      i.nivel === 'patron' &&
      (i.blockA.id === regionId || i.blockB.id === regionId) &&
      !shownPatternsRef.current.has(i.id)
    );
    if (newPattern) {
      shownPatternsRef.current.add(newPattern.id);
      setEmergingPattern('Hay un patrón que emerge en tus respuestas. Lo exploraremos más adelante.');
    } else {
      setEmergingPattern('');
    }

    // Check if ALL 9 regions are fully completed
    const keys = Object.keys(bloquesDiagnostico);
    const answeredKeys = Object.keys(screeningAnswers);
    if (!answeredKeys.includes(regionId)) {
      answeredKeys.push(regionId);
    }
    const allCompleted = keys.every(k => answeredKeys.includes(k));

    if (allCompleted) {
      // Award Final Regional Conquest Medal & bonus XP if not already awarded
      setAchievements(ach => {
        if (!ach['rompedor-de-cadenas']) {
          const upd = { ...ach, 'rompedor-de-cadenas': true };
          localStorage.setItem('ti_achievements', JSON.stringify(upd));
          setUserXp(xp => xp + 50);
          setXpNotification({ xp: 50, label: "Panorama completo" });
          setNewAchievementAlert({ 
            name: "PANORAMA COMPLETO", 
            description: "Has explorado las 9 áreas de tu vida." 
          });
          setTimeout(() => setXpNotification(null), 3000);
          setTimeout(() => setNewAchievementAlert(null), 4500);
          return upd;
        }
        return ach;
      });

      const finalMsg = "¡Excelente! Has completado la exploración de las 9 áreas. Analizando patrones con discernimiento...";
      setAnsweringFeedback(`${feedback}\n\n${finalMsg}`);
      setIsAnswering(true);
    } else {
      setAnsweringFeedback(feedback);
      setIsAnswering(true);
    }
  };

  const handleContinueScreening = () => {
    setEmergingPattern('');
    const keys = Object.keys(bloquesDiagnostico);
    const answeredKeys = Object.keys(screeningAnswers);
    const allCompleted = keys.every(k => answeredKeys.includes(k));

    if (allCompleted) {
      setStep('calculating_blocks');
      setIsAnswering(false);
      setAnsweringFeedback('');
    } else {
      // Find next uncompleted region key
      const nextUncompleted = keys.find(k => k !== currentSelectedRegion && !answeredKeys.includes(k));
      if (nextUncompleted) {
        setCurrentSelectedRegion(nextUncompleted);
      }
      setIsAnswering(false);
      setAnsweringFeedback('');
    }
  };

  // Compute active blocks and setup Layer 2 deep dive
  useEffect(() => {
    if (step === 'calculating_blocks') {
      const timer = setTimeout(() => {
        // Calculate all blocks with Score >= 3, sorted descending
        const passing = Object.entries(screeningAnswers)
          .filter(([_, score]) => (score as number) >= 3)
          .sort((a, b) => (b[1] as number) - (a[1] as number));

        let activated: string[] = [];

        if (passing.length > 0) {
          if (passing.length <= 3) {
            activated = passing.map(([id]) => id);
          } else {
            // Keep top 3 plus any blocks that tie with the 3rd block's score
            const cutoffScore = passing[2][1] as number;
            activated = passing
              .filter(([_, score]) => (score as number) >= cutoffScore)
              .map(([id]) => id);
          }
        } else {
          // If no blocks are >= 3, pick the top 3 highest scores
          const sorted = Object.entries(screeningAnswers)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .slice(0, 3)
            .map(([id, _]) => id);
          activated = sorted;
        }

        // Filter the complete database for beliefs belonging to activated blocks
        const targetQuestions = creenciasDatabase.filter(c => activated.includes(c.bloqueId));
        
        setActiveBlocks(activated);
        setDeepDiveQuestions(targetQuestions);
        setDeepDiveIndex(0);
        
        // Initialize all answers to 0 if not set, or reset
        const initialAnswers: Record<number, number> = {};
        targetQuestions.forEach(q => {
          initialAnswers[q.id] = 0; // default is "no"
        });
        setDeepDiveAnswers(initialAnswers);
        
        setTransitionFrom(1);
        setStep('stage_transition');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [step, screeningAnswers, screeningList]);

  const handleDeepDiveAnswer = (score: number) => {
    const currentQuestion = deepDiveQuestions[deepDiveIndex];
    if (!currentQuestion) return;

    // Only award XP if this belief has not already been scored in this journey (prevents duplicate XP when navigating Back)
    const isFirstTimeScored = !scoredBeliefIdsRef.current.has(currentQuestion.id);

    setDeepDiveAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: score
    }));

    if (isFirstTimeScored) {
      scoredBeliefIdsRef.current.add(currentQuestion.id);
      // Award XP (15 XP for cataloging each deep belief node)
      setUserXp(currentXp => currentXp + 15);
      setXpNotification({ xp: 15, label: "Afirmación registrada" });
      setTimeout(() => setXpNotification(null), 3000);
    }

    // Generate warm deep-dive feedback
    const feedback = getDeepDivePastoralFeedback(currentQuestion.bloque, score, userName);

    const isLastQuestion = deepDiveIndex === deepDiveQuestions.length - 1;

    if (isLastQuestion) {
      // Award Descent Completion Achievement if not already awarded
      setAchievements(ach => {
        if (!ach['ojo-revelador']) {
          const upd = { ...ach, 'ojo-revelador': true };
          localStorage.setItem('ti_achievements', JSON.stringify(upd));
          setUserXp(currentXp => currentXp + 60);
          setXpNotification({ xp: 60, label: "Exploración profunda completada" });
          setNewAchievementAlert({ 
            name: "MÁS PROFUNDO", 
            description: "Has examinado los pensamientos detrás de tus respuestas." 
          });
          setTimeout(() => setXpNotification(null), 3000);
          setTimeout(() => setNewAchievementAlert(null), 4500);
          return upd;
        }
        return ach;
      });

      const finalMsg = "¡Autoexploración completada! Llevando cada pensamiento a la luz de la verdad en Cristo. Preparando tu mapa de exploración...";
      setAnsweringFeedback(`${feedback}\n\n${finalMsg}`);
      setIsAnswering(true);
    } else {
      setAnsweringFeedback(feedback);
      setIsAnswering(true);
    }
  };

  const handleContinueDeepDive = () => {
    if (deepDiveIndex < deepDiveQuestions.length - 1) {
      setDeepDiveIndex(prev => prev + 1);
      setIsAnswering(false);
      setAnsweringFeedback('');
    } else {
      setTransitionFrom(2);
      setStep('stage_transition');
      setIsAnswering(false);
      setAnsweringFeedback('');
    }
  };

  const handleToggleStageOption = (optionId: string) => {
    const currentQ = HEART_STAGE_QUESTIONS[stageIndex];
    if (!currentQ) return;

    setStageAnswers(prev => {
      const current = prev[currentQ.id] || [];
      if (!currentQ.multi) {
        return { ...prev, [currentQ.id]: [optionId] };
      }

      if (optionId === 'otra') {
        if (current.includes('otra')) {
          return { ...prev, [currentQ.id]: [] };
        }
        return { ...prev, [currentQ.id]: ['otra'] };
      } else {
        const withoutOtra = current.filter(id => id !== 'otra');
        if (withoutOtra.includes(optionId)) {
          return { ...prev, [currentQ.id]: withoutOtra.filter(id => id !== optionId) };
        } else {
          if (withoutOtra.length >= currentQ.maxSelect) {
            return prev;
          }
          return { ...prev, [currentQ.id]: [...withoutOtra, optionId] };
        }
      }
    });
  };

  const handleContinueStage = () => {
    const currentQuestion = HEART_STAGE_QUESTIONS[stageIndex];
    if (!currentQuestion) return;

    const currentSelected = stageAnswers[currentQuestion.id] || [];
    if (currentSelected.length === 0) return;

    // +10 puntos la primera vez que se completa cada etapa (con aviso +10 puntos · [stageTitle])
    if (!scoredStageIdsRef.current.has(currentQuestion.id)) {
      scoredStageIdsRef.current.add(currentQuestion.id);
      setUserXp(prev => prev + 10);
      setXpNotification({ xp: 10, label: currentQuestion.stageTitle });
      setTimeout(() => setXpNotification(null), 3000);
    }

    if (stageIndex < HEART_STAGE_QUESTIONS.length - 1) {
      setStageIndex(prev => prev + 1);
    } else {
      setTransitionFrom(6);
      setStep('stage_transition');
    }
  };

  // Fase 4A: avanzar desde la pantalla de cierre de etapa
  const handleContinueTransition = () => {
    if (transitionFrom === 1) {
      setTransitionFrom(null);
      setStep('deep_dive');
    } else if (transitionFrom === 2) {
      setTransitionFrom(null);
      setStageIndex(0);
      setStep('heart_stages');
    } else {
      setTransitionFrom(null);
      if (validationTargets.length > 0) {
        setValidationIndex(0);
        setStep('validation');
      } else {
        setStep('generating_results');
      }
    }
  };

  // Fase 4A: micro-insight de una sola oración, calculado con datos reales (nunca con una sola respuesta)
  const getStageInsight = (from: 1 | 2 | 6 | null): string => {
    if (from === 1) {
      return 'Tus respuestas muestran más resonancia en algunas áreas. Ahora veremos qué pensamientos hay detrás.';
    }
    if (from === 2) {
      return 'Algunas afirmaciones resonaron contigo con fuerza. Ahora exploraremos qué buscas y qué temes.';
    }
    if (from === 6) {
      const related = new Set<string>();
      ['busca', 'teme'].forEach(qid => {
        const q = HEART_STAGE_QUESTIONS.find(x => x.id === qid);
        (stageAnswers[qid] || []).forEach(optId => {
          if (optId === 'otra') return;
          q?.options.find(o => o.id === optId)?.relatedBlocks.forEach(b => related.add(b));
        });
      });
      const matches = activeBlocks.some(b => related.has(b));
      if (matches) return 'Lo que buscas y lo que temes apuntan en la misma dirección que tus áreas principales.';
      return 'Tus respuestas muestran matices distintos; vale la pena revisarlos con calma.';
    }
    return '';
  };

  const handleAnswerValidation = (interactionId: string, option: 'si' | 'parte' | 'no') => {
    setValidationAnswers(prev => {
      const next = { ...prev, [interactionId]: option };
      localStorage.setItem('ti_validation_answers', JSON.stringify(next));
      return next;
    });

    if (option === 'si') {
      setValidatedInteractions(prev => {
        const next = { ...prev, [interactionId]: true };
        localStorage.setItem('ti_validated_interactions', JSON.stringify(next));
        return next;
      });
      setRejectedInteractions(prev => {
        const next = { ...prev, [interactionId]: false };
        localStorage.setItem('ti_rejected_interactions', JSON.stringify(next));
        return next;
      });
    } else if (option === 'parte') {
      setValidatedInteractions(prev => {
        const next = { ...prev, [interactionId]: false };
        localStorage.setItem('ti_validated_interactions', JSON.stringify(next));
        return next;
      });
      setRejectedInteractions(prev => {
        const next = { ...prev, [interactionId]: false };
        localStorage.setItem('ti_rejected_interactions', JSON.stringify(next));
        return next;
      });
    } else if (option === 'no') {
      setValidatedInteractions(prev => {
        const next = { ...prev, [interactionId]: false };
        localStorage.setItem('ti_validated_interactions', JSON.stringify(next));
        return next;
      });
      setRejectedInteractions(prev => {
        const next = { ...prev, [interactionId]: true };
        localStorage.setItem('ti_rejected_interactions', JSON.stringify(next));
        return next;
      });
    }
  };

  const handleContinueValidation = () => {
    const currentInteraction = validationTargets[validationIndex];
    if (!currentInteraction) return;

    const currentSelected = validationAnswers[currentInteraction.id];
    if (!currentSelected) return;

    // +10 puntos la primera vez que se responde cada validación (con mecanismo useRef)
    if (!scoredValidationIdsRef.current.has(currentInteraction.id)) {
      scoredValidationIdsRef.current.add(currentInteraction.id);
      setUserXp(prev => prev + 10);
      setXpNotification({ xp: 10, label: "Validación de Conexión" });
      setTimeout(() => setXpNotification(null), 3000);
    }

    if (validationIndex < validationTargets.length - 1) {
      setValidationIndex(prev => prev + 1);
    } else {
      setStep('generating_results');
    }
  };

  const handleValidationBack = () => {
    if (validationIndex > 0) {
      setValidationIndex(prev => prev - 1);
    } else {
      setStep('heart_stages');
      setStageIndex(HEART_STAGE_QUESTIONS.length - 1);
    }
  };

  const handleStageBack = () => {
    if (stageIndex > 0) {
      setStageIndex(prev => prev - 1);
    } else {
      setStep('deep_dive');
      setDeepDiveIndex(Math.max(0, deepDiveQuestions.length - 1));
      setIsAnswering(false);
      setAnsweringFeedback('');
    }
  };

  const handleDeepDiveBack = () => {
    setIsAnswering(false);
    setAnsweringFeedback('');
    if (deepDiveIndex > 0) {
      setDeepDiveIndex(prev => prev - 1);
    } else {
      setStep('screening');
    }
  };

  // Keyboard navigation: Enter key triggers CONTINUAR when button is visible
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
          return;
        }

        if (step === 'screening' && isAnswering && answeringFeedback) {
          e.preventDefault();
          handleContinueScreening();
        } else if (step === 'deep_dive' && isAnswering && answeringFeedback) {
          e.preventDefault();
          handleContinueDeepDive();
        } else if (step === 'heart_stages') {
          const currentQ = HEART_STAGE_QUESTIONS[stageIndex];
          if (currentQ) {
            const currentSelected = stageAnswers[currentQ.id] || [];
            if (currentSelected.length > 0) {
              e.preventDefault();
              handleContinueStage();
            }
          }
        } else if (step === 'stage_transition') {
          e.preventDefault();
          handleContinueTransition();
        } else if (step === 'validation') {
          const currentInter = validationTargets[validationIndex];
          if (currentInter && validationAnswers[currentInter.id]) {
            e.preventDefault();
            handleContinueValidation();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, isAnswering, answeringFeedback, screeningAnswers, currentSelectedRegion, deepDiveIndex, deepDiveQuestions, stageIndex, stageAnswers, validationIndex, validationTargets, validationAnswers, transitionFrom]);

  const restartJourney = () => {
    setStep('welcome');
    setScreeningAnswers({});
    setScreeningIndex(0);
    setActiveBlocks([]);
    setDeepDiveAnswers({});
    setDeepDiveQuestions([]);
    setDeepDiveIndex(0);
    setStageAnswers({});
    setStageIndex(0);
    setResults([]);
    setIntroParagraph('');
    setTiebreakCandidates([]);
    setTiebreakBonusId(null);
    setIsSimulatedCase19(false);
    localStorage.removeItem('ti_tiebreak_bonus_id');
    localStorage.removeItem('ti_is_simulated_case_19');
    setCompletedDays({});
    setJournalNotes({});
    setExpandedBelief(null);
    setAiDiagnosis(null);
    setActiveTab(0);
    setProgressScores({ anxiety: 5, confidence: 5, obedience: 5, hope: 5, frequency: 5 });
    setSelectedDayIndex(0);
    setIsUnveiled(false);
    setSelectedHypothesis('');
    setConfirmedHeartSteps({});
    setValidatedInteractions({});
    setRejectedInteractions({});
    setValidationIndex(0);
    setValidationAnswers({});
    setTransitionFrom(null);
    setEmergingPattern('');
    shownPatternsRef.current.clear();
    setSelectedBlockModalId(null);
    setUserAge('');
    setUserXp(0);
    setAchievements({});
    scoredBeliefIdsRef.current.clear();
    scoredStageIdsRef.current.clear();
    scoredValidationIdsRef.current.clear();
    setCurrentSelectedRegion('capacidad-identidad');
    setIsAnswering(false);
    setAnsweringFeedback('');
    
    localStorage.removeItem('ti_step');
    localStorage.removeItem('ti_screening_answers');
    localStorage.removeItem('ti_screening_index');
    localStorage.removeItem('ti_active_blocks');
    localStorage.removeItem('ti_deep_dive_answers');
    localStorage.removeItem('ti_deep_dive_questions');
    localStorage.removeItem('ti_deep_dive_index');
    localStorage.removeItem('ti_stage_answers');
    localStorage.removeItem('ti_stage_index');
    localStorage.removeItem('ti_rejected_interactions');
    localStorage.removeItem('ti_validation_index');
    localStorage.removeItem('ti_validation_answers');
    localStorage.removeItem('ti_transition_from');
    localStorage.removeItem('ti_results');
    localStorage.removeItem('ti_intro_paragraph');
    localStorage.removeItem('ti_completed_days');
    localStorage.removeItem('ti_journal_notes');
    localStorage.removeItem('ti_ai_diagnosis');
    localStorage.removeItem('ti_selected_hypothesis');
    localStorage.removeItem('ti_confirmed_heart_steps');
    localStorage.removeItem('ti_validated_interactions');
    localStorage.removeItem('ti_active_tab');
    localStorage.removeItem('ti_progress_scores');
    localStorage.removeItem('ti_selected_day_index');
    localStorage.removeItem('ti_is_unveiled');
    localStorage.removeItem('ti_user_age');
    localStorage.removeItem('ti_user_xp');
    localStorage.removeItem('ti_achievements');
    localStorage.removeItem('ti_selected_region');
  };

  const triggerDiagnosisGeneration = async (compiledResults: UserResult[]) => {
    setLoadingAi(true);
    setAiError(null);
    const primary = compiledResults[0] || (creenciasDatabase[0] as any);
    if (primary) {
      primary.screeningScore = screeningAnswers[primary.bloqueId] || primaryBlock.score || 1;
    }
    
    try {
      const response = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          primaryBelief: primary,
          activeBeliefs: compiledResults.slice(0, 5),
          userAge,
          screeningAnswers,
          stageSummary
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.useFallback) {
          console.log("No GEMINI_API_KEY configured on server. Creating dynamic local fallback.");
          const fallback = generateFallbackData(primary, userName, userEmail, compiledResults, screeningAnswers, stageSummary);
          setAiDiagnosis(fallback);
        } else {
          const fallback = generateFallbackData(primary, userName, userEmail, compiledResults, screeningAnswers, stageSummary);
          const completeDiagnosis = { ...data };
          if (!completeDiagnosis.mapaDelCorazon) {
            completeDiagnosis.mapaDelCorazon = fallback.mapaDelCorazon;
          } else if (fallback.mapaDelCorazon) {
            const steps = ["circunstancia", "interpretacion", "deseo", "temor", "estrategiaControl", "respuesta", "fruto"] as const;
            completeDiagnosis.mapaDelCorazon = { ...completeDiagnosis.mapaDelCorazon };
            for (const stepKey of steps) {
              const currentStep = completeDiagnosis.mapaDelCorazon[stepKey];
              if (!currentStep || !currentStep.contenido || currentStep.contenido.trim() === "" || currentStep.contenido === "No provisto") {
                completeDiagnosis.mapaDelCorazon[stepKey] = fallback.mapaDelCorazon[stepKey];
              }
            }
          }
          setAiDiagnosis(completeDiagnosis);
        }
      } else {
        console.warn("API Server responded with non-200. Proceeding with dynamic fallback.");
        const fallback = generateFallbackData(primary, userName, userEmail, compiledResults, screeningAnswers, stageSummary);
        setAiDiagnosis(fallback);
      }
    } catch (err) {
      console.error("Failed to query API for AI Diagnosis:", err);
      const fallback = generateFallbackData(primary, userName, userEmail, compiledResults, screeningAnswers, stageSummary);
      setAiDiagnosis(fallback);
    } finally {
      setLoadingAi(false);
    }
  };

  // Build Results and empathetic intro
  useEffect(() => {
    if (step === 'generating_results') {
      const compileAllAndQuery = async () => {
        // Compile major block
        const blockScores: Record<string, number> = {};
        screeningList.forEach(item => {
          blockScores[item.id] = screeningAnswers[item.id] || 1;
        });

        const sortedBlocks = Object.entries(blockScores)
          .sort((a, b) => b[1] - a[1]);
        
        // Empathic, prudent, and biblically sound introductory paragraph
        const intros: Record<string, string> = {
          "capacidad-identidad": "Con el tiempo, tu mente aprendió a protegerse exigiendo una preparación exhaustiva por temor al rechazo o a no estar a la altura. Esa voz interior crítica nació para cuidarte ante la crítica, pero hoy te desgasta. La verdad bíblica es que tu suficiencia y competencia provienen de Dios, no de una perfección inalcanzable (2 Corintios 3:5).",
          "merecimiento-vinculo": "Tu cuerpo aprendió a mantenerse en guardia incluso en los momentos de mayor calma, como si la tranquilidad fuera frágil y una tormenta estuviera siempre por llegar. Pero la bendición de Dios no trae facturas ocultas ni dolor: Su amor es incondicional y enriquece tu vida en paz (Proverbios 10:22).",
          "control-entorno": "Ante la incertidumbre, tu cuerpo y mente aprendieron a estar en alerta constante, creyendo que si no estás al tanto de cada detalle las cosas se desmoronarán. Hoy puedes soltar esa carga: el cuidado de tu vida descansa en la fidelidad y soberanía de Dios (Proverbios 3:5-6).",
          "rendimiento-logro": "Tu mente aprendió a asociar tu valor con la cantidad de tareas terminadas y metas alcanzadas, haciendo del descanso un motivo de culpa involuntaria. Pero tu dignidad no es un salario que debes ganarte: Cristo te recibe en gracia y te invita a descansar de verdad (Mateo 11:28).",
          "relaciones-poder": "Para evitar heridas y desacuerdos, aprendiste a callar tus necesidades o, en ocasiones, a defenderte con rigidez. Dios te da libertad y sabiduría para expresar la verdad con amor, poniendo límites sanos con mansedumbre y paz (Efesios 4:15).",
          "cuerpo-salud": "Tu mente aprendió a tratar a tu cuerpo como una herramienta de trabajo continuo, postergando el descanso y la salud. Tu cuerpo es templo del Espíritu Santo, diseñado para ser cuidado con mayordomía y honra (1 Corintios 6:19).",
          "espiritualidad-trascendencia": "A veces sientes a Dios lejano o te cuesta tener certeza sobre tu propósito. Recuerda que Dios no busca ritos vacíos sino una relación viva de Padre a hijo, y sus planes para ti son de bien y esperanza (Jeremías 29:11).",
          "tiempo-futuro": "Tu mente aprendió a vivir acelerada, calculando escenarios y temiendo equivocarte de rumbo o quedarte sin tiempo. Dios es el Señor de tus tiempos: cada día tiene su propio afán y su gracia te acompaña en el presente (Mateo 6:34).",
          "genero-identidad-social": "Has sentido el peso de etiquetas familiares, sociales o de tu historia que intentaron poner un techo a lo que puedes alcanzar. En Cristo esas barreras pierden su poder: tu identidad y llamado provienen del Reino de Dios (Gálatas 3:28)."
        };

        // Compile beliefs results
        const compiled: UserResult[] = [];
        creenciasDatabase.forEach(item => {
          const score = deepDiveAnswers[item.id];
          if (score !== undefined && score > 0) {
            compiled.push({
              ...item,
              category: item.bloque,
              intensity: score
            });
          }
        });

        // Fallback if none got activated
        if (compiled.length === 0) {
          const fallbackBlocks = sortedBlocks.slice(0, 2).map(b => b[0]);
          creenciasDatabase.filter(c => fallbackBlocks.includes(c.bloqueId)).forEach(b => {
            compiled.push({
              ...b,
              category: b.bloque,
              intensity: 1
            });
          });
        }

        // Puntaje compuesto: (screening del bloque x 10) + intensidad de la
        // exploración profunda (1 = a veces, 2 = prácticamente sí).
        const beliefScore = (b: UserResult) =>
          (screeningAnswers[b.bloqueId] || 1) * 10 + (b.intensity || 1);

        compiled.sort((a, b) => beliefScore(b) - beliefScore(a));

        // FIX "siempre la misma creencia": con solo 3 niveles de intensidad,
        // varias creencias empatan en el puntaje máximo y el orden estable del
        // arreglo elegía siempre la primera de la base de datos. Si hay
        // empate en la cima, no se adivina: se le pregunta a la persona.
        const maxScore = compiled.length > 0 ? beliefScore(compiled[0]) : 0;
        const tiedAtTop = compiled.filter(b => beliefScore(b) === maxScore);
        const bonusIsValid =
          tiebreakBonusId !== null && tiedAtTop.some(b => b.id === tiebreakBonusId);
        if (tiedAtTop.length > 1 && !bonusIsValid) {
          // Hasta 6 candidatas, con diversidad de bloques: primero una por
          // bloque distinto y luego se completa con las siguientes empatadas.
          // Así, con un empate entre los 9 bloques, la persona puede elegir
          // una creencia de otro bloque y no solo las 3 primeras de la lista.
          const diverseTied: UserResult[] = [];
          const seenBlocks = new Set<string>();
          for (const b of tiedAtTop) {
            if (diverseTied.length < 3 && !seenBlocks.has(b.bloqueId)) {
              diverseTied.push(b);
              seenBlocks.add(b.bloqueId);
            }
          }
          for (const b of tiedAtTop) {
            if (diverseTied.length >= 6) break;
            if (!diverseTied.includes(b)) diverseTied.push(b);
          }
          setTiebreakCandidates(diverseTied);
          setStep('tiebreak');
          return;
        }
        if (bonusIsValid) {
          compiled.sort((a, b) =>
            (b.id === tiebreakBonusId ? 1 : 0) - (a.id === tiebreakBonusId ? 1 : 0) ||
            beliefScore(b) - beliefScore(a)
          );
        }

        // La introducción empática sigue a la creencia principal elegida,
        // no al primer bloque empatado del screening.
        const primaryBlockId = compiled[0]?.bloqueId || sortedBlocks[0]?.[0] || 'capacidad-identidad';
        setIntroParagraph(intros[primaryBlockId] || intros["capacidad-identidad"]);

        setResults(compiled);

        // Run full 8-phase diagnostic handbook builder
        await triggerDiagnosisGeneration(compiled);
        setStep('results');
      };

      // Set a tiny lag screen to create premium suspension, then compile
      const timer = setTimeout(() => {
        compileAllAndQuery();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, deepDiveAnswers, deepDiveQuestions, screeningAnswers, screeningList]);

  // Compute stats for results screen
  const stats = useMemo(() => {
    return {
      totalToTransform: results.length,
      highPriority: results.filter(r => r.intensity === 2).length,
      focusAreas: new Set(results.map(r => r.bloqueId)).size
    };
  }, [results]);

  // Configurable WhatsApp contact for pastoral accompaniment
  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => {
    return localStorage.getItem('ti_whatsapp_number') || '5491122334455';
  });
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [tempWhatsapp, setTempWhatsapp] = useState(whatsappNumber);

  const handleSaveWhatsapp = () => {
    const cleaned = tempWhatsapp.trim();
    localStorage.setItem('ti_whatsapp_number', cleaned);
    setWhatsappNumber(cleaned);
    setShowWhatsappModal(false);
  };

  // SVG Radar coordinates generator (mobile optimized with center 180 and radius 90 in 360x360 box)
  const radarPoints = useMemo(() => {
    const center = 180;
    const radius = 90;
    const numPoints = screeningList.length;

    return screeningList.map((item, idx) => {
      const score = screeningAnswers[item.id] || 1; // 1 to 5
      const scoreFactor = Math.max(0.2, score / 5);
      const angle = (idx * 2 * Math.PI) / numPoints - Math.PI / 2;
      const x = center + radius * scoreFactor * Math.cos(angle);
      const y = center + radius * scoreFactor * Math.sin(angle);
      
      // Outer boundary points
      const outerX = center + radius * Math.cos(angle);
      const outerY = center + radius * Math.sin(angle);

      // Level 3 threshold ring (0.6 factor = 3/5)
      const level3X = center + radius * 0.6 * Math.cos(angle);
      const level3Y = center + radius * 0.6 * Math.sin(angle);

      const blockInfo = (bloquesDiagnostico as any)[item.id];
      const shortTitle = blockInfo?.shortTitle || item.title;

      return {
        id: item.id,
        label: item.title,
        shortTitle,
        score,
        x,
        y,
        outerX,
        outerY,
        level3X,
        level3Y,
        angle
      };
    });
  }, [screeningAnswers, screeningList]);

  const radarPointsString = useMemo(() => {
    return radarPoints.map(p => `${p.x},${p.y}`).join(' ');
  }, [radarPoints]);

  const radarOuterString = useMemo(() => {
    return radarPoints.map(p => `${p.outerX},${p.outerY}`).join(' ');
  }, [radarPoints]);

  const radarLevel3String = useMemo(() => {
    return radarPoints.map(p => `${p.level3X},${p.level3Y}`).join(' ');
  }, [radarPoints]);

  // Ordered list of 9 blocks from highest to lowest score
  const sortedBlocksWithScores = useMemo(() => {
    return Object.keys(bloquesDiagnostico).map(blockId => {
      const score = screeningAnswers[blockId] || 1;
      const info = (bloquesDiagnostico as any)[blockId];
      return {
        id: blockId,
        title: info?.title || blockId,
        shortTitle: info?.shortTitle || info?.title || blockId,
        score
      };
    }).sort((a, b) => b.score - a.score);
  }, [screeningAnswers]);

  // Dominant blocks (highest score ties)
  const dominantBlocks = useMemo(() => {
    if (sortedBlocksWithScores.length === 0) return [];
    const maxScore = sortedBlocksWithScores[0].score;
    return sortedBlocksWithScores.filter(b => b.score === maxScore);
  }, [sortedBlocksWithScores]);

  // El bloque principal sigue a la creencia principal elegida (results[0]),
  // no al primer bloque empatado del screening: antes, con un empate en el
  // screening, la introducción, la guía práctica y el plan siempre eran de
  // Capacidad e Identidad aunque la creencia detectada fuera de otro bloque.
  const primaryBlock = useMemo(() => {
    if (results.length > 0) {
      const chosen = results[0];
      const info = (bloquesDiagnostico as any)[chosen.bloqueId];
      if (info) {
        return {
          id: chosen.bloqueId,
          title: info.title,
          shortTitle: info.shortTitle,
          score: screeningAnswers[chosen.bloqueId] || 1
        };
      }
    }
    return dominantBlocks[0] || sortedBlocksWithScores[0] || {
      id: 'capacidad-identidad',
      title: 'Capacidad e Identidad',
      shortTitle: 'Capacidad',
      score: 1
    };
  }, [dominantBlocks, sortedBlocksWithScores, results, screeningAnswers]);

  // Nivel de confianza calculado para cada interacción según los 6 factores metodológicos
  const interactionConfidence = useMemo(() => {
    const map: Record<string, ConfidenceEvaluation> = {};
    detectedInteractions.forEach((inter) => {
      const evaluation = evaluateHypothesisConfidence({
        hipotesisTitulo: inter.tag,
        hipotesisDescripcion: inter.hipotesis,
        bloqueId: inter.blockA.id,
        screeningScores: screeningAnswers,
        isUserValidated: false
      });

      let nivel: ConfidenceLevel = evaluation.nivel;

      // Para señales: antes de aplicar la validación, nivel inicial es BAJA si devolvió MODERADA o ALTA
      if (inter.nivel === 'senal' && (nivel === 'MODERADA' || nivel === 'ALTA')) {
        nivel = 'BAJA';
      }

      // Regla de validación: si está validada, sube UN escalón (sin pasar de ALTA)
      if (validatedInteractions[inter.id]) {
        if (nivel === 'INSUFICIENTE') nivel = 'BAJA';
        else if (nivel === 'BAJA') nivel = 'MODERADA';
        else if (nivel === 'MODERADA') nivel = 'ALTA';
      }

      // Tope por nivel de interacción: si es 'senal', el nivel máximo es MODERADA
      if (inter.nivel === 'senal' && nivel === 'ALTA') {
        nivel = 'MODERADA';
      }

      // Si rejectedInteractions[inter.id] es true, baja UN escalón el nivel calculado (ALTA → MODERADA → BAJA → INSUFICIENTE)
      if (rejectedInteractions[inter.id]) {
        if (nivel === 'ALTA') nivel = 'MODERADA';
        else if (nivel === 'MODERADA') nivel = 'BAJA';
        else if (nivel === 'BAJA') nivel = 'INSUFICIENTE';
      }

      map[inter.id] = {
        ...evaluation,
        nivel
      };
    });
    return map;
  }, [detectedInteractions, screeningAnswers, validatedInteractions, rejectedInteractions]);

  // Healthiest / freest areas (score <= 2 or the lowest 3)
  const healthiestBlocks = useMemo(() => {
    const low = sortedBlocksWithScores.filter(b => b.score <= 2);
    if (low.length >= 2) return low;
    return [...sortedBlocksWithScores].reverse().slice(0, 3);
  }, [sortedBlocksWithScores]);

  const severeBlocksCount = useMemo(() => {
    return sortedBlocksWithScores.filter(b => b.score >= 3).length;
  }, [sortedBlocksWithScores]);

  // Toggle Day checklist
  const toggleDayCheck = (dayKey: string) => {
    setCompletedDays(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  // PDF Devotional exporter
  const handleExportPDF = () => {
    const levelsMap: Record<string, string> = {};
    Object.entries(interactionConfidence).forEach(([id, conf]) => {
      levelsMap[id] = (conf as ConfidenceEvaluation).nivel;
    });
    downloadPDFResults(
      userName,
      userEmail,
      aiDiagnosis,
      results,
      journalNotes,
      levelsMap,
      stageSummary,
      detectedInteractions,
      rejectedInteractions
    );
  };

  return (
    <div id="app-container" className="min-h-screen bg-[#0A0A0A] text-[#F3F4F6] selection:bg-[#C9A84C]/30 selection:text-[#C9A84C] py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500">
      
      {/* Absolute elegant particle overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,168,76,0.12),rgba(0,0,0,0))] pointer-events-none" />

      {/* Floating Notifications: XP and Achievements (Top-Right) */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {xpNotification && (
            <motion.div
              key="xp-notification-toast"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-auto bg-[#141414]/95 border border-[#C9A84C]/60 text-white px-4 py-2.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center gap-2.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse flex-shrink-0" />
              <span className="text-xs font-mono text-white/90">
                <strong className="text-[#C9A84C] font-bold">+{xpNotification.xp} puntos</strong> · {xpNotification.label}
              </span>
            </motion.div>
          )}

          {newAchievementAlert && (
            <motion.div
              key="achievement-alert-toast"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-auto bg-[#141414]/95 border border-[#C9A84C] text-white p-3.5 rounded-xl shadow-[0_4px_25px_rgba(201,168,76,0.25)] backdrop-blur-md space-y-1"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A84C] animate-pulse flex-shrink-0" />
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#C9A84C]">
                  {newAchievementAlert.name}
                </span>
              </div>
              <p className="text-xs text-white/80 font-sans pl-6">
                {newAchievementAlert.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${step === 'welcome' ? 'max-w-6xl' : 'max-w-4xl'} mx-auto bg-[#121212]/90 border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden relative backdrop-blur-md transition-all duration-500`}
      >
        
        {/* Cinematic Header */}
        {step !== 'welcome' && (
          <header id="main-header" className="relative border-b border-white/5 bg-gradient-to-b from-[#181818] to-[#121212] p-8 text-center">
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-xs text-[#C9A84C] font-semibold tracking-wide">
              <Flame className="w-3.5 h-3.5 text-[#C9A84C] animate-pulse" />
              <span>Mapeo Cognitivo Frecuente</span>
            </div>

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-[#C9A84C] mt-4 mb-2 filter drop-shadow-[0_2px_10px_rgba(201,168,76,0.15)]"
            >
              Transformación Interior
            </motion.h1>
            <p className="text-sm font-serif italic text-white/60 max-w-lg mx-auto leading-relaxed">
              "Transformaos por medio de la renovación de vuestro entendimiento, comprobando la buena de Dios..." — Romanos 12:2
            </p>

            {/* Stepper progress indicator */}
            {step !== 'welcome' && (
              <div className="mt-8 relative max-w-md mx-auto">
                <div className="flex justify-between text-xs text-white/40 mb-2 font-mono">
                  <span>Rastreo Integral</span>
                  <span>
                    {step === 'screening' && ` Screening: ${Object.keys(screeningAnswers).length} / 9`}
                    {step === 'calculating_blocks' && `Calculando activación`}
                    {step === 'deep_dive' && `Profundización: ${deepDiveIndex + 1} / ${deepDiveQuestions.length}`}
                    {step === 'heart_stages' && `Exploración: ${stageIndex + 1} / 4`}
                    {step === 'validation' && `Validación: ${validationIndex + 1} / ${validationTargets.length}`}
                    {step === 'stage_transition' && 'Etapa completada'}
                    {step === 'results' && 'Tu mapa de exploración'}
                  </span>
                </div>
                <div id="progress-track" className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#C9A84C] to-yellow-600 shadow-[0_0_8px_#C9A84C]"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${
                        step === 'screening' ? (Object.keys(screeningAnswers).length / 9) * 100 :
                        step === 'calculating_blocks' ? 50 :
                        step === 'deep_dive' ? (50 + ((deepDiveIndex + 1) / deepDiveQuestions.length) * 50) :
                        step === 'heart_stages' ? 90 :
                        step === 'validation' ? 95 :
                        step === 'stage_transition' ? (transitionFrom === 1 ? 50 : transitionFrom === 2 ? 85 : 92) :
                        step === 'generating_results' ? 98 : 100
                      }%` 
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </header>
        )}

        {/* Dynamic Wizard Steps */}
        <main id="main-content" className="p-6 sm:p-10 relative">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: WELCOME */}
            {step === 'welcome' && (
              <motion.div
                key="welcome-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 max-w-2xl mx-auto"
              >
                {/* Encabezado */}
                <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-white/5 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A84C] to-yellow-600 flex items-center justify-center text-[#0D0D0D] shadow-lg shadow-[#C9A84C]/10">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.2em] font-mono text-[#C9A84C]/80 uppercase block font-semibold">Plataforma de Crecimiento</span>
                      <h2 className="text-lg font-bold text-white tracking-tight -mt-0.5">Transformación Interior</h2>
                    </div>
                  </div>
                  <p className="text-xs font-serif italic text-white/50 max-w-sm text-center sm:text-right">
                    "Transformaos por medio de la renovación de vuestro entendimiento..."
                    <span className="block not-italic font-mono text-[9px] uppercase font-bold text-[#C9A84C] mt-0.5">— Romanos 12:2</span>
                  </p>
                </div>

                {/* Qué es y qué recibes */}
                <div className="text-center space-y-4">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
                    ¿Qué te detiene?
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light max-w-xl mx-auto">
                    Un autoexamen para encontrar las creencias limitantes que dirigen tus decisiones. Al final recibirás tu creencia principal y un plan para romperla y vivir redimido.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-[#C9A84C]" /> 8 a 12 minutos
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                      <Lock className="w-3.5 h-3.5 text-[#C9A84C]" /> Respuestas privadas
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                      <BookOpen className="w-3.5 h-3.5 text-[#C9A84C]" /> Con base bíblica
                    </span>
                  </div>
                  <p className="text-xs text-white/50 italic font-serif max-w-xl mx-auto">
                    Esto no te pone una etiqueta: te ayuda a entender cómo interpretas lo que vives.
                  </p>
                </div>

                {/* Formulario de inicio */}
                <form
                  id="gate-form"
                  onSubmit={handleStartScreening}
                  className="bg-[#161616]/90 border border-[#C9A84C]/25 p-6 sm:p-7 rounded-[24px] shadow-2xl relative overflow-hidden space-y-6"
                >
                  <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-[#C9A84C]/10 blur-2xl pointer-events-none" />

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white tracking-tight">Empieza tu autoexamen</h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Tus datos solo personalizan tu resultado.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#C9A84C] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Nombre o Pseudónimo
                      </label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Ej. María o Samuel"
                        className="w-full bg-[#202020] border border-white/5 rounded-xl pl-4 pr-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] text-white transition-all focus:bg-[#252525] placeholder:text-white/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-[#C9A84C] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Correo Electrónico
                      </label>
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="w-full bg-[#202020] border border-white/5 rounded-xl pl-4 pr-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] text-white transition-all focus:bg-[#252525] placeholder:text-white/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-[#C9A84C] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Edad
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="120"
                        value={userAge}
                        onChange={(e) => setUserAge(e.target.value)}
                        placeholder="Años"
                        className="w-full bg-[#202020] border border-white/5 rounded-xl pl-4 pr-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] text-white transition-all focus:bg-[#252525]"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-[#202020]/20 p-3.5 rounded-xl border border-white/5">
                    <input
                      type="checkbox"
                      id="opt-terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 cursor-pointer accent-[#C9A84C] rounded border-white/10"
                    />
                    <label htmlFor="opt-terms" className="text-[11px] text-white/45 leading-normal cursor-pointer select-none">
                      Acepto que mis respuestas se guarden solo en mi dispositivo para mi autoexamen.
                    </label>
                  </div>

                  <button
                    type="submit"
                    id="btn-gate-start"
                    disabled={!acceptedTerms}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-[#C9A84C] to-yellow-600 disabled:from-gray-700 disabled:to-gray-800 disabled:text-white/40 disabled:pointer-events-none text-[#0D0D0D] font-bold py-4 px-6 rounded-xl hover:shadow-[0_0_25px_rgba(201,168,76,0.35)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="relative z-10 text-sm tracking-wide">Comenzar mi autoexamen</span>
                    <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  {SHOW_TEST_TOOLS && (
                    <button
                      type="button"
                      onClick={handleLoadSimulatedCase19}
                      className="w-full bg-[#181818] hover:bg-[#222222] border border-[#C9A84C]/40 text-[#C9A84C] font-mono text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>PROBAR CASO REAL SIMULADO (Control 5, Tiempo 5)</span>
                    </button>
                  )}

                  <p className="text-center text-white/35 text-[10px] font-mono uppercase tracking-wider">
                    🔒 Privacidad total y cifrado local
                  </p>
                </form>
              </motion.div>
            )}

            {/* STEP 2: SCREENING (CAPA 1) - LA EXPEDICIÓN DEL TERRITORIO INTERIOR */}
            {step === 'screening' && (
              USE_GUIDED_FLOW ? (
                <GuidedExplorationFlow
                  mode="screening"
                  bloquesDiagnostico={bloquesDiagnostico}
                  currentSelectedRegion={currentSelectedRegion}
                  screeningAnswers={screeningAnswers}
                  isAnswering={isAnswering}
                  answeringFeedback={answeringFeedback}
                  userXp={userXp}
                  getExploradorLevel={getExploradorLevel}
                  onAnswer={handleMapRegionAnswer}
                  onContinue={handleContinueScreening}
                  onSelectRegion={(id) => {
                    setCurrentSelectedRegion(id);
                    setIsAnswering(false);
                    setAnsweringFeedback('');
                    setEmergingPattern('');
                  }}
                  emergingPattern={emergingPattern}
                />
              ) : (
                <motion.div
                  key="screening-pane"
                  initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6 max-w-6xl mx-auto"
              >
                {/* Adventure Top HUD bar */}
                <div className="bg-[#121212]/95 border border-[#C9A84C]/25 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#C9A84C]/5 to-transparent pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A84C] to-yellow-600 text-black flex items-center justify-center font-bold text-xl shadow-lg font-mono">
                      {getExploradorLevel(userXp).lvl}
                    </div>
                    <div>
                      <h4 className="text-white text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Etapa de exploración</h4>
                      <p className="text-[#C9A84C] font-semibold text-sm font-sans flex items-center gap-1.5">{getExploradorLevel(userXp).title}</p>
                    </div>
                  </div>
                  
                  {/* XP Progress Bar */}
                  <div className="w-full sm:w-64 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-white/40 font-bold">
                      <span>{userXp} / {getExploradorLevel(userXp).nextXp} puntos</span>
                      <span>Explorado: {Object.keys(screeningAnswers).length}/9 regiones</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-yellow-600 to-[#C9A84C] h-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (userXp / getExploradorLevel(userXp).nextXp) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#1C1C1C] border border-white/5 px-4 py-2 rounded-xl">
                    <Flame className="w-4 h-4 text-amber-500 animate-pulse fill-amber-500/10" />
                    <span className="text-xs font-bold text-white/90 font-mono">Fase 1: Mapeo</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left-ish Panel: The 9 Regions Interactive Constellation (Col-span 7) */}
                  <div className="lg:col-span-7 bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
                    {/* Atmospheric lines drawing or abstract pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,rgba(0,0,0,0)_80%)] pointer-events-none" />
                    
                    <div className="space-y-1 relative z-10">
                      <span className="text-[10px] tracking-[0.2em] font-mono text-[#C9A84C] uppercase block font-bold">Planisferio Mental</span>
                      <h3 className="text-lg font-bold text-white tracking-tight">El Trazado de las 9 Regiones</h3>
                      <p className="text-xs text-white/50">Haz clic en cualquier región para descifrar la fortaleza de mentira y cimentar la verdad de filiación.</p>
                    </div>

                    {/* Constellation Nodes Grid */}
                    <div className="grid grid-cols-3 gap-3 relative z-10 py-4">
                      {[
                        { id: 'capacidad-identidad', title: 'Capacidad & Identidad', icon: Brain, desc: 'Duda sobre valor innato.' },
                        { id: 'merecimiento-vinculo', title: 'Merecimiento & Vínculo', icon: Heart, desc: 'Terror al rechazo imprevisto.' },
                        { id: 'control-entorno', title: 'Control del Entorno', icon: Shield, desc: 'Lucha por dominar el mañana.' },
                        { id: 'rendimiento-logro', title: 'Rendimiento & Logro', icon: Activity, desc: 'Medir el alma por obras.' },
                        { id: 'relaciones-poder', title: 'Relaciones & Poder', icon: Users, desc: 'Falta de límites por pánico.' },
                        { id: 'cuerpo-salud', title: 'Cuerpo & Descanso', icon: Flame, desc: 'Culpa asociada al ocio sacro.' },
                        { id: 'espiritualidad-trascendencia', title: 'Espiritualidad', icon: Sparkles, desc: 'Cercanía paternal divina.' },
                        { id: 'tiempo-futuro', title: 'Tiempo & Futuro', icon: Clock, desc: 'Pánico a la irreversible elección.' },
                        { id: 'genero-identidad-social', title: 'Linaje & Origen', icon: Briefcase, desc: 'Condición social de cuna.' }
                      ].map((reg, idx) => {
                        const score = screeningAnswers[reg.id];
                        const isSelected = currentSelectedRegion === reg.id;
                        const isCompleted = score !== undefined;
                        
                        const IconComponent = reg.icon;

                        return (
                          <div 
                            key={reg.id}
                            onClick={() => {
                              setCurrentSelectedRegion(reg.id);
                              setIsAnswering(false);
                              setAnsweringFeedback('');
                            }}
                            className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer flex flex-col justify-between min-h-[110px] ${
                              isSelected 
                                ? 'bg-[#C9A84C]/10 border-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.15)] ring-1 ring-[#C9A84C]/30' 
                                : isCompleted
                                ? 'bg-[#181818] border-emerald-500/30 hover:border-emerald-500/60'
                                : 'bg-[#161616] border-white/5 hover:border-white/10 hover:bg-[#1A1A1A]'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className={`p-2 rounded-xl transition-all ${
                                isSelected 
                                  ? 'bg-[#C9A84C]/20 text-[#C9A84C]' 
                                  : isCompleted
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-white/5 text-white/40'
                              }`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] uppercase font-mono font-bold text-white/25">Z-{idx+1}</span>
                            </div>

                            <div className="space-y-0.5 mt-2">
                              <h4 className="text-[11px] font-bold text-white leading-tight font-sans tracking-tight">Región {idx + 1}</h4>
                              <p className="text-[9px] text-white/40 line-clamp-1">Área por explorar</p>
                            </div>

                            {/* Node Status Badge */}
                            <div className="mt-1 pb-0.5 flex items-center justify-between">
                              <span className={`text-[8px] uppercase font-mono font-semibold tracking-wider flex items-center gap-1 ${
                                isCompleted ? 'text-emerald-400' : 'text-amber-500/85'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-amber-500 animate-pulse'}`} />
                                {isCompleted ? 'Explorado' : 'Neblina'}
                              </span>
                              {isCompleted && (
                                <span className="text-[9px] font-mono font-bold text-[#C9A84C] bg-[#C9A84C]/15 border border-[#C9A84C]/15 px-1.5 rounded">
                                  {score}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1.5 border-t border-white/5 pt-4 text-[10px] text-white/40 font-mono uppercase">
                      <Info className="w-3.5 h-3.5 text-[#C9A84C]" />
                      <span>Completa las 9 regiones para develar las puertas del inconsciente.</span>
                    </div>
                  </div>

                  {/* Right Panel: The Quest details and options (Col-span 5) */}
                  <div className="lg:col-span-5 bg-[#161616] border border-[#C9A84C]/25 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
                    {/* Ambient light inside card */}
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#C9A84C]/5 blur-2xl pointer-events-none" />

                    <div className="space-y-4">
                      {/* Active region head */}
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C]">
                          {(() => {
                            const keys = Object.keys(bloquesDiagnostico);
                            const activeIndex = keys.indexOf(currentSelectedRegion);
                            return <span className="text-xs font-bold font-mono">ZONA {activeIndex !== -1 ? activeIndex + 1 : 1}</span>;
                          })()}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[#C9A84C] uppercase tracking-widest font-semibold block">Rastreo de Activación</span>
                        </div>
                      </div>

                      {/* Companion speech bubble inside panel to guide them */}
                      <div className="bg-[#101010] border border-white/5 p-4 rounded-2xl flex gap-3 items-start relative">
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C9A84C] animate-ping" />
                        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 flex items-center justify-center text-[#C9A84C] flex-shrink-0 mt-0.5">
                          <Heart className="w-4 h-4 text-[#C9A84C]" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-mono tracking-wider text-[#C9A84C] font-bold">Consejería del Territorio</span>
                          <p className="text-xs text-white/80 italic leading-relaxed font-sans">
                            Responde con honestidad, {userName}: ¿cuánto resuena contigo esta afirmación?
                          </p>
                        </div>
                      </div>

                      {/* Diagnostic Phrase display board */}
                      <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl relative overflow-hidden text-center space-y-1.5 min-h-[90px] flex flex-col justify-center">
                        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
                        <span className="text-[9px] uppercase font-mono text-white/30 tracking-widest font-semibold block">Determinación de Resonancia</span>
                        <p className="text-sm sm:text-base text-white font-medium leading-relaxed font-sans italic">
                          "{bloquesDiagnostico[currentSelectedRegion as keyof typeof bloquesDiagnostico]?.screeningPhrase}"
                        </p>
                      </div>
                    </div>

                    {/* Likert Selection */}
                    <div className="space-y-4">
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block ml-1 font-bold">¿Cuánto resuena contigo?</span>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { val: 1, desc: 'Nunca' },
                            { val: 2, desc: 'Rara vez' },
                            { val: 3, desc: 'A veces' },
                            { val: 4, desc: 'A menudo' },
                            { val: 5, desc: 'Total' }
                          ].map((opt) => {
                            const currentScore = screeningAnswers[currentSelectedRegion];
                            const isSelectedOption = currentScore === opt.val;
                            
                            return (
                              <button
                                key={opt.val}
                                id={`likert-btn-${opt.val}`}
                                type="button"
                                onClick={() => handleMapRegionAnswer(currentSelectedRegion, opt.val)}
                                className={`py-3 px-1 rounded-xl text-center group transition-all duration-200 cursor-pointer border ${
                                  isSelectedOption
                                    ? 'bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C] font-bold shadow-[0_0_10px_rgba(201,168,76,0.25)] scale-[1.03]'
                                    : 'bg-[#1C1C1C] border-white/5 hover:border-[#C9A84C]/35 hover:bg-[#C9A84C]/5 text-white'
                                }`}
                              >
                                <span className={`block text-sm font-bold leading-none mb-1 ${
                                  isSelectedOption ? 'text-[#0A0A0A]' : 'text-white/40 group-hover:text-[#C9A84C]'
                                }`}>{opt.val}</span>
                                <span className="block text-[8px] font-bold tracking-tight uppercase leading-none opacity-80">{opt.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-white/30 px-1 mt-1">
                          <span>← No resuena</span>
                          <span>Resuena de lleno →</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isAnswering && answeringFeedback && (
                          <motion.div
                            key="counseling-feedback-box"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="space-y-3"
                          >
                            <div className="bg-[#1C1C1C]/90 border border-[#C9A84C]/35 p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center relative overflow-hidden shadow-2xl">
                              <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 flex items-center justify-center text-[#C9A84C]">
                                <Sparkles className="w-4 h-4 text-[#C9A84C] animate-pulse" />
                              </div>
                              <p className="text-xs sm:text-sm text-white italic leading-relaxed px-1 whitespace-pre-line">
                                "{answeringFeedback}"
                              </p>
                            </div>

                            <button
                              type="button"
                              id="screening-btn-continue"
                              onClick={handleContinueScreening}
                              className="w-full bg-gradient-to-r from-[#C9A84C] to-yellow-600 hover:from-[#d8b556] hover:to-yellow-500 text-[#0D0D0D] font-bold py-3.5 px-5 rounded-xl transition-all shadow-[0_0_15px_rgba(201,168,76,0.25)] flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wider font-mono hover:scale-[1.01] active:scale-95"
                            >
                              <span>CONTINUAR →</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Navigation inside card */}
                    <div className="flex justify-between items-center pt-2 border-t border-white/5 relative z-10">
                      <button 
                        onClick={() => {
                          const keys = Object.keys(bloquesDiagnostico);
                          const currentIndex = keys.indexOf(currentSelectedRegion);
                          setIsAnswering(false);
                          setAnsweringFeedback('');
                          if (currentIndex > 0) {
                            setCurrentSelectedRegion(keys[currentIndex - 1]);
                          } else {
                            setStep('welcome');
                          }
                        }}
                        className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Atrás
                      </button>

                      <span className="text-[10px] font-mono text-white/25 uppercase font-bold">
                        Zona {Object.keys(screeningAnswers).length} de 9 Cartografiadas
                      </span>
                    </div>

                  </div>
                </div>
              </motion.div>
              )
            )}

            {/* STEP 3: INTERMEDIATE CALCULATING PROGRESS */}
            {step === 'calculating_blocks' && (
              <motion.div
                key="calculating-pane"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 space-y-6"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" />
                  <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-[#C9A84C] animate-spin" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-display text-white">Mapeando Fortalezas Cognitivas...</h3>
                  <p className="text-white/60 text-sm max-w-sm mx-auto leading-relaxed">
                    Analizando patrones de screening e identificando tus sectores de mayor vulnerabilidad de creencia.
                  </p>
                </div>

                <div className="text-xs text-[#C9A84C]/70 font-mono italic">
                  Entramando verdades eternas de reconciliación...
                </div>
              </motion.div>
            )}

            {/* STEP 4: DEEP DIVE (CAPA 2) - EL DESCENSO DE DESCUBRIMIENTO */}
            {step === 'deep_dive' && (
              USE_GUIDED_FLOW ? (
                <GuidedExplorationFlow
                  mode="deepDive"
                  deepDiveQuestions={deepDiveQuestions}
                  deepDiveIndex={deepDiveIndex}
                  deepDiveAnswers={deepDiveAnswers}
                  isAnswering={isAnswering}
                  answeringFeedback={answeringFeedback}
                  userXp={userXp}
                  getExploradorLevel={getExploradorLevel}
                  onAnswer={handleDeepDiveAnswer}
                  onContinue={handleContinueDeepDive}
                  onBack={handleDeepDiveBack}
                  reflectionKey="deep-dive-start"
                  reflectionPrompt={deepDiveIndex === 0 ? 'Antes de empezar: piensa en una situación concreta de las últimas semanas que te haya generado presión. Tenla presente mientras lees cada afirmación.' : undefined}
                />
              ) : (
                <motion.div
                  key="deep-dive-pane"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6 max-w-6xl mx-auto"
                >
                {/* Descenso Top HUD Bar */}
                <div className="bg-[#121212]/95 border border-[#C9A84C]/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-2 h-full bg-[#C9A84C]/80" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-950/45 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold text-lg font-mono">
                      {getExploradorLevel(userXp).lvl}
                    </div>
                    <div>
                      <h4 className="text-white text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Nivel de Descenso</h4>
                      <p className="text-[#C9A84C] font-semibold text-xs font-sans">Sondeando Creencias Sepultadas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Progress indicators */}
                    <div className="text-right font-mono">
                      <span className="text-white/40 text-[10px] block font-bold uppercase">Pregunta Activa</span>
                      <span className="text-white font-bold text-xs">Afirmación {deepDiveIndex + 1} de {deepDiveQuestions.length}</span>
                    </div>
                    <div className="h-8 w-[1px] bg-white/10" />
                    <div className="text-right font-mono">
                      <span className="text-white/40 text-[10px] block font-bold uppercase">Exploración</span>
                      <span className="text-[#C9A84C] font-bold text-xs">En curso</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column (Col-span 8): Active Quest Affirmation & Heart Dial (Tri-State buttons) */}
                  <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                    
                    {/* Primary Affirmation Board */}
                    <div className="bg-[#121212] border border-white/5 p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl flex-grow flex flex-col justify-center text-center space-y-4">
                      {/* Ambient background glow */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.04)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
                      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A84C]/25 to-transparent" />
                      
                      <span className="text-white/30 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold block">La Voz del Inconsciente</span>
                      
                      <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-relaxed max-w-2xl mx-auto italic font-sans py-4">
                        "{deepDiveQuestions[deepDiveIndex]?.afirmacionTest}"
                      </h3>

                    </div>

                    {/* Highly Stylized Heart Dial responses */}
                    <div className="bg-[#121212] border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/35 block ml-1 font-bold">Graduación en tu Espíritu</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { score: 2, id: 'deep-dive-yes', title: 'Prácticamente Sí', desc: 'Siento total y constante afinidad' },
                          { score: 1, id: 'deep-dive-sometimes', title: 'A veces', desc: 'Ocurre de manera intermitente' },
                          { score: 0, id: 'deep-dive-no', title: 'En absoluto', desc: 'No coincide ni resuena conmigo' }
                        ].map((opt) => {
                          const currentScore = deepDiveAnswers[deepDiveQuestions[deepDiveIndex]?.id];
                          const isSelected = isAnswering && currentScore === opt.score;

                          return (
                            <button
                              key={opt.id}
                              id={opt.id}
                              type="button"
                              onClick={() => handleDeepDiveAnswer(opt.score)}
                              className={`p-4 rounded-xl text-center transition-all cursor-pointer flex flex-col justify-center items-center min-h-[70px] border ${
                                isSelected
                                  ? 'bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C] font-bold shadow-[0_0_15px_rgba(201,168,76,0.3)] scale-[1.02]'
                                  : opt.score === 2
                                  ? 'bg-[#C9A84C]/15 border-[#C9A84C]/35 text-[#C9A84C] hover:bg-[#C9A84C]/25'
                                  : opt.score === 1
                                  ? 'bg-[#1C1C1C] border-white/10 text-white hover:border-[#C9A84C]/50'
                                  : 'bg-[#161616] border-white/5 text-white/60 hover:text-white hover:border-red-500/30'
                              }`}
                            >
                              <span className={`text-sm font-extrabold tracking-wide uppercase ${isSelected ? 'text-[#0A0A0A]' : ''}`}>
                                {opt.title}
                              </span>
                              <span className={`text-[9px] block ${isSelected ? 'text-black/80 font-semibold' : 'text-white/50'}`}>
                                {opt.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <AnimatePresence>
                        {isAnswering && answeringFeedback && (
                          <motion.div
                            key="deep-dive-feedback-box"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="space-y-3 pt-2"
                          >
                            <div className="bg-[#1C1C1C]/95 border border-[#C9A84C]/35 p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center relative overflow-hidden shadow-2xl">
                              <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 flex items-center justify-center text-[#C9A84C]">
                                <Activity className="w-4 h-4 text-[#C9A84C] animate-pulse" />
                              </div>
                              <p className="text-xs sm:text-sm text-white italic leading-relaxed px-2 font-sans whitespace-pre-line">
                                "{answeringFeedback}"
                              </p>
                              <span className="text-[10px] text-[#C9A84C] font-mono flex items-center gap-1.5 animate-pulse uppercase tracking-wider font-semibold">
                                <Sparkles className="w-3.5 h-3.5" /> Reconfigurando redes neuronales del espíritu...
                              </span>
                            </div>

                            <button
                              type="button"
                              id="deep-dive-btn-continue"
                              onClick={handleContinueDeepDive}
                              className="w-full bg-gradient-to-r from-[#C9A84C] to-yellow-600 hover:from-[#d8b556] hover:to-yellow-500 text-[#0D0D0D] font-bold py-3.5 px-5 rounded-xl transition-all shadow-[0_0_15px_rgba(201,168,76,0.25)] flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wider font-mono hover:scale-[1.01] active:scale-95"
                            >
                              <span>CONTINUAR →</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                  {/* Right Column (Col-span 4): Pastoral Advisor & Blocks tracking ladder */}
                  <div className="lg:col-span-4 bg-[#141414] border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
                    
                    <div className="space-y-6">
                      
                      {/* Speech speech Advisor */}
                      <div className="bg-[#101010] border border-white/5 p-4 rounded-2xl flex gap-3 items-start relative">
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] flex-shrink-0 mt-0.5">
                          <BookOpen className="w-4 h-4 text-[#C9A84C]" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-mono tracking-wider text-[#C9A84C] font-bold">Consejero de Combate</span>
                          <p className="text-xs text-white/70 italic leading-relaxed font-sans">
                            "Mide tus pensamientos a la luz de esta afirmación. No te culpes; solo detectemos el nudo para traer libertad."
                          </p>
                        </div>
                      </div>

                      {/* Descent checklist tracking */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-white/30 block ml-0.5 font-bold">Sendero del Descenso</span>
                        
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {activeBlocks.map((blockId, idx) => {
                            const isCurrent = deepDiveQuestions[deepDiveIndex]?.bloqueId === blockId;
                            
                            // Check if this block questions have been answered or are being answered
                            // All questions for this block that have index < deepDiveIndex
                            const blockQuestions = deepDiveQuestions.filter(q => q.bloqueId === blockId);
                            const isCompleted = blockQuestions.every(q => {
                              const qIndex = deepDiveQuestions.findIndex(x => x.id === q.id);
                              return qIndex < deepDiveIndex;
                            });

                            return (
                              <div 
                                key={blockId}
                                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                                  isCurrent 
                                    ? 'bg-[#C9A84C]/10 border-[#C9A84C] shadow-md shadow-[#C9A84C]/5' 
                                    : isCompleted
                                    ? 'bg-emerald-900/10 border-emerald-500/20 opacity-70'
                                    : 'bg-[#181818]/40 border-white/5 opacity-40'
                                }`}
                              >
                                {isCompleted ? (
                                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs">
                                    ✓
                                  </div>
                                ) : isCurrent ? (
                                  <div className="w-5 h-5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C] text-[10px] font-bold font-mono animate-pulse">
                                    {idx + 1}
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/30 text-[10px] font-bold font-mono">
                                    {idx + 1}
                                  </div>
                                )}
                                <div className="space-y-0.5">
                                  <h5 className="text-[11px] font-bold text-white font-sans">Sector {idx + 1}</h5>
                                  <span className="text-[8px] uppercase font-mono tracking-wider text-white/35 block font-bold">
                                    {isCompleted ? 'Derrumbado' : isCurrent ? 'Sondeando...' : 'Bloqueado'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      {/* Back Button */}
                      <button 
                        onClick={handleDeepDiveBack}
                        className="flex items-center gap-1 text-white/45 hover:text-white text-xs transition-colors cursor-pointer font-bold font-mono"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Atrás
                      </button>
                      
                      <span className="text-[9px] font-mono text-white/20 uppercase font-bold">
                        Capa 2 • Expedición Interior
                      </span>
                    </div>

                  </div>

                </div>
              </motion.div>
              )
            )}

            {/* STEP 4.5: HEART STAGES (ETAPAS 03-06: LO QUE BUSCAS, TEMES, CÓMO TE PROTEGES, LO QUE PRODUCE) */}
            {step === 'heart_stages' && (
              <GuidedExplorationFlow
                mode="stage"
                stageQuestion={HEART_STAGE_QUESTIONS[stageIndex]}
                selectedOptions={stageAnswers[HEART_STAGE_QUESTIONS[stageIndex]?.id] || []}
                userXp={userXp}
                getExploradorLevel={getExploradorLevel}
                onToggleOption={handleToggleStageOption}
                onContinue={handleContinueStage}
                onBack={handleStageBack}
                reflectionKey={`stage-${HEART_STAGE_QUESTIONS[stageIndex]?.id}`}
                reflectionPrompt={
                  HEART_STAGE_QUESTIONS[stageIndex]?.id === 'busca'
                    ? 'Piensa en una situación real de esta última semana en la que sentiste que debías sostenerlo todo. ¿Qué había en juego para ti?'
                    : HEART_STAGE_QUESTIONS[stageIndex]?.id === 'teme'
                    ? 'Vuelve a esa misma situación: si todo hubiera salido mal, ¿qué habría sido lo más difícil para ti?'
                    : undefined
                }
              />
            )}

            {/* STEP 4.55: CIERRE DE ETAPA CON MICRO-INSIGHT (FASE 4A) */}
            {step === 'stage_transition' && (
              <GuidedExplorationFlow
                mode="transition"
                transitionLabel={
                  transitionFrom === 1 ? 'ETAPA 01 COMPLETADA · LO QUE HACES'
                  : transitionFrom === 2 ? 'ETAPA 02 COMPLETADA · LO QUE PIENSAS'
                  : 'ETAPA 06 COMPLETADA · LO QUE ESTO PRODUCE'
                }
                transitionInsight={getStageInsight(transitionFrom)}
                transitionNext={
                  transitionFrom === 1 ? 'Siguiente: 02 · Lo que piensas'
                  : transitionFrom === 2 ? 'Siguiente: 03 · Lo que buscas'
                  : validationTargets.length > 0 ? 'Siguiente: 07 · Lo que necesitamos explorar'
                  : 'Siguiente: Tu mapa de exploración'
                }
                userXp={userXp}
                getExploradorLevel={getExploradorLevel}
                onContinue={handleContinueTransition}
              />
            )}

            {/* STEP 4.6: VALIDATION (ETAPA 07: VALIDACIÓN ANTES DE LOS RESULTADOS) */}
            {step === 'validation' && validationTargets[validationIndex] && (
              <GuidedExplorationFlow
                mode="validation"
                validationTarget={validationTargets[validationIndex]}
                validationIndex={validationIndex}
                validationTotal={validationTargets.length}
                selectedValidationOption={validationAnswers[validationTargets[validationIndex].id]}
                userXp={userXp}
                getExploradorLevel={getExploradorLevel}
                onAnswerValidation={(option) => handleAnswerValidation(validationTargets[validationIndex].id, option)}
                onContinue={handleContinueValidation}
                onBack={handleValidationBack}
              />
            )}

            {/* STEP 5: INTERMEDIATE CALC RESULTS */}
            {step === 'generating_results' && (
              <motion.div
                key="generating-pane"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 space-y-6"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10 animate-ping" />
                  <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-emerald-500 animate-spin" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-display text-white">Reescribiendo Identidad...</h3>
                  <p className="text-white/60 text-sm max-w-sm mx-auto">
                    Contrastando respuestas con bases neurobiológicas y consolando el alma con verdades eternas en Cristo.
                  </p>
                </div>

                <div className="text-xs text-emerald-400 font-mono italic animate-pulse">
                  Uniendo ciencia y espíritu. Sintonizando respuestas...
                </div>
              </motion.div>
            )}

            {/* PASO DE DESEMPATE: varias creencias empataron en el puntaje máximo.
                La app no elige por orden de lista: la persona elige cuál le describe mejor. */}
            {step === 'tiebreak' && (
              <motion.div
                key="tiebreak-pane"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto py-10 space-y-6"
              >
                <div className="text-center space-y-3">
                  <span className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.2em] font-semibold block">
                    Última pregunta antes de tu resultado
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    Varias creencias resonaron con la misma fuerza
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed max-w-lg mx-auto">
                    Tus respuestas apuntan con igual intensidad a más de una creencia.
                    Para que tu resultado sea realmente tuyo, dime cuál de estas
                    afirmaciones te describe mejor hoy:
                  </p>
                </div>

                <div className="space-y-3">
                  {tiebreakCandidates.map((candidate) => (
                    <button
                      key={candidate.id}
                      onClick={() => chooseTiebreakBelief(candidate.id)}
                      className="w-full text-left bg-[#161616] hover:bg-[#1E1E1E] border border-white/10 hover:border-[#C9A84C]/50 p-5 rounded-2xl transition-all cursor-pointer space-y-2"
                    >
                      <span className="text-white/60 text-sm italic leading-relaxed block">
                        “{candidate.afirmacionTest}”
                      </span>
                      <span className="text-[#C9A84C] text-xs font-bold block pt-1">
                        Esta es la que más me describe →
                      </span>
                    </button>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => tiebreakCandidates.length > 0 && chooseTiebreakBelief(tiebreakCandidates[0].id)}
                    className="text-[11px] text-white/40 hover:text-white/70 underline cursor-pointer"
                  >
                    No estoy seguro/a, elige por mí
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 6: CLINICAL & DEVOTIONAL RESULTS DETAILED */}
            {step === 'results' && !isUnveiled && (
              <motion.div
                key="unveiling-ceremony"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto py-12 text-center space-y-8 relative"
              >
                {/* Ancient radiant watermarks */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(201,168,76,0.08),rgba(0,0,0,0))] pointer-events-none" />

                <div className="space-y-4">
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/35"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <Sparkles className="w-10 h-10 text-[#C9A84C] drop-shadow-[0_0_15px_#C9A84C]" />
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                    Tu mapa de exploración está listo
                  </h2>
                </div>

                <div className="bg-[#141414] border border-[#C9A84C]/25 p-8 sm:p-10 rounded-3xl relative overflow-hidden space-y-6 shadow-2xl text-left border-dashed">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C9A84C]/5 to-transparent pointer-events-none rounded-bl-full" />
                  
                  <div className="space-y-4 font-sans text-white/80 leading-relaxed text-sm sm:text-base">
                    <p>
                      Querido/a <strong className="text-white font-semibold font-display text-lg">{userName}</strong>,
                    </p>
                    <p>
                      A continuación verás lo que muestran tus respuestas: las áreas donde hay más tensión, algunos patrones posibles y preguntas para seguir explorando. No es un diagnóstico ni una etiqueta; es un punto de partida para reflexionar, conversar con tu consejero y buscar dirección en la Palabra de Dios.
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4 text-center">
                    <p className="font-serif italic text-xs sm:text-sm text-[#C9A84C] max-w-md mx-auto leading-relaxed">
                      "Y conoceréis la verdad, y la verdad os hará libres... Así que, si el Hijo os libertare, seréis verdaderamente libres."
                      <br /><strong className="text-[10px] uppercase font-sans tracking-widest font-bold mt-1.5 block font-mono">— Juan 8:32, 36</strong>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setIsUnveiled(true);
                      localStorage.setItem('ti_is_unveiled', 'true');
                    }}
                    className="relative bg-gradient-to-r from-[#C9A84C] to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-[#0d0d0d] font-bold px-12 py-5 rounded-2xl text-lg shadow-2xl hover:shadow-[#C9A84C]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 w-full sm:w-auto mx-auto cursor-pointer"
                  >
                    <CheckCircle className="w-6 h-6" /> Ver mi mapa de exploración
                  </button>
                  <p className="text-white/40 text-xs font-mono">
                    Tus respuestas se guardan solo en este dispositivo.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'results' && isUnveiled && (
              <motion.div
                key="results-pane"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-10"
              >
                {/* TU REPORTE: pequeño y concreto */}
                <div className="text-center space-y-2">
                  <span className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.2em] font-semibold block">Tu reporte</span>
                  <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">{userName}</h2>
                  <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    Esto es lo que tu autoexamen encontró: tu creencia principal y tu plan para romperla.
                  </p>
                </div>

                <div className="bg-[#141414] border border-[#C9A84C]/25 p-6 sm:p-8 rounded-3xl space-y-5">
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] text-[#C9A84C] font-mono uppercase tracking-widest font-bold block">Tu creencia principal</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                      {results[0]?.alias || 'Tu creencia limitante'}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">{results[0]?.creencia}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-500/[0.03] border border-red-500/15 p-5 rounded-2xl space-y-2">
                      <span className="text-[10px] text-red-400 uppercase tracking-widest font-mono font-bold block">La mentira que se rompe</span>
                      <p className="text-red-100 text-sm italic font-serif leading-relaxed">
                        “{results[0]?.afirmacionTest}”
                      </p>
                    </div>
                    <div className="bg-emerald-500/[0.03] border border-emerald-500/15 p-5 rounded-2xl space-y-2">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono font-bold block">La verdad que te redime</span>
                      <p className="text-emerald-50 text-sm leading-relaxed">
                        {results[0]?.verdad}
                      </p>
                      {results[0]?.versiculos?.[0] && (
                        <p className="text-emerald-200/70 text-xs italic leading-relaxed">
                          “{results[0].versiculos[0].txt}” — {results[0].versiculos[0].ref}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#0F1411] border border-emerald-500/20 p-5 rounded-2xl space-y-2">
                    <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase font-bold block">
                      Tu declaración — repítela cada mañana
                    </span>
                    <p className="text-emerald-100 text-sm font-serif italic leading-relaxed">
                      “{results[0]?.declaracion}”
                    </p>
                  </div>
                </div>
                {/* TU PLAN DE 30 DÍAS */}
                <div className="space-y-5 pt-4 border-t border-[#C9A84C]/25">
                  <div className="flex items-center gap-2 text-[#C9A84C]">
                    <Heart className="w-5 h-5 text-[#C9A84C]" />
                    <h3 className="text-lg font-bold font-display text-white">
                      Tu plan para romper «{results[0]?.alias || 'esta creencia'}» y vivir redimido
                    </h3>
                  </div>
                  <div className="bg-[#0F1411] border border-[#C9A84C]/25 p-5 rounded-2xl space-y-2">
                    <span className="text-[10px] text-[#C9A84C] font-mono tracking-wider uppercase font-bold block">
                      Cita base de tu plan · {CITA_BASE}
                    </span>
                    <p className="text-emerald-100 text-sm font-serif italic leading-relaxed">
                      “{TEXTO_CITA_BASE}”
                    </p>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    No es igual para todos: nace de la creencia que tu autoexamen detectó. Cuatro elementos, un día a la vez.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PLAN_PROVERBIOS.map((el) => (
                      <div key={el.id} className="bg-[#161616] border border-white/5 p-4 rounded-2xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-[#C9A84C] uppercase block">{el.numero}. {el.titulo} · Días {el.diasInicio}–{el.diasFin}</span>
                        <p className="text-white/85 text-xs leading-relaxed">Tiene que ver con {el.tieneQueVer.toLowerCase()}: {el.hacer.toLowerCase()}.</p>
                      </div>
                    ))}
                  </div>
                </div>
                {(
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    {/* LOS 4 ELEMENTOS DEL PLAN · PROVERBIOS 3:5-9 */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2 text-[#C9A84C]">
                        <Calendar className="w-5 h-5" />
                        <h4 className="text-base font-bold font-display uppercase tracking-wider font-mono">Los 4 elementos de tu plan</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {PLAN_PROVERBIOS.map((el) => {
                          const semana = [aiDiagnosis?.fase5?.semana1, aiDiagnosis?.fase5?.semana2, aiDiagnosis?.fase5?.semana3, aiDiagnosis?.fase5?.semana4][el.semanaIndex] as any;
                          return (
                            <div key={el.id} className="bg-[#141414] border-l-4 border-l-[#C9A84C] p-5 rounded-r-2xl space-y-3 border-y border-r border-white/5">
                              <span className="text-[10px] text-[#C9A84C] font-mono font-bold uppercase block">{el.numero}. {el.titulo} · Días {el.diasInicio}–{el.diasFin}</span>
                              <ul className="space-y-1.5 text-xs leading-relaxed">
                                {elementLines(el).map((l) => (
                                  <li key={l.label} className="text-white/80">
                                    <strong className="text-white">{l.label}:</strong> {l.text}
                                  </li>
                                ))}
                              </ul>
                              {semana?.objetivo && (
                                <div className="border-t border-white/5 pt-2 text-[11px] text-white/60 leading-relaxed">
                                  <strong className="text-[#C9A84C]">Enfoque de la semana:</strong> {semana.objetivo}
                                  {semana.reflexion && <span className="block italic mt-1">“{semana.reflexion}”</span>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* FASE 6: PLAN DIARIO Y CALENDARIO INTERACTIVO */}
                    <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#C9A84C] font-mono block">Día a día</span>
                          <h4 className="text-lg font-bold font-display text-white">Interactiva tu agenda de 30 días</h4>
                          <p className="text-white/50 text-xs leading-relaxed">
                            {PLAN_PROVERBIOS.map((el) => `Días ${el.diasInicio}–${el.diasFin}: ${el.titulo}`).join(' · ')}
                          </p>
                        </div>
                        <span className="bg-[#C9A84C]/5 border border-[#C9A84C]/15 px-3 py-1 rounded-full text-xs text-[#C9A84C] font-mono font-medium">
                          Progreso total: {Object.values(completedDays).filter(Boolean).length} de 30 completados
                        </span>
                      </div>
                      
                      {/* Interactive Days Grid (1 to 30) */}
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                        {Array.from({ length: 30 }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const isCompleted = completedDays[dayNum.toString()];
                          const isActive = selectedDayIndex === idx;

                          return (
                            <button
                              key={idx}
                              id={`day-btn-${dayNum}`}
                              onClick={() => setSelectedDayIndex(idx)}
                              className={`aspect-square sm:aspect-auto sm:py-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                                isCompleted
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                  : isActive
                                  ? 'bg-[#C9A84C] text-[#0D0D0D] border-[#C9A84C] font-bold scale-[1.05]'
                                  : 'bg-[#181818] border-white/5 text-white/50 hover:text-white hover:border-white/10'
                              }`}
                            >
                              <span className="text-xs font-mono">Día</span>
                              <span className="text-sm font-bold font-sans mt-0.5">{dayNum}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Day Details Panel */}
                      {aiDiagnosis?.fase6 && aiDiagnosis.fase6[selectedDayIndex] && (
                        <div className="bg-[#181818] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/5 pb-3">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-[#C9A84C] font-mono">Enfoque del Día {selectedDayIndex + 1} · {elementForDay(selectedDayIndex + 1).titulo}</span>
                              <h5 className="text-white font-bold text-sm tracking-wide">{aiDiagnosis.fase6[selectedDayIndex].enfoque}</h5>
                            </div>
                            
                            <button
                              onClick={() => {
                                const dayKey = (selectedDayIndex + 1).toString();
                                const isToggledOn = !completedDays[dayKey];
                                setCompletedDays(prev => {
                                  const updated = {
                                    ...prev,
                                    [dayKey]: isToggledOn
                                  };
                                  const totalCompleted = Object.values(updated).filter(Boolean).length;
                                  if (totalCompleted === 30) {
                                    setShowCelebrationModal(true);
                                  }
                                  return updated;
                                });
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                completedDays[(selectedDayIndex + 1).toString()]
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 hover:bg-[#C9A84C]/20'
                              }`}
                            >
                              {completedDays[(selectedDayIndex + 1).toString()] ? "✓ Día Completado" : "Marcar como Completado"}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-3 bg-[#111] p-4 rounded-xl border border-white/5">
                              <div>
                                <span className="text-[#C9A84C] font-mono text-[9px] block uppercase font-bold mb-1">Versículo Llave</span>
                                <p className="italic font-serif leading-relaxed text-white/80">"{aiDiagnosis.fase6[selectedDayIndex].versiculo.texto}"</p>
                                <strong className="block text-right text-white/50 font-mono mt-1 text-[10px]">— {aiDiagnosis.fase6[selectedDayIndex].versiculo.referencia}</strong>
                              </div>
                              <div className="border-t border-white/5 pt-2">
                                <span className="text-indigo-400 font-mono text-[9px] block uppercase font-bold mb-1">Pregunta de Autoconfrontación</span>
                                <p className="text-white/70 italic leading-relaxed">"{aiDiagnosis.fase6[selectedDayIndex].reflexion}"</p>
                              </div>
                            </div>

                            <div className="space-y-3 bg-[#111] p-4 rounded-xl border border-white/5">
                              <div>
                                <span className="text-emerald-400 font-mono text-[9px] block uppercase font-bold mb-1">Micro-Acción de Fe</span>
                                <p className="text-white/80 leading-relaxed font-sans">{aiDiagnosis.fase6[selectedDayIndex].accion}</p>
                              </div>
                              <div className="border-t border-white/5 pt-2">
                                <span className="text-amber-500 font-mono text-[9px] block uppercase font-bold mb-1">Oración Matutina</span>
                                <p className="text-white/70 leading-relaxed italic">"{aiDiagnosis.fase6[selectedDayIndex].oracion}"</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Cierre: lo que probablemente estás enfrentando y cómo Dios lo redime */}
                <div className="bg-[#0F1411] border border-[#C9A84C]/25 p-6 sm:p-8 rounded-3xl space-y-4">
                  <span className="text-[10px] text-[#C9A84C] font-mono tracking-wider uppercase font-bold block">
                    Para cerrar
                  </span>
                  <h3 className="text-xl font-bold font-display text-white leading-snug">
                    Muy probablemente estás lidiando con esta creencia{results.length > 1 ? ' o creencias' : ''}:
                  </h3>
                  <ul className="space-y-1.5">
                    {results.slice(0, 3).map((r: any, idx: number) => (
                      <li key={idx} className="text-white/85 text-sm leading-relaxed">
                        • <strong className="text-white">{r?.alias || r?.creencia}</strong>{r?.creencia && r?.alias ? ` — ${r.creencia}` : ''}
                      </li>
                    ))}
                  </ul>
                  <p className="text-white/80 text-sm leading-relaxed">
                    La forma en que Dios puede redimirlas es: {results[0]?.verdad || 'cambiar la mentira por la verdad de su Palabra y caminarla un día a la vez'}.
                    Por eso tu plan se sostiene en {CITA_BASE}: confía en Él, contesta a su llamado, confiesa tu necesidad de Él y consagra todo. Él es quien endereza tus veredas.
                  </p>
                </div>

                {/* Acciones finales: PDF y acompañamiento */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/5">
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola, completé el autoexamen Qué me detiene en Levántate Resplandece. Mi creencia principal fue «${results[0]?.alias || 'una creencia limitante'}». Quisiera agendar una sesión de acompañamiento pastoral.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#25D366] hover:bg-[#20ba56] text-[#0A0A0A] font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all w-full sm:w-auto cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#0A0A0A]" />
                    Agenda una sesión de acompañamiento
                  </a>

                  <button
                    onClick={handleExportPDF}
                    className="bg-gradient-to-r from-[#C9A84C] to-yellow-600 hover:from-yellow-400 hover:to-amber-500 text-[#0A0A0A] font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all w-full sm:w-auto cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#0A0A0A]" />
                    Descargar mi resultado (PDF)
                  </button>
                </div>

                <div className="text-center pt-1">
                  <button
                    onClick={restartJourney}
                    className="text-[11px] text-white/40 hover:text-white/70 underline cursor-pointer"
                  >
                    Volver a hacer el autoexamen
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </motion.div>

      {/* Footer credits */}
      <footer className="mt-16 text-center text-zinc-300 text-xs space-y-2 pb-8 max-w-2xl mx-auto px-4">
        <p className="font-semibold text-zinc-200">© {new Date().getFullYear()} Levántate Resplandece • Transformación Interior • Romanos 12:2</p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Herramienta de autoexploración basada en principios de consejería bíblica. No es un diagnóstico clínico ni sustituye la atención profesional de salud mental o pastoral.
        </p>
      </footer>

      {/* WhatsApp configuration modal */}
      {showWhatsappModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h5 className="text-white font-bold text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              Configurar WhatsApp del Ministerio
            </h5>
            <p className="text-xs text-white/60 leading-relaxed">
              Ingresa el número con código de país para recibir las solicitudes de acompañamiento pastoral (ejemplo: 5491122334455 o 15551234567):
            </p>
            <input
              type="tel"
              value={tempWhatsapp}
              onChange={(e) => setTempWhatsapp(e.target.value)}
              className="w-full bg-[#202020] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] font-mono"
              placeholder="Código de país + número"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowWhatsappModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveWhatsapp}
                className="px-4 py-2 rounded-xl text-xs bg-[#C9A84C] hover:bg-yellow-500 text-[#0A0A0A] font-bold cursor-pointer transition-colors"
              >
                Guardar Número
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9 Blocks Methodological Definition Modal */}
      {selectedBlockModalId && (() => {
        const def = blockDefinitions[selectedBlockModalId];
        if (!def) return null;
        const currentScore = screeningAnswers[def.id];
        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-[#141414] border border-[#C9A84C]/40 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#181818]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A84C] font-bold">
                      Fundamento Metodológico • Los 9 Bloques
                    </span>
                    {currentScore !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        currentScore >= 3 ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30'
                      }`}>
                        Tu puntaje: {currentScore}/5
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {def.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBlockModalId(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selector de los 9 bloques */}
              <div className="px-5 py-3 border-b border-white/5 bg-black/40 overflow-x-auto flex gap-1.5 scrollbar-thin">
                {Object.values(blockDefinitions).map((b) => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setSelectedBlockModalId(b.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                      selectedBlockModalId === b.id
                        ? 'bg-[#C9A84C] text-[#0A0A0A] font-bold shadow-md shadow-[#C9A84C]/20'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {b.name.split(' (')[0]}
                  </button>
                ))}
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-white/85">
                {/* QUÉ MIDE vs QUÉ NO MIDE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-950/20 border border-emerald-500/25 p-4 rounded-2xl space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Qué SÍ Mide
                    </span>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                      {def.queMide}
                    </p>
                  </div>

                  <div className="bg-red-950/20 border border-red-500/25 p-4 rounded-2xl space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Qué NO Mide
                    </span>
                    <p className="text-xs text-red-100/90 leading-relaxed">
                      {def.queNoMide}
                    </p>
                  </div>
                </div>

                {/* NO ASUMIR PROBLEMA AUTOMÁTICO */}
                <div className="bg-[#C9A84C]/10 border-l-4 border-[#C9A84C] p-4 rounded-r-2xl space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A84C] font-bold block">
                    ⚠️ Por qué un puntaje alto NO significa automáticamente un problema
                  </span>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {def.noEsProblemaAutomatico}
                  </p>
                </div>

                {/* COMPORTAMIENTOS RELACIONADOS */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/50 font-bold block">
                    Comportamientos observables relacionados:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {def.comportamientosRelacionados.map((comp, idx) => (
                      <div key={idx} className="bg-black/30 border border-white/5 p-2.5 rounded-xl text-xs text-white/80 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0 mt-1.5" />
                        <span>{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HIPÓTESIS POSIBLES */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/50 font-bold block">
                    Gama de hipótesis que puede generar:
                  </span>
                  <div className="space-y-2">
                    {def.hipotesisPosibles.map((hip, idx) => (
                      <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded-xl text-xs text-white/85 flex items-start gap-2.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                        <span>{hip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PREGUNTAS ADICIONALES */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/50 font-bold block">
                    Preguntas adicionales que activa:
                  </span>
                  <div className="space-y-2">
                    {def.preguntasAdicionales.map((preg, idx) => (
                      <div key={idx} className="bg-black/30 border border-white/5 p-3 rounded-xl text-xs text-amber-200/90 italic flex items-start gap-2.5">
                        <span className="text-[#C9A84C] font-mono font-bold not-italic">P{idx + 1}:</span>
                        <span>"{preg}"</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* POSIBLES RELACIONES CON OTROS BLOQUES */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C9A84C] font-bold block flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Posibles relaciones con otros bloques:
                  </span>
                  <div className="space-y-2.5">
                    {def.posiblesRelaciones.map((rel, idx) => (
                      <div key={idx} className="bg-black/40 border border-white/10 p-3.5 rounded-2xl space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-[#C9A84C]">
                            {rel.condicion}
                          </span>
                        </div>
                        <p className="text-xs text-white/80">
                          <strong>Hipótesis: </strong>{rel.hipotesisInteraccion}
                        </p>
                        <p className="text-xs text-white/60 italic">
                          <strong>Pregunta: </strong>"{rel.preguntaClave}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 bg-[#181818] flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedBlockModalId(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs hover:bg-yellow-500 transition-colors cursor-pointer"
                >
                  Entendido / Volver al Diagnóstico
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Golden Confetti & Cinematic Completion Modal */}
      <GoldenCelebration 
        isOpen={showCelebrationModal} 
        onClose={() => setShowCelebrationModal(false)} 
        userName={userName} 
      />
    </div>
  );
}
