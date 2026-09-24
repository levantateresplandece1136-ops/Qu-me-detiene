import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  HelpCircle,
  Compass,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Heart,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Scale,
  Target,
  Brain,
  MessageSquare,
  Flame,
  Info
} from 'lucide-react';
import {
  HeartExplorationMapResult,
  PlanDeConsejeria,
  BehavioralChangeTask,
  CentralSessionQuestion,
  FidelityVsPerfectionCheck,
  CLINICAL_SAFETY_NOTICE,
  checkClinicalSafety,
  VisualInterventionNode,
  PRINCIPIO_FUNDAMENTAL_SISTEMA
} from '../data/counselingMovements';
import { DiscernmentAnalysis, PASTORAL_DIMENSIONS_CONFIG } from '../data/pastoralDiscernment';

interface Props {
  mapData?: HeartExplorationMapResult;
  counselingPlan?: PlanDeConsejeria;
  discernment?: DiscernmentAnalysis;
  fidelityCheck?: FidelityVsPerfectionCheck;
  centralQuestion?: CentralSessionQuestion;
  behavioralTask?: BehavioralChangeTask;
  userName: string;
  onLoadCase19?: () => void;
  isSimulatedCase19?: boolean;
}

export const HeartExplorationSection: React.FC<Props> = ({
  mapData,
  counselingPlan,
  discernment,
  fidelityCheck,
  centralQuestion,
  behavioralTask,
  userName,
  onLoadCase19,
  isSimulatedCase19 = false
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'circunstancia': true,
    'interpretacion': true,
    'verdadBiblica': true
  });
  const [showClinicalDetails, setShowClinicalDetails] = useState(false);
  const [activeDiscernmentFilter, setActiveDiscernmentFilter] = useState<string>('TODAS');

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const plan = counselingPlan;
  const map = mapData;

  return (
    <div className="space-y-12">
      {/* ========================================================
          PROMPT 16: BANNER DE SEGURIDAD CLÍNICA
         ======================================================== */}
      <div className="bg-amber-950/30 border border-amber-500/40 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex-shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Marco Ético y de Seguridad
                </span>
                <span className="text-white/40 text-xs font-mono">Consejería Pastoral Bíblica</span>
              </div>
              <h3 className="text-white font-bold text-base sm:text-lg mt-1 font-sans">
                {CLINICAL_SAFETY_NOTICE.advertenciaPrincipal}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
                {CLINICAL_SAFETY_NOTICE.descripcion} Si experimentas crisis agudas, ideación suicida o situaciones de riesgo, es mandatorio acudir a profesionales de salud acreditados.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowClinicalDetails(prev => !prev)}
            className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex-shrink-0"
          >
            {showClinicalDetails ? 'Ocultar Criterios y Líneas' : 'Ver Líneas de Emergencia'}
            {showClinicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {showClinicalDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Criterios Obligatorios de Derivación:
                </h4>
                <ul className="space-y-1.5 text-xs text-white/75">
                  {CLINICAL_SAFETY_NOTICE.criteriosDeDerivacion.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-amber-400" /> Líneas de Atención Inmediata:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {CLINICAL_SAFETY_NOTICE.lineasDeEmergencia.map((line, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-amber-500/15">
                      <span className="text-[10px] font-mono text-white/50 block font-bold">{line.pais}</span>
                      <span className="text-amber-300 font-mono font-bold block text-sm">{line.telefono}</span>
                      <span className="text-[10px] text-white/60 block">{line.servicio}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================
          PROMPT 19: SIMULADOR DE CASO DE PRUEBA (TEST HARNESS)
         ======================================================== */}
      {onLoadCase19 && (
        <div className="bg-[#121212] border border-[#C9A84C]/30 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-[#C9A84C] bg-[#C9A84C]/15 px-2 py-0.5 rounded border border-[#C9A84C]/30">
                PROMPT 19 • Banco de Validación
              </span>
              {isSimulatedCase19 && (
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  CASO ACTIVO
                </span>
              )}
            </div>
            <h4 className="text-white font-bold text-sm">
              Probar Caso Control=5, Tiempo=5, Capacidad=3, Identidad=3, Aprobación=3
            </h4>
            <p className="text-white/60 text-xs max-w-2xl leading-relaxed">
              Verifica cómo el sistema evita diagnosticar automáticamente «síndrome del impostor», ofreciendo hipótesis alternativas de sobrecarga y falta de destrezas de delegación.
            </p>
          </div>
          <button
            onClick={onLoadCase19}
            className="flex items-center gap-2 text-xs font-mono font-bold text-[#0D0D0D] bg-gradient-to-r from-[#C9A84C] to-yellow-500 hover:from-yellow-400 hover:to-amber-400 px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            {isSimulatedCase19 ? 'Recargar Caso Simulado' : 'Cargar Simulación Prompt 19'}
          </button>
        </div>
      )}

      {/* ========================================================
          PROMPT 20: PRINCIPIO FINAL DE LA APLICACIÓN (REGLA FUNDAMENTAL)
         ======================================================== */}
      <div className="bg-gradient-to-br from-[#1c1810] via-[#14120e] to-[#0f0e0c] border-2 border-[#C9A84C]/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Etiqueta superior */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-[#C9A84C]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] flex-shrink-0">
              <Compass className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-bold text-[#C9A84C] block">
                Principio Fundamental del Sistema • Regla Pastoral de Oro
              </span>
              <h3 className="text-white font-bold text-base sm:text-lg tracking-tight">
                El Propósito Central de la Consejería Bíblica
              </h3>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] text-[11px] font-mono font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mapa de Comprensión, No Etiqueta</span>
          </div>
        </div>

        {/* Declaración textual del principio (Prompt 20) */}
        <div className="relative z-10 bg-[#0d0d0d]/85 border border-[#C9A84C]/30 rounded-2xl p-5 sm:p-6 space-y-2">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#C9A84C] font-bold block text-center">
            Fundamento Metodológico y Pastoral
          </span>
          <p className="text-sm sm:text-base text-amber-100/95 leading-relaxed font-sans italic text-center max-w-4xl mx-auto">
            «{PRINCIPIO_FUNDAMENTAL_SISTEMA.reglaFundamental}»
          </p>
        </div>

        {/* Los 3 pasos de transición: Del Diagnóstico Reduccionista a la Fidelidad en Cristo */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/60 font-bold">
            <Layers className="w-4 h-4 text-[#C9A84C]" />
            <span>Transición Pastoral de Preguntas (De la Etiqueta al Discernimiento)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Paso 1: Lo que dejamos atrás */}
            <div className="bg-[#161616]/90 border border-red-500/25 rounded-2xl p-5 space-y-2.5 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  Etapa 1 • Lo que superamos
                </span>
                <span className="text-red-400/60 text-xs font-mono font-bold">❌ Dejar atrás</span>
              </div>
              <h4 className="text-white font-bold text-sm tracking-tight pt-1">
                «{PRINCIPIO_FUNDAMENTAL_SISTEMA.transicionDePreguntas.etapa1.deDondePartimos}»
              </h4>
              <p className="text-white/60 text-xs leading-relaxed">
                {PRINCIPIO_FUNDAMENTAL_SISTEMA.transicionDePreguntas.etapa1.descripcion}
              </p>
            </div>

            {/* Paso 2: Comprensión activa */}
            <div className="bg-[#161616]/90 border border-sky-500/25 rounded-2xl p-5 space-y-2.5 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  Etapa 2 • Comprensión Bíblica
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <h4 className="text-white font-bold text-sm tracking-tight pt-1 text-sky-100">
                «{PRINCIPIO_FUNDAMENTAL_SISTEMA.transicionDePreguntas.etapa2.haciaDondeAvanzamos}»
              </h4>
              <p className="text-white/60 text-xs leading-relaxed">
                {PRINCIPIO_FUNDAMENTAL_SISTEMA.transicionDePreguntas.etapa2.descripcion}
              </p>
            </div>

            {/* Paso 3: Meta final en Cristo */}
            <div className="bg-[#161616]/90 border border-emerald-500/30 rounded-2xl p-5 space-y-2.5 relative overflow-hidden group shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Etapa 3 • Meta en Cristo
                </span>
                <span className="text-emerald-400 text-xs font-mono font-bold">🎯 Meta final</span>
              </div>
              <h4 className="text-white font-bold text-sm tracking-tight pt-1 text-emerald-100">
                «{PRINCIPIO_FUNDAMENTAL_SISTEMA.transicionDePreguntas.etapa3.metaFinal}»
              </h4>
              <p className="text-white/60 text-xs leading-relaxed">
                {PRINCIPIO_FUNDAMENTAL_SISTEMA.transicionDePreguntas.etapa3.descripcion}
              </p>
            </div>
          </div>
        </div>

        {/* Declaración de la meta */}
        <div className="pt-3 border-t border-[#C9A84C]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/80 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400/80" />
            <span className="text-white/50 line-through">{PRINCIPIO_FUNDAMENTAL_SISTEMA.metaDelSistema.loQueNoEs}</span>
          </div>
          <div className="flex items-center gap-2 text-[#C9A84C] font-semibold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C] animate-pulse" />
            <span>{PRINCIPIO_FUNDAMENTAL_SISTEMA.metaDelSistema.loQueEs}</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          PROMPT 17: MAPA DE EXPLORACIÓN DEL CORAZÓN
         ======================================================== */}
      <div className="space-y-8">
        {/* Encabezado del Mapa */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-[10px] font-mono uppercase tracking-widest font-bold">
            <Compass className="w-3.5 h-3.5" />
            Estructura Canónica de 10 Puntos
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            MAPA DE EXPLORACIÓN DEL CORAZÓN
          </h2>
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
            Dejamos atrás los veredictos deterministas y las etiquetas clínicas seculares. Este mapa describe lo observado y abre el espacio para un discernimiento bíblico humilde, compasivo y transformador.
          </p>
        </div>

        {/* 1. LO QUE OBSERVAMOS & 2. PATRONES DETECTADOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Lo que observamos */}
          <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-xs">
                1
              </span>
              Lo que observamos (Datos Objetivos)
            </div>
            <p className="text-white/80 text-xs leading-relaxed">
              {map?.loQueObservamos.sintesisRespuestas || 'Puntajes objetivos recopilados durante la autoevaluación inicial sin sesgo interpretativo previo.'}
            </p>
            <div className="space-y-2 pt-2 border-t border-white/5 max-h-48 overflow-y-auto pr-1">
              {map?.loQueObservamos.datosObjetivos.map((dato, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs">
                  <span className="text-white/80 font-medium">{dato.bloque}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-mono hidden sm:inline">{dato.descripcion}</span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                      dato.puntaje >= 4 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/10 text-white/60'
                    }`}>
                      {dato.puntaje}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Patrones detectados */}
          <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xs">
                2
              </span>
              Patrones Detectados (Relaciones entre Bloques)
            </div>
            <p className="text-white/80 text-xs leading-relaxed">
              {map?.patronesDetectados.dinamicaDominante || 'Interacción funcional entre la necesidad de certidumbre y la administración de los recursos temporales.'}
            </p>
            <div className="space-y-2.5 pt-2 border-t border-white/5">
              {(map?.patronesDetectados.relacionesEntreBloques || [])
                .slice()
                .sort((a, b) => {
                  const aIsSenal = a.toLowerCase().includes('señal débil');
                  const bIsSenal = b.toLowerCase().includes('señal débil');
                  return (aIsSenal ? 1 : 0) - (bIsSenal ? 1 : 0);
                })
                .map((rel, i) => {
                  const isSenal = rel.toLowerCase().includes('señal débil');
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                        isSenal
                          ? 'bg-indigo-950/10 border-indigo-500/10 text-indigo-300/60 opacity-60'
                          : 'bg-indigo-950/20 border-indigo-500/20 text-indigo-200/90'
                      }`}
                    >
                      <ArrowRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isSenal ? 'text-indigo-400/50' : 'text-indigo-400'}`} />
                      <div>
                        {isSenal && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 mr-2 mb-1">
                            Señal débil — a explorar
                          </span>
                        )}
                        <span>{isSenal ? rel.replace(/^Señal débil — a explorar:\s*/i, '') : rel}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* 3. HIPÓTESIS PRINCIPALES & 4. NIVEL DE CONFIANZA */}
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[#C9A84C]">
              <span className="w-6 h-6 rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-xs">
                3
              </span>
              Hipótesis Principales (Máximo 3) y Nivel de Confianza (4)
            </div>

            {/* Badges de Confianza con Regla Inquebrantable */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/40 uppercase">Nivel Asignado:</span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C]">
                {map?.nivelDeConfianza.nivel || 'MODERADA'}
              </span>
            </div>
          </div>

          {/* Regla inquebrantable aviso */}
          <div className="bg-[#0f0f0f] border border-[#C9A84C]/20 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-white/80">
            <Info className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
            <span>
              <strong>Regla Metodológica:</strong> Nunca mostrar una hipótesis como certeza cuando la evidencia sea insuficiente. Todo punto aquí señalado es una propuesta para explorar juntos en diálogo pastoral.
            </span>
          </div>

          {/* Lista de 3 hipótesis con explicaciones alternativas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {map?.hipotesisPrincipales.map((hip, i) => (
              <div key={i} className="bg-[#181818] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#C9A84C] uppercase">Hipótesis {hip.numero}</span>
                    <span className="text-[9px] font-mono text-white/40">No determinista</span>
                  </div>
                  <h4 className="text-white font-bold text-sm leading-snug">{hip.hipotesis}</h4>
                  <div className="text-xs text-white/70">
                    <strong className="text-white/40 block text-[10px] uppercase font-mono mt-2">Evidencia observada:</strong>
                    {hip.evidencia}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10">
                  <span className="text-[10px] font-mono font-bold text-amber-300 block uppercase">
                    Explicación Alternativa:
                  </span>
                  <p className="text-[11px] text-white/70 italic mt-0.5">
                    {hip.explicacionAlternativa}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. CICLO POSIBLE (7 NIVELES: CIRCUNSTANCIA A FRUTO) */}
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
            <span className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-xs">
              5
            </span>
            Ciclo Posible del Corazón (7 Niveles)
          </div>
          <p className="text-white/70 text-xs">
            Rastreo funcional desde el detonante externo hasta la manifestación conductual y su fruto relacional/espiritual.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {[
              { label: 'Circunstancia', icon: '🌐', desc: 'Situación real o presión externa', color: 'border-sky-500/30 text-sky-300 bg-sky-950/20' },
              { label: 'Interpretación', icon: '🧠', desc: 'Lectura o sentencia interna de la mente', color: 'border-indigo-500/30 text-indigo-300 bg-indigo-950/20' },
              { label: 'Deseo', icon: '🔥', desc: 'Anhelo que muta en demanda absoluta', color: 'border-amber-500/30 text-amber-300 bg-amber-950/20' },
              { label: 'Temor', icon: '🛡️', desc: 'Vulnerabilidad profunda que se busca evadir', color: 'border-rose-500/30 text-rose-300 bg-rose-950/20' },
              { label: 'Control', icon: '⚙️', desc: 'Mecanismo defensivo de hipervigilancia', color: 'border-purple-500/30 text-purple-300 bg-purple-950/20' },
              { label: 'Respuesta', icon: '⚡', desc: 'Acción visible, postergación o fiscalización', color: 'border-orange-500/30 text-orange-300 bg-orange-950/20' },
              { label: 'Fruto', icon: '🍂', desc: 'Desgaste, aislamiento o fatiga acumulada', color: 'border-red-500/30 text-red-300 bg-red-950/20' }
            ].map((node, i) => (
              <div key={i} className={`p-3 rounded-2xl border ${node.color} flex flex-col justify-between space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-lg">{node.icon}</span>
                  <span className="text-[9px] font-mono opacity-50 font-bold">Paso {i + 1}</span>
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">{node.label}</h5>
                  <p className="text-[10px] text-white/60 leading-tight mt-1">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. LO QUE TODAVÍA NO SABEMOS (PROMPT 11 - OBLIGATORIO) */}
        <div className="bg-[#151515] border border-amber-500/25 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            <span className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xs">
              6
            </span>
            LO QUE TODAVÍA NO SABEMOS (Sección Obligatoria de Humildad Pastoral)
          </div>
          <p className="text-white/70 text-xs leading-relaxed max-w-3xl">
            Un cuestionario digital jamás puede capturar la totalidad de la historia, las heridas ni el corazón humano. Estas son las preguntas fundamentales que no pueden resolverse sin el encuentro pastoral personal:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {map?.loQueTodaviaNecesitamosInvestigar.map((unk, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-white/90 leading-snug">{unk.enunciado}</span>
                </div>
                <div className="pl-6 text-[11px] text-white/50 italic">
                  <strong>Pregunta sugerida para la sesión:</strong> «{unk.preguntaParaLaSesion}»
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. PREGUNTA CENTRAL DE SESIÓN (PROMPT 13) */}
        <div className="bg-gradient-to-br from-[#1c1810] to-[#121212] border-2 border-[#C9A84C]/50 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] text-[10px] font-mono uppercase tracking-widest font-bold mx-auto">
            <span className="w-5 h-5 rounded-full bg-[#C9A84C] text-black flex items-center justify-center text-[10px] font-bold">7</span>
            Pregunta Central de Sesión
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white max-w-2xl mx-auto leading-relaxed italic">
            {centralQuestion?.pregunta || map?.preguntaCentral.pregunta}
          </h3>

          <div className="max-w-xl mx-auto space-y-1 text-xs text-white/60">
            <p>
              <strong className="text-[#C9A84C]">Enfoque Pastoral:</strong> {centralQuestion?.enfoquePastoral || map?.preguntaCentral.enfoquePastoral}
            </p>
            <p className="text-[11px] text-white/40 font-mono">
              Fundamento bíblico: {centralQuestion?.pasajeSoporte || map?.preguntaCentral.pasajeSoporte || '2 Corintios 3:5'}
            </p>
          </div>
        </div>

        {/* 8. DIRECCIÓN BÍBLICA: LOS 4 MOVIMIENTOS (PROMPT 8) */}
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xs">
              8
            </span>
            Dirección de Consejería en 4 Movimientos Bíblicos
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Movimiento 1: Redefinir */}
            <div className="p-5 rounded-2xl bg-[#191919] border border-sky-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-sky-400 uppercase tracking-wider">1. REDEFINIR</span>
                <span className="text-[10px] font-mono text-white/40">Examinar Interpretación</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-semibold">
                {map?.direccionBiblica.redefinir.interpretacionAExaminar}
              </p>
              <div className="space-y-1.5 text-[11px] text-white/60 pt-2 border-t border-white/5">
                <div><strong className="text-sky-300">Acerca de Dios:</strong> {map?.direccionBiblica.redefinir.dios}</div>
                <div><strong className="text-sky-300">Acerca de sí misma:</strong> {map?.direccionBiblica.redefinir.siMismo}</div>
                <div><strong className="text-sky-300">Acerca de los demás:</strong> {map?.direccionBiblica.redefinir.demas}</div>
              </div>
            </div>

            {/* Movimiento 2: Reenfocar */}
            <div className="p-5 rounded-2xl bg-[#191919] border border-indigo-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider">2. REENFOCAR</span>
                <span className="text-[10px] font-mono text-white/40">Fijar los ojos en Cristo</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-semibold">
                {map?.direccionBiblica.reenfocar.verdadEvangelio}
              </p>
              <div className="space-y-1.5 text-[11px] text-white/60 pt-2 border-t border-white/5">
                <div><strong className="text-indigo-300">Atención a Cristo:</strong> {map?.direccionBiblica.reenfocar.atencionACristo}</div>
                <div className="p-2 rounded-xl bg-indigo-950/30 text-indigo-200">
                  <strong>{map?.direccionBiblica.reenfocar.pasajeTransformador.cita}:</strong> {map?.direccionBiblica.reenfocar.pasajeTransformador.principio}
                </div>
              </div>
            </div>

            {/* Movimiento 3: Rendir */}
            <div className="p-5 rounded-2xl bg-[#191919] border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">3. RENDIR</span>
                <span className="text-[10px] font-mono text-white/40">Entregar el Control</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-semibold">
                {map?.direccionBiblica.rendir.queEntregarAlSenor}
              </p>
              <div className="space-y-1.5 text-[11px] text-white/60 pt-2 border-t border-white/5">
                <div><strong className="text-amber-300">Qué intenta controlar:</strong> {map?.direccionBiblica.rendir.queEstaIntentandoControlar}</div>
                <div><strong className="text-amber-300">Deseo a someter:</strong> {map?.direccionBiblica.rendir.deseoASometer}</div>
                <div><strong className="text-amber-300">Expectativa a rendir:</strong> {map?.direccionBiblica.rendir.expectativaARendir}</div>
              </div>
            </div>

            {/* Movimiento 4: Reestructurar */}
            <div className="p-5 rounded-2xl bg-[#191919] border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">4. REESTRUCTURAR</span>
                <span className="text-[10px] font-mono text-white/40">Nueva Práctica de Fe</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-semibold">
                {map?.direccionBiblica.reestructurar.nuevaRespuesta}
              </p>
              <div className="space-y-1.5 text-[11px] text-white/60 pt-2 border-t border-white/5">
                <div><strong className="text-emerald-300">Conducta concreta:</strong> {map?.direccionBiblica.reestructurar.conductaConcreta}</div>
                <div><strong className="text-emerald-300">Límite sabio:</strong> {map?.direccionBiblica.reestructurar.limiteEstablecer}</div>
                <div><strong className="text-emerald-300">Acción de obediencia:</strong> {map?.direccionBiblica.reestructurar.accionObediencia}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 9. TEXTOS BÍBLICOS SUGERIDOS CON FUNCIÓN ESPECÍFICA (PROMPT 9) */}
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
            <span className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xs">
              9
            </span>
            Dirección Bíblica Pertinente (No listas frías de versículos)
          </div>
          <p className="text-white/70 text-xs">
            Cada texto tiene asignada una función hermenéutica precisa: Verdad teológica, conexión con el caso, pregunta de consejería y aplicación.
          </p>

          <div className="space-y-4">
            {map?.textosBiblicosSugeridos.map((bib, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#181818] border border-[#C9A84C]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#C9A84C] font-mono">{bib.texto}</span>
                  <span className="text-[10px] font-mono text-white/40 uppercase font-bold">Pasaje Pertinente</span>
                </div>
                <div className="text-xs text-white/90">
                  <strong className="text-white/50 block text-[10px] uppercase font-mono">Verdad Bíblica:</strong>
                  {bib.verdadBiblica}
                </div>
                <div className="text-xs text-white/70">
                  <strong className="text-white/50 block text-[10px] uppercase font-mono">Conexión con el caso:</strong>
                  {bib.conexionConElCaso}
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 italic">
                  <strong>Pregunta de Consejería:</strong> «{bib.preguntaDeConsejeria}»
                </div>
                <div className="text-xs text-emerald-300">
                  <strong className="text-white/50 block text-[10px] uppercase font-mono">Aplicación Práctica:</strong>
                  {bib.aplicacion}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 10. PRÓXIMO PASO: TAREA DE CAMBIO (PROMPT 15: VERDAD -> FE -> CONDUCTA) */}
        <div className="bg-[#141414] border border-[#C9A84C]/40 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[#C9A84C]">
            <span className="w-6 h-6 rounded-lg bg-[#C9A84C] text-black flex items-center justify-center text-xs font-bold">
              10
            </span>
            Próximo Paso: Tarea de Cambio Conductual (Verdad → Fe → Conducta)
          </div>

          <div className="bg-[#181818] border border-white/5 p-5 rounded-2xl space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#C9A84C] uppercase tracking-wider block">Instrucción Principal</span>
              <p className="text-sm text-white/90 leading-relaxed font-semibold">
                {behavioralTask?.instruccionPrincipal || map?.proximoPaso.instruccionPrincipal}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/20">
                <span className="text-[9px] font-mono font-bold uppercase text-sky-400 block">1. Verdad</span>
                <span className="text-white/70 text-[11px] block mt-1">{behavioralTask?.verdadTeologica || map?.proximoPaso.verdadTeologica}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
                <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block">2. Paso de Fe</span>
                <span className="text-white/70 text-[11px] block mt-1">{behavioralTask?.pasoDeFe || map?.proximoPaso.pasoDeFe}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 block">3. Conducta Concreta</span>
                <span className="text-white/70 text-[11px] block mt-1">{behavioralTask?.conductaConcreta || map?.proximoPaso.conductaConcreta}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 block">
                Preguntas de Seguimiento para Responder después de la Tarea:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(behavioralTask?.preguntasDeSeguimiento || map?.proximoPaso.preguntasDeSeguimiento)?.map((item, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-white/80">
                    <span className="font-semibold text-amber-300 block">{item.pregunta}</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">{item.propositoPastoral}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            PROMPT 10: DIFERENCIAR FIDELIDAD vs. PERFECCIÓN
           ======================================================== */}
        {fidelityCheck && fidelityCheck.aplica && (
          <div className="bg-[#141414] border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                <Scale className="w-5 h-5 text-amber-400" />
                Diferenciar Fidelidad vs. Perfección (Prompt 10)
              </div>
              <span className="text-[10px] font-mono text-white/40">{fidelityCheck.motivoActivacion}</span>
            </div>

            <p className="text-white/70 text-xs">
              El perfeccionismo nace del temor a la descalificación y busca la invulnerabilidad; la fidelidad nace del reposo en Cristo y busca honrar a Dios dentro de los límites humanos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fidelityCheck.preguntasDiscernimiento.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#191919] border border-white/5 space-y-2">
                  <h4 className="text-xs font-bold text-[#C9A84C] font-mono leading-snug">
                    {item.pregunta}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                      <strong className="block text-[9px] uppercase font-mono text-emerald-400">Fidelidad:</strong>
                      {item.enfoqueFidelidad}
                    </div>
                    <div className="p-2 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300">
                      <strong className="block text-[9px] uppercase font-mono text-rose-400">Trampa:</strong>
                      {item.trampaPerfeccion}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            PROMPT 7: MATRIZ DE DISCERNIMIENTO PASTORAL (8 CATEGORÍAS)
           ======================================================== */}
        {discernment && (
          <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
                <Brain className="w-5 h-5 text-rose-400" />
                Matriz de Discernimiento Pastoral: Las 8 Dimensiones
              </div>
              <span className="text-[10px] font-mono text-white/40">Evita llamar pecado a lo que es sufrimiento o falta de destrezas</span>
            </div>

            <p className="text-xs text-white/70 italic leading-relaxed">
              {discernment.principioTeologico}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {discernment.items.map((item, i) => {
                const conf = PASTORAL_DIMENSIONS_CONFIG[item.categoria];
                return (
                  <div key={i} className="p-4 rounded-2xl bg-[#181818] border border-white/5 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-base">{item.icono}</span>
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${conf?.badgeBg}`}>
                          {item.categoria}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-white leading-tight">{item.titulo}</h5>
                      <p className="text-[11px] text-white/60 leading-relaxed">{item.descripcion}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-1 text-[10px]">
                      <div className="text-white/40 font-mono">
                        <strong className="text-amber-300">Postura:</strong> {item.posturaPastoral}
                      </div>
                      <div className="text-white/50 italic">
                        «{item.ejemploConcreto}»
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
