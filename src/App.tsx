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
  Flame
} from 'lucide-react';
import { creenciasDatabase, bloquesDiagnostico, CreenciaRecord } from './data/creencias';
import { generateFallbackData, AIDiagnosis } from './utils/fallbackGenerator';
import { downloadPDFResults } from './utils/pdfGenerator';

export interface UserResult extends CreenciaRecord {
  category: string;
  intensity: number;
}

type Step = 'welcome' | 'screening' | 'calculating_blocks' | 'deep_dive' | 'generating_results' | 'results';

// Clinical-Pastoral Evaluation for the 30-Day Spiritual/Neuroplastic Progress Tracker
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
      status: "Filiación Activa y Plena Paz en la Gracia",
      color: "bg-emerald-950/30 border-emerald-500/20 text-emerald-300",
      badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
      commentary: `Querido/a ${name}, tus valoraciones de monitoreo reflejan una alineación notable con el Espíritu y una reconfiguración sináptica activa de la verdad. Has logrado neutralizar los picos de rumiación y ansiedad rindiéndolos ante la Cruz, traduciendo tu teología en una praxis activa de obediencia radical. El cableado neurobiológico del temor se debilita día a día mientras la autopista de la Verdad Divina se consolida. ¡Prosigue, la gracia incondicional es tu escudo y herencia!`
    };
  } else if (index >= 5) {
    return {
      status: "Renovación en Proceso (Conflicto de Fe y Carne)",
      color: "bg-amber-950/20 border-amber-500/20 text-amber-300",
      badge: "bg-amber-500/10 text-amber-400 border border-amber-500/25",
      commentary: `Pastor/Clínico observa: ${name}, te encuentras en pleno desmantelamiento activo. Registras niveles intermedios de confianza y obediencia, pero los viejos ramales neuronales de la rumiación frecuente e inquietud intentan sabotear tu reposo en Cristo. Esto es esperable en el período de transición de 30 días. No condenes tu proceso; cada micro-acción incómoda de obediencia de fe que ejecutas (pese al temor o cansancio) es un martillazo que debilita las fortalezas antiguas. Declara tu filiación de hijo en voz elocuente.`
    };
  } else {
    return {
      status: "Alerta de Sobrecarga e Hipervigilancia Activa",
      color: "bg-red-950/20 border-red-500/20 text-red-300",
      badge: "bg-red-500/10 text-red-400 border border-red-500/25",
      commentary: `Alerta Ministerial: ${name}, tus marcas exponen síntomas severos de rumiación y un elevado estado de alerta autonómica simpática (miedo/ansiedad alto, obediencia paralizada). Es imperativo que interrumpas el bucle de hipervigilancia autoprotectora. Estás pretendiendo sostener los resultados bajo tu propio desempeño o méritos. Vuelve tu mirada a la Verdad Sustitutoria: Cristo compró tu suficiencia en la cruz. Te sugerimos agendar la sesión pastoral prioritaria por WhatsApp para recibir ministración individual.`
    };
  }
};

export default function App() {
  const [step, setStep] = useState<Step>(() => {
    const saved = localStorage.getItem('ti_step');
    return (saved as Step) || 'welcome';
  });
  const [userName, setUserName] = useState(() => localStorage.getItem('ti_user_name') || '');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('ti_user_email') || '');
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

  const handleCopyToClipboard = (text: string, label = "la declaración") => {
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

    // AI Transformation kit serialization
    if (aiDiagnosis) {
      localStorage.setItem('ti_ai_diagnosis', JSON.stringify(aiDiagnosis));
    } else {
      localStorage.removeItem('ti_ai_diagnosis');
    }
    localStorage.setItem('ti_active_tab', activeTab.toString());
    localStorage.setItem('ti_progress_scores', JSON.stringify(progressScores));
    localStorage.setItem('ti_selected_day_index', selectedDayIndex.toString());
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
    activeTab,
    progressScores,
    selectedDayIndex
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

  // Load name and email from localStorage if they exist
  useEffect(() => {
    const savedName = localStorage.getItem('ti_user_name');
    const savedEmail = localStorage.getItem('ti_user_email');
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
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
    localStorage.setItem('ti_user_name', userName);
    localStorage.setItem('ti_user_email', userEmail);
    setStep('screening');
  };

  const handleScreeningAnswer = (score: number) => {
    const currentBlockId = screeningList[screeningIndex].id;
    setScreeningAnswers(prev => ({
      ...prev,
      [currentBlockId]: score
    }));

    if (screeningIndex < screeningList.length - 1) {
      setTimeout(() => {
        setScreeningIndex(prev => prev + 1);
      }, 200);
    } else {
      setTimeout(() => {
        // Evaluate screening blocks
        setStep('calculating_blocks');
      }, 300);
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
    const currentQuestion = deepDiveQuestions[deepDiveIndex];
    setDeepDiveAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: score
    }));

    if (deepDiveIndex < deepDiveQuestions.length - 1) {
      setTimeout(() => {
        setDeepDiveIndex(prev => prev + 1);
      }, 200);
    } else {
      setTimeout(() => {
        setStep('generating_results');
      }, 300);
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
    localStorage.removeItem('ti_active_tab');
    localStorage.removeItem('ti_progress_scores');
    localStorage.removeItem('ti_selected_day_index');
  };

  const triggerDiagnosisGeneration = async (compiledResults: UserResult[]) => {
    setLoadingAi(true);
    setAiError(null);
    const primary = compiledResults[0] || (creenciasDatabase[0] as any);
    
    try {
      const response = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          primaryBelief: primary,
          activeBeliefs: compiledResults.slice(0, 5)
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.useFallback) {
          console.log("No GEMINI_API_KEY configured on server. Creating dynamic local fallback.");
          const fallback = generateFallbackData(primary, userName, userEmail, compiledResults);
          setAiDiagnosis(fallback);
        } else {
          setAiDiagnosis(data);
        }
      } else {
        console.warn("API Server responded with non-200. Proceeding with dynamic fallback.");
        const fallback = generateFallbackData(primary, userName, userEmail, compiledResults);
        setAiDiagnosis(fallback);
      }
    } catch (err) {
      console.error("Failed to query API for AI Diagnosis:", err);
      const fallback = generateFallbackData(primary, userName, userEmail, compiledResults);
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
          blockScores[item.id] = screeningAnswers[item.id] || 0;
        });

        const sortedBlocks = Object.entries(blockScores)
          .sort((a, b) => b[1] - a[1]);
        
        const primaryBlockId = sortedBlocks[0]?.[0] || 'capacidad-identidad';
        
        // Draft empathetic introductory paragraph
        const intros: Record<string, string> = {
          "capacidad-identidad": "Tu mente ha aprendido a levantar altas murallas en torno a tu sentido de idoneidad. Esa voz interior crítica no es una enemiga insolente, sino un antiguo mecanismo protector que teme al rechazo o a la humillación. Has llevado la carga de la sobreexplicación u ocultamiento para estar a salvo; mas hoy el Pastor de tu alma te llama a descansar en la legítima suficiencia que brota de su gracia soberana.",
          "merecimiento-vinculo": "Tu corazón asocia secretamente la paz duradera y el cariño profundo con una inminente tempestad. El temor al abandono y la culpa sorda te han empujado a boicotear los momentos de calma para retornar a escenarios conocidos de control. Pero la misericordia de Dios no tiene facturas ocultas: su bendición enriquece sin añadir tristeza.",
          "control-entorno": "La incertidumbre y las tempestades del pasado enseñaron a tu sistema neurológico a permanecer en una alerta roja de hipervigilancia extrema, creyendo que todo se desmoronará si sueltas las riendas espirituales o cotidianas de tu esfera. Dios, el Soberano fiel, es hoy tu castillo seguro. Puedes destensar tus puños conscientes; el universo sigue sostenido en sus manos cariñosas.",
          "rendimiento-logro": "Has encadenado tu dignidad humana a los peldaños de tu rendimiento intelectual, títulos o saldo financiero, viviendo una asfixia incesante frente al ocio recreativo. La prisa es tu altar y el cansancio prolongado tu insignia de prestigio. Jesús de Nazaret, antes de que produjeses tu primer fruto, ya te acogía en amor perfecto sin deudas morales.",
          "relaciones-poder": "Las heridas de confrontaciones tempranas te entrenaron para ceder preventivamente ante los temperamentos rudos, silenciando tus genuinos anhelos existenciales o adoptando silencios autoprotectores. Pero tu voz humilde y sabia es hermosa, posees herencia y discernimiento real para edificar límites sanos con denuedo majestuoso y perdón puro.",
          "cuerpo-salud": "Has mirado tu cuerpo de forma desapegada, tratándolo como a un siervo inerte o una máquina que forzar al límite hasta el colapso. O quizás te ha inundado una vergüenza corrosiva u obsesiones por heredar achaques de cuna. Tu organismo es un santuario sagrado comprado con precio eterno, llamado a gozar de un sano y sagrado descanso.",
          "espiritualidad-trascendencia": "Una sutil orfandad espiritual o un temor a la mirada escrutadora de un Creador fiscalizador ha enfriado tu comunión viva, orando de forma repetitiva con pánico al error mental. Aquel que te predestinó conoce tus secretos e imperfecciones y, sabiendo cada detalle, se regocija apasionadamente al cobijarte como a su heredero consentido.",
          "tiempo-futuro": "Vives escribiendo finales trágicos en el guión de tu porvenir, sopesando opciones con un doble ánimo que paraliza tu florecimiento y suspirando por un pasado al que revistes de un esplendor irrecuperable. Pero la senda de Dios avanza en aumento glorioso; tu mañana no es escasez, sino abundancia de paz cierta.",
          "genero-identidad-social": "Asumes que tu cuna familiar fracturada, tu edad o tu procedencia social establecen un techo hermético que frustrará tus lazos y honra profesional hoy. El veredicto de Cristo descarta todo estigma social de hombres: eres de linaje real divinamente ungido para habitar en lugares de eminencia."
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

        compiled.sort((a, b) => b.intensity - a.intensity);
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

  // SVG Radar coordinates generator
  const radarPoints = useMemo(() => {
    const center = 150;
    const radius = 100;
    const numPoints = screeningList.length;

    return screeningList.map((item, idx) => {
      const score = screeningAnswers[item.id] || 1; // 1 to 5
      // Normalize score to map nicely: range 1-5 maps to factor 0.2 to 1.0 of radius
      const scoreFactor = score / 5;
      const angle = (idx * 2 * Math.PI) / numPoints - Math.PI / 2;
      const x = center + radius * scoreFactor * Math.cos(angle);
      const y = center + radius * scoreFactor * Math.sin(angle);
      
      // Calculate max coordinate to draw outer polygon
      const outerX = center + radius * Math.cos(angle);
      const outerY = center + radius * Math.sin(angle);

      return {
        id: item.id,
        label: item.title,
        score,
        x,
        y,
        outerX,
        outerY,
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

  // Toggle Day checklist
  const toggleDayCheck = (dayKey: string) => {
    setCompletedDays(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  // Plain-text Devotional exporter
  const handleExportText = () => {
    downloadResults();
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
        className="max-w-4xl mx-auto bg-[#121212]/90 border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden relative backdrop-blur-md"
      >
        
        {/* Cinematic Header */}
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
                      step === 'screening' ? ((screeningIndex + 1) / 18) * 100 :
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

        {/* Dynamic Wizard Steps */}
        <main id="main-content" className="p-6 sm:p-10 relative">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: WELCOME */}
            {step === 'welcome' && (
              <motion.div
                key="welcome-pane"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <span className="text-[#C9A84C] uppercase text-xs font-mono tracking-[0.25em] font-semibold block">SISTEMA CIENTÍFICO BÍBLICO DE DIAGNÓSTICO</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-white leading-tight">
                    "Hay voces en tu interior que decidieron tu futuro antes de que tú lo hicieras."
                  </h2>
                  <p className="text-white/70 text-base leading-relaxed font-sans">
                    Bienvenido a una experiencia clínica y espiritual de autoconocimiento profundo. Este test explora los <strong>9 bloques cognitivos limitantes</strong> que rigen tu conducta inconsciente, contrastándolos con neurociencia y la verdad inquebrantable de tu identidad en Cristo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="bg-[#181818] border border-white/5 p-5 rounded-2xl text-center flex flex-col items-center gap-3">
                    <div className="bg-[#C9A84C]/10 p-3 rounded-full text-[#C9A84C]">
                      <Brain className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Respuesta Neurobiológica</h3>
                    <p className="text-white/55 text-xs">Entiende qué hormonas y circuitos sinápticos activa cada temor.</p>
                  </div>
                  <div className="bg-[#181818] border border-white/5 p-5 rounded-2xl text-center flex flex-col items-center gap-3">
                    <div className="bg-[#C9A84C]/10 p-3 rounded-full text-[#C9A84C]">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Contraste de Identidad</h3>
                    <p className="text-white/55 text-xs">Derriba mentiras con argumentos teológicos precisos y anclados.</p>
                  </div>
                  <div className="bg-[#181818] border border-white/5 p-5 rounded-2xl text-center flex flex-col items-center gap-3">
                    <div className="bg-[#C9A84C]/10 p-3 rounded-full text-[#C9A84C]">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Plan de 30 Días</h3>
                    <p className="text-white/55 text-xs">Ejercicios prácticos con checklists reales de renovación mental.</p>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-[#C9A84C]/15 p-6 rounded-2xl max-w-2xl mx-auto text-center font-serif text-white/80 italic leading-relaxed relative">
                  "Porque cual es su pensamiento en su corazón, tal es él."
                  <br /><strong>— Proverbios 23:7</strong>
                </div>

                {/* Gate Form */}
                <form id="gate-form" onSubmit={handleStartScreening} className="max-w-md mx-auto bg-[#161616] p-6 rounded-2xl border border-white/5 space-y-4">
                  <h3 className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider text-center mb-2">Prepara tu Perfil Personal</h3>
                  <div className="space-y-3">
                    <div className="relative">
                      <User className="w-4 h-4 text-white/40 absolute left-3 top-3.5" />
                      <input 
                        type="text" 
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Ingresa tu nombre" 
                        className="w-full bg-[#202020] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] text-white"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3.5" />
                      <input 
                        type="email" 
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Correo electrónico para recibir el reporte" 
                        className="w-full bg-[#202020] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="opt-terms" 
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 accent-[#C9A84C]" 
                    />
                    <label htmlFor="opt-terms" className="text-[11px] text-white/45 leading-relaxed">
                      Autorizo registrar mis respuestas de forma segura y descargo la responsabilidad en pro del autoconocimiento.
                    </label>
                  </div>

                  <button 
                    type="submit"
                    id="btn-gate-start"
                    disabled={!acceptedTerms}
                    className="w-full bg-gradient-to-r from-[#C9A84C] to-yellow-600 disabled:from-gray-700 disabled:to-gray-800 disabled:text-white/40 text-[#0D0D0D] font-bold py-3.5 px-6 rounded-xl hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Iniciar Test de 8 Minutos <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="text-center text-white/30 text-xs">
                  🔒 Procesado localmente libre de cookies comerciales • Duración aproximada: 8 minutos
                </div>
              </motion.div>
            )}

            {/* STEP 2: SCREENING (CAPA 1) */}
            {step === 'screening' && (
              <motion.div
                key="screening-pane"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center max-w-xl mx-auto space-y-3">
                  <span className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest font-semibold">Capa 1: Rastreo de Bloques Cognitivos</span>
                  <p className="text-white/60 text-sm">Responde de manera intuitiva y honesta según resuena en tu vida cotidiana.</p>
                </div>

                <div className="bg-[#181818] border border-white/5 p-8 sm:p-10 rounded-3xl max-w-2xl mx-auto text-center space-y-6 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#C9A84C]" />
                  
                  <span className="text-[#C9A84C]/50 font-mono text-xs uppercase">Afirmación {screeningIndex + 1} de 9</span>
                  
                  <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-relaxed max-w-xl mx-auto italic font-sans">
                    "{screeningList[screeningIndex].screeningPhrase}"
                  </h3>

                  <div className="text-xs text-[#C9A84C] border border-[#C9A84C]/10 bg-[#C9A84C]/5 px-4 py-2 rounded-full inline-block font-medium">
                    Área evaluada: {screeningList[screeningIndex].title}
                  </div>
                </div>

                {/* Likert Scale */}
                <div className="max-w-2xl mx-auto space-y-3">
                  <p className="text-center text-xs text-white/40 uppercase tracking-widest font-mono">Selecciona tu nivel de afinación:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {[
                      { val: 1, desc: 'Nunca', label: '1. Nunca me pasa' },
                      { val: 2, desc: 'Rara vez', label: '2. Rara vez' },
                      { val: 3, desc: 'A veces', label: '3. A veces' },
                      { val: 4, desc: 'Con frecuencia', label: '4. Con frecuencia' },
                      { val: 5, desc: 'Completamente', label: '5. Me describe por completo' }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        id={`likert-btn-${opt.val}`}
                        onClick={() => handleScreeningAnswer(opt.val)}
                        className="bg-[#161616] border border-white/5 hover:border-[#C9A84C] p-4 rounded-xl text-center group transition-all duration-200 cursor-pointer hover:bg-[#C9A84C]/5 active:scale-95"
                      >
                        <span className="block text-lg font-bold text-white/30 group-hover:text-[#C9A84C] transition-colors mb-1">{opt.val}</span>
                        <span className="block text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-center">
                  <button 
                    onClick={() => {
                      if (screeningIndex > 0) {
                        setScreeningIndex(prev => prev - 1);
                      } else {
                        setStep('welcome');
                      }
                    }}
                    className="flex items-center gap-2 text-white/55 hover:text-white text-sm transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Regresar al paso anterior
                  </button>
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

            {/* STEP 4: DEEP DIVE (CAPA 2) */}
            {step === 'deep_dive' && (
              <motion.div
                key="deep-dive-pane"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center max-w-xl mx-auto space-y-3">
                  <span className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest font-semibold">Capa 2: Diagnóstico de Creencias Específicas</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Profundizando en tus bloques álgidos</h3>
                  <p className="text-white/60 text-sm">
                    Hemos detectado activación en <strong>{activeBlocks.length} bloques cognitivos</strong>. Responde con total honestidad a estas afirmaciones internas escritas de forma íntima.
                  </p>
                </div>

                {/* Progress bar specific to deep dive */}
                <div className="max-w-xl mx-auto bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex justify-between items-center text-xs font-mono">
                  <span className="text-[#C9A84C]">Bloque evaluando: <strong className="text-white font-sans">{deepDiveQuestions[deepDiveIndex]?.bloque}</strong></span>
                  <span className="text-white/40">Afirmación {deepDiveIndex + 1} de {deepDiveQuestions.length}</span>
                </div>

                <div className="bg-[#181818]/60 border border-white/5 p-8 sm:p-10 rounded-3xl max-w-2xl mx-auto text-center space-y-6 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-3 h-3 bg-[#C9A84C] animate-pulse rounded-bl-lg" />
                  
                  <span className="text-white/40 font-mono text-xs uppercase">La Voz del Inconsciente</span>
                  
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#F3F4F6] tracking-tight leading-relaxed max-w-xl mx-auto py-2 font-display">
                    "{deepDiveQuestions[deepDiveIndex]?.afirmacionTest}"
                  </h3>
                </div>

                {/* Tri-state Response Buttons */}
                <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    id="deep-dive-yes"
                    onClick={() => handleDeepDiveAnswer(2)}
                    className="bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0D0D0D] font-bold p-4 rounded-xl text-center hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#C9A84C]/10"
                  >
                    <span className="block text-sm">Prácticamente Sí</span>
                    <span className="text-[10px] opacity-80 block font-normal">Siento total afinidad</span>
                  </button>

                  <button
                    id="deep-dive-sometimes"
                    onClick={() => handleDeepDiveAnswer(1)}
                    className="bg-[#1C1C1C] border border-white/10 text-white hover:border-[#C9A84C] font-bold p-4 rounded-xl text-center hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="block text-sm">A veces</span>
                    <span className="text-[10px] text-white/50 block font-normal">Ocurre intermitente</span>
                  </button>

                  <button
                    id="deep-dive-no"
                    onClick={() => handleDeepDiveAnswer(0)}
                    className="bg-[#161616] border border-white/5 text-white/60 hover:text-white hover:border-red-500/40 font-bold p-4 rounded-xl text-center hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="block text-sm">En absoluto (No)</span>
                    <span className="text-[10px] text-white/40 block font-normal">No coincide conmigo</span>
                  </button>
                </div>

                {/* Back Button */}
                <div className="flex justify-center hover:translate-x-[-2px] transition-transform">
                  <button 
                    onClick={() => {
                      if (deepDiveIndex > 0) {
                        setDeepDiveIndex(prev => prev - 1);
                      } else {
                        // go back to screening calculated step
                        setStep('screening');
                      }
                    }}
                    className="flex items-center gap-2 text-white/55 hover:text-white text-sm transition-colors cursor-pointer font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" /> Regresar al paso anterior
                  </button>
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
            {step === 'results' && (
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
                {activeTab === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    {/* Perspective card */}
                    <div className="border bg-[#1C1C1C]/40 border-white/5 p-6 sm:p-8 rounded-3xl relative overflow-hidden text-white/90">
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#C9A84C] to-yellow-600" />
                      <span className="text-xs text-[#C9A84C] font-mono uppercase font-semibold block mb-2">Perspectiva Neuro-Espiritual</span>
                      <p className="text-base font-sans leading-relaxed italic pr-4">
                        "{introParagraph}"
                      </p>
                      <p className="mt-4 text-xs text-white/40 block">
                        — Dios diseñó la flexibilidad de tu cerebro para que sea renovado por completo a la luz del evangelio (Romanos 12:2).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
                      {/* SVG Radar Chart component (Josue Cortes original pure math) */}
                      <div className="bg-[#161616] p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                        <span className="text-xs text-[#C9A84C] font-mono uppercase font-semibold mb-4 text-center">MAPA DE ACTIVACIÓN COGNITIVA (9 BLOQUES)</span>
                        
                        <div className="w-full max-w-[280px] aspect-square relative">
                          <svg viewBox="0 0 300 300" className="w-full h-full text-white/10">
                            {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, sIdx) => (
                              <polygon
                                key={sIdx}
                                points={radarPoints.map(p => {
                                  const angle = p.angle;
                                  const x = 150 + 100 * scale * Math.cos(angle);
                                  const y = 150 + 100 * scale * Math.sin(angle);
                                  return `${x},${y}`;
                                }).join(' ')}
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.05)"
                                strokeWidth="1"
                              />
                            ))}

                            {radarPoints.map((p, idx) => (
                              <line
                                key={idx}
                                x1="150"
                                y1="150"
                                x2={p.outerX}
                                y2={p.outerY}
                                stroke="rgba(255, 255, 255, 0.07)"
                                strokeWidth="1.5"
                              />
                            ))}

                            <polygon
                              points={radarOuterString}
                              fill="none"
                              stroke="rgba(201, 168, 76, 0.1)"
                              strokeWidth="1.5"
                            />

                            <polygon
                              points={radarPointsString}
                              fill="rgba(201, 168, 76, 0.25)"
                              stroke="#C9A84C"
                              strokeWidth="2.5"
                              className="filter drop-shadow-[0_0_8px_rgba(201,168,76,0.3)]"
                            />

                            {radarPoints.map((p, idx) => (
                              <circle
                                key={idx}
                                cx={p.x}
                                cy={p.y}
                                r="4.5"
                                fill={p.score >= 3 ? '#F59E0B' : '#C9A84C'}
                                stroke="#0D0D0D"
                                strokeWidth="1"
                              />
                            ))}

                            {radarPoints.map((p, idx) => {
                              const angle = p.angle;
                              const offsetDist = 118;
                              const textX = 150 + offsetDist * Math.cos(angle);
                              const textY = 150 + offsetDist * Math.sin(angle);
                              
                              let textAnchor = 'middle';
                              if (Math.cos(angle) > 0.15) textAnchor = 'start';
                              else if (Math.cos(angle) < -0.15) textAnchor = 'end';

                              const nameWords = p.label.split(' / ')[0].split(' y ');
                              const labelText = nameWords[0];

                              return (
                                <text
                                  key={idx}
                                  x={textX}
                                  y={textY}
                                  textAnchor={textAnchor}
                                  className="fill-white/60 text-[9px] uppercase font-mono tracking-tighter"
                                  alignmentBaseline="middle"
                                >
                                  {labelText} ({p.score})
                                </text>
                              );
                            })}
                          </svg>
                        </div>

                        <div className="flex gap-4 mt-4 text-xs font-mono text-white/50 justify-center">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 bg-[#C9A84C] rounded-full inline-block" />
                            <span>Zonas de Diagnóstico</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full inline-block animate-pulse" />
                            <span>Activación Severa (≥3)</span>
                          </div>
                        </div>
                      </div>

                      {/* Diagnostic details */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#C9A84C]">
                          <Sparkles className="w-5 h-5" />
                          <h4 className="text-lg font-bold font-display">Clasificación de Perfil</h4>
                        </div>
                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
                          <div>
                            <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider font-mono font-bold">Creencia Principal</span>
                            <p className="text-white text-base font-semibold leading-relaxed">
                              {aiDiagnosis?.fase1?.principalBelief || results[0]?.creencia}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider font-mono font-bold">Temor Raíz</span>
                              <p className="text-white/80 text-xs leading-relaxed">{aiDiagnosis?.fase1?.rootFear || "Temor a ser considerado inútil o incompetente ante otros."}</p>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider font-mono font-bold">Emoción Dominante</span>
                              <p className="text-white/80 text-xs leading-relaxed">{aiDiagnosis?.fase1?.dominantEmotion || "Ansiedad o Insuficiencia Crónica"}</p>
                            </div>
                          </div>
                          <div className="border-t border-white/5 pt-3">
                            <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider font-mono font-bold block mb-1">Mecanismo de Autosabotaje Inconsciente</span>
                            <p className="text-white/70 text-xs leading-relaxed italic">
                              "{aiDiagnosis?.fase2?.selfSabotageMechanism || 'Postergación bajo un escudo de perfeccionismo extremo, evitando tomar riesgos reales para proteger el sentido del ego.'}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FASE 2: Bento cost analysis */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-[#C9A84C] font-bold text-sm uppercase tracking-wider font-mono text-center">Costo Actual de Mantener la Mentira (Las 4 Dimensiones)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-red-500/[0.02] border border-red-500/10 p-5 rounded-2xl space-y-2">
                          <span className="text-xs font-mono font-bold text-red-400 block uppercase">1. Decisiones</span>
                          <p className="text-white/70 text-xs leading-relaxed">{aiDiagnosis?.fase2?.currentCost?.decisions || "Tomar opciones regidas por el miedo a la crítica o evitando la visibilidad de tu liderazgo."}</p>
                        </div>
                        <div className="bg-red-500/[0.02] border border-red-500/10 p-5 rounded-2xl space-y-2">
                          <span className="text-xs font-mono font-bold text-red-400 block uppercase">2. Emociones</span>
                          <p className="text-white/70 text-xs leading-relaxed">{aiDiagnosis?.fase2?.currentCost?.emotions || "Carga pesada de insuficiencia, estrés crónico e hipervigilancia emocional insostenible."}</p>
                        </div>
                        <div className="bg-red-500/[0.02] border border-red-500/10 p-5 rounded-2xl space-y-2">
                          <span className="text-xs font-mono font-bold text-red-400 block uppercase">3. Relaciones</span>
                          <p className="text-white/70 text-xs leading-relaxed">{aiDiagnosis?.fase2?.currentCost?.relationships || "Retener verdades o aislarte por temor a que descubran flaquezas y juzguen tu valor."}</p>
                        </div>
                        <div className="bg-red-500/[0.02] border border-red-500/10 p-5 rounded-2xl space-y-2">
                          <span className="text-xs font-mono font-bold text-red-400 block uppercase">4. Destino / Propósito</span>
                          <p className="text-white/70 text-xs leading-relaxed">{aiDiagnosis?.fase2?.currentCost?.potentialFuture || "Parálisis de dones confiados por Dios, restringiendo el alcance de tu fructificación."}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

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
                      <span className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.2em] font-bold block">Fase 4: Declaración de Identidad Cristocéntrica</span>
                      <blockquote className="text-[#F3F4F6] italic text-base sm:text-lg leading-relaxed font-serif max-w-xl mx-auto">
                        "{aiDiagnosis?.fase4?.declaracionIdentidad || results[0]?.declaracion}"
                      </blockquote>
                      <div className="pt-2 flex justify-center">
                        <button
                          onClick={() => handleCopyToClipboard(aiDiagnosis?.fase4?.declaracionIdentidad || results[0]?.declaracion)}
                          className="bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 border border-[#C9A84C]/20 text-[#C9A84C] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Copiar mi Declaración
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
                                setCompletedDays(prev => ({
                                  ...prev,
                                  [dayKey]: !prev[dayKey]
                                }));
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
                          Si consideras que éstas fortalezas mentales están sumamente anquilosadas en tu historia, agenda una sesión especial pastoral de acompañamiento directo con Josue Cortes.
                        </p>
                        <div className="flex gap-3 flex-wrap">
                          <a 
                            href="https://wa.me/5491122334455?text=Hola,%20completé%20el%20test%20de%20Transformación%20Interior%20y%20me%20gustaría%20agendar%20una%20sesión."
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#25D366] hover:bg-[#20ba56] text-[#000] font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                          >
                             Agendar por WhatsApp
                          </a>
                          <button 
                            onClick={() => alert(`Enviamos el enlace de reserva directamente al correo registrado: ${userEmail}`)}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-2 px-3 rounded-xl text-[10px] transition-colors"
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
                        onClick={handleExportText}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold bg-[#1C1C1C] hover:bg-[#262626] border border-white/5 text-white/70 hover:text-white transition-all w-full sm:w-auto cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Exportar (TXT)
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
      <footer className="mt-12 text-center text-white/30 text-xs space-y-2">
        <p>© {new Date().getFullYear()} Josue Cortes • Transformación Interior • Romanos 12:2</p>
        <p className="text-[10px] text-white/20">Metodología clínica y ministerial unificada diseñada en base a principios neurocientíficos y de consejería bíblica para levantate resplandece 11.36</p>
      </footer>
    </div>
  );

  // EXPORTER OF THE FULL 8 PHASES DIOCESAN MANUAL (Durable TXT Devotional Book)
  function downloadResults() {
    let content = `
================================================================================
              TRANSFORMACIÓN INTERIOR • PROGRAMA DE RENOVACIÓN MENTAL
           "Transformaos por medio de la renovación de vuestro entendimiento"
                                Romanos 12:2
================================================================================

Rastreo expedido para: ${userName}
Perfil registrado: ${userEmail || 'Sin correo electrónico'}
Fecha de diagnóstico: ${new Date().toLocaleDateString('es-ES')}

================================================================================
FASE 1 Y 2: IDENTIFICACIÓN Y DIAGNÓSTICO COGNITIVO
================================================================================
• Creencia Principal: ${aiDiagnosis?.fase1?.principalBelief || results[0]?.creencia}
• Temor Raíz Subyacente: ${aiDiagnosis?.fase1?.rootFear || 'Temor a la crítica.'}
• Emoción Dominante: ${aiDiagnosis?.fase1?.dominantEmotion || 'Insuficiencia o Temor'}
• Área Vulnerable Afectada: ${aiDiagnosis?.fase1?.affectedArea || 'Identidad / Liderazgo'}

❌ LA MENTIRA RAÍZ DETECTADA:
   "${aiDiagnosis?.fase2?.rootLie || 'Mi valía y capacidad dependen de mí propio desempeño.'}"

💬 MECANISMO DE AUTOSABOTAJE:
   "${aiDiagnosis?.fase2?.selfSabotageMechanism || 'Postergación rumiante incesante buscando perfeccionismo.'}"

🔍 COSTOS ESTIMADOS EN TU COGNICIÓN (LAS 4 DIMENSIONES):
   * En Decisiones:   ${aiDiagnosis?.fase2?.currentCost?.decisions}
   * En Emociones:    ${aiDiagnosis?.fase2?.currentCost?.emotions}
   * En Relaciones:   ${aiDiagnosis?.fase2?.currentCost?.relationships}
   * En Tu Propósito: ${aiDiagnosis?.fase2?.currentCost?.potentialFuture}

================================================================================
FASE 3 Y 4: RENOVACIÓN BÍBLICA Y NUEVA IDENTIDAD CRISTOCÉNTRICA
================================================================================
🛑 LA MENTIRA CARNAL ENFRENTADA:
   "${aiDiagnosis?.fase3?.mentira || results[0]?.afirmacionTest}"

🟢 LA VERDAD ETERNA SUSTITUTORIA:
   "${aiDiagnosis?.fase3?.verdadBiblica || results[0]?.verdad}"

📖 VERSÍCULO ANCLERO SELECCIONADO:
   "${aiDiagnosis?.fase3?.versiculo?.texto || results[0]?.versiculos[0]?.txt}"
   — Cita: ${aiDiagnosis?.fase3?.versiculo?.referencia || results[0]?.versiculos[0]?.ref}

🔥 RECOMENDACIÓN DE ENTRENAMIENTO ESPIRITUAL:
   ${aiDiagnosis?.fase3?.aplicacion || results[0]?.espiritu}

✨ PRINCIPAL CONFESIÓN DE IDENTIDAD (FASE 4 - PROCLAMAR CON VOZ AUDIBLE):
   "${aiDiagnosis?.fase4?.declaracionIdentidad || results[0]?.declaracion}"

================================================================================
FASE 5: HOJA DE RUTA SEMANALES DE REESTRUCTURACIÓN NEURO-ESPIRITUAL
================================================================================
• SEMANA 1: Consciencia Mental de la Mentira
  - Objetivo:  ${aiDiagnosis?.fase5?.semana1?.objetivo}
  - Reflexión: ${aiDiagnosis?.fase5?.semana1?.reflexion}
  - Pregunta:  ${aiDiagnosis?.fase5?.semana1?.autoconfrontacion}
  - Registro:  ${aiDiagnosis?.fase5?.semana1?.registroPensamientos}
  - Oración:   ${aiDiagnosis?.fase5?.semana1?.oracionGuiada}

• SEMANA 2: Desmantelamiento Cognitivo
  - Objetivo:  ${aiDiagnosis?.fase5?.semana2?.objetivo}
  - Evidencia: ${aiDiagnosis?.fase5?.semana2?.evidenciaContraria}
  - Reencuadre: ${aiDiagnosis?.fase5?.semana2?.reencuadreBiblico}
  - Desafío:   ${aiDiagnosis?.fase5?.semana2?.desafiosPracticos}
  - Anclaje:   ${aiDiagnosis?.fase5?.semana2?.interrupcionPatrones}

• SEMANA 3: Renovación y Cableado Nuevo
  - Objetivo:  ${aiDiagnosis?.fase5?.semana3?.objetivo}
  - Meditación: ${aiDiagnosis?.fase5?.semana3?.meditacionDiaria}
  - Memoria:   ${aiDiagnosis?.fase5?.semana3?.memorizacionVersiculo}
  - Gratitud:  ${aiDiagnosis?.fase5?.semana3?.diarioGratitud}
  - Ensayo:    ${aiDiagnosis?.fase5?.semana3?.visualizacionBiblica}

• SEMANA 4: Consolidación y Obediencia de Fe
  - Objetivo:  ${aiDiagnosis?.fase5?.semana4?.objetivo}
  - Provocación: ${aiDiagnosis?.fase5?.semana4?.retosReales}
  - He de Fe:   ${aiDiagnosis?.fase5?.semana4?.accionesFe}
  - Límites:   ${aiDiagnosis?.fase5?.semana4?.conversacionesDificiles}
  - Obediencia: ${aiDiagnosis?.fase5?.semana4?.pasosObediencia}

================================================================================
FASE 6: ITINERARIO DEVOCIONAL COMPLETO DE 30 DÍAS
================================================================================
${aiDiagnosis?.fase6?.map(day => `
DÍA ${day.dia}: ${day.enfoque.toUpperCase()}
--------------------------------------------------------------------------------
📖 Pasaje del día: "${day.versiculo.texto}" (${day.versiculo.referencia})
🌱 Micro-Acción Práctica: ${day.accion}
🧠 Autoconfrontación Interna: ${day.reflexion}
🙏 Oración sugerida (Voz audible): "${day.oracion}"
`).join('\n\n')}

================================================================================
FASE 8: CLAUSURA Y ACUERDO DE FILIACIÓN DE FE
================================================================================
• Estado Inicial: ${aiDiagnosis?.reporteFinal?.antes}
• Estado Libre: ${aiDiagnosis?.reporteFinal?.ahora}
• Sentencia de la Limitación:  ${aiDiagnosis?.reporteFinal?.creenciaDerribada}
• Sentencia de la Verdad:      ${aiDiagnosis?.reporteFinal?.verdadEstablecida}
• Próximo Hábito Duradero:     ${aiDiagnosis?.reporteFinal?.proximoPaso}

✨ BENDICIÓN DE COMPROMISO PASTORAL DE CLAUSURA:
   "${aiDiagnosis?.reporteFinal?.exhortacionBiblica || 'Por lo tanto, mantén firmemente la mirada fija en Jesús...'}"

================================================================================
HISTORIAL DE VALORACIONES DE TU DIARIO DE ORACIÓN:
================================================================================
${results.map(r => `
* Creencia Evaluada: "${r.creencia}" (${r.alias})
  - Diario personal escrito por ti:
    "${journalNotes[r.id] || '(No guardaste notas de oración correspondientes en este casillero).'}"
`).join('\n')}

--------------------------------------------------------------------------------
Desarrollado con amor y rigor pastoral por Josue Cortes • Transformación Interior
Canal Oficial de WhatsApp: wa.me/5491122334455
Página Web: levantateresplandece1136.com
--------------------------------------------------------------------------------
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Manual-Transformacion-Interior-${userName.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
