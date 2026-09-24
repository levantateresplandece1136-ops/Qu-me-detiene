/**
 * SISTEMA DE NIVEL DE CONFIANZA PARA HIPÓTESIS PASTORALES
 * 
 * Evalúa rigurosamente el nivel de certeza/confianza de cada hipótesis
 * según los 6 factores metodológicos:
 * 1. Intensidad del puntaje.
 * 2. Cantidad de bloques relacionados.
 * 3. Consistencia entre respuestas.
 * 4. Respuestas de validación.
 * 5. Contradicciones existentes.
 * 6. Evidencia explícita aportada por la persona.
 * 
 * Regla de Oro: NUNCA mostrar una hipótesis como certeza cuando la evidencia sea insuficiente.
 */

export type ConfidenceLevel = 'ALTA' | 'MODERADA' | 'BAJA' | 'INSUFICIENTE';

export interface ConfidenceFactorDetail {
  nombre: string;
  puntuacion: number; // 0 - 100
  estado: 'fuerte' | 'moderado' | 'debil' | 'contradictorio' | 'insuficiente';
  descripcion: string;
}

export interface ConfidenceEvaluation {
  nivel: ConfidenceLevel;
  puntuacionTotal: number; // 0 - 100
  resumen: string;
  advertenciaMetodologica: string;
  factores: {
    intensidadPuntaje: ConfidenceFactorDetail;
    bloquesRelacionados: ConfidenceFactorDetail;
    consistenciaRespuestas: ConfidenceFactorDetail;
    respuestasValidacion: ConfidenceFactorDetail;
    contradicciones: ConfidenceFactorDetail;
    evidenciaExplicita: ConfidenceFactorDetail;
  };
}

export interface ConfidenceInput {
  hipotesisTitulo: string;
  hipotesisDescripcion?: string;
  bloqueId: string;
  screeningScores?: Record<string, number>;
  primaryScore?: number;
  activeBeliefs?: Array<{ creencia?: string; afirmacionTest?: string; bloqueId?: string; score?: number }>;
  userGoal?: string;
  isUserValidated?: boolean;
}

/**
 * Palabras clave para mapear hipótesis a bloques relacionados
 */
const BLOCK_KEYWORD_MAP: Record<string, string[]> = {
  'control-entorno': ['control', 'supervisión', 'incertidumbre', 'desborde', 'imprevisto', 'seguridad', 'vigilancia'],
  'genero-identidad-social': ['aprobación', 'rechazo', 'imagen', 'agradar', 'crítica', 'social', 'juicio', 'gente', 'pertenencia'],
  'rendimiento-logro': ['rendimiento', 'desempeño', 'producción', 'éxito', 'fracaso', 'error', 'estándar', 'perfección'],
  'capacidad-identidad': ['capacidad', 'insuficiente', 'incapaz', 'recursos', 'no poder', 'descalificado', 'competente'],
  'merecimiento-vinculo': ['merecimiento', 'ganar', 'descanso', 'deuda', 'gracia', 'condición', 'identidad', 'valor', 'dignidad', 'amor', 'sentirse menos', 'inadecuado'],
  'tiempo-futuro': ['tiempo', 'urgencia', 'tarde', 'prisa', 'retraso', 'postergación', 'agotamiento', 'futuro'],
  'relaciones-poder': ['relaciones', 'confianza', 'vulnerabilidad', 'traición', 'apertura', 'distancia', 'soledad', 'conflicto', 'ceder', 'poder'],
  'cuerpo-salud': ['cuerpo', 'salud', 'descanso', 'agotamiento', 'culpa al descansar', 'fatiga', 'físico', 'dormir', 'tensión'],
  'espiritualidad-trascendencia': ['espiritualidad', 'dios', 'castigo', 'culpa', 'oración', 'soberanía', 'fe', 'propósito']
};

/**
 * Evalúa y calcula la confianza de una hipótesis
 */
export function evaluateHypothesisConfidence(input: ConfidenceInput): ConfidenceEvaluation {
  const {
    hipotesisTitulo,
    hipotesisDescripcion = '',
    bloqueId,
    screeningScores = {},
    primaryScore,
    activeBeliefs = [],
    userGoal = '',
    isUserValidated = false
  } = input;

  const fullHypText = `${hipotesisTitulo} ${hipotesisDescripcion}`.toLowerCase();

  // 1. FACTOR 1: INTENSIDAD DEL PUNTAJE BASE (Peso: 25%)
  const baseScore = primaryScore ?? screeningScores[bloqueId] ?? 3;
  let factor1Score = 0;
  let factor1Estado: ConfidenceFactorDetail['estado'] = 'moderado';
  let factor1Desc = '';

  if (baseScore >= 5) {
    factor1Score = 95;
    factor1Estado = 'fuerte';
    factor1Desc = `Puntaje máximo reportado (${baseScore}/5) en el bloque principal. Intensidad alta confirmada.`;
  } else if (baseScore === 4) {
    factor1Score = 80;
    factor1Estado = 'fuerte';
    factor1Desc = `Puntaje elevado (${baseScore}/5) en el bloque principal. Fuerte presencia del patrón.`;
  } else if (baseScore === 3) {
    factor1Score = 55;
    factor1Estado = 'moderado';
    factor1Desc = `Puntaje medio (${baseScore}/5). El patrón es intermitente o circunstancial.`;
  } else if (baseScore === 2) {
    factor1Score = 25;
    factor1Estado = 'debil';
    factor1Desc = `Puntaje bajo (${baseScore}/5). Evidencia tenue en las respuestas de tamizaje.`;
  } else {
    factor1Score = 10;
    factor1Estado = 'insuficiente';
    factor1Desc = `Puntaje mínimo (${baseScore}/5). No hay respaldo numérico observable para esta hipótesis.`;
  }

  // 2. FACTOR 2: CANTIDAD DE BLOQUES RELACIONADOS (Peso: 20%)
  const relatedBlocksActive: string[] = [];
  Object.entries(BLOCK_KEYWORD_MAP).forEach(([bId, keywords]) => {
    if (bId !== bloqueId) {
      const isThematicallyLinked = keywords.some(k => fullHypText.includes(k));
      const otherScore = screeningScores[bId] ?? 0;
      if (isThematicallyLinked && otherScore >= 3) {
        relatedBlocksActive.push(`${bId} (${otherScore}/5)`);
      }
    }
  });

  let factor2Score = 0;
  let factor2Estado: ConfidenceFactorDetail['estado'] = 'moderado';
  let factor2Desc = '';

  if (relatedBlocksActive.length >= 2) {
    factor2Score = 90;
    factor2Estado = 'fuerte';
    factor2Desc = `Convergencia multidimensional sólida: Respaldada por ${relatedBlocksActive.length} bloques adicionales activos (${relatedBlocksActive.join(', ')}).`;
  } else if (relatedBlocksActive.length === 1) {
    factor2Score = 65;
    factor2Estado = 'moderado';
    factor2Desc = `Respaldo cruzado con 1 dimensión conectada: ${relatedBlocksActive[0]}.`;
  } else {
    // Si la hipótesis requiere soporte de otro bloque (ej. "temor al rechazo" pero Aprobación Social está en 1 o 2)
    const mentionsSocial = fullHypText.includes('rechazo') || fullHypText.includes('aprobación');
    const mentionsControl = fullHypText.includes('control');
    const mentionsCapacidad = fullHypText.includes('incapaz') || fullHypText.includes('insuficiente');

    const socialScore = screeningScores['genero-identidad-social'] ?? screeningScores['aprobacion-social'] ?? 2;
    const capacidadScore = screeningScores['capacidad-identidad'] ?? screeningScores['capacidad-recursos'] ?? 2;

    if (mentionsSocial && socialScore <= 2 && bloqueId !== 'genero-identidad-social' && bloqueId !== 'aprobacion-social') {
      factor2Score = 15;
      factor2Estado = 'insuficiente';
      factor2Desc = `Aislamiento temático: Plantea temor a rechazo/aprobación, pero el bloque de Aceptación Social reportó nivel muy bajo (${socialScore}/5).`;
    } else if (mentionsCapacidad && capacidadScore <= 2 && bloqueId !== 'capacidad-identidad' && bloqueId !== 'capacidad-recursos') {
      factor2Score = 20;
      factor2Estado = 'debil';
      factor2Desc = `Sin convergencia cruzada: El bloque de Capacidad e Identidad reporta normalidad (${capacidadScore}/5).`;
    } else {
      factor2Score = 40;
      factor2Estado = 'moderado';
      factor2Desc = `Hipótesis focalizada exclusivamente en el bloque evaluado sin amplificación de otras áreas.`;
    }
  }

  // 3. FACTOR 3: CONSISTENCIA ENTRE RESPUESTAS (Peso: 15%)
  const beliefsInBlock = activeBeliefs.filter(b => b.bloqueId === bloqueId || !b.bloqueId);
  let factor3Score = 50;
  let factor3Estado: ConfidenceFactorDetail['estado'] = 'moderado';
  let factor3Desc = '';

  if (beliefsInBlock.length >= 2 && baseScore >= 3) {
    factor3Score = 85;
    factor3Estado = 'fuerte';
    factor3Desc = `Alta coherencia: ${beliefsInBlock.length} afirmaciones registradas en el test confirman sistemáticamente este patrón.`;
  } else if (beliefsInBlock.length === 1) {
    factor3Score = 70;
    factor3Estado = 'moderado';
    factor3Desc = `Consistencia moderada: Respaldada por una afirmación directa del test de creencias.`;
  } else if (baseScore <= 2) {
    factor3Score = 25;
    factor3Estado = 'debil';
    factor3Desc = `Inconsistencia leve: Baja presencia de afirmaciones en el cuestionario detallado.`;
  } else {
    factor3Score = 50;
    factor3Estado = 'moderado';
    factor3Desc = `Consistencia estándar observada en las respuestas.`;
  }

  // 4. FACTOR 4: RESPUESTAS DE VALIDACIÓN DEL USUARIO (Peso: 20%)
  let factor4Score = 0;
  let factor4Estado: ConfidenceFactorDetail['estado'] = 'debil';
  let factor4Desc = '';

  if (isUserValidated) {
    factor4Score = 95;
    factor4Estado = 'fuerte';
    factor4Desc = `Validación explícita activa: Tú has confirmado que esta hipótesis describe con fidelidad tu sentir interior.`;
  } else {
    factor4Score = 35;
    factor4Estado = 'debil';
    factor4Desc = `Pendiente de validación personal: Es una propuesta exploratoria que aún no has confirmado en la autoexploración.`;
  }

  // 5. FACTOR 5: CONTRADICCIONES EXISTENTES (Peso: 10% - Penalizador)
  let factor5Score = 80;
  let factor5Estado: ConfidenceFactorDetail['estado'] = 'fuerte';
  let factor5Desc = 'Sin contradicciones lógicas aparentes en el patrón de respuestas.';

  // Detectar contradicción clínica común: Hipótesis de alta ansiedad/rechazo pero puntajes bajísimos en identidad y aprobación
  const isHypothesisAboutRejection = fullHypText.includes('rechazo') || fullHypText.includes('aprobación');
  const socialIsVeryLow = (screeningScores['genero-identidad-social'] ?? screeningScores['aprobacion-social'] ?? 3) <= 1;
  const isHypothesisAboutControlDefensive = fullHypText.includes('control') && (screeningScores['control-entorno'] ?? 3) <= 1;

  if (isHypothesisAboutRejection && socialIsVeryLow) {
    factor5Score = 15;
    factor5Estado = 'contradictorio';
    factor5Desc = `Contradicción detectada: La hipótesis sugiere búsqueda de aprobación dominante, pero tus respuestas en Aprobación Social reflejan desinterés o plena libertad en esa área (1/5).`;
  } else if (isHypothesisAboutControlDefensive) {
    factor5Score = 15;
    factor5Estado = 'contradictorio';
    factor5Desc = `Contradicción detectada: La hipótesis sugiere necesidad de control como protección, pero tu puntaje en Control es mínimo (1/5).`;
  } else {
    factor5Score = 85;
    factor5Estado = 'fuerte';
    factor5Desc = `Lógica armónica: No se detectan contradicciones entre las respuestas del tamizaje y la hipótesis.`;
  }

  // 6. FACTOR 6: EVIDENCIA EXPLÍCITA APORTADA POR LA PERSONA (Peso: 10%)
  let factor6Score = 40;
  let factor6Estado: ConfidenceFactorDetail['estado'] = 'moderado';
  let factor6Desc = '';

  const explicitBeliefText = activeBeliefs.map(b => b.afirmacionTest || b.creencia || '').join(' ').toLowerCase();
  const matchedExplicitKeywords = BLOCK_KEYWORD_MAP[bloqueId]?.filter(k => explicitBeliefText.includes(k) || userGoal.toLowerCase().includes(k)) || [];

  if (matchedExplicitKeywords.length >= 2 || (userGoal && userGoal.length > 5)) {
    factor6Score = 85;
    factor6Estado = 'fuerte';
    factor6Desc = `Evidencia directa tangible: Testimonios explícitos en tus respuestas («${matchedExplicitKeywords.slice(0, 2).join(', ')}») y meta declarada.`;
  } else if (matchedExplicitKeywords.length === 1) {
    factor6Score = 65;
    factor6Estado = 'moderado';
    factor6Desc = `Evidencia parcial registrada en las afirmaciones seleccionadas.`;
  } else {
    factor6Score = 30;
    factor6Estado = 'debil';
    factor6Desc = `Evidencia inferencial indirecta: No se aportaron comentarios ni frases textuales directas sobre este punto específico.`;
  }

  // CÁLCULO PONDERADO FINAL
  // 1: 25%, 2: 20%, 3: 15%, 4: 20%, 5: 10%, 6: 10%
  const totalScore = Math.round(
    factor1Score * 0.25 +
    factor2Score * 0.20 +
    factor3Score * 0.15 +
    factor4Score * 0.20 +
    factor5Score * 0.10 +
    factor6Score * 0.10
  );

  let nivel: ConfidenceLevel = 'MODERADA';
  let resumen = '';
  let advertenciaMetodologica = '';

  // Determinar Nivel con umbrales estrictos
  if (factor5Estado === 'contradictorio' || baseScore <= 1 || totalScore < 35) {
    nivel = 'INSUFICIENTE';
    resumen = 'La evidencia disponible es insuficiente o presenta contradicciones significativas con tus respuestas.';
    advertenciaMetodologica = '⚠️ EVIDENCIA INSUFICIENTE: Esta hipótesis es solo una posibilidad teórica y NO DEBE TOMARSE COMO CERTEZA. Carece de respaldo suficiente en tus respuestas y no debe asumirse como una conclusión válida sin mayor diálogo.';
  } else if (totalScore < 55 || baseScore <= 2) {
    nivel = 'BAJA';
    resumen = 'Existe respaldo débil o tangencial. No hay convergencia clara entre bloques ni afirmación enfática.';
    advertenciaMetodologica = '⚠️ CONFIANZA BAJA: Planteamiento exploratorio con indicios menores. Requiere discernimiento paciente y no debe considerarse un factor determinante.';
  } else if (totalScore >= 78) {
    nivel = 'ALTA';
    resumen = 'Evidencia convergente robusta: Respaldada por puntaje alto, consistencia, bloques cruzados y afirmación observable.';
    advertenciaMetodologica = '💡 Nota de Gracia: Aunque el nivel de confianza sea ALTO, toda hipótesis pastoral es un instrumento de reflexión interior para orar, no una etiqueta inamovible sobre tu persona.';
  } else {
    nivel = 'MODERADA';
    resumen = 'Indicios claros y consistentes con el bloque evaluado, aunque aún requiere validación personal o mayor respaldo cruzado.';
    advertenciaMetodologica = '🔍 Hipótesis en Proceso: Presenta coherencia con tus respuestas, pero debe ser sopesada en tu propio corazón delante de Dios.';
  }

  return {
    nivel,
    puntuacionTotal: totalScore,
    resumen,
    advertenciaMetodologica,
    factores: {
      intensidadPuntaje: {
        nombre: '1. Intensidad del Puntaje',
        puntuacion: factor1Score,
        estado: factor1Estado,
        descripcion: factor1Desc
      },
      bloquesRelacionados: {
        nombre: '2. Cantidad de Bloques Relacionados',
        puntuacion: factor2Score,
        estado: factor2Estado,
        descripcion: factor2Desc
      },
      consistenciaRespuestas: {
        nombre: '3. Consistencia entre Respuestas',
        puntuacion: factor3Score,
        estado: factor3Estado,
        descripcion: factor3Desc
      },
      respuestasValidacion: {
        nombre: '4. Respuestas de Validación',
        puntuacion: factor4Score,
        estado: factor4Estado,
        descripcion: factor4Desc
      },
      contradicciones: {
        nombre: '5. Contradicciones Existentes',
        puntuacion: factor5Score,
        estado: factor5Estado,
        descripcion: factor5Desc
      },
      evidenciaExplicita: {
        nombre: '6. Evidencia Explícita Aportada',
        puntuacion: factor6Score,
        estado: factor6Estado,
        descripcion: factor6Desc
      }
    }
  };
}

/**
 * Retorna las clases de Tailwind y estilos visuales para cada nivel de confianza
 */
export function getConfidenceBadgeProps(nivel: ConfidenceLevel) {
  switch (nivel) {
    case 'ALTA':
      return {
        label: 'CONFIANZA ALTA',
        badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
        dotColor: 'bg-emerald-400',
        borderAccent: 'border-emerald-500/40',
        cardBg: 'bg-emerald-950/10',
        textColor: 'text-emerald-300',
        barColor: 'bg-emerald-500',
        tagText: 'Evidencia robusta y convergente'
      };
    case 'MODERADA':
      return {
        label: 'CONFIANZA MODERADA',
        badgeBg: 'bg-[#C9A84C]/15 border-[#C9A84C]/35 text-[#C9A84C]',
        dotColor: 'bg-[#C9A84C]',
        borderAccent: 'border-[#C9A84C]/35',
        cardBg: 'bg-[#C9A84C]/5',
        textColor: 'text-[#C9A84C]',
        barColor: 'bg-[#C9A84C]',
        tagText: 'Indicios claros a discernir'
      };
    case 'BAJA':
      return {
        label: 'CONFIANZA BAJA',
        badgeBg: 'bg-orange-500/15 border-orange-500/35 text-orange-300',
        dotColor: 'bg-orange-400',
        borderAccent: 'border-orange-500/35',
        cardBg: 'bg-orange-950/10',
        textColor: 'text-orange-300',
        barColor: 'bg-orange-500',
        tagText: 'Indicios débiles o parciales'
      };
    case 'INSUFICIENTE':
      return {
        label: 'CONFIANZA INSUFICIENTE',
        badgeBg: 'bg-red-500/15 border-red-500/35 text-red-300',
        dotColor: 'bg-red-400',
        borderAccent: 'border-red-500/35',
        cardBg: 'bg-red-950/15',
        textColor: 'text-red-300',
        barColor: 'bg-red-500',
        tagText: 'Sin evidencia suficiente • No es certeza'
      };
    default:
      return {
        label: 'CONFIANZA MODERADA',
        badgeBg: 'bg-white/10 border-white/20 text-white/80',
        dotColor: 'bg-white/60',
        borderAccent: 'border-white/20',
        cardBg: 'bg-white/5',
        textColor: 'text-white/80',
        barColor: 'bg-white/60',
        tagText: 'En evaluación'
      };
  }
}
