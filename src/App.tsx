import React, { useState, useMemo, useEffect } from 'react';
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
import GoldenCelebration from './components/GoldenCelebration';
import { HeartExplorationSection } from './components/HeartExplorationSection';
import { SIMULATED_CASE_19 } from './data/counselingMovements';

export interface UserResult extends CreenciaRecord {
  category: string;
  intensity: number;
  screeningScore?: number;
  score?: number;
}

type Step = 'welcome' | 'screening' | 'calculating_blocks' | 'deep_dive' | 'generating_results' | 'results';

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
    switch (blockId) {
      case "capacidad-identidad":
        return `Comprendo esa sensación, ${formattedName}. La voz que te exige estar siempre a la altura puede ser muy agotadora. Recuerda que tu verdadero valor y suficiencia provienen de Dios (2 Corintios 3:5).`;
      case "merecimiento-vinculo":
        return `Entiendo el temor a que la calma no dure, ${formattedName}. Cuando nos acostumbramos a la tensión, cuesta recibir la paz. Pero la bondad de Dios es sincera y no tiene condiciones ocultas.`;
      case "control-entorno":
        return `Estás cargando el peso de resolverlo todo en tus propias fuerzas, ${formattedName}. Respira hondo... Dios cuida de ti con amor y fidelidad día tras día.`;
      case "rendimiento-logro":
        return `Querido/a ${formattedName}, descansar no es un error. Tu dignidad no depende de cuánto produces, sino del amor incondicional con el que Dios te mira.`;
      case "relaciones-poder":
        return `Guardar silencio por temor al conflicto deja un gran desgaste interior, ${formattedName}. Dios te da sabiduría para hablar la verdad con amor y poner límites sanos con serenidad.`;
      case "cuerpo-salud":
        return `El descanso no es tiempo perdido, ${formattedName}; es parte del cuidado responsable del templo que Dios te ha confiado.`;
      case "espiritualidad-trascendencia":
        return `A veces la rutina o las dudas hacen sentir lejana la presencia de Dios, ${formattedName}. Pero Él te conoce, te ama y permanece cerca aun en los momentos de silencio.`;
      case "tiempo-futuro":
        return `La prisa y la preocupación por el mañana desgastan el presente, ${formattedName}. Tu tiempo está en las manos de Dios y su paz te acompaña hoy.`;
      case "genero-identidad-social":
        return `Las etiquetas que otros pusieron sobre tu historia no definen tu futuro, ${formattedName}. En Cristo tienes una nueva identidad y un propósito claro.`;
      default:
        return `Gracias por tu honestidad, ${formattedName}. Reconocer lo que sentimos es siempre el primer paso hacia la libertad.`;
    }
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
  if (xp >= 600) return { title: "Arquitecto de Vida 👑", lvl: 7, nextXp: 700 };
  if (xp >= 500) return { title: "Transformador 🔥", lvl: 6, nextXp: 600 };
  if (xp >= 400) return { title: "Renovador ✦", lvl: 5, nextXp: 500 };
  if (xp >= 300) return { title: "Reconstructor ⚒", lvl: 4, nextXp: 400 };
  if (xp >= 200) return { title: "Investigador 🔍", lvl: 3, nextXp: 300 };
  if (xp >= 100) return { title: "Explorador 🧭", lvl: 2, nextXp: 200 };
  return { title: "Despierto 👁", lvl: 1, nextXp: 100 };
};

export default function App() {
  const [step, setStep] = useState<Step>(() => {
    const saved = localStorage.getItem('ti_step');
    return (saved as Step) || 'welcome';
  });
  const [userName, setUserName] = useState(() => localStorage.getItem('ti_user_name') || '');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('ti_user_email') || '');
  const [userAge, setUserAge] = useState(() => localStorage.getItem('ti_user_age') || '');
  const [userGoal, setUserGoal] = useState(() => localStorage.getItem('ti_user_goal') || '');
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
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('ti_validated_interactions', JSON.stringify(next));
      return next;
    });
  };

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
    localStorage.setItem('ti_results', JSON.stringify(results));
    localStorage.setItem('ti_intro_paragraph', introParagraph);
    localStorage.setItem('ti_completed_days', JSON.stringify(completedDays));
    localStorage.setItem('ti_journal_notes', JSON.stringify(journalNotes));
    localStorage.setItem('ti_user_age', userAge);
    localStorage.setItem('ti_user_goal', userGoal);
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
    userGoal,
    userXp,
    achievements,
    currentSelectedRegion
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
  }, [step, screeningIndex, deepDiveIndex]);

  // Load profile from localStorage if they exist
  useEffect(() => {
    const savedName = localStorage.getItem('ti_user_name');
    const savedEmail = localStorage.getItem('ti_user_email');
    const savedAge = localStorage.getItem('ti_user_age');
    const savedGoal = localStorage.getItem('ti_user_goal');
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
    if (savedAge) setUserAge(savedAge);
    if (savedGoal) setUserGoal(savedGoal);
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
    if (!userGoal.trim()) {
      alert('Por favor selecciona tu propósito principal para esta expedición.');
      return;
    }

    localStorage.setItem('ti_user_name', userName);
    localStorage.setItem('ti_user_email', userEmail);
    localStorage.setItem('ti_user_age', userAge);
    localStorage.setItem('ti_user_goal', userGoal);

    // Initial Onboarding XP & Achievement
    setUserXp(25);
    setAchievements(prev => ({
      ...prev,
      'primer-paso': true
    }));
    
    setXpNotification({ xp: 25, label: "¡Ficha de Explorador Preparada!" });
    setNewAchievementAlert({ 
      name: "Primer Paso ⚔️", 
      description: "Has iniciado tu Expedición al Territorio Interior con valentía." 
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
    if (isAnswering) return; // Prevent double taps

    setScreeningAnswers(prev => {
      const updated = {
        ...prev,
        [regionId]: score
      };

      // Award XP for first discovery of this region
      const alreadyAnswered = prev[regionId] !== undefined;
      if (!alreadyAnswered) {
        setUserXp(currentXp => currentXp + 30);
        setXpNotification({ 
          xp: 30, 
          label: `¡Región "${bloquesDiagnostico[regionId as keyof typeof bloquesDiagnostico]?.title}" Explorada!` 
        });
        setTimeout(() => setXpNotification(null), 3000);
      }

      // Check for mid-journey Milestone achievement (4 regions completed)
      const completedCount = Object.keys(updated).length;
      if (completedCount === 4) {
        setAchievements(ach => {
          const upd = { ...ach, 'explorador-valiente': true };
          localStorage.setItem('ti_achievements', JSON.stringify(upd));
          setNewAchievementAlert({ 
            name: "Explorador Valiente 🗺️", 
            description: "Has trazado con éxito la mitad de tu Territorio Interior." 
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
    setAnsweringFeedback(feedback);
    setIsAnswering(true);

    const transitionDelay = 2200;

    // Check if ALL 9 regions are fully completed
    const keys = Object.keys(bloquesDiagnostico);
    const answeredKeys = Object.keys(screeningAnswers);
    if (!answeredKeys.includes(regionId)) {
      answeredKeys.push(regionId);
    }
    const allCompleted = keys.every(k => answeredKeys.includes(k));

    if (allCompleted) {
      // Award Final Regional Conquest Medal & bonus XP
      setAchievements(ach => {
        const upd = { ...ach, 'rompedor-de-cadenas': true };
        localStorage.setItem('ti_achievements', JSON.stringify(upd));
        return upd;
      });
      setUserXp(xp => xp + 50);

      setTimeout(() => {
        setAnsweringFeedback("¡Excelente! Has completado la exploración de las 9 áreas. Analizando patrones con discernimiento...");
        setXpNotification({ xp: 50, label: "¡Mapeo Inicial Completado!" });
        setNewAchievementAlert({ 
          name: "Paso de Valentía ✨", 
          description: "Completaste las 9 áreas para conocer la verdad que trae libertad." 
        });
        setTimeout(() => setXpNotification(null), 3000);
        setTimeout(() => setNewAchievementAlert(null), 4500);
      }, transitionDelay);

      setTimeout(() => {
        setStep('calculating_blocks');
        setIsAnswering(false);
        setAnsweringFeedback('');
      }, transitionDelay + 2500);
    } else {
      setTimeout(() => {
        // Find next uncompleted region key
        const nextUncompleted = keys.find(k => k !== regionId && !answeredKeys.includes(k));
        if (nextUncompleted) {
          setCurrentSelectedRegion(nextUncompleted);
        }
        setIsAnswering(false);
        setAnsweringFeedback('');
      }, transitionDelay);
    }
  };

  // Compute active blocks and setup Layer 2 deep dive
  useEffect(() => {
    if (step === 'calculating_blocks') {
      const timer = setTimeout(() => {
        // Calculate all blocks with Score >= 3
        let activated = Object.entries(screeningAnswers)
          .filter(([_, score]) => (score as number) >= 3)
          .map(([id, _]) => id);

        // If no blocks are >= 3, pick the top 3 highest scores
        if (activated.length === 0) {
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
        
        setStep('deep_dive');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, screeningAnswers, screeningList]);

  const handleDeepDiveAnswer = (score: number) => {
    if (isAnswering) return; // Prevent double taps

    const currentQuestion = deepDiveQuestions[deepDiveIndex];
    setDeepDiveAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: score
    }));

    // Award XP (15 XP for cataloging each deep belief node)
    setUserXp(currentXp => currentXp + 15);
    setXpNotification({ xp: 15, label: `Descifrando: ${currentQuestion.bloque}` });
    setTimeout(() => setXpNotification(null), 3000);

    // Generate warm deep-dive feedback
    const feedback = getDeepDivePastoralFeedback(currentQuestion.bloque, score, userName);
    setAnsweringFeedback(feedback);
    setIsAnswering(true);

    const transitionDelay = 2200; // 2.2 seconds to absorb the pastoral translation

    if (deepDiveIndex < deepDiveQuestions.length - 1) {
      setTimeout(() => {
        setDeepDiveIndex(prev => prev + 1);
        setIsAnswering(false);
        setAnsweringFeedback('');
      }, transitionDelay);
    } else {
      // Award Descent Completion Achievement
      setAchievements(ach => {
        const upd = { ...ach, 'ojo-revelador': true };
        localStorage.setItem('ti_achievements', JSON.stringify(upd));
        return upd;
      });
      setUserXp(currentXp => currentXp + 60);

      setTimeout(() => {
        setAnsweringFeedback("¡Autoexploración completada! Llevando cada pensamiento a la luz de la verdad en Cristo. Preparando tu diagnóstico...");
        setXpNotification({ xp: 60, label: "¡Exploración Concluida!" });
        setNewAchievementAlert({ 
          name: "Claridad Interior 🕊️", 
          description: "Has examinado tus pensamientos a la luz de la verdad que renueva la mente." 
        });
        setTimeout(() => setXpNotification(null), 3000);
        setTimeout(() => setNewAchievementAlert(null), 4500);
      }, transitionDelay);

      setTimeout(() => {
        setStep('generating_results');
        setIsAnswering(false);
        setAnsweringFeedback('');
      }, transitionDelay + 2500);
    }
  };

  const restartJourney = () => {
    setStep('welcome');
    setScreeningAnswers({});
    setScreeningIndex(0);
    setActiveBlocks([]);
    setDeepDiveAnswers({});
    setDeepDiveQuestions([]);
    setDeepDiveIndex(0);
    setResults([]);
    setIntroParagraph('');
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
    setSelectedBlockModalId(null);
    setUserAge('');
    setUserGoal('');
    setUserXp(0);
    setAchievements({});
    setCurrentSelectedRegion('capacidad-identidad');
    
    localStorage.removeItem('ti_step');
    localStorage.removeItem('ti_screening_answers');
    localStorage.removeItem('ti_screening_index');
    localStorage.removeItem('ti_active_blocks');
    localStorage.removeItem('ti_deep_dive_answers');
    localStorage.removeItem('ti_deep_dive_questions');
    localStorage.removeItem('ti_deep_dive_index');
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
    localStorage.removeItem('ti_user_goal');
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
          userGoal,
          screeningAnswers
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.useFallback) {
          console.log("No GEMINI_API_KEY configured on server. Creating dynamic local fallback.");
          const fallback = generateFallbackData(primary, userName, userEmail, compiledResults, screeningAnswers);
          setAiDiagnosis(fallback);
        } else {
          setAiDiagnosis(data);
        }
      } else {
        console.warn("API Server responded with non-200. Proceeding with dynamic fallback.");
        const fallback = generateFallbackData(primary, userName, userEmail, compiledResults, screeningAnswers);
        setAiDiagnosis(fallback);
      }
    } catch (err) {
      console.error("Failed to query API for AI Diagnosis:", err);
      const fallback = generateFallbackData(primary, userName, userEmail, compiledResults, screeningAnswers);
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
        
        const primaryBlockId = sortedBlocks[0]?.[0] || 'capacidad-identidad';
        
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

        setIntroParagraph(intros[primaryBlockId] || intros["capacidad-identidad"]);
        
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

        // CRITICAL FIX: Sort beliefs by composite weight: (screeningScore * 10) + deepDiveIntensity
        // This ensures the primary belief matches the user's highest screening block(s)!
        compiled.sort((a, b) => {
          const scoreA = (screeningAnswers[a.bloqueId] || 1) * 10 + a.intensity;
          const scoreB = (screeningAnswers[b.bloqueId] || 1) * 10 + b.intensity;
          return scoreB - scoreA;
        });

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

  const primaryBlock = useMemo(() => {
    return dominantBlocks[0] || sortedBlocksWithScores[0] || {
      id: 'capacidad-identidad',
      title: 'Capacidad e Identidad',
      shortTitle: 'Capacidad',
      score: 1
    };
  }, [dominantBlocks, sortedBlocksWithScores]);

  // Interacciones dinámicas detectadas entre bloques
  const detectedInteractions = useMemo(() => {
    if (aiDiagnosis?.interacciones && aiDiagnosis.interacciones.length > 0) {
      return aiDiagnosis.interacciones;
    }
    return detectBlockInteractions(screeningAnswers);
  }, [screeningAnswers, aiDiagnosis]);

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
    downloadPDFResults(userName, userEmail, aiDiagnosis, results, journalNotes);
  };

  return (
    <div id="app-container" className="min-h-screen bg-[#0A0A0A] text-[#F3F4F6] selection:bg-[#C9A84C]/30 selection:text-[#C9A84C] py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500">
      
      {/* Absolute elegant particle overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,168,76,0.12),rgba(0,0,0,0))] pointer-events-none" />

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
                    {step === 'screening' && ` Screening: ${screeningIndex + 1} / 9`}
                    {step === 'calculating_blocks' && `Calculando activación`}
                    {step === 'deep_dive' && `Profundización: ${deepDiveIndex + 1} / ${deepDiveQuestions.length}`}
                    {step === 'results' && 'Tu Diagnóstico'}
                  </span>
                </div>
                <div id="progress-track" className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#C9A84C] to-yellow-600 shadow-[0_0_8px_#C9A84C]"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${
                        step === 'screening' ? ((screeningIndex + 1) / 9) * 100 :
                        step === 'calculating_blocks' ? 50 :
                        step === 'deep_dive' ? (50 + ((deepDiveIndex + 1) / deepDiveQuestions.length) * 50) :
                        step === 'generating_results' ? 95 : 100
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
                className="space-y-10"
              >
                {/* Floating Topbar Header inside Welcome screen */}
                <div className="flex flex-col md:flex-row justify-between items-center pb-6 border-b border-white/5 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A84C] to-yellow-600 flex items-center justify-center text-[#0D0D0D] shadow-lg shadow-[#C9A84C]/10">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.2em] font-mono text-[#C9A84C]/80 uppercase block font-semibold">Plataforma de Crecimiento</span>
                      <h2 className="text-lg font-bold text-white tracking-tight -mt-0.5">Transformación Interior</h2>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-xs font-serif italic text-white/50 max-w-sm">
                      "Transformaos por medio de la renovación de vuestro entendimiento..."
                      <span className="block not-italic font-mono text-[9px] uppercase font-bold text-[#C9A84C] mt-0.5">— Romanos 12:2</span>
                    </p>
                  </div>
                </div>

                {/* Hero Columns Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Emotion, Mystery and Authoritative Content (span 7) */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Glowing Accent Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/5 text-[11px] text-[#C9A84C] font-mono uppercase tracking-[0.15em]">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#C9A84C]" />
                      <span>Sinfonía de Neurociencia & Sabiduría Divina</span>
                    </div>

                    {/* Titular Principal */}
                    <h1 className="text-2xl sm:text-3.5xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
                      ¿Y si el mayor obstáculo para tu futuro no estuviera delante de ti... <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-yellow-500 drop-shadow-[0_2px_15px_rgba(201,168,76,0.25)]">sino dentro de ti?</span>
                    </h1>

                    {/* Subtítulo (Deep emotional trigger paragraphs) */}
                    <div className="space-y-4 text-white/80 text-sm sm:text-base leading-relaxed font-sans font-light">
                      <p>
                        Durante años has tomado decisiones creyendo que eras libre.
                      </p>
                      <p>
                        Pero algunas de tus creencias más profundas pudieron haberse formado por heridas, experiencias, miedos o mensajes que aceptaste como verdad.
                      </p>
                      <p className="text-[#C9A84C] font-normal border-l-2 border-[#C9A84C]/40 pl-4 bg-[#C9A84C]/5 py-2 rounded-r-xl">
                        Descubre qué patrones invisibles están moldeando tus decisiones y comienza a renovar tu manera de pensar hoy mismo.
                      </p>
                    </div>

                    {/* Ultra-Polished Clinical Dashboard Card (Texto de Impacto) */}
                    <div className="bg-[#161616]/70 border border-white/5 p-6 rounded-2xl relative overflow-hidden space-y-4">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.06),transparent)] pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A84C] font-semibold">Tasa de Comportamiento Inconsciente</span>
                        <div className="flex items-center gap-2 bg-yellow-950/20 px-2 py-1 rounded border border-[#C9A84C]/20">
                          <Activity className="w-3.5 h-3.5 text-[#C9A84C] animate-pulse" />
                          <span className="text-[#C9A84C] font-mono text-xs font-bold">95% de Autómata</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-white text-sm font-semibold tracking-wide">El 95% de nuestras decisiones ocurren de forma automática.</h4>
                        <p className="text-white/50 text-xs leading-relaxed">
                          Muchas personas luchan continuamente contra síntomas visibles con pura fuerza de voluntad, sin percatarse del lazo oculto:
                        </p>
                      </div>

                      {/* Diagnostic Checklist */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-1.5">
                        {[
                          { title: 'Procrastinación', badge: 'Retraso' },
                          { title: 'Miedo al fracaso', badge: 'Parálisis' },
                          { title: 'Falta de confianza', badge: 'Duda' },
                          { title: 'Relaciones conflictivas', badge: 'Patrón' },
                          { title: 'Autosabotaje', badge: 'Límite' },
                          { title: 'Estancamiento financiero', badge: 'Bloqueo' }
                        ].map((item) => (
                          <div key={item.title} className="flex items-center gap-2 text-xs text-white/90">
                            <span className="text-amber-500 font-extrabold">✓</span>
                            <span className="font-medium">{item.title}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-white/55 leading-relaxed pt-3 border-t border-white/5">
                        Sin darse cuenta de que detrás existe una <strong>compleja estructura de creencias profundas</strong> que dirige cada decisión bajo la sombra.
                      </p>
                    </div>

                    {/* Proverbios Quote Badge & Fundamental Principle */}
                    <div className="bg-[#1C1C1C]/40 border border-white/5 px-4 py-3 rounded-xl flex items-center gap-3 text-xs italic text-white/70 font-serif">
                      <span className="text-[#C9A84C] text-lg font-bold leading-none font-serif">“</span>
                      <span>Porque cual es su pensamiento en su corazón, tal es él. — Proverbios 23:7</span>
                    </div>

                    <div className="bg-[#121212] border border-[#C9A84C]/30 p-4 rounded-2xl flex items-start gap-3 text-xs text-white/80">
                      <div className="p-2 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] flex-shrink-0 mt-0.5">
                        <Compass className="w-4 h-4 text-[#C9A84C]" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A84C] font-bold block">
                          Principio Fundamental • Regla Pastoral de Oro (Prompt 20)
                        </span>
                        <p className="text-[11px] text-white/70 leading-relaxed font-sans italic">
                          «La herramienta no pretende decirle al consejero quién es la persona. Pretende ayudarle a hacer mejores preguntas para comprender cómo esa persona está interpretando sus circunstancias, qué está buscando, qué teme, cómo responde y dónde necesita ser redirigida hacia la verdad de Dios y la suficiencia de Cristo.»
                        </p>
                        <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-[#C9A84C]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                          <span>La meta no es producir una etiqueta; es producir un mapa de comprensión y una dirección de ayuda.</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Profile Gate Form & Action (span 5) */}
                  <div className="lg:col-span-5">
                    <form 
                      id="gate-form" 
                      onSubmit={handleStartScreening} 
                      className="bg-[#161616]/90 border border-[#C9A84C]/25 p-6 sm:p-7 rounded-[24px] shadow-2xl relative overflow-hidden space-y-6"
                    >
                      {/* Decorative Gold flare blur inside the card */}
                      <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-[#C9A84C]/10 blur-2xl pointer-events-none" />

                      <div className="space-y-1.5">
                        <span className="text-[10px] tracking-[0.25em] font-mono text-[#C9A84C]/80 block uppercase font-bold">Puerta de Acceso</span>
                        <h3 className="text-lg font-bold text-white tracking-tight">Prepara tu Perfil de Exploración</h3>
                        <p className="text-xs text-white/50 leading-relaxed">
                          Introduce tus datos confidenciales para mapear tus interpretaciones, deseos y temores hacia la verdad de Dios y la suficiencia de Cristo.
                        </p>
                      </div>

                      {/* Input fields */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-[#C9A84C] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> Nombre o Pseudónimo
                          </label>
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              placeholder="Ej. María o Samuel" 
                              className="w-full bg-[#202020] border border-white/5 rounded-xl pl-4 pr-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] text-white transition-all focus:bg-[#252525] placeholder:text-white/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-[#C9A84C] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> Correo Electrónico
                          </label>
                          <div className="relative">
                            <input 
                              type="email" 
                              required
                              value={userEmail}
                              onChange={(e) => setUserEmail(e.target.value)}
                              placeholder="correo@ejemplo.com" 
                              className="w-full bg-[#202020] border border-white/5 rounded-xl pl-4 pr-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] text-white transition-all focus:bg-[#252525] placeholder:text-white/20"
                            />
                          </div>
                        </div>

                        {/* Age and Main Goal Grid to keep compact layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1.5 sm:col-span-1">
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

                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs text-[#C9A84C] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5" /> Objetivo Principal
                            </label>
                            <select 
                              required
                              value={userGoal}
                              onChange={(e) => setUserGoal(e.target.value)}
                              className="w-full bg-[#202020] border border-white/5 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#C9A84C] text-white transition-all"
                            >
                              <option value="" disabled>Selecciona tu misión...</option>
                              <option value="Superar el autosabotaje y procrastinación">Superar el autosabotaje</option>
                              <option value="Sanar mi valor personal e identidad">Sanar mi valor personal</option>
                              <option value="Romper el pánico al fracaso y perfeccionismo">Romper el pánico al fracaso</option>
                              <option value="Alinear mis finanzas con la abundancia">Alinear mis finanzas</option>
                              <option value="Integrar sanamente mis relaciones">Integrar mis relaciones</option>
                              <option value="Vivir sin culpa de descanso y autoreproche">Descansar sin culpa</option>
                              <option value="Descubrir mi propósito de vida y Reino">Descubrir mi propósito</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Responsive Character Badge Preview */}
                      <div className="bg-[#0A0A0A] border border-[#C9A84C]/15 rounded-2xl p-4 space-y-2 relative overflow-hidden transition-all hover:border-[#C9A84C]/35">
                        <div className="absolute right-2 top-2 text-[#C9A84C]/10 pointer-events-none">
                          <Compass className="w-16 h-16" />
                        </div>
                        <span className="text-[9px] tracking-[0.2em] font-mono text-[#C9A84C] block uppercase font-bold">FICHA DE CERTIFICACIÓN TEMPORAL</span>
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-bold text-white font-serif">{userName ? `Explorador ${userName}` : 'Explorador sin nombre'}</h4>
                            <p className="text-[10px] text-white/50">{userAge ? `${userAge} años` : 'Edad no definida'} • Misión: {userGoal ? userGoal : 'Encontrar la verdad'}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 px-2 py-0.5 rounded-full font-mono">Lvl 1: Despierto 👁</span>
                          </div>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
                          <div className="bg-[#C9A84C] h-full w-[25%]" />
                        </div>
                        <p className="text-[9px] text-white/30 italic">✓ +25 XP iniciales serán otorgados al iniciar la exploración.</p>
                      </div>

                      {/* Terms Acceptance */}
                      <div className="flex items-start gap-2.5 bg-[#202020]/20 p-3.5 rounded-xl border border-white/5">
                        <input 
                          type="checkbox" 
                          id="opt-terms" 
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="mt-1 w-4 h-4 cursor-pointer accent-[#C9A84C] rounded border-white/10" 
                        />
                        <label htmlFor="opt-terms" className="text-[11px] text-white/45 leading-normal cursor-pointer select-none">
                          Autorizo registrar mis respuestas de forma segura y descargo la responsabilidad en pro del autoconocimiento.
                        </label>
                      </div>

                      {/* Primary GRAND CTA Button */}
                      <button 
                        type="submit"
                        id="btn-gate-start"
                        disabled={!acceptedTerms}
                        className="w-full relative group overflow-hidden bg-gradient-to-r from-[#C9A84C] to-yellow-600 disabled:from-gray-700 disabled:to-gray-800 disabled:text-white/40 disabled:pointer-events-none text-[#0D0D0D] font-bold py-4 px-6 rounded-xl hover:shadow-[0_0_25px_rgba(201,168,76,0.35)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="relative z-10 text-sm tracking-wide">Descubrir mi mapa de exploración interior</span>
                        <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      {/* Botón de Simulación de Prueba Rápida (Prompt 19) */}
                      <button
                        type="button"
                        onClick={handleLoadSimulatedCase19}
                        className="w-full bg-[#181818] hover:bg-[#222222] border border-[#C9A84C]/40 text-[#C9A84C] font-mono text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>PROBAR CASO REAL SIMULADO (Prompt 19: Control 5, Tiempo 5)</span>
                      </button>

                      {/* Supportive Info Badge List (Structured layout) */}
                      <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-white/5">
                        <div className="flex items-center gap-2 text-white/70">
                          <Clock className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                          <span className="text-[11px] leading-tight font-medium">⏱ Duración: 6 minutos</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <Activity className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                          <span className="text-[11px] leading-tight font-medium">📊 Mapa de comprensión</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <Brain className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                          <span className="text-[11px] leading-tight font-medium">🧠 Patrones cognitivos</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <BookOpen className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                          <span className="text-[11px] leading-tight font-medium">📖 Principios bíblicos</span>
                        </div>
                      </div>

                      <div className="text-center text-white/35 text-[10px] font-mono uppercase tracking-wider pt-1">
                        🔒 Privacidad total y cifrado local
                      </div>
                    </form>
                  </div>

                </div>

              </motion.div>
            )}

            {/* STEP 2: SCREENING (CAPA 1) - LA EXPEDICIÓN DEL TERRITORIO INTERIOR */}
            {step === 'screening' && (
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
                      <h4 className="text-white text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Rango de Exploración</h4>
                      <p className="text-[#C9A84C] font-semibold text-sm font-sans flex items-center gap-1.5">{getExploradorLevel(userXp).title}</p>
                    </div>
                  </div>
                  
                  {/* XP Progress Bar */}
                  <div className="w-full sm:w-64 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-white/40 font-bold">
                      <span>XP: {userXp} / {getExploradorLevel(userXp).nextXp}</span>
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
                              if (!isAnswering) {
                                setCurrentSelectedRegion(reg.id);
                              }
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
                              <h4 className="text-[11px] font-bold text-white leading-tight font-sans tracking-tight">{reg.title}</h4>
                              <p className="text-[9px] text-white/40 line-clamp-1">{reg.desc}</p>
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
                          <h4 className="text-white font-bold text-sm tracking-tight font-sans">
                            {bloquesDiagnostico[currentSelectedRegion as keyof typeof bloquesDiagnostico]?.title || 'Capacidad & Identidad'}
                          </h4>
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
                            {currentSelectedRegion === 'capacidad-identidad' && `Hola ${userName}, descifremos la fortaleza de mentira de la incapacidad. ¿Temes no estar a la altura en público?`}
                            {currentSelectedRegion === 'merecimiento-vinculo' && `Comprendo el temor, ${userName}. Siguiente paso: ¿aguarda tu mente que un rechazo o catástrofe imprevista ocurra para cobrarte facturas?`}
                            {currentSelectedRegion === 'control-entorno' && `Analicemos qué tan obsesivo se vuelve el deseo de dominar lo incontrolable pretendiendo sostener todo en tus manos.`}
                            {currentSelectedRegion === 'rendimiento-logro' && `Evaluemos si condicionas el valor intrínseco de tu alma a la acumulación y volumen de tus trofeos terrenales, ${userName}.`}
                            {currentSelectedRegion === 'relaciones-poder' && `Indaguemos en el pánico a ser vulnerable o a colocar fronteras de paz en tus relaciones cotidianas por temor de abandono.`}
                            {currentSelectedRegion === 'cuerpo-salud' && `Detrás de tu cansancio físico prolongado, ¿por qué sientes que reposar sin culpabilidad es un pecado del cual arrepentirse?`}
                            {currentSelectedRegion === 'espiritualidad-trascendencia' && `¿Vivencias verdaderamente una filiación de gracia o percibes la lejanía divina como un veredicto frío?`}
                            {currentSelectedRegion === 'tiempo-futuro' && `El tiempo corre. ¿Te paralizas ante la idea de tomar una sendera irreversible sintiendo escasez de oportunidades?`}
                            {currentSelectedRegion === 'genero-identidad-social' && `¿Consideras que tus marcas heredadas de cuna o demográficas limitan eternamente tu unción de gracia?`}
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
                      <AnimatePresence mode="wait">
                        {!isAnswering ? (
                          <motion.div 
                            key="likert-controls"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-2.5"
                          >
                            <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block ml-1 font-bold">Graduación del Desafío</span>
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
                          </motion.div>
                        ) : (
                          <motion.div
                            key="counseling-feedback"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1C1C1C]/90 border border-[#C9A84C]/35 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 text-center relative overflow-hidden shadow-2xl min-h-[140px]"
                          >
                            {/* Dynamic Progress Bar */}
                            <div 
                              className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gradient to-yellow-600"
                              style={{
                                width: barWidth,
                                transition: 'width 2.15s linear',
                                background: '#C9A84C'
                              }}
                            />
                            <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 flex items-center justify-center text-[#C9A84C]">
                              <Sparkles className="w-5 h-5 text-[#C9A84C] animate-pulse" />
                            </div>
                            <p className="text-xs sm:text-sm text-white italic leading-relaxed px-1">
                              "{answeringFeedback}"
                            </p>
                            <span className="text-[10px] text-white/40 font-mono flex items-center gap-1">
                              <Clock className="w-3" /> Mapeando vibraciones de la creencia...
                            </span>
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
                      <span className="text-white/40 text-[10px] block font-bold uppercase">Sectores Abismales</span>
                      <span className="text-[#C9A84C] font-bold text-xs">{activeBlocks.length} Bloques Detectados</span>
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

                      <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/10 px-4 py-1.5 rounded-full text-xs text-[#C9A84C] font-semibold w-fit mx-auto self-center">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sectores: {deepDiveQuestions[deepDiveIndex]?.bloque}</span>
                      </div>
                    </div>

                    {/* Highly Stylized Heart Dial responses */}
                    <div className="bg-[#121212] border border-white/5 p-6 rounded-3xl space-y-3 shadow-xl">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/35 block ml-1 font-bold">Graduación en tu Espíritu</span>
                      <AnimatePresence mode="wait">
                        {!isAnswering ? (
                          <motion.div 
                            key="deep-dive-selection"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                          >
                            <button
                              key="dive-yes"
                              id="deep-dive-yes"
                              onClick={() => handleDeepDiveAnswer(2)}
                              className="bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-black font-bold p-4 rounded-xl text-center hover:scale-[1.01] active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#C9A84C]/10 flex flex-col justify-center items-center min-h-[70px]"
                            >
                              <span className="text-sm font-extrabold tracking-wide uppercase">Prácticamente Sí</span>
                              <span className="text-[9px] opacity-75 font-normal block">Siento total y constante afinidad</span>
                            </button>

                            <button
                              key="dive-sometimes"
                              id="deep-dive-sometimes"
                              onClick={() => handleDeepDiveAnswer(1)}
                              className="bg-[#1C1C1C] border border-white/10 text-white hover:border-[#C9A84C]/50 font-bold p-4 rounded-xl text-center hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex flex-col justify-center items-center min-h-[70px]"
                            >
                              <span className="text-sm font-extrabold tracking-wide uppercase">A veces</span>
                              <span className="text-[9px] text-white/55 font-normal block font-sans">Ocurre de manera intermitente</span>
                            </button>

                            <button
                              key="dive-no"
                              id="deep-dive-no"
                              onClick={() => handleDeepDiveAnswer(0)}
                              className="bg-[#161616] border border-white/5 text-white/60 hover:text-white hover:border-red-500/30 font-bold p-4 rounded-xl text-center hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex flex-col justify-center items-center min-h-[70px]"
                            >
                              <span className="text-sm font-extrabold tracking-wide uppercase">En absoluto</span>
                              <span className="text-[9px] text-white/40 font-normal block">No coincide ni resuena conmigo</span>
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="deep-dive-feedback"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1C1C1C]/95 border border-[#C9A84C]/35 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 text-center relative overflow-hidden shadow-2xl min-h-[82px]"
                          >
                            <div 
                              className="absolute inset-x-0 bottom-0 h-1"
                              style={{
                                width: barWidth,
                                transition: 'width 2.15s linear',
                                background: '#C9A84C'
                              }}
                            />
                            <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 flex items-center justify-center text-[#C9A84C]">
                              <Activity className="w-5 h-5 text-[#C9A84C] animate-pulse" />
                            </div>
                            <p className="text-xs sm:text-sm text-white italic leading-relaxed px-2 font-sans">
                              "{answeringFeedback}"
                            </p>
                            <span className="text-[10px] text-[#C9A84C] font-mono flex items-center gap-1.5 animate-pulse uppercase tracking-wider font-semibold">
                              <Sparkles className="w-3.5 h-3.5" /> Reconfigurando redes neuronales del espíritu...
                            </span>
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
                            const blockName = bloquesDiagnostico[blockId as keyof typeof bloquesDiagnostico]?.title || blockId;
                            
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
                                  <h5 className="text-[11px] font-bold text-white font-sans">{blockName}</h5>
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
                      {!isAnswering && (
                        <button 
                          onClick={() => {
                            if (deepDiveIndex > 0) {
                              setDeepDiveIndex(prev => prev - 1);
                            } else {
                              setStep('screening');
                            }
                          }}
                          className="flex items-center gap-1 text-white/45 hover:text-white text-xs transition-colors cursor-pointer font-bold font-mono"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Atrás
                        </button>
                      )}
                      
                      <span className="text-[9px] font-mono text-white/20 uppercase font-bold">
                        Capa 2 • Expedición Interior
                      </span>
                    </div>

                  </div>

                </div>
              </motion.div>
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
                    Tu Diseño Revelado está Listo
                  </h2>
                </div>

                <div className="bg-[#141414] border border-[#C9A84C]/25 p-8 sm:p-10 rounded-3xl relative overflow-hidden space-y-6 shadow-2xl text-left border-dashed">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C9A84C]/5 to-transparent pointer-events-none rounded-bl-full" />
                  
                  <div className="space-y-4 font-sans text-white/80 leading-relaxed text-sm sm:text-base">
                    <p>
                      Querido/a <strong className="text-white font-semibold font-display text-lg">{userName}</strong>,
                    </p>
                    <p>
                      Te encuentras ante un espejo de Gracia inmerecida. Lo que estás por presenciar no es un reporte estadístico secular de tus deficiencias corporativas, sino una <strong>revelación profética y clínica</strong> de cómo los temores involuntarios han intentado entorpecer tu mente, y del plan de renovación cerebral y espiritual que Cristo ya selló para ti.
                    </p>
                    <p>
                      Sondeamos con reverencia los recovecos inconscientes y los confrontamos con la soberanía insustituible de tu filiación celestial. Procede de rodillas en tu espíritu...
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
                    <CheckCircle className="w-6 h-6" /> Develar mi Renovación de Identidad
                  </button>
                  <p className="text-white/40 text-xs font-mono">
                    🛡️ Tu diagnóstico permanecerá archivado localmente con máxima privacidad en tu dispositivo.
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
                {/* Empathetic Greeting with custom names */}
                <div className="text-center space-y-3">
                  <span className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.2em] font-semibold block">REPORTE PERSONALIZADO EXPEDIDO PARA</span>
                  <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">{userName}</h2>
                  <div className="flex justify-center pb-2">
                    <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-full text-xs text-white/50 font-mono">{userEmail}</span>
                  </div>
                </div>

                {/* Dashboard Stats (Toca los 3 pilares) */}
                <div id="stats-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl text-center">
                    <span className="text-3xl font-bold text-[#C9A84C] block mb-1">{stats.totalToTransform}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block">Creencias Limitadoras</span>
                  </div>
                  <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl text-center col-span-1">
                    <span className="text-3xl font-bold text-emerald-400 block mb-1">
                      {Object.values(completedDays).filter(Boolean).length} / 30
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block">Días Completados</span>
                  </div>
                  <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl text-center">
                    <span className="text-3xl font-bold text-indigo-400 block mb-1">{stats.focusAreas}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block">Sectores Activados</span>
                  </div>
                </div>

                {/* Interactive premium 5-tab workspace selection bar */}
                <div className="flex flex-wrap gap-2 justify-center border-b border-white/5 pb-4 mb-8">
                  {[
                    { id: 0, label: "📊 Fase 1 y 2: Diagnóstico" },
                    { id: 1, label: "📖 Fase 3 y 4: Renovación" },
                    { id: 2, label: "🗓️ Fase 5 y 6: Itinerario 30 Días" },
                    { id: 3, label: "📈 Fase 7: Registro Progreso" },
                    { id: 4, label: "🎓 Fase 8: Clausura & Reporte" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide cursor-pointer transition-all ${
                        activeTab === tab.id
                          ? 'bg-[#C9A84C] text-[#0D0D0D] shadow-lg shadow-[#C9A84C]/10 hover:scale-[1.02]'
                          : 'bg-[#181818] border border-white/5 text-white/60 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {copiedNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 text-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-semibold max-w-md mx-auto"
                  >
                    {copiedNotification}
                  </motion.div>
                )}

                {/* TAB 0: 📊 Fase 1 y 2: Identificación y Diagnóstico del Sistema Cognitivo */}
                {activeTab === 0 && (() => {
                  const primaryGuide = practicalStepsByBlock[primaryBlock.id] || practicalStepsByBlock['control-entorno'];
                  const displayBelief = results[0]?.afirmacionTest
                    ? `Posible patrón a contrastar: «${results[0].afirmacionTest}»`
                    : (aiDiagnosis?.fase1?.principalBelief || "Búsqueda involuntaria de seguridad por esfuerzo propio");

                  const tiedHypotheses = (() => {
                    if (!results || results.length < 2) return [];
                    const score0 = (screeningAnswers[results[0].bloqueId] || 1) * 10 + (results[0].intensity || 1);
                    const ties = [results[0]];
                    for (let i = 1; i < results.length; i++) {
                      const scoreI = (screeningAnswers[results[i].bloqueId] || 1) * 10 + (results[i].intensity || 1);
                      if (scoreI === score0 && results[i].bloqueId !== results[0].bloqueId) {
                        ties.push(results[i]);
                        break;
                      }
                    }
                    return ties.length > 1 ? ties : [];
                  })();

                  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
                  const isAllHealthy = dominantBlocks.length > 0 && dominantBlocks[0].score <= 2;
                  const expData = aiDiagnosis?.exploratorio;

                  const confirmedHeartCount = Object.values(confirmedHeartSteps).filter(Boolean).length;
                  const heartNote = confirmedHeartCount > 0 ? ` Además, validé ${confirmedHeartCount} hipótesis en mi mapa del corazón.` : '';
                  const confirmedInteractionsCount = Object.values(validatedInteractions).filter(Boolean).length;
                  const interactionNote = confirmedInteractionsCount > 0 ? ` e identifiqué ${confirmedInteractionsCount} interacción(es) activa(s) entre mis dimensiones.` : '';

                  const whatsappMsg = selectedHypothesis 
                    ? `Hola, completé la autoexploración Qué me detiene en Levántate Resplandece. Mi área de exploración principal fue ${primaryBlock.title} (${primaryBlock.score}/5), y la hipótesis con la que más me identifiqué fue: "${selectedHypothesis}".${heartNote}${interactionNote} Quisiera agendar una sesión de acompañamiento pastoral.`
                    : `Hola, completé la autoexploración Qué me detiene en Levántate Resplandece. Mi área de exploración principal fue ${primaryBlock.title} (${primaryBlock.score}/5).${heartNote}${interactionNote} Quisiera agendar una sesión de acompañamiento pastoral.`;

                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-8"
                    >
                      {/* MAPA DE EXPLORACIÓN DEL CORAZÓN (PROMPTS 5-19) */}
                      <HeartExplorationSection
                        mapData={aiDiagnosis?.heartExplorationMap}
                        counselingPlan={aiDiagnosis?.counselingPlan}
                        discernment={aiDiagnosis?.pastoralDiscernment}
                        fidelityCheck={aiDiagnosis?.fidelityCheck}
                        centralQuestion={aiDiagnosis?.centralSessionQuestion}
                        behavioralTask={aiDiagnosis?.behavioralTask}
                        userName={userName || 'Aconsejado'}
                        onLoadCase19={handleLoadSimulatedCase19}
                        isSimulatedCase19={isSimulatedCase19}
                      />

                      {/* BANNER METODOLÓGICO: FILOSOFÍA DE EXPLORACIÓN Y DISCERNIMIENTO */}
                      <div className="bg-gradient-to-r from-amber-950/25 via-[#161616] to-amber-950/15 border border-[#C9A84C]/30 p-5 sm:p-6 rounded-3xl relative overflow-hidden">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] flex-shrink-0 mt-0.5">
                            <Compass className="w-5 h-5 text-[#C9A84C]" />
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-mono uppercase tracking-widest text-[#C9A84C] font-bold">
                                Modelo de Discernimiento Pastoral
                              </span>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/25 font-bold">
                                DATOS → PATRONES → HIPÓTESIS → VALIDACIÓN → AYUDA
                              </span>
                            </div>
                            <p className="text-white/85 leading-relaxed">
                              <strong>Principio Fundamental (Prompt 20):</strong> «La herramienta no pretende decirle al consejero quién es la persona. Pretende ayudarle a hacer mejores preguntas para comprender cómo esa persona está interpretando sus circunstancias, qué está buscando, qué teme, cómo responde y dónde necesita ser redirigida hacia la verdad de Dios y la suficiencia de Cristo.»
                            </p>
                            <p className="text-[#C9A84C] font-mono text-[11px] pt-0.5">
                              La meta no es producir una etiqueta. La meta es producir un mapa de comprensión y una dirección de ayuda.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CONDICIONAL: PERFIL SANO vs PERFIL CON DETECCIÓN */}
                      {isAllHealthy ? (
                        <div className="border bg-gradient-to-br from-[#0F1D14] via-[#121A15] to-[#0D1410] border-emerald-500/30 p-6 sm:p-8 rounded-3xl relative overflow-hidden text-white/90 shadow-2xl space-y-5">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <Shield className="w-6 h-6 text-emerald-400" />
                            <span className="text-xs font-mono uppercase font-bold tracking-wider">
                              Perfil de Estabilidad y Paz Interior (Todos los bloques ≤ 2/5)
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                              ¡Damos gracias a Dios! Tus respuestas reflejan una temporada de equilibrio y descanso.
                            </h3>
                            <p className="text-sm text-emerald-200/80 leading-relaxed font-sans">
                              Ninguno de los 9 bloques supera el umbral de activación. El puntaje máximo registrado fue de {primaryBlock.score}/5 en {primaryBlock.title}.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="bg-black/30 border border-emerald-500/20 p-4 rounded-2xl space-y-1.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                                1. DATO OBSERVABLE
                              </span>
                              <p className="text-xs text-white/80 leading-relaxed">
                                Respuestas con baja frecuencia de tensión, control o rumiación en los 9 bloques examinados.
                              </p>
                            </div>

                            <div className="bg-black/30 border border-emerald-500/20 p-4 rounded-2xl space-y-1.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                                2. PATRÓN OBSERVABLE
                              </span>
                              <p className="text-xs text-white/80 leading-relaxed">
                                Buena autorregulación emocional, límites sanos y capacidad de descanso frente a las demandas cotidianas.
                              </p>
                            </div>

                            <div className="bg-black/30 border border-emerald-500/20 p-4 rounded-2xl space-y-1.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                                3. HIPÓTESIS DE TRABAJO
                              </span>
                              <p className="text-xs text-white/80 leading-relaxed">
                                Podrías estar viviendo una temporada de madurez y consolidación espiritual, o bien respondiste desde un período con pocos detonantes activos.
                              </p>
                            </div>

                            <div className="bg-black/30 border border-emerald-500/20 p-4 rounded-2xl space-y-1.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                                4. DIRECCIÓN DE AYUDA Y MAYORDOMÍA
                              </span>
                              <p className="text-xs text-white/80 leading-relaxed">
                                Preservar la comunión íntima con Dios en gratitud, cuidar los tiempos de reposo y ser un canal de apoyo y mentoreo para quienes hoy atraviesan sobrecarga.
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-emerald-500/20 pt-4">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                              Pregunta para reflexionar en oración:
                            </span>
                            <p className="text-xs italic text-emerald-100/90 leading-relaxed">
                              "¿Qué hábitos de fe o personas de apoyo te han ayudado a mantenerte en paz, y de qué forma puedes invertir esta serenidad para bendecir a otros?"
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* SECUENCIA DE EXPLORACIÓN COMPLETA PARA PERFILES CON ACTIVACIÓN */
                        <div className="space-y-6">
                          {/* SECCIÓN 1: DATO Y PATRÓN OBSERVABLES (LO QUE MÁS TE DETIENE) */}
                          <div className="border bg-gradient-to-br from-[#1C1C1C] via-[#141414] to-[#0E0E0E] border-white/10 p-6 sm:p-8 rounded-3xl relative overflow-hidden text-white/90 shadow-2xl">
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#C9A84C] to-amber-600" />
                            
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                              <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-[#C9A84C]" />
                                <span className="text-xs text-[#C9A84C] font-mono uppercase font-bold tracking-wider">
                                  Lo que más te detiene
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {dominantBlocks.map((b) => (
                                  <span 
                                    key={b.id}
                                    className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                                      b.score >= 3 
                                        ? 'bg-red-500/15 text-red-300 border-red-500/30' 
                                        : 'bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30'
                                    }`}
                                  >
                                    {b.title}: {b.score}/5
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* DATO OBSERVABLE */}
                            <div className="space-y-2 mb-4 bg-black/30 border border-white/5 p-4 rounded-2xl">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A84C] font-bold block">
                                1. DATO OBSERVABLE (Reportado)
                              </span>
                              <p className="text-sm sm:text-base font-sans text-white/95 leading-relaxed font-medium">
                                {expData?.dato?.descripcion || `Reportaste un puntaje de ${primaryBlock.score}/5 en el área de ${primaryGuide.blockTitle}. ${primaryGuide.dato}`}
                              </p>
                            </div>

                            {/* PATRÓN CONDUCTUAL */}
                            <div className="space-y-2 mb-4 bg-black/30 border border-white/5 p-4 rounded-2xl">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A84C] font-bold block">
                                2. PATRÓN CONDUCTUAL OBSERVABLE
                              </span>
                              <p className="text-sm font-sans text-white/90 leading-relaxed">
                                {expData?.patron?.observacion || primaryGuide.patron}
                              </p>
                              <p className="text-xs text-white/50 italic pt-1">
                                Nota metodológica: Este es el comportamiento manifestado. La raíz del corazón no es fija ni automática, sino que requiere discernimiento conjunto a la luz de las Escrituras.
                              </p>
                            </div>

                            <div className="bg-black/50 border-l-2 border-[#C9A84C] p-3.5 rounded-r-xl text-xs text-white/80 leading-relaxed">
                              <strong className="text-[#C9A84C] font-semibold">Causa de fondo a explorar: </strong>
                              Tu necesidad de {primaryBlock.title} ({primaryBlock.score}/5) es la conducta que más te frena; {primaryGuide.rootExplanationHint}
                            </div>
                          </div>

                          {/* SECCIÓN 2: HIPÓTESIS DE TRABAJO (No diagnósticos deterministas) */}
                          <div className="border bg-[#161616] border-white/5 p-6 sm:p-8 rounded-3xl space-y-4">
                            <div className="flex items-center gap-2 text-[#C9A84C]">
                              <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                              <span className="text-xs font-mono uppercase font-bold tracking-wider">
                                3. Hipótesis de Discernimiento (A contrastar, no etiquetas fijas)
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                              Un puntaje de {primaryBlock.score}/5 en {primaryGuide.shortTitle} no define automáticamente quién eres ni sentencia tu corazón. Abre al menos tres hipótesis pastorales para examinar en oración:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                              {expData?.hipotesis && expData.hipotesis.length > 0 ? (
                                expData.hipotesis.map((h: any, idx: number) => {
                                  const isSelected = selectedHypothesis === h.titulo;
                                  return (
                                    <div 
                                      key={idx}
                                      onClick={() => setSelectedHypothesis(h.titulo)}
                                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                                        isSelected 
                                          ? 'bg-[#C9A84C]/15 border-[#C9A84C] shadow-lg shadow-[#C9A84C]/10' 
                                          : 'bg-black/30 border-white/5 hover:border-white/20'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#C9A84C]">
                                          Hipótesis {String.fromCharCode(65 + idx)}
                                        </span>
                                        {isSelected && (
                                          <CheckCircle className="w-4 h-4 text-[#C9A84C]" />
                                        )}
                                      </div>
                                      <h5 className="text-white text-xs font-bold">{h.titulo}</h5>
                                      <p className="text-white/70 text-xs leading-relaxed">{h.descripcion}</p>
                                    </div>
                                  );
                                })
                              ) : (
                                primaryGuide.hipotesis.map((hText, idx) => {
                                  const [titlePart, ...descParts] = hText.split(': ');
                                  const desc = descParts.join(': ') || hText;
                                  const isSelected = selectedHypothesis === titlePart;

                                  return (
                                    <div 
                                      key={idx}
                                      onClick={() => setSelectedHypothesis(titlePart)}
                                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                                        isSelected 
                                          ? 'bg-[#C9A84C]/15 border-[#C9A84C] shadow-lg shadow-[#C9A84C]/10' 
                                          : 'bg-black/30 border-white/5 hover:border-white/20'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#C9A84C]">
                                          Hipótesis {String.fromCharCode(65 + idx)}
                                        </span>
                                        {isSelected && (
                                          <CheckCircle className="w-4 h-4 text-[#C9A84C]" />
                                        )}
                                      </div>
                                      <h5 className="text-white text-xs font-bold">{titlePart}</h5>
                                      <p className="text-white/70 text-xs leading-relaxed">{desc}</p>
                                    </div>
                                  );
                                })
                              )}
                            </div>

                            {/* SECCIÓN 3: VALIDACIÓN PERSONAL INTERACTIVA */}
                            <div className="bg-black/40 border border-[#C9A84C]/25 p-4 sm:p-5 rounded-2xl space-y-3 mt-4">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C9A84C] uppercase tracking-wider">
                                <CheckCircle className="w-4 h-4 text-[#C9A84C]" />
                                4. Validación Personal: Tu discernimiento cuenta
                              </div>
                              <p className="text-xs text-white/80 leading-relaxed">
                                {primaryGuide.validacionPrompt}
                              </p>
                              
                              <div className="flex flex-wrap gap-2 pt-1">
                                {['Hipótesis A', 'Hipótesis B', 'Hipótesis C', 'Otra opción / A discernir en consejería'].map((opt) => {
                                  const isSelected = selectedHypothesis.includes(opt) || (opt === 'Otra opción / A discernir en consejería' && selectedHypothesis === 'Otra opción');
                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => setSelectedHypothesis(opt === 'Otra opción / A discernir en consejería' ? 'Otra opción' : opt)}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                                        isSelected 
                                          ? 'bg-[#C9A84C] text-[#0A0A0A] font-bold shadow-md shadow-[#C9A84C]/20' 
                                          : 'bg-[#202020] border border-white/10 text-white/70 hover:text-white hover:border-white/25'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {selectedHypothesis && (
                                <p className="text-xs text-emerald-300 bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl font-medium mt-2">
                                  ✓ Has priorizado para tu proceso: <strong>{selectedHypothesis}</strong>. Esta línea será abordada de forma específica en tu tiempo de oración y acompañamiento.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* SECCIÓN 4: PREGUNTAS POR EXPLORAR EN EL CORAZÓN */}
                          <div className="border bg-[#161616] border-white/5 p-6 sm:p-8 rounded-3xl space-y-4">
                            <div className="flex items-center gap-2 text-[#C9A84C]">
                              <Compass className="w-5 h-5 text-[#C9A84C]" />
                              <span className="text-xs font-mono uppercase font-bold tracking-wider">
                                5. Preguntas para Explorar en Oración y Consejería
                              </span>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed">
                              Lleva estas tres preguntas a tu intimidad con Dios o a tu espacio de conversación pastoral. No busques respuestas apresuradas:
                            </p>

                            <div className="space-y-2.5 pt-1">
                              {(expData?.preguntasPorExplorar || primaryGuide.preguntasPorExplorar).map((pregunta: string, idx: number) => (
                                <div key={idx} className="bg-black/30 border border-white/5 p-3.5 rounded-xl flex items-start gap-3">
                                  <span className="w-5 h-5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] text-[11px] font-mono font-bold flex-shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium">
                                    {pregunta}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* SECCIÓN 5: DIRECCIÓN DE AYUDA Y GRACIA */}
                          <div className="border bg-gradient-to-br from-[#181818] via-[#141414] to-[#101010] border-white/10 p-6 sm:p-8 rounded-3xl space-y-3">
                            <div className="flex items-center gap-2 text-[#C9A84C]">
                              <Heart className="w-5 h-5 text-[#C9A84C]" />
                              <span className="text-xs font-mono uppercase font-bold tracking-wider">
                                6. Dirección de Ayuda y Restauración
                              </span>
                            </div>
                            <p className="text-sm font-sans text-white/90 leading-relaxed">
                              {expData?.direccionDeAyuda?.enfoque || primaryGuide.direccionDeAyuda}
                            </p>
                          </div>

                          {/* SECCIÓN 7-NIVELES: NUEVO MODELO DE ANÁLISIS DEL CORAZÓN (CIRCUNSTANCIA → FRUTO) */}
                          {(() => {
                            const heartMap = aiDiagnosis?.mapaDelCorazon || primaryGuide?.heartMap;
                            const heartStepsConfig = [
                              {
                                key: 'circunstancia',
                                num: 1,
                                title: 'CIRCUNSTANCIA',
                                sub: 'Contexto detonante o demanda situacional',
                                defaultType: 'sabemos' as const,
                                data: heartMap?.circunstancia,
                                icon: Calendar,
                                defaultContent: `Enfrentar tareas complejas, decisiones compartidas o imprevistos vinculados con ${primaryBlock.title}.`,
                                defaultJustif: 'Dato confirmado en tus respuestas: Puntuación destacada en el cuestionario.'
                              },
                              {
                                key: 'interpretacion',
                                num: 2,
                                title: 'INTERPRETACIÓN',
                                sub: 'Significado o sentencia interna que la mente le otorga',
                                defaultType: 'explorar' as const,
                                data: heartMap?.interpretacion,
                                icon: Brain,
                                defaultContent: '“Si no controlo cada detalle o si fallo, quedará demostrada mi insuficiencia ante los demás.”',
                                defaultJustif: 'Hipótesis pastoral: Lectura cognitiva interna a contrastar en oración.'
                              },
                              {
                                key: 'deseo',
                                num: 3,
                                title: 'DESEO / ANHELO',
                                sub: 'Lo que el corazón anhela o intenta asegurar',
                                defaultType: 'explorar' as const,
                                data: heartMap?.deseo,
                                icon: Heart,
                                defaultContent: 'Seguridad previsible, orden blindado, ser considerado competente y tener paz sin sobresaltos.',
                                defaultJustif: 'Hipótesis del corazón: Anhelo legítimo que se intenta garantizar por esfuerzo propio.'
                              },
                              {
                                key: 'temor',
                                num: 4,
                                title: 'TEMOR',
                                sub: 'La vulnerabilidad profunda que se busca evitar a toda costa',
                                defaultType: 'explorar' as const,
                                data: heartMap?.temor,
                                icon: Shield,
                                defaultContent: 'Quedar desprotegido ante la incertidumbre, ser expuesto como insuficiente o perder la aprobación.',
                                defaultJustif: 'Hipótesis de raíz: Vulnerabilidad de fondo que se busca evitar a toda costa.'
                              },
                              {
                                key: 'estrategiaControl',
                                num: 5,
                                title: 'ESTRATEGIA DE CONTROL',
                                sub: 'Mecanismo humano y carnal de autoprotección',
                                defaultType: 'explorar' as const,
                                data: heartMap?.estrategiaControl,
                                icon: Lock,
                                defaultContent: 'Supervisión exhaustiva, rigidez, dificultad para delegar, sobreanálisis o hipervigilancia.',
                                defaultJustif: 'Hipótesis de mecanismo: Estrategia de autoprotección empleada por la carne.'
                              },
                              {
                                key: 'respuesta',
                                num: 6,
                                title: 'RESPUESTA',
                                sub: 'Conducta manifiesta y síntoma observable reportado',
                                defaultType: 'sabemos' as const,
                                data: heartMap?.respuesta,
                                icon: Activity,
                                defaultContent: 'Asumir la carga total, postergar decisiones hasta que todo esté perfecto o replegarse a la defensiva.',
                                defaultJustif: 'Dato confirmado en tus respuestas: Conducta y síntoma reportado en el test.'
                              },
                              {
                                key: 'fruto',
                                num: 7,
                                title: 'FRUTO / CONSECUENCIA',
                                sub: 'Impacto en paz, relaciones y oportunidades',
                                defaultType: 'explorar' as const,
                                data: heartMap?.fruto,
                                icon: Flame,
                                defaultContent: 'Fatiga mental, tensión vincular, ansiedad constante, postergación y pérdida del reposo en Dios.',
                                defaultJustif: 'Hipótesis de consecuencia: Impacto en paz y relaciones para validar personalmente.'
                              }
                            ];

                            const confirmedCount = Object.values(confirmedHeartSteps).filter(Boolean).length;

                            return (
                              <div className="border bg-gradient-to-b from-[#181818] via-[#121212] to-[#0D0D0D] border-white/10 p-6 sm:p-8 rounded-3xl relative overflow-hidden text-white/90 shadow-2xl space-y-6">
                                {/* Header banner */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Compass className="w-5 h-5 text-[#C9A84C]" />
                                      <span className="text-xs text-[#C9A84C] font-mono uppercase font-bold tracking-wider">
                                        Dinámica Bíblica del Corazón (7 Niveles)
                                      </span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                                      Modelo de Análisis del Corazón
                                    </h3>
                                    <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
                                      La conducta externa nace de las aguas profundas del corazón (Proverbios 4:23, Lucas 6:45). La aplicación construye este mapa distinguiendo estrictamente lo que es un dato directamente reportado de lo que proponemos como hipótesis para tu discernimiento.
                                    </p>
                                  </div>

                                  <div className="bg-black/50 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3 flex-shrink-0">
                                    <div className="text-right">
                                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">Tus Validaciones</span>
                                      <span className="text-xs font-bold text-[#C9A84C] font-mono">
                                        {confirmedCount} de 5 hipótesis validadas
                                      </span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
                                      <Check className="w-4 h-4" />
                                    </div>
                                  </div>
                                </div>

                                {/* CRITICAL VISUAL DISTINCTION BAR: "Lo que sabemos" vs "Lo que estamos proponiendo explorar" */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-black/40 border border-white/10 p-4 sm:p-5 rounded-2xl">
                                  <div className="flex items-start gap-3 bg-emerald-950/25 border border-emerald-500/30 p-3.5 rounded-xl">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                                      <CheckCircle className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300 block">
                                        ✓ LO QUE SABEMOS
                                      </span>
                                      <p className="text-xs text-white/80 leading-relaxed">
                                        <strong>Hechos y datos observables:</strong> Puntuaciones registradas y conductas que marcaste expresamente en el cuestionario (Circunstancia y Respuesta).
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-3 bg-amber-950/25 border border-[#C9A84C]/30 p-3.5 rounded-xl">
                                    <div className="w-6 h-6 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] flex-shrink-0 mt-0.5">
                                      <Search className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C9A84C] block">
                                        🔍 LO QUE ESTAMOS PROPONIENDO EXPLORAR
                                      </span>
                                      <p className="text-xs text-white/80 leading-relaxed">
                                        <strong>Hipótesis pastorales:</strong> Interpretaciones, anhelos internos, temores y consecuencias propuestas para orar y discernir. <em>Haz clic para confirmar las que resuenan contigo.</em>
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* THE 7-STEP VERTICAL FLOW */}
                                <div className="space-y-2 pt-1">
                                  {heartStepsConfig.map((step, idx) => {
                                    const isConfirmedByUser = !!confirmedHeartSteps[step.key];
                                    const isFact = step.defaultType === 'sabemos';
                                    const isExploration = !isFact;
                                    const IconComponent = step.icon;
                                    const stepContent = step.data?.contenido || step.defaultContent;
                                    const stepJustif = step.data?.justificacion || step.defaultJustif;

                                    return (
                                      <React.Fragment key={step.key}>
                                        <div 
                                          className={`transition-all duration-300 rounded-2xl border p-4 sm:p-5 relative ${
                                            isFact
                                              ? 'bg-gradient-to-r from-emerald-950/25 via-[#131E17] to-[#101913] border-emerald-500/40 border-l-4 border-l-emerald-400 shadow-lg shadow-emerald-950/20'
                                              : isConfirmedByUser
                                                ? 'bg-gradient-to-r from-emerald-950/30 via-[#182319] to-[#111A12] border-emerald-400 border-l-4 border-l-emerald-400 shadow-xl shadow-emerald-950/30'
                                                : 'bg-gradient-to-r from-amber-950/20 via-[#1B1812] to-[#14120D] border-[#C9A84C]/35 border-dashed border-l-4 border-l-[#C9A84C] hover:border-solid hover:border-[#C9A84C]/60'
                                          }`}
                                        >
                                          {/* Top header row */}
                                          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                                            <div className="flex items-center gap-2.5">
                                              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                                                isFact || isConfirmedByUser
                                                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                                                  : 'bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C]'
                                              }`}>
                                                {step.num}
                                              </span>
                                              <div>
                                                <h4 className="text-white text-xs sm:text-sm font-bold font-display tracking-wide uppercase flex items-center gap-2">
                                                  <IconComponent className="w-3.5 h-3.5 text-[#C9A84C]" />
                                                  {step.title}
                                                </h4>
                                                <span className="text-[10px] text-white/50 block font-mono">
                                                  {step.sub}
                                                </span>
                                              </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex items-center gap-2">
                                              {isFact ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                                                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                                                  LO QUE SABEMOS
                                                </span>
                                              ) : isConfirmedByUser ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/25 text-emerald-200 border border-emerald-400 uppercase tracking-wider shadow-sm shadow-emerald-500/20">
                                                  <Check className="w-3 h-3 text-emerald-300" />
                                                  ✓ CONFIRMADO POR TI
                                                </span>
                                              ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/35 uppercase tracking-wider">
                                                  <Search className="w-3 h-3 text-[#C9A84C]" />
                                                  PROPUESTO PARA EXPLORAR
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          {/* Step description */}
                                          <div className="bg-black/40 border border-white/5 p-3.5 sm:p-4 rounded-xl space-y-2 my-2">
                                            <p className="text-sm sm:text-base font-sans text-white/95 leading-relaxed font-medium">
                                              {stepContent}
                                            </p>
                                            <div className="flex items-center gap-2 text-[11px] text-white/50 italic border-t border-white/5 pt-2">
                                              <Info className="w-3 h-3 text-white/40 flex-shrink-0" />
                                              <span>{stepJustif}</span>
                                            </div>
                                          </div>

                                          {/* Action toggle for hypothesis steps */}
                                          {isExploration && (
                                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                              <span className="text-[11px] text-white/60">
                                                {isConfirmedByUser 
                                                  ? "✓ Has validado esta hipótesis como representativa de tu experiencia interna."
                                                  : "¿Esta descripción refleja lo que experimentas en tu corazón?"}
                                              </span>
                                              <button
                                                type="button"
                                                onClick={() => toggleHeartStep(step.key)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                                                  isConfirmedByUser
                                                    ? 'bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/40'
                                                    : 'bg-[#C9A84C]/20 hover:bg-[#C9A84C]/35 text-[#C9A84C] border border-[#C9A84C]/40 hover:border-[#C9A84C]'
                                                }`}
                                              >
                                                {isConfirmedByUser ? (
                                                  <>
                                                    <Check className="w-3.5 h-3.5" />
                                                    Validado (clic para desmarcar)
                                                  </>
                                                ) : (
                                                  <>
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                    Sí, me identifico (validar hipótesis)
                                                  </>
                                                )}
                                              </button>
                                            </div>
                                          )}
                                        </div>

                                        {/* Connector down arrow */}
                                        {idx < heartStepsConfig.length - 1 && (
                                          <div className="flex flex-col items-center justify-center my-1 py-0.5" aria-hidden="true">
                                            <div className="w-0.5 h-3 bg-gradient-to-b from-[#C9A84C]/30 to-[#C9A84C]/70" />
                                            <div className="w-6 h-6 rounded-full bg-[#181818] border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] shadow-sm my-0.5">
                                              <ArrowDown className="w-3 h-3 text-[#C9A84C]" />
                                            </div>
                                            <div className="w-0.5 h-3 bg-gradient-to-b from-[#C9A84C]/70 to-[#C9A84C]/30" />
                                          </div>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                </div>

                                {/* Biblical foundation footer */}
                                <div className="bg-black/50 border border-white/10 p-4 rounded-2xl flex items-start gap-3 text-xs text-white/70 leading-relaxed">
                                  <Heart className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="text-[#C9A84C] font-semibold block mb-0.5">Fundamento Bíblico:</strong>
                                    «Sobre toda cosa guardada, guarda tu corazón; porque de él mana la vida» (Proverbios 4:23). El cambio bíblico no consiste en controlar externamente la respuesta o castigar el síntoma, sino en llevar el deseo y el temor a la cruz de Cristo, donde su gracia transforma la raíz.
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* SECCIÓN: MAPEO DINÁMICO DE INTERACCIONES ENTRE BLOQUES */}
                      <div className="border bg-gradient-to-br from-[#1A1813] via-[#141414] to-[#0E0E0E] border-[#C9A84C]/30 p-6 sm:p-8 rounded-3xl relative overflow-hidden text-white/90 shadow-2xl space-y-6">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.12),transparent)] pointer-events-none" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[#C9A84C]">
                              <Zap className="w-5 h-5 text-[#C9A84C]" />
                              <span className="text-xs font-mono uppercase font-bold tracking-wider">
                                Mapeo de Interacciones entre Dimensiones
                              </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                              Cómo se Influyen Mutuamente tus Bloques Activos
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedBlockModalId(primaryBlock.id || 'control-entorno')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#C9A84C] hover:text-white transition-all cursor-pointer self-start sm:self-auto font-medium"
                          >
                            <BookOpen className="w-4 h-4 text-[#C9A84C]" />
                            Glosario & Fundamento de los 9 Bloques
                          </button>
                        </div>

                        {/* Metodología explicada */}
                        <div className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                          <p>
                            <strong className="text-white">Principio Metodológico: </strong>
                            Un bloque con puntaje alto <strong>NO significa automáticamente un problema</strong>. Por ejemplo: una necesidad de <em>Control</em> alta no equivale a ser una «persona controladora»; puede ser una respuesta de prudencia, responsabilidad o una maniobra para amortiguar dudas de <em>Capacidad</em> o proteger la <em>Aceptación Social</em>.
                          </p>
                          <p className="text-white/60 text-xs italic">
                            Por eso buscamos interacciones entre dimensiones: contrastamos cómo dos áreas se potencian para formular hipótesis de trabajo y preguntas que tú mismo puedas discernir.
                          </p>
                        </div>

                        {/* Lista de interacciones detectadas */}
                        {detectedInteractions.length > 0 ? (
                          <div className="space-y-4">
                            {[...detectedInteractions]
                              .sort((a, b) => (a.nivel === 'patron' ? 0 : 1) - (b.nivel === 'patron' ? 0 : 1))
                              .map((inter, idx) => {
                                const isValidated = validatedInteractions[inter.id];
                                const isSignal = inter.nivel === 'senal';
                                return (
                                  <div
                                    key={inter.id || idx}
                                    className={`p-5 rounded-2xl border transition-all space-y-4 ${
                                      isSignal ? 'opacity-70' : ''
                                    } ${
                                      isValidated
                                        ? 'bg-emerald-950/25 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                                        : 'bg-black/35 border-white/10 hover:border-[#C9A84C]/40'
                                    }`}
                                  >
                                    {/* Interaction Badge Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-3 py-1 rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-xs font-mono font-bold text-[#C9A84C]">
                                          {inter.blockA.name} ({inter.blockA.score}/5)
                                        </span>
                                        <span className="text-white/40 text-xs font-mono font-bold">⚡</span>
                                        <span className="px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs font-mono font-bold text-amber-300">
                                          {inter.blockB.name} ({inter.blockB.score}/5)
                                        </span>
                                        {isSignal && (
                                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                                            Señal débil — a explorar
                                          </span>
                                        )}
                                      </div>

                                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/70 font-semibold">
                                        Eje: {inter.tag}
                                      </span>
                                    </div>

                                  {/* Hipótesis de Interacción */}
                                  <div className="space-y-1 bg-black/40 border border-white/5 p-3.5 rounded-xl">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A84C] font-bold block">
                                      Hipótesis de Trabajo (A Explorar Juntos)
                                    </span>
                                    <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
                                      {inter.hipotesis}
                                    </p>
                                  </div>

                                  {/* Pregunta Clave */}
                                  <div className="space-y-1 bg-black/40 border border-white/5 p-3.5 rounded-xl">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                                      Pregunta Clave de Discernimiento Pastoral
                                    </span>
                                    <p className="text-xs sm:text-sm text-amber-100/90 italic leading-relaxed">
                                      "{inter.preguntaClave}"
                                    </p>
                                  </div>

                                  {/* Dirección de Gracia */}
                                  <div className="text-xs text-white/75 bg-white/5 border border-white/5 p-3 rounded-xl flex items-start gap-2">
                                    <Heart className="w-3.5 h-3.5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                                    <span>
                                      <strong className="text-white">Dirección de Gracia: </strong>
                                      {inter.direccionPastoral}
                                    </span>
                                  </div>

                                  {/* Botón interactivo de validación */}
                                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/5">
                                    <button
                                      type="button"
                                      onClick={() => toggleValidatedInteraction(inter.id)}
                                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                        isValidated
                                          ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                      }`}
                                    >
                                      {isValidated ? (
                                        <>
                                          <Check className="w-3.5 h-3.5" />
                                          ✓ Hipótesis de Interacción Validada por ti
                                        </>
                                      ) : (
                                        <>
                                          <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                                          ¿Esta combinación describe tu experiencia? Clic para validar
                                        </>
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setSelectedBlockModalId(inter.blockA.id)}
                                      className="text-[11px] font-mono text-white/50 hover:text-[#C9A84C] transition-colors cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                                    >
                                      Ver qué mide {inter.blockA.name} <ChevronRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="bg-black/30 border border-white/5 p-5 rounded-2xl text-center space-y-3">
                            <Shield className="w-8 h-8 text-emerald-400 mx-auto" />
                            <p className="text-xs text-white/80 max-w-md mx-auto leading-relaxed">
                              Tus respuestas actuales no muestran cruces simultáneos de alta fricción entre bloques. Las áreas examinadas se presentan en rangos moderados o independientes.
                            </p>
                            <button
                              type="button"
                              onClick={() => setSelectedBlockModalId(primaryBlock.id || 'control-entorno')}
                              className="px-4 py-2 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] text-xs font-mono font-bold hover:bg-[#C9A84C]/30 transition-all cursor-pointer inline-flex items-center gap-2"
                            >
                              <BookOpen className="w-3.5 h-3.5" /> Explorar Definición de los 9 Bloques
                            </button>
                          </div>
                        )}
                      </div>

                      {/* SECCIÓN 6: PERSPECTIVA NEURO-ESPIRITUAL */}
                      <div className="border bg-[#161616]/70 border-white/5 p-6 sm:p-8 rounded-3xl relative overflow-hidden text-white/90">
                        <div className="flex items-center gap-2 text-[#C9A84C] mb-3">
                          <Brain className="w-5 h-5 text-[#C9A84C]" />
                          <span className="text-xs font-mono uppercase font-bold tracking-wider">Perspectiva Neuro-Espiritual</span>
                        </div>
                        <p className="text-base font-sans leading-relaxed italic text-white/90">
                          "{introParagraph}"
                        </p>
                        <p className="mt-4 text-xs text-white/50 block">
                          — Tu cuerpo aprendió estos patrones para protegerte frente a vivencias difíciles, pero la verdad del evangelio renueva el entendimiento y produce descanso genuino en el corazón (Romanos 12:2).
                        </p>
                      </div>

                      {/* SECCIÓN 7: MAPA RADAR & CLASIFICACIÓN DE PERFIL */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
                        {/* SVG Radar Chart component (Optimizado para móvil sin cortes) */}
                        <div className="bg-[#141414] p-4 sm:p-7 rounded-3xl border border-white/5 flex flex-col items-center">
                          <span className="text-xs text-[#C9A84C] font-mono uppercase font-bold mb-4 text-center tracking-wide">
                            MAPA DE ACTIVACIÓN COGNITIVA (9 BLOQUES)
                          </span>
                          
                          <div className="w-full max-w-[340px] aspect-square relative">
                            <svg viewBox="-30 -30 420 420" className="w-full h-full overflow-visible">
                              {/* Background concentric reference rings */}
                              {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, sIdx) => (
                                <polygon
                                  key={sIdx}
                                  points={radarPoints.map(p => {
                                    const angle = p.angle;
                                    const x = 180 + 90 * scale * Math.cos(angle);
                                    const y = 180 + 90 * scale * Math.sin(angle);
                                    return `${x},${y}`;
                                  }).join(' ')}
                                  fill="none"
                                  stroke="rgba(255, 255, 255, 0.07)"
                                  strokeWidth="1"
                                />
                              ))}

                              {/* Level 3 Dotted Threshold Ring (Severidad) */}
                              <polygon
                                points={radarLevel3String}
                                fill="none"
                                stroke="#EF4444"
                                strokeWidth="1.5"
                                strokeDasharray="3 3"
                                opacity="0.65"
                              />

                              {/* Axis lines from center */}
                              {radarPoints.map((p, idx) => (
                                <line
                                  key={idx}
                                  x1="180"
                                  y1="180"
                                  x2={p.outerX}
                                  y2={p.outerY}
                                  stroke="rgba(255, 255, 255, 0.08)"
                                  strokeWidth="1"
                                />
                              ))}

                              {/* Outer boundary polygon */}
                              <polygon
                                points={radarOuterString}
                                fill="none"
                                stroke="rgba(201, 168, 76, 0.15)"
                                strokeWidth="1"
                              />

                              {/* Filled data polygon */}
                              <polygon
                                points={radarPointsString}
                                fill="rgba(201, 168, 76, 0.22)"
                                stroke="#C9A84C"
                                strokeWidth="2.5"
                                className="filter drop-shadow-[0_0_10px_rgba(201,168,76,0.35)]"
                              />

                              {/* Individual score nodes */}
                              {radarPoints.map((p, idx) => {
                                const isSevere = p.score >= 3;
                                return (
                                  <circle
                                    key={idx}
                                    cx={p.x}
                                    cy={p.y}
                                    r={isSevere ? 5 : 4}
                                    fill={isSevere ? '#EF4444' : '#C9A84C'}
                                    stroke={isSevere ? '#FFFFFF' : '#0D0D0D'}
                                    strokeWidth={isSevere ? 1.5 : 1}
                                    className={isSevere ? 'filter drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]' : ''}
                                  />
                                );
                              })}

                              {/* Labels positioned cleanly with wide margins to avoid clipping */}
                              {radarPoints.map((p, idx) => {
                                const angle = p.angle;
                                const offsetDist = 110;
                                const textX = 180 + offsetDist * Math.cos(angle);
                                const textY = 180 + offsetDist * Math.sin(angle);
                                
                                let textAnchor = 'middle';
                                if (Math.cos(angle) > 0.25) textAnchor = 'start';
                                else if (Math.cos(angle) < -0.25) textAnchor = 'end';

                                let dy = '3';
                                if (Math.sin(angle) < -0.7) dy = '-6';
                                else if (Math.sin(angle) > 0.7) dy = '12';

                                return (
                                  <text
                                    key={idx}
                                    x={textX}
                                    y={textY}
                                    dy={dy}
                                    textAnchor={textAnchor}
                                    className="fill-white/80 text-[9.5px] sm:text-[10.5px] font-mono tracking-tight font-medium"
                                  >
                                    {p.shortTitle}{' '}
                                    <tspan className={p.score >= 3 ? 'fill-red-400 font-bold' : 'fill-[#C9A84C] font-bold'}>
                                      ({p.score}/5)
                                    </tspan>
                                  </text>
                                );
                              })}
                            </svg>
                          </div>

                          {/* Distinct Legend */}
                          <div className="flex flex-wrap gap-3 sm:gap-5 mt-6 text-[11px] font-mono text-white/70 justify-center">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 bg-[#C9A84C] rounded-full inline-block" />
                              <span>Nivel Leve / Sano (&lt;3)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 bg-red-400 rounded-full inline-block shadow-[0_0_6px_rgba(248,113,113,0.7)]" />
                              <span className="text-red-300 font-semibold">Activación Severa (≥3)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-3.5 h-0.5 border-b-2 border-dashed border-red-400 inline-block" />
                              <span className="text-white/60">Umbral Alerta (3)</span>
                            </div>
                          </div>

                          {/* Ordered list of 9 blocks below radar */}
                          <div className="w-full mt-6 space-y-2 border-t border-white/5 pt-4">
                            <div className="flex justify-between items-center text-[11px] font-mono text-white/50 px-1">
                              <span>Bloques ordenados por activación</span>
                              <span>Puntaje</span>
                            </div>
                            {sortedBlocksWithScores.map((b) => {
                              const isSevere = b.score >= 3;
                              const percent = (b.score / 5) * 100;
                              return (
                                <div key={b.id} className="bg-[#101010] border border-white/5 rounded-xl p-2.5 space-y-1.5">
                                  <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-white/90">{b.title}</span>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedBlockModalId(b.id)}
                                        className="text-[10px] text-[#C9A84C]/80 hover:text-[#C9A84C] hover:underline font-mono cursor-pointer flex items-center gap-0.5"
                                        title="Ver qué mide y qué no mide este bloque"
                                      >
                                        <HelpCircle className="w-3 h-3" />
                                        <span>Definición</span>
                                      </button>
                                    </div>
                                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                                      isSevere ? 'bg-red-500/15 text-red-400 border border-red-500/25' : 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/25'
                                    }`}>
                                      {b.score} / 5
                                    </span>
                                  </div>
                                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        isSevere ? 'bg-gradient-to-r from-red-500 to-rose-400' : 'bg-gradient-to-r from-[#C9A84C] to-amber-400'
                                      }`}
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Diagnostic details (Línea de Exploración de Perfil) */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[#C9A84C]">
                            <Sparkles className="w-5 h-5" />
                            <h4 className="text-lg font-bold font-display">Línea de Exploración de Perfil</h4>
                          </div>

                          <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
                            <div>
                              <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider font-mono font-bold">
                                Hipótesis de Creencia a Contrastar
                              </span>
                              <p className="text-white text-base font-semibold leading-relaxed mt-1">
                                {displayBelief}
                              </p>
                              <span className="text-[10px] text-white/40 font-mono block mt-1">
                                Bloque asociado: {primaryBlock.title} ({primaryBlock.score}/5)
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-3">
                              <div>
                                <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider font-mono font-bold">Hipótesis de Temor Raíz</span>
                                <p className="text-white/80 text-xs leading-relaxed mt-1">
                                  {aiDiagnosis?.fase1?.rootFear || results[0]?.impacto || "Temor a que la situación se desborde si no intervienes personalmente."}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider font-mono font-bold">Emoción Observada</span>
                                <p className="text-white/80 text-xs leading-relaxed mt-1">
                                  {aiDiagnosis?.fase1?.dominantEmotion || (primaryBlock.score >= 3 ? "Alerta y tensión continua" : "Inseguridad periódica")}
                                </p>
                              </div>
                            </div>

                            <div className="border-t border-white/5 pt-3">
                              <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider font-mono font-bold block mb-1">
                                Tendencia Conductual a Vigilar
                              </span>
                              <p className="text-white/70 text-xs leading-relaxed italic">
                                "{aiDiagnosis?.fase2?.selfSabotageMechanism || (results[0]?.conducta ? results[0].conducta.join(", ") : 'Asumir el control excesivo o postergar decisiones para protegerte del error.')}"
                              </p>
                            </div>
                          </div>

                          {/* Mensaje de cuidado pastoral si hay muchos bloques severos */}
                          {severeBlocksCount >= 4 && (
                            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3 text-amber-200 text-xs leading-relaxed">
                              <Heart className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-amber-300 font-bold block mb-1">Acompañamiento recomendado:</strong>
                                Has registrado varios bloques con activación elevada simultánea. Esto refleja un período de sobrecarga importante. Te animamos a no llevar este proceso a solas y buscar un espacio de consejería pastoral o profesional para caminar con respaldo y serenidad.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* SECCIÓN 8: COSTO DE MANTENER LA MENTIRA (4 DIMENSIONES PERSONALIZADAS) */}
                      <div className="space-y-4 pt-4">
                        <div className="text-center space-y-1">
                          <h4 className="text-[#C9A84C] font-bold text-sm uppercase tracking-wider font-mono">
                            Costo Actual de Mantener la Mentira (Las 4 Dimensiones)
                          </h4>
                          <p className="text-xs text-white/50">
                            Impacto específico en tu vida diaria basado en tu área dominante ({primaryBlock.title})
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-red-500/[0.03] border border-red-500/15 p-5 rounded-2xl space-y-2">
                            <span className="text-xs font-mono font-bold text-red-400 block uppercase">1. Decisiones</span>
                            <p className="text-white/80 text-xs leading-relaxed">
                              {aiDiagnosis?.fase2?.currentCost?.decisions || primaryGuide.dimensionCosts.decisions}
                            </p>
                          </div>
                          <div className="bg-red-500/[0.03] border border-red-500/15 p-5 rounded-2xl space-y-2">
                            <span className="text-xs font-mono font-bold text-red-400 block uppercase">2. Emociones</span>
                            <p className="text-white/80 text-xs leading-relaxed">
                              {aiDiagnosis?.fase2?.currentCost?.emotions || primaryGuide.dimensionCosts.emotions}
                            </p>
                          </div>
                          <div className="bg-red-500/[0.03] border border-red-500/15 p-5 rounded-2xl space-y-2">
                            <span className="text-xs font-mono font-bold text-red-400 block uppercase">3. Relaciones</span>
                            <p className="text-white/80 text-xs leading-relaxed">
                              {aiDiagnosis?.fase2?.currentCost?.relationships || primaryGuide.dimensionCosts.relationships}
                            </p>
                          </div>
                          <div className="bg-red-500/[0.03] border border-red-500/15 p-5 rounded-2xl space-y-2">
                            <span className="text-xs font-mono font-bold text-red-400 block uppercase">4. Futuro / Propósito</span>
                            <p className="text-white/80 text-xs leading-relaxed">
                              {aiDiagnosis?.fase2?.currentCost?.potentialFuture || primaryGuide.dimensionCosts.potentialFuture}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* SECCIÓN 9: FORTALEZAS (TUS ÁREAS MÁS SANAS) */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Shield className="w-5 h-5 text-emerald-400" />
                          <h4 className="text-lg font-bold font-display text-white">Tus Áreas Más Sanas</h4>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Tu autoexploración también muestra áreas de libertad, equilibrio y paz. Reconocer estas fortalezas te da un punto de apoyo firme para renovar lo demás:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {healthiestBlocks.map((block) => (
                            <div key={block.id} className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                                  ✓
                                </div>
                                <div>
                                  <h5 className="text-white text-xs font-bold">{block.title}</h5>
                                  <span className="text-[10px] text-emerald-400/80 font-mono">Puntaje saludable: {block.score}/5</span>
                                </div>
                              </div>
                              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">
                                En paz
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SECCIÓN 10: PASOS PRÁCTICOS Y LLAMADO A LA ACCIÓN */}
                      <div className="space-y-5 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[#C9A84C]">
                          <Calendar className="w-5 h-5 text-[#C9A84C]" />
                          <h4 className="text-lg font-bold font-display text-white">Tu Siguiente Paso Esta Semana</h4>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                          La renovación de la mente cobra vida cuando la verdad se traduce en acciones concretas. Pon en práctica estos dos pasos basados en tu área dominante ({primaryGuide.blockTitle}):
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-[#161616] border border-white/5 p-5 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C9A84C] uppercase">
                              <span className="w-5 h-5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] text-[11px]">1</span>
                              Acción Práctica 1
                            </div>
                            <p className="text-white/85 text-xs leading-relaxed">
                              {primaryGuide.action1}
                            </p>
                          </div>
                          <div className="bg-[#161616] border border-white/5 p-5 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C9A84C] uppercase">
                              <span className="w-5 h-5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] text-[11px]">2</span>
                              Acción Práctica 2
                            </div>
                            <p className="text-white/85 text-xs leading-relaxed">
                              {primaryGuide.action2}
                            </p>
                          </div>
                        </div>

                        {/* Versículo para meditar */}
                        <div className="bg-[#0F1411] border border-emerald-500/20 p-5 rounded-2xl space-y-2">
                          <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase font-bold block">
                            Versículo para meditar esta semana
                          </span>
                          <p className="text-emerald-100 text-sm font-serif italic leading-relaxed">
                            "{primaryGuide.verse.text}"
                          </p>
                          <span className="text-emerald-400 text-xs font-mono font-bold block text-right">
                            — {primaryGuide.verse.ref}
                          </span>
                        </div>

                        {/* Botones de acción principales */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                          <a
                            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(whatsappMsg)}`}
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

                        {/* Configuración rápida de WhatsApp para el ministerio */}
                        <div className="text-center pt-2">
                          <button
                            onClick={() => {
                              setTempWhatsapp(whatsappNumber);
                              setShowWhatsappModal(true);
                            }}
                            className="text-[11px] text-white/40 hover:text-white/70 underline cursor-pointer"
                          >
                            Configurar número de WhatsApp para citas
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* TAB 1: 📖 Fase 3 y 4: Renovación Bíblica y Nueva Identidad Cristocéntrica */}
                {activeTab === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    {/* FASE 3: Contraste direct de Mentira vs Verdad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="bg-red-500/[0.02] border border-red-500/15 p-6 rounded-3xl space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-2 py-1 bg-red-500/10 text-red-400 border-bl border-red-500/20 text-[9px] font-mono rounded-bl-lg font-bold">LA ESCLAVITUD CARNAL</div>
                        <span className="text-[10px] text-red-400 uppercase tracking-widest font-mono font-bold block">La Mentira Sembrada</span>
                        <p className="text-red-200 text-lg italic font-serif leading-relaxed font-semibold">
                          "{aiDiagnosis?.fase3?.mentira || results[0]?.afirmacionTest}"
                        </p>
                        <p className="text-white/40 text-xs leading-relaxed">
                          Éste es el postulado inconsciente que debilita tu prefrontal y te aleja de la seguridad en Dios.
                        </p>
                      </div>

                      <div className="bg-emerald-500/[0.02] border border-emerald-500/15 p-6 rounded-3xl space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-2 py-1 bg-emerald-500/10 text-emerald-400 border-bl border-emerald-500/20 text-[9px] font-mono rounded-bl-lg font-bold">LA LIBERTAD DEL ENTENDIMIENTO</div>
                        <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono font-bold block">La Verdad Sellada</span>
                        <p className="text-emerald-50 text-lg font-medium leading-relaxed">
                          {aiDiagnosis?.fase3?.verdadBiblica || results[0]?.verdad}
                        </p>
                        <p className="text-white/40 text-xs leading-relaxed">
                          El postulado incondicional del evangelio que disuelve el temor mediante gracia y poder.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#0F1411] border border-emerald-500/10 p-6 rounded-2xl max-w-3xl mx-auto space-y-3">
                      <span className="text-[10px] text-emerald-400 font-mono tracking-widest block uppercase font-bold">Pasaje Anclero del Entendimiento</span>
                      <p className="text-emerald-150 leading-relaxed font-serif text-sm italic">
                        "{aiDiagnosis?.fase3?.versiculo?.texto || results[0]?.versiculos[0]?.txt}"
                      </p>
                      <strong className="text-emerald-400 font-mono block text-right">— {aiDiagnosis?.fase3?.versiculo?.referencia || results[0]?.versiculos[0]?.ref}</strong>
                      <div className="pt-2 border-t border-emerald-500/5 text-xs text-white/50 leading-relaxed">
                        <strong className="text-emerald-400">Instrucciones de ruminación:</strong> {aiDiagnosis?.fase3?.aplicacion || "Meditar y respirar en voz audible por la mañana antes de abrir pantallas de consumo."}
                      </div>
                    </div>

                    {/* FASE 4: Nueva Identidad */}
                    <div className="bg-gradient-to-br from-[#1A1813] to-[#0A0906] border-2 border-[#C9A84C]/25 p-6 sm:p-8 rounded-[2rem] text-center space-y-4 relative overflow-hidden max-w-3xl mx-auto">
                      <div className="absolute inset-0 bg-[#C9A84C]/2 w-1/2 blur-3xl pointer-events-none top-1/4 left-1/4" />
                      <Flame className="w-8 h-8 mx-auto text-[#C9A84C] animate-pulse" />
                      <span className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.2em] font-bold block">Fase 4: Determinación de Identidad Cristocéntrica</span>
                      <blockquote className="text-[#F3F4F6] italic text-base sm:text-lg leading-relaxed font-serif max-w-xl mx-auto">
                        "{aiDiagnosis?.fase4?.declaracionIdentidad || results[0]?.declaracion}"
                      </blockquote>
                      <div className="pt-2 flex justify-center">
                        <button
                          onClick={() => handleCopyToClipboard(aiDiagnosis?.fase4?.declaracionIdentidad || results[0]?.declaracion)}
                          className="bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 border border-[#C9A84C]/20 text-[#C9A84C] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Copiar mi Determinación
                        </button>
                      </div>
                    </div>

                    {/* OTRAS CREENCIAS - Journaling expandable list */}
                    <div className="space-y-4 max-w-3xl mx-auto pt-4">
                      <h4 className="text-base font-bold font-display text-white text-center">Explora las restantes creencias detectadas y escribe en tu diario de oración</h4>
                      <p className="text-white/50 text-xs text-center max-w-md mx-auto">
                        La renovación neurológica requiere de concienciar el rumiar de pensamientos. Abre cada una para escribir verdades:
                      </p>
                      
                      <div className="space-y-3">
                        {results.map((r) => (
                          <div key={r.id} className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
                            <button
                              onClick={() => setExpandedBelief(expandedBelief === r.id ? null : r.id)}
                              className="w-full text-left p-4 flex justify-between items-center bg-[#151515] hover:bg-[#1D1D1D] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] bg-[#C9A84C]/10 text-[#C9A84C] w-6 h-6 rounded-full font-bold font-mono flex items-center justify-center">
                                  {r.id}
                                </span>
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-[#C9A84C]/80 block font-mono">{r.alias}</span>
                                  <span className="text-white text-xs font-semibold">{r.creencia}</span>
                                </div>
                              </div>
                              {expandedBelief === r.id ? <ChevronUp className="w-4 h-4 text-[#C9A84C]" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                            </button>

                            {expandedBelief === r.id && (
                              <div className="p-5 border-t border-white/5 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className="text-red-400 block font-mono font-semibold uppercase text-[9px]">Voz del miedo:</span>
                                    <p className="italic bg-red-500/5 p-3 rounded-xl text-red-150 border border-red-500/5 mt-1">"{r.afirmacionTest}"</p>
                                    <span className="text-white/40 block font-semibold mt-2 uppercase text-[9px]">Costo:</span>
                                    <p className="text-white/70 leading-relaxed mt-1">{r.impacto}</p>
                                  </div>
                                  <div>
                                    <span className="text-emerald-400 block font-mono font-semibold uppercase text-[9px]">Sustitución Divina:</span>
                                    <p className="font-semibold text-emerald-50 mt-1">{r.verdad}</p>
                                    <div className="bg-[#0D0F0E] p-3 rounded-xl border border-emerald-500/5 mt-2">
                                      <p className="italic font-serif text-emerald-300">"{r.versiculos[0]?.txt}"</p>
                                      <strong className="block text-right text-[10px] text-emerald-400 font-mono mt-1">— {r.versiculos[0]?.ref}</strong>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2 border-t border-white/5 pt-3">
                                  <label className="text-[10px] uppercase font-bold text-[#C9A84C] font-mono block">Diario personal de esta creencia:</label>
                                  <textarea
                                    value={journalNotes[r.id] || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setJournalNotes(prev => ({
                                        ...prev,
                                        [r.id]: val
                                      }));
                                    }}
                                    placeholder="Registra hoy evidencias conscientes donde esta creencia mintió, y cómo aplicarás tu herencia incondicional..."
                                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-3 text-sm text-white/90 placeholder:text-white/20 font-mono focus:outline-none focus:border-[#C9A84C] min-h-[90px]"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: 🗓️ Fase 5 y 6: Itinerario de 30 Días e Instrucciones Semanales */}
                {activeTab === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    {/* FASE 5: Hoja de ruta semanal */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2 text-[#C9A84C]">
                        <Calendar className="w-5 h-5" />
                        <h4 className="text-base font-bold font-display uppercase tracking-wider font-mono">Fase 5: Hoja de Ruta de Reconfiguración Semanal</h4>
                      </div>
                      <p className="text-white/60 text-xs">
                        Para guiar la renovación mental de forma ordenada, Dios ha facultado etapas en el aprendizaje neural. Recorre este itinerario con paciencia de gracia:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Week 1 */}
                        <div className="bg-[#141414] border-l-4 border-l-indigo-400 p-5 rounded-r-2xl space-y-3 border-y border-r border-white/5">
                          <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase block">Semana 1: Consciencia Mental</span>
                          <h4 className="text-white font-bold text-sm">{aiDiagnosis?.fase5?.semana1?.objetivo || "Detectar la mentira en tu diálogo interior"}</h4>
                          <p className="text-white/60 text-xs leading-relaxed italic">"{aiDiagnosis?.fase5?.semana1?.reflexion || "Registrarás cada rumiar de insuficiencia que te quite la paz."}"</p>
                          <div className="text-[11px] text-[#C9A84C] font-mono leading-relaxed bg-[#0D0D0D] p-3 rounded-lg border border-white/5">
                            <strong>Pregunta Demoledora:</strong> {aiDiagnosis?.fase5?.semana1?.autoconfrontacion || "¿Le creo al acusador mundano o a mi Salvador?"}
                          </div>
                          <div className="border-t border-white/5 pt-2 text-[10px] text-white/40 leading-relaxed font-mono">
                            <strong>Oración de Derribo:</strong> {aiDiagnosis?.fase5?.semana1?.oracionGuiada}
                          </div>
                        </div>

                        {/* Week 2 */}
                        <div className="bg-[#141414] border-l-4 border-l-emerald-400 p-5 rounded-r-2xl space-y-3 border-y border-r border-white/5">
                          <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block">Semana 2: Desmantelamiento Cognitivo</span>
                          <h4 className="text-white font-bold text-sm">{aiDiagnosis?.fase5?.semana2?.objetivo || "Debilitar la creencia mediante evidencias"}</h4>
                          <p className="text-white/60 text-xs leading-relaxed italic">"{aiDiagnosis?.fase5?.semana2?.reencuadreBiblico || "Buscarás evidencias del cuidado de Dios contradiciendo el pánico de escasez."}"</p>
                          <div className="text-[11px] text-[#C9A84C] font-mono leading-relaxed bg-[#0D0D0D] p-3 rounded-lg border border-white/5">
                            <strong>Desafíos Conductuales:</strong> {aiDiagnosis?.fase5?.semana2?.desafiosPracticos || "Toma decisiones sin pedir aprobación redundante."}
                          </div>
                          <div className="border-t border-white/5 pt-2 text-[10px] text-white/40 leading-relaxed font-mono">
                            <strong>Anclaje Neural:</strong> {aiDiagnosis?.fase5?.semana2?.interrupcionPatrones || "Pon tu mano en el pecho al sentir pánico y susurra: 'Su gracia es mi ancla'."}
                          </div>
                        </div>

                        {/* Week 3 */}
                        <div className="bg-[#141414] border-l-4 border-l-amber-500 p-5 rounded-r-2xl space-y-3 border-y border-r border-white/5">
                          <span className="text-[10px] text-[#C9A84C] font-mono font-bold uppercase block">Semana 3: Renovación y Cableado Nuevo</span>
                          <h4 className="text-white font-bold text-sm">{aiDiagnosis?.fase5?.semana3?.objetivo || "Instalar nuevas autopistas de fe"}</h4>
                          <p className="text-white/60 text-xs leading-relaxed italic">"{aiDiagnosis?.fase5?.semana3?.meditacionDiaria || "Integrarás la ruminación rítmica y la gratitud incondicional."}"</p>
                          <div className="text-[11px] text-[#C9A84C] font-mono leading-relaxed bg-[#0D0D0D] p-3 rounded-lg border border-white/5">
                            <strong>Memorización de Pasaje:</strong> {aiDiagnosis?.fase5?.semana3?.memorizacionVersiculo || "Visualiza el versículo en post-it de tu baño o celular."}
                          </div>
                          <div className="border-t border-white/5 pt-2 text-[10px] text-white/40 leading-relaxed font-mono">
                            <strong>Visualización Cristocéntrica:</strong> {aiDiagnosis?.fase5?.semana3?.visualizacionBiblica || "Ensaya mentalmente por la noche actuando en paz."}
                          </div>
                        </div>

                        {/* Week 4 */}
                        <div className="bg-[#141414] border-l-4 border-l-rose-400 p-5 rounded-r-2xl space-y-3 border-y border-r border-white/5">
                          <span className="text-[10px] text-rose-400 font-mono font-bold uppercase block">Semana 4: Consolidación y Obediencia de Fe</span>
                          <h4 className="text-white font-bold text-sm">{aiDiagnosis?.fase5?.semana4?.objetivo || "Vivir bajo soberana filiación"}</h4>
                          <p className="text-white/60 text-xs leading-relaxed italic">"{aiDiagnosis?.fase5?.semana4?.retosReales || "Levanta la mano en tareas de incomodidad confiada."}"</p>
                          <div className="text-[11px] text-[#C9A84C] font-mono leading-relaxed bg-[#0D0D0D] p-3 rounded-lg border border-white/5">
                            <strong>Porvenir de Hijo:</strong> {aiDiagnosis?.fase5?.semana4?.accionesFe || "Ofrece un acto de extrema generosidad."}
                          </div>
                          <div className="border-t border-white/5 pt-2 text-[10px] text-white/40 leading-relaxed font-mono">
                            <strong>Paso de Obediencia:</strong> {aiDiagnosis?.fase5?.semana4?.pasosObediencia || "Acepta ese puesto ministerial o encargo pastoral que habías pospuesto."}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FASE 6: PLAN DIARIO Y CALENDARIO INTERACTIVO */}
                    <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#C9A84C] font-mono block">Fase 6: Itinerario de Reconfiguración Diario</span>
                          <h4 className="text-lg font-bold font-display text-white">Interactiva tu agenda de 30 días</h4>
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
                              <span className="text-[9px] uppercase font-bold text-[#C9A84C] font-mono">Enfoque del Día {selectedDayIndex + 1}</span>
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

                {/* TAB 3: 📈 Fase 7: Registro de Progreso y Evaluación Semanal */}
                {activeTab === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8 max-w-2xl mx-auto"
                  >
                    <div className="space-y-2 pt-2 text-center">
                      <span className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.2em] font-semibold block">FASE 7: REGISTRO Y MONITOREO DE EVOLUCIÓN</span>
                      <h4 className="text-2xl font-bold font-display text-white">Escala Semanal de Ajuste</h4>
                      <p className="text-white/60 text-xs max-w-sm mx-auto leading-relaxed">
                        Mueve los controles deslizantes de acuerdo con las percepciones de tu estado emocional y conductual para esta semana. El pastor-clínico te dará retroalimentación instantánea.
                      </p>
                    </div>

                    <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 space-y-6 shadow-inner">
                      {/* Anxiety Slider (lower is better) */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <label className="text-white/80 font-bold flex items-center gap-1.5 font-sans">
                            🔻 Nivel de Ansiedad y Tensión Corporal
                          </label>
                          <span className="font-mono text-[#C9A84C] font-bold">{progressScores.anxiety} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={progressScores.anxiety}
                          onChange={(e) => setProgressScores(prev => ({ ...prev, anxiety: parseInt(e.target.value, 10) }))}
                          className="w-full h-1.5 bg-[#202020] rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
                        />
                        <div className="flex justify-between text-[9px] text-white/30 font-mono">
                          <span>1. Paz Absoluta</span>
                          <span>10. Pánico e Impaciencia</span>
                        </div>
                      </div>

                      {/* Confidence Slider (higher is better) */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <label className="text-white/80 font-bold flex items-center gap-1.5 font-sans">
                            🛡️ Confianza en tu Capacidad Proveniente de Gracia
                          </label>
                          <span className="font-mono text-[#C9A84C] font-bold">{progressScores.confidence} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={progressScores.confidence}
                          onChange={(e) => setProgressScores(prev => ({ ...prev, confidence: parseInt(e.target.value, 10) }))}
                          className="w-full h-1.5 bg-[#202020] rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
                        />
                        <div className="flex justify-between text-[9px] text-white/30 font-mono">
                          <span>1. Incompetente / Frustración</span>
                          <span>10. Totalmente Capaz en Cristo</span>
                        </div>
                      </div>

                      {/* Obedience Slider (higher is better) */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <label className="text-white/80 font-bold flex items-center gap-1.5 font-sans">
                            🌱 Obediencia y Toma de Acciones Incómodas de Fe
                          </label>
                          <span className="font-mono text-[#C9A84C] font-bold">{progressScores.obedience} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={progressScores.obedience}
                          onChange={(e) => setProgressScores(prev => ({ ...prev, obedience: parseInt(e.target.value, 10) }))}
                          className="w-full h-1.5 bg-[#202020] rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
                        />
                        <div className="flex justify-between text-[9px] text-white/30 font-mono">
                          <span>1. Paralizado / Evitativo</span>
                          <span>10. Obediencia Radical</span>
                        </div>
                      </div>

                      {/* Hope Slider (higher is better) */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <label className="text-white/80 font-bold flex items-center gap-1.5 font-sans">
                            🕊️ Esperanza de Filiación (Mirada sobre tu porvenir divino)
                          </label>
                          <span className="font-mono text-[#C9A84C] font-bold">{progressScores.hope} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={progressScores.hope}
                          onChange={(e) => setProgressScores(prev => ({ ...prev, hope: parseInt(e.target.value, 10) }))}
                          className="w-full h-1.5 bg-[#202020] rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
                        />
                        <div className="flex justify-between text-[9px] text-white/30 font-mono">
                          <span>1. Catastrofismo / Angustia</span>
                          <span>10. Plena Certeza del Porvenir</span>
                        </div>
                      </div>

                      {/* Frequency Slider (lower is better) */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <label className="text-white/80 font-bold flex items-center gap-1.5 font-sans">
                            🧠 Frecuencia de Aparición del Pensamiento Limitante
                          </label>
                          <span className="font-mono text-[#C9A84C] font-bold">{progressScores.frequency} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={progressScores.frequency}
                          onChange={(e) => setProgressScores(prev => ({ ...prev, frequency: parseInt(e.target.value, 10) }))}
                          className="w-full h-1.5 bg-[#202020] rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
                        />
                        <div className="flex justify-between text-[9px] text-white/30 font-mono">
                          <span>1. Rara vez / Neutralizado</span>
                          <span>10. Rumiación Severa</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Evaluation Commentary Panel */}
                    {(() => {
                      const evaluation = getProgressEvaluation(progressScores, userName);
                      return (
                        <div className={`p-6 rounded-2xl border ${evaluation.color} space-y-4`}>
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-white/50 block font-mono">Análisis Clínico-Pastoral</span>
                              <h5 className="text-white font-bold text-sm">{evaluation.status}</h5>
                            </div>
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold self-start sm:self-center font-mono ${evaluation.badge}`}>
                              Evaluando Nivel
                            </span>
                          </div>
                          
                          <p className="text-white/80 text-xs leading-relaxed italic font-serif">
                             "{evaluation.commentary}"
                          </p>
                          <div className="pt-2">
                            <button
                              onClick={() => alert(`Guardamos tu evaluación de progreso semanal en tu perfil seguro localmente.`)}
                              className="bg-white/5 hover:bg-white/10 text-white shadow p-2.5 rounded-xl text-xs font-mono border border-white/15 w-full cursor-pointer"
                            >
                               ✓ Guardar Monitoreo Semanal
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}

                {/* TAB 4: 🎓 Fase 8: Clausura, Itinerario de Resultados & Reporte Final */}
                {activeTab === 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8 max-w-3xl mx-auto"
                  >
                    {/* Comparative before/after */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="bg-red-500/[0.01] border-l-4 border-l-red-500 border-y border-r border-[#301010] p-5 rounded-r-2xl space-y-2">
                        <span className="text-[10px] text-red-400 font-mono font-bold uppercase block">1. Antes (Mente Esclavizada)</span>
                        <p className="text-white/70 text-xs leading-relaxed italic">
                          "{aiDiagnosis?.reporteFinal?.antes || 'Procedías bajo la tiranía del pánico al error o rechazo de los hombres, desgastando tu liderazgo y ocultando dones en hipervigilancia extrema.'}"
                        </p>
                      </div>

                      <div className="bg-[#0D1F13] border-l-4 border-l-emerald-400 border-y border-r border-[#10301A] p-5 rounded-r-2xl space-y-2">
                        <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block">2. Ahora (Filiación Redimida)</span>
                        <p className="text-[#DAF7E2] text-xs leading-relaxed italic font-semibold">
                          "{aiDiagnosis?.reporteFinal?.ahora || 'Caminas asentado firmemente bajo la justificación de Cristo, obrando de reposo a labor con plena audacia de herencia incondicional.'}"
                        </p>
                      </div>
                    </div>

                    {/* Bento of report results */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl">
                        <span className="text-[#C9A84C] font-mono text-[9px] uppercase font-bold block mb-1">Fortaleza Demolida</span>
                        <p className="text-white/80 text-xs leading-relaxed">
                          {aiDiagnosis?.reporteFinal?.creenciaDerribada || "Se rinde la idolatría de la meritocracia temporalista."}
                        </p>
                      </div>
                      <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl">
                        <span className="text-[#C9A84C] font-mono text-[9px] uppercase font-bold block mb-1">Certeza Establecida</span>
                        <p className="text-white/80 text-xs leading-relaxed font-semibold">
                          {aiDiagnosis?.reporteFinal?.verdadEstablecida || "Tu suficiencia proviene de la herencia santa sellada en la cruz."}
                        </p>
                      </div>
                      <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl">
                        <span className="text-[#C9A84C] font-mono text-[9px] uppercase font-bold block mb-1">Próximo Hábito Duradero</span>
                        <p className="text-white/80 text-xs leading-relaxed">
                          {aiDiagnosis?.reporteFinal?.proximoPaso || "Sostener un registro de evidencias conscientes de gracia de forma diaria."}
                        </p>
                      </div>
                    </div>

                    {/* Exhortacion final */}
                    <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
                      <span className="absolute -right-8 -bottom-8 text-emerald-500/5 pointer-events-none text-9xl font-serif">🙏</span>
                      <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono">
                        Exhortación Bíblica de Clausura
                      </h4>
                      <p className="text-emerald-50 italic leading-relaxed text-sm font-serif">
                        "{aiDiagnosis?.reporteFinal?.exhortacionBiblica || 'Permanece firme en tu llamado, amado/a coheredero de Cristo. Estás justificado y revestido de herencia real para que Tus obras del Reino glorifiquen al Padre continuamente. Hebreos 12:1-2.'}"
                      </p>
                    </div>

                    {/* Booking / Course action blocks (Josue's core marketing vectors) */}
                    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                      <div className="space-y-4">
                        <h4 className="text-white font-bold text-base font-display flex items-center gap-2">
                           <MessageSquare className="w-5 h-5 text-[#C9A84C]" /> ¿Deseas consejería con respaldo?
                        </h4>
                        <p className="text-white/60 text-[11px] leading-relaxed">
                          Si consideras que estos patrones o fortalezas mentales te han limitado por mucho tiempo, agenda una sesión especial de acompañamiento pastoral con el ministerio Levántate Resplandece.
                        </p>
                        <div className="flex gap-3 flex-wrap">
                          <a 
                            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola, completé el test Qué me detiene de Transformación Interior y me gustaría agendar una sesión de acompañamiento pastoral.')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#25D366] hover:bg-[#20ba56] text-[#000] font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                          >
                             Agendar por WhatsApp
                          </a>
                          <button 
                            onClick={() => {
                              setCopiedNotification(`Enlace de reserva preparado para: ${userEmail || 'tu correo registrado'}`);
                              setTimeout(() => setCopiedNotification(null), 4000);
                            }}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-2 px-3 rounded-xl text-[10px] transition-colors cursor-pointer"
                          >
                            Recibir enlace
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 md:border-l md:border-white/5 md:pl-6">
                        <h4 className="text-white font-bold text-base font-display flex items-center gap-2">
                           <BookOpen className="w-5 h-5 text-indigo-400" /> Programa Mente Renovada
                        </h4>
                        <p className="text-white/60 text-[11px] leading-relaxed">
                          Únete a nuestro seminario intensivo diseñado para desmantelar de forma conductual y espiritual fortalezas inconscientes e instalar mentes del Reino.
                        </p>
                        <a 
                          href="https://levantateresplandece1136.com/renovacion"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs items-center gap-1.5 transition-colors shadow-lg active:scale-95"
                        >
                          Explorar Curso Completo
                        </a>
                      </div>
                    </div>

                    {/* Exporter and reset buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                      <button 
                        onClick={handleExportPDF}
                        className="bg-gradient-to-r from-[#C9A84C] to-yellow-600 text-[#0D0D0D] font-bold px-10 py-4 rounded-xl text-base shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer"
                      >
                        <Download className="w-5 h-5" /> Descargar mi Guía de 30 Días (PDF)
                      </button>

                      <button 
                        onClick={restartJourney}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold bg-[#1C1C1C] hover:bg-[#262626] border border-white/5 text-white/70 hover:text-white transition-all w-full sm:w-auto cursor-pointer"
                      >
                        <RefreshCcw className="w-4 h-4" /> Resetear Evaluación
                      </button>
                    </div>
                  </motion.div>
                )}
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
