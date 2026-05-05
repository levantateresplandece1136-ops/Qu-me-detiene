/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Download, 
  RefreshCcw, 
  Sparkles, 
  Quote,
  Target,
  BookOpen,
  Calendar,
  Layers,
  Activity,
  Heart,
  ChevronRight
} from 'lucide-react';
import { beliefsDatabase, Category, Belief } from './data/beliefs';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface UserResult extends Belief {
  category: string;
  intensity: number;
}

export default function App() {
  const [step, setStep] = useState<Step>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userBeliefs, setUserBeliefs] = useState<Record<string, number>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<UserResult[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const nextStep = () => {
    if (step < 8) setStep((prev) => (prev + 1) as Step);
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => (prev - 1) as Step);
  };

  const toggleCategory = (key: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(key)) {
        return prev.filter((c) => c !== key);
      }
      if (prev.length < 5) {
        return [...prev, key];
      }
      return prev;
    });
  };

  const selectIntensity = (beliefKey: string, value: number) => {
    setUserBeliefs((prev) => ({
      ...prev,
      [beliefKey]: value,
    }));
  };

  const handleStartAnalysis = () => {
    const totalQuestions = selectedCategories.reduce(
      (sum, cat) => sum + beliefsDatabase[cat].beliefs.length,
      0
    );

    if (Object.keys(userBeliefs).length < totalQuestions) {
      alert('Por favor responde todas las preguntas antes de continuar.');
      return;
    }

    setStep(4);
    setAnalyzing(true);
    setTimeout(() => {
      const generatedResults: UserResult[] = [];
      for (const [key, value] of Object.entries(userBeliefs)) {
        if (value >= 2) {
          const [categoryKey, beliefIndex] = key.split('-');
          const belief = beliefsDatabase[categoryKey].beliefs[parseInt(beliefIndex)];
          generatedResults.push({
            category: beliefsDatabase[categoryKey].title,
            intensity: value,
            ...belief,
          });
        }
      }
      generatedResults.sort((a, b) => b.intensity - a.intensity);
      setResults(generatedResults);
      setAnalyzing(false);
      setStep(5);
    }, 2500);
  };

  const restartJourney = () => {
    if (window.confirm('¿Estás seguro de que quieres comenzar de nuevo? Se perderán tus resultados actuales.')) {
      setStep(1);
      setSelectedCategories([]);
      setUserBeliefs({});
      setResults([]);
    }
  };

  const downloadResults = () => {
    let content = `
╔═══════════════════════════════════════════════════════════════╗
║          TRANSFORMACIÓN INTERIOR - MI PLAN PERSONAL          ║
║       "Transformaos por la renovación del entendimiento"      ║
║                       Romanos 12:2                            ║
╚═══════════════════════════════════════════════════════════════╝

📊 MIS ESTADÍSTICAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Creencias a Transformar: ${results.length}
• Alta Prioridad: ${results.filter(r => r.intensity >= 3).length}
• Áreas de Enfoque: ${new Set(results.map(r => r.category)).size}

═══════════════════════════════════════════════════════════════

📋 MIS CREENCIAS Y SU TRANSFORMACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    results.forEach((result, index) => {
      const priority = result.intensity >= 3 ? '🔴 ALTA' : result.intensity >= 2 ? '🟡 MEDIA' : '🟢 BAJA';
      content += `
${index + 1}. ${priority} PRIORIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Categoría: ${result.category}

❌ CREENCIA LIMITANTE:
   "${result.limiting}"

✅ LA VERDAD DE DIOS:
   ${result.truth}

📖 VERSÍCULO:
   ${result.verse}

💪 MI NUEVA IDENTIDAD:
   "${result.empowered}"

`;
    });

    content += `
═══════════════════════════════════════════════════════════════

📅 PLAN DE ACCIÓN DE 30 DÍAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SEMANA 1: IDENTIFICAR Y CUESTIONAR
□ Días 1-2: Revisar resultados y leer en voz alta cada verdad
□ Días 3-5: Responder las 7 Preguntas Demoledoras
□ Días 6-7: Crear recordatorios visuales

SEMANA 2: REEMPLAZAR Y ANCLAR
□ Días 8-10: Afirmaciones matutinas (5 min)
□ Días 11-14: Diario de Evidencias (3 ejemplos diarios)
□ Cada día: Acción "como si"

SEMANA 3: INTEGRAR Y ACTUAR
□ Días 15-17: Compartir con alguien de confianza
□ Días 18-21: Aumentar acciones "como si" (2-3 diarias)
□ Cada noche: Gratitud (3 ejemplos de nueva identidad)

SEMANA 4: CONSOLIDAR Y EXPANDIR
□ Días 22-25: Revisión semanal
□ Días 26-28: Celebrar victorias
□ Días 29-30: Planea tu próximo mes

═══════════════════════════════════════════════════════════════

🙏 MI ORACIÓN DIARIA DE TRANSFORMACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Padre, destruyo toda fortaleza mental que se levante contra 
el conocimiento de Dios. Llevo cautivo TODO pensamiento a la 
obediencia de Cristo. Renuncio a las mentiras del enemigo y 
abrazo la verdad de Tu Palabra. Espíritu Santo, recuérdame 
quién soy en Cristo cada vez que lo olvide. En el nombre de 
Jesús, amén."

═══════════════════════════════════════════════════════════════

💪 MIS AFIRMACIONES DIARIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    results.slice(0, 5).forEach((result, index) => {
      content += `${index + 1}. "${result.empowered}"\n   ${result.verse}\n\n`;
    });

    content += `
═══════════════════════════════════════════════════════════════

✨ DECLARACIÓN DE IDENTIDAD ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Soy hijo/a de Dios, creado/a con propósito.
Soy más que vencedor/a en Cristo.
Todo lo puedo en Aquel que me fortalece.
Soy libre, soy amado/a, soy capaz.
SOY QUIEN DIOS DICE QUE SOY.

"Porque cual es su pensamiento en su corazón, tal es él"
- Proverbios 23:7

═══════════════════════════════════════════════════════════════

Creado: ${new Date().toLocaleDateString('es-ES')}
Transformación Interior - Un viaje hacia tu verdadera identidad
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transformacion-interior-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const progress = (step / 8) * 100;

  return (
    <div id="app-container" className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <header id="main-header" className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-8 text-center text-white relative">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-3xl sm:text-4xl font-bold mb-2 font-display"
          >
            ✨ Transformación Interior ✨
          </motion.h1>
          <p className="text-lg opacity-90 italic font-serif">
            "Transformaos por medio de la renovación de vuestro entendimiento" - Romanos 12:2
          </p>
          <div className="mt-6 w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </header>

        <main id="main-content" className="p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-[#667eea] mb-6">Bienvenido a tu Jornada de Transformación</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                  Esta no es una simple prueba. Es una experiencia de autoconocimiento profundo que te ayudará a:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8 text-left">
                  {[
                    { label: 'Identificar', desc: 'creencias que te limitan' },
                    { label: 'Cuestionar', desc: 'su validez con verdad bíblica' },
                    { label: 'Reemplazar', desc: 'con identidad en Cristo' },
                    { label: 'Transformar', desc: 'tu vida con ejercicios prácticos' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl border-l-4 border-[#667eea]">
                      <CheckCircle2 className="text-[#667eea] w-5 h-5 flex-shrink-0" />
                      <div>
                        <strong className="text-[#667eea] block">{item.label}</strong>
                        <span className="text-gray-600 text-sm">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-50/50 border-l-4 border-[#667eea] p-6 rounded-r-xl italic text-gray-700 mb-8 max-w-2xl mx-auto">
                  <Quote className="w-8 h-8 text-[#667eea] mb-2 opacity-50" />
                  "Y conoceréis la verdad, y la verdad os hará libres"
                  <br /><strong>- Juan 8:32</strong>
                </div>

                <div className="bg-gray-50 p-8 rounded-2xl mb-8 max-w-2xl mx-auto text-left space-y-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Al finalizar recibirás:</h3>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Target className="w-5 h-5 text-indigo-400" />
                    <span>Mapa completo de tus creencias limitantes</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>Verdades bíblicas personalizadas</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <span>Ejercicios de transformación específicos</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <span>Plan de acción de 30 días</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <span>Afirmaciones diarias personalizadas</span>
                  </div>
                </div>

                <button 
                  id="btn-start"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto"
                >
                  Comenzar mi Transformación <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#667eea] mb-3">¿En qué áreas de tu vida sientes más limitaciones?</h2>
                  <p className="text-gray-500">Selecciona todas las que resuenen contigo (mínimo 2, máximo 5)</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {Object.entries(beliefsDatabase).map(([key, category]) => (
                    <button
                      id={`category-${key}`}
                      key={key}
                      onClick={() => toggleCategory(key)}
                      className={`text-left p-6 rounded-2xl transition-all border-3 ${
                        selectedCategories.includes(key) 
                          ? 'border-[#667eea] bg-indigo-50 shadow-md' 
                          : 'border-transparent bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <h3 className="font-bold text-lg text-[#667eea] mb-1">{category.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{category.description}</p>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold border-2 border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" /> Atrás
                  </button>
                  <button 
                    id="btn-continue-2"
                    onClick={() => {
                      if (selectedCategories.length < 2) {
                        alert('Por favor selecciona al menos 2 áreas para continuar.');
                        return;
                      }
                      nextStep();
                    }}
                    className={`flex items-center justify-center gap-2 px-10 py-3 rounded-full font-bold text-white transition-all ${
                      selectedCategories.length >= 2 
                        ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] shadow-lg hover:-translate-y-1' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Continuar <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#667eea] mb-3">Evaluación de Creencias</h2>
                  <p className="text-gray-500">Lee cada afirmación honestamente. ¿Qué tanto resuena contigo?</p>
                </div>

                <div className="space-y-6 mb-10">
                  {selectedCategories.flatMap((catKey) => 
                    beliefsDatabase[catKey].beliefs.map((belief, idx) => (
                      <div key={`${catKey}-${idx}`} className="bg-gray-50 p-6 rounded-2xl border-l-4 border-[#667eea]">
                        <h3 className="text-xl font-medium text-gray-800 mb-4 italic">"{belief.limiting}"</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                          {[
                            { val: 0, label: 'No resuena' },
                            { val: 1, label: 'Un poco' },
                            { val: 2, label: 'Moderado' },
                            { val: 3, label: 'Bastante' },
                            { val: 4, label: 'Totalmente' }
                          ].map((option) => (
                            <button
                              id={`intensity-${catKey}-${idx}-${option.val}`}
                              key={option.val}
                              onClick={() => selectIntensity(`${catKey}-${idx}`, option.val)}
                              className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border-2 ${
                                userBeliefs[`${catKey}-${idx}`] === option.val
                                  ? 'bg-[#667eea] border-[#667eea] text-white shadow-md'
                                  : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-300'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold border-2 border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" /> Atrás
                  </button>
                  <button 
                    id="btn-analyze"
                    onClick={handleStartAnalysis}
                    className="flex items-center justify-center gap-2 px-10 py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] shadow-lg hover:-translate-y-1 transition-all"
                  >
                    Ver mis Resultados <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#667eea] mx-auto mb-6"></div>
                <p className="text-xl text-gray-600 font-medium animate-pulse">
                  Analizando tus respuestas y preparando tu plan personalizado...
                </p>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#667eea] mb-6 font-display">Tu Mapa de Transformación</h2>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  <div className="bg-indigo-50 p-6 rounded-2xl text-center shadow-sm">
                    <span className="text-4xl font-bold text-[#667eea] block mb-1">{results.length}</span>
                    <span className="text-sm font-medium text-gray-500 italic">Creencias a Transformar</span>
                  </div>
                  <div className="bg-indigo-50 p-6 rounded-2xl text-center shadow-sm">
                    <span className="text-4xl font-bold text-[#667eea] block mb-1">{results.filter(r => r.intensity >= 3).length}</span>
                    <span className="text-sm font-medium text-gray-500 italic">Alta Prioridad</span>
                  </div>
                  <div className="bg-indigo-50 p-6 rounded-2xl text-center shadow-sm">
                    <span className="text-4xl font-bold text-[#667eea] block mb-1">{new Set(results.map(r => r.category)).size}</span>
                    <span className="text-sm font-medium text-gray-500 italic">Áreas de Enfoque</span>
                  </div>
                </div>

                <div className="bg-indigo-50/50 border-l-4 border-indigo-400 p-6 rounded-r-xl italic text-gray-700 mb-10">
                  "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas"
                  <br /><strong>- 2 Corintios 5:17</strong>
                </div>

                <div className="space-y-8 mb-10">
                  {results.map((result, idx) => (
                    <div key={idx} className="bg-white border-2 border-indigo-100 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                      <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold text-white rounded-bl-xl ${
                        result.intensity >= 3 ? 'bg-red-500' : 'bg-orange-400'
                      }`}>
                        {result.intensity >= 3 ? 'Alta Prioridad' : 'Prioridad Media'}
                      </div>
                      
                      <div className="flex items-start gap-4 mb-6">
                        <div className="bg-red-50 p-3 rounded-full flex-shrink-0">
                          <span className="text-red-500 text-xl">❌</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight italic">"{result.limiting}"</h3>
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{result.category}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50/50 p-5 rounded-2xl border-l-4 border-emerald-400">
                          <h4 className="text-emerald-700 font-bold mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> La Verdad de Dios:
                          </h4>
                          <p className="text-gray-700 mb-4 font-medium">{result.truth}</p>
                          <div className="bg-white p-4 rounded-xl text-sm italic text-gray-600 border border-emerald-100">
                            {result.verse}
                          </div>
                        </div>

                        <div className="bg-indigo-50/50 p-5 rounded-2xl border-l-4 border-indigo-400">
                          <h4 className="text-indigo-700 font-bold mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Tu Nueva Identidad:
                          </h4>
                          <p className="text-lg font-bold text-gray-800 leading-tight">
                            "{result.empowered}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mb-8">
                  <button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:-translate-y-1 transition-all flex items-center gap-3"
                  >
                    Ver Ejercicios Personalizados <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#667eea] mb-6 font-display">Tus Ejercicios de Transformación</h2>
                </div>

                <div className="space-y-10 mb-10">
                  {results.slice(0, 3).map((belief, index) => (
                    <div key={index} className="bg-gray-50 rounded-3xl p-8 border-l-6 border-orange-400 shadow-sm">
                      <h3 className="text-xl font-bold text-orange-600 mb-6 flex items-center gap-3">
                        <Activity className="w-6 h-6" /> Ejercicio {index + 1}: Transformando "{belief.limiting}"
                      </h3>

                      <div className="space-y-8">
                        <div>
                          <h4 className="text-[#667eea] font-bold mb-4 flex items-center gap-2">
                             <Layers className="w-5 h-5" /> Las 7 Preguntas Demoledoras
                          </h4>
                          <p className="text-gray-500 text-sm mb-4">Responde estas preguntas en tu diario:</p>
                          <ul className="space-y-3">
                            {[
                              '¿Es esto realmente cierto? ¿Tengo evidencia objetiva?',
                              '¿Puedo estar 100% seguro de que es verdad?',
                              '¿Cómo me hace sentir y actuar esta creencia?',
                              '¿Quién sería yo sin este pensamiento?',
                              '¿De dónde viene esta creencia?',
                              '¿Qué evidencia tengo de lo CONTRARIO?',
                              '¿Qué dice la Palabra de Dios sobre esto?'
                            ].map((q, i) => (
                              <li key={i} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm items-center">
                                <span className="bg-orange-400 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{i+1}</span>
                                <span className="text-gray-700 font-medium">{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-[#667eea] font-bold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5" /> Ejercicio de Reemplazo
                          </h4>
                          <div className="space-y-3">
                            <div className="bg-white p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                              <ChevronRight className="text-indigo-400 w-5 h-5 mt-1" />
                              <div>
                                <span className="text-xs text-gray-400 uppercase font-bold">Lee tu nueva creencia</span>
                                <p className="font-bold text-gray-800">"{belief.empowered}"</p>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                              <ChevronRight className="text-indigo-400 w-5 h-5 mt-1" />
                              <div>
                                <span className="text-xs text-gray-400 uppercase font-bold">Lee el versículo</span>
                                <p className="italic text-gray-600">{belief.verse}</p>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold font-mono">STEP</span>
                              <p className="text-gray-700">Visualízate viviendo desde esta verdad y repite 3 veces con convicción.</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[#667eea] font-bold mb-4 flex items-center gap-2">
                             <BookOpen className="w-5 h-5" /> Diario de Evidencias
                          </h4>
                          <p className="text-gray-500 text-sm mb-3">Escribe 3 ejemplos de cómo tu nueva creencia fue verdad HOY:</p>
                          <textarea 
                            className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 min-h-[150px] focus:outline-none focus:border-indigo-300 transition-all shadow-inner placeholder:italic"
                            placeholder="Ejemplo 1: Hoy me atreví a...&#10;Ejemplo 2: Sentí confianza cuando...&#10;Ejemplo 3: Logré superar..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-white border-2 border-indigo-50 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-indigo-700 mb-6 flex items-center gap-3">
                       <Activity className="w-6 h-6" /> Ejercicio de Vigilancia Mental
                    </h3>
                    <div className="bg-emerald-50 p-6 rounded-2xl italic text-emerald-800 mb-8 border-l-4 border-emerald-400">
                      "Sobre toda cosa guardada, guarda tu corazón; porque de él mana la vida" - Proverbios 4:23
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <span className="font-bold text-indigo-600 uppercase text-xs tracking-widest">Mañana</span>
                        <div className="bg-indigo-50/50 p-4 rounded-xl text-sm text-gray-700">
                          Antes del móvil, declara en voz alta tus nuevas creencias.
                        </div>
                      </div>
                      <div className="space-y-3">
                        <span className="font-bold text-indigo-600 uppercase text-xs tracking-widest">Durante el día</span>
                        <div className="bg-indigo-50/50 p-4 rounded-xl text-sm text-gray-700">
                          Detecta mentiras: Di "ALTO" y reemplaza con la verdad bíblica.
                        </div>
                      </div>
                      <div className="space-y-3">
                        <span className="font-bold text-indigo-600 uppercase text-xs tracking-widest">Noche</span>
                        <div className="bg-indigo-50/50 p-4 rounded-xl text-sm text-gray-700">
                          Revisa: ¿Qué mentiras intentaron entrar? Escribe 3 victorias.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold border-2 border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" /> Ver Resultados
                  </button>
                  <button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:-translate-y-1 transition-all flex items-center gap-3"
                  >
                    Plan de 30 Días <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 7 && (
              <motion.div
                key="step-7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#667eea] mb-6 font-display">Tu Plan de Acción de 30 Días</h2>
                </div>

                <div className="bg-indigo-50/50 border-l-4 border-indigo-400 p-6 rounded-r-xl italic text-gray-700 mb-10">
                  "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis"
                  <br /><strong>- Jeremías 29:11</strong>
                </div>

                <div className="bg-emerald-50/20 p-6 sm:p-10 rounded-[2.5rem] border-2 border-emerald-50 space-y-10 mb-10">
                  <h3 className="text-2xl font-bold text-emerald-700 text-center mb-10 underline decoration-emerald-200 underline-offset-8">Calendario de Transformación</h3>
                  
                  {[
                    {
                      week: 1, title: 'Identificar y Cuestionar',
                      items: [
                        { d: 'Días 1-2', t: 'Revisa tus resultados. Lee en voz alta cada creencia limitante y su verdad bíblica.' },
                        { d: 'Días 3-5', t: 'Responde las 7 Preguntas Demoledoras para tus top 3 creencias.' },
                        { d: 'Días 6-7', t: 'Crea recordatorios visuales (post-its en espejos, escritorio, etc.).' }
                      ]
                    },
                    {
                      week: 2, title: 'Reemplazar y Anclar',
                      items: [
                        { d: 'Días 8-10', t: 'Afirmaciones matutinas (5 min) - Lee tus nuevas creencias con EMOCIÓN.' },
                        { d: 'Días 11-14', t: 'Inicia tu Diario de Evidencias (3 ejemplos diarios).' },
                        { d: 'Cada día', t: 'Elige UNA acción "como si" que demuestre tu nueva creencia.' }
                      ]
                    },
                    {
                      week: 3, title: 'Integrar y Actuar',
                      items: [
                        { d: 'Días 15-17', t: 'Comparte tu proceso con alguien de confianza. Rendición de cuentas.' },
                        { d: 'Días 18-21', t: 'Aumentar acciones "como si" (2-3 diarias).' },
                        { d: 'Cada noche', t: 'Ejercicio de gratitud - 3 cosas que demuestran tu nueva identidad.' }
                      ]
                    },
                    {
                      week: 4, title: 'Consolidar y Expandir',
                      items: [
                        { d: 'Días 22-25', t: 'Revisión semanal - ¿Qué ha cambiado? ¿Qué evidencias tienes?' },
                        { d: 'Días 26-28', t: 'Celebra cada victoria. Agradece a Dios por la transformación.' },
                        { d: 'Días 29-30', t: 'Planea tu próximo mes. Elige nuevas áreas para trabajar.' }
                      ]
                    }
                  ].map((week, idx) => (
                    <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-50">
                      <h4 className="text-indigo-600 font-bold text-lg mb-6 flex items-center gap-3">
                        <span className="bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">S{week.week}</span>
                        {week.title}
                      </h4>
                      <div className="space-y-4">
                        {week.items.map((item, i) => (
                          <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-start">
                            <input type="checkbox" className="w-5 h-5 mt-1 accent-[#667eea]" />
                            <div>
                              <strong className="text-gray-800 block text-sm mb-1">{item.d}</strong>
                              <p className="text-gray-600 text-sm leading-relaxed">{item.t}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 rounded-3xl text-white shadow-lg space-y-4">
                    <h4 className="text-xl font-bold flex items-center gap-2">
                       <Quote className="w-6 h-6" /> Oración Diaria de Transformación
                    </h4>
                    <p className="italic text-emerald-50 leading-relaxed font-serif">
                      "Padre, destruyo toda fortaleza mental que se levante contra el conocimiento de Dios. 
                      Llevo cautivo TODO pensamiento a la obediencia de Cristo. 
                      Renuncio a las mentiras del enemigo y abrazo la verdad de Tu Palabra. 
                      Espíritu Santo, recuérdame quién soy en Cristo cada vez que lo olvide. 
                      En el nombre de Jesús, amén."
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold border-2 border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" /> Ver Ejercicios
                  </button>
                  <button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:-translate-y-1 transition-all flex items-center gap-3"
                  >
                    Mis Afirmaciones <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 8 && (
              <motion.div
                key="step-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="pb-10"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-[#667eea] mb-6 font-display">Tus Afirmaciones Personalizadas</h2>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mb-12">
                  {results.slice(0, 5).map((result, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-[#667eea] to-[#764ba2] p-8 rounded-[2rem] text-white shadow-xl max-w-sm text-center flex flex-col justify-center gap-4"
                    >
                      <Sparkles className="w-10 h-10 mx-auto text-yellow-300 mb-2" />
                      <h3 className="text-2xl font-bold leading-tight font-display italic">"{result.empowered}"</h3>
                      <p className="text-sm opacity-80 italic font-serif">"{result.verse}"</p>
                    </motion.div>
                  ))}

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-10 rounded-[2.5rem] text-white shadow-2xl max-w-xl w-full text-center space-y-6"
                  >
                    <h3 className="text-3xl font-bold font-display italic tracking-widest uppercase">✨ Declaración de Identidad ✨</h3>
                    <div className="space-y-2 text-xl font-medium">
                      <p>Soy hijo/a de Dios, creado/a con propósito.</p>
                      <p>Soy más que vencedor/a en Cristo.</p>
                      <p>Todo lo puedo en Aquel que me fortalece.</p>
                      <p>Soy libre, soy amado/a, soy capaz.</p>
                      <p className="text-2xl font-bold text-yellow-300 mt-6 tracking-tighter">SOY QUIEN DIOS DICE QUE SOY.</p>
                    </div>
                    <div className="bg-black/10 py-3 px-6 rounded-full inline-block text-sm font-medium">
                      Proverbios 23:7
                    </div>
                  </motion.div>
                </div>

                <div className="bg-gray-50 p-10 rounded-[2.5rem] text-center mb-10 border-2 border-indigo-50">
                  <h3 className="text-2xl font-bold text-emerald-600 mb-4">¡Felicitaciones!</h3>
                  <p className="text-gray-600 mb-4 text-lg">Has completado tu evaluación de transformación. Ahora comienza el verdadero trabajo de renovación.</p>
                  <p className="text-gray-800 font-bold italic">"Fiel es el que os llama, el cual también lo hará" - 1 Tesalonicenses 5:24</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
                  <button 
                    onClick={downloadResults}
                    className="bg-emerald-600 text-white px-12 py-5 rounded-full text-xl font-bold shadow-xl shadow-emerald-100 hover:shadow-emerald-200 transform hover:-translate-y-1 transition-all flex items-center gap-3 w-full sm:w-auto"
                  >
                    <Download className="w-6 h-6" /> Descargar Mi Plan Completo
                  </button>
                  <button 
                    onClick={restartJourney}
                    className="flex items-center justify-center gap-2 px-10 py-5 rounded-full font-bold text-gray-500 hover:bg-gray-100 transition-all w-full sm:w-auto mt-4 sm:mt-0"
                  >
                    <RefreshCcw className="w-5 h-5" /> Comenzar de Nuevo
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Footer creds */}
      <footer className="mt-12 text-center text-white/60 text-sm">
        <p>© {new Date().getFullYear()} Transformación Interior • Basado en Romanos 12:2</p>
      </footer>
    </div>
  );
}
