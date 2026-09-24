/**
 * SEGUNDA CAPA DINÁMICA DE PREGUNTAS DE VALIDACIÓN
 * 
 * Preguntas seleccionadas dinámicamente según:
 * - El bloque dominante (Control, Aprobación, Rendimiento, etc.)
 * - Las interacciones activas entre bloques (Control + Capacidad, Control + Social, Tiempo + Perfeccionismo)
 * 
 * Cada pregunta investiga los 7 niveles del corazón:
 * CIRCUNSTANCIA, INTERPRETACIÓN, DESEO, TEMOR, CONTROL, RESPUESTA, FRUTO.
 */

export type HeartTarget = 
  | 'CIRCUNSTANCIA' 
  | 'INTERPRETACIÓN' 
  | 'DESEO' 
  | 'TEMOR' 
  | 'CONTROL' 
  | 'RESPUESTA' 
  | 'FRUTO';

export interface DynamicValidationQuestion {
  id: string;
  bloqueTrigger: string; // e.g. 'control-entorno' or 'control-capacidad'
  heartTarget: HeartTarget;
  enunciado: string;
  propositoPastoral: string;
  opciones: string[];
  permiteTextoLibre?: boolean;
}

export const VALIDATION_QUESTION_BANK: DynamicValidationQuestion[] = [
  // --- BLOQUE: CONTROL Y ENTORNO ---
  {
    id: 'val-ctrl-1',
    bloqueTrigger: 'control-entorno',
    heartTarget: 'TEMOR',
    enunciado: '¿Qué temes que ocurra si no puedes controlar el resultado final de una situación importante?',
    propositoPastoral: 'Identificar la vulnerabilidad o desastre anticipado que activa la hipervigilancia.',
    opciones: [
      'Que todo se desborde y nadie sepa qué hacer',
      'Que cometa un error y quede expuesto/a como incompetente',
      'Que los demás sufran o me culpen por el desastre',
      'Que pierda la paz mental por la incertidumbre'
    ],
    permiteTextoLibre: true
  },
  {
    id: 'val-ctrl-2',
    bloqueTrigger: 'control-entorno',
    heartTarget: 'INTERPRETACIÓN',
    enunciado: '¿Qué significado íntimo tiene para ti cometer un error o que algo salga fuera de tu plan?',
    propositoPastoral: 'Discernir la sentencia interna de la mente ante la imperfección.',
    opciones: [
      'Significa que fui negligente o que no me esforcé suficiente',
      'Significa que no soy tan capaz como los demás creen',
      'Significa un peligro real que pudo haberse evitado',
      'Significa un simple recordatorio de que soy humano/a'
    ]
  },
  {
    id: 'val-ctrl-3',
    bloqueTrigger: 'control-entorno',
    heartTarget: 'CONTROL',
    enunciado: '¿Qué es lo más difícil para ti al momento de delegar una responsabilidad a otra persona?',
    propositoPastoral: 'Observar la estrategia de control defensivo en las relaciones.',
    opciones: [
      'Temo que no lo hagan con la calidad y cuidado que yo pongo',
      'Siento que tardo más explicando que haciéndolo yo mismo/a',
      'Me genera ansiedad perder la visibilidad del avance',
      'Siento que al final tendré que rehacerlo todo'
    ]
  },
  {
    id: 'val-ctrl-4',
    bloqueTrigger: 'control-entorno',
    heartTarget: 'RESPUESTA',
    enunciado: '¿Qué crees que las personas que te rodean pensarían de ti si algo bajo tu cargo sale mal?',
    propositoPastoral: 'Localizar la presión de imagen o expectativa social vinculada al control.',
    opciones: [
      'Pensarían que no soy de fiar o que perdí el control',
      'Se decepcionarían de mí y dudarían de mi capacidad',
      'Me juzgarían con dureza o harían comentarios hirientes',
      'Probablemente lo entenderían, pero mi propia autoexigencia no me lo perdonaría'
    ]
  },
  {
    id: 'val-ctrl-5',
    bloqueTrigger: 'control-entorno',
    heartTarget: 'DESEO',
    enunciado: '¿Qué necesitas sentir interiormente para poder soltar una situación y dejarla en manos de Dios o de otros?',
    propositoPastoral: 'Desvelar el anhelo del corazón que se antepone a la fe y al reposo.',
    opciones: [
      'Necesito tener garantías tangibles de que todo saldrá bien',
      'Necesito saber que si algo falla, tendré un plan de contingencia inmediato',
      'Necesito sentir que ya di hasta mi última gota de energía',
      'Necesito paz sobrenatural para descansar sin garantías humanas'
    ]
  },
  {
    id: 'val-ctrl-6',
    bloqueTrigger: 'control-entorno',
    heartTarget: 'CONTROL',
    enunciado: '¿Qué resultado específico estás intentando garantizar a través de tu anticipación constante?',
    propositoPastoral: 'Hacer visible el objeto de seguridad que compite con la soberanía divina.',
    opciones: [
      'Garantizar la estabilidad emocional o financiera de mi familia',
      'Garantizar que no seré tomado/a por sorpresa ni humillado/a',
      'Garantizar mi reputación de persona impecable y resolutiva',
      'Garantizar que las cosas se hagan en el orden correcto'
    ],
    permiteTextoLibre: true
  },

  // --- INTERACCIÓN: CAPACIDAD RELACIONADA CON CONTROL ---
  {
    id: 'val-cap-ctrl-1',
    bloqueTrigger: 'capacidad-control',
    heartTarget: 'INTERPRETACIÓN',
    enunciado: '¿Qué significado tiene para ti encontrarte ante una situación y no saber qué hacer?',
    propositoPastoral: 'Evaluar si la ignorancia o límite se lee como descalificación de identidad.',
    opciones: [
      'Siento que quedo desprotegido/a y vulnerable ante los demás',
      'Siento una profunda vergüenza interna de no estar a la altura',
      'Lo veo como una oportunidad natural para aprender y pedir consejo',
      'Me urge simular seguridad para no evidenciar mi confusión'
    ]
  },
  {
    id: 'val-cap-ctrl-2',
    bloqueTrigger: 'capacidad-control',
    heartTarget: 'FRUTO',
    enunciado: '¿Qué ocurre dentro de ti cuando ves que otra persona sabe o resuelve con más rapidez que tú?',
    propositoPastoral: 'Detectar comparaciones defensivas o repliegues interiores.',
    opciones: [
      'Se despierta una voz interna de inferioridad («¿por qué a mí me cuesta tanto?»)',
      'Me pongo tenso/a e intento esforzarme el doble para no quedar atrás',
      'Siento alivio de poder aprender de su experiencia',
      'Siento frustración porque expone mis propias debilidades'
    ]
  },
  {
    id: 'val-cap-ctrl-3',
    bloqueTrigger: 'capacidad-control',
    heartTarget: 'TEMOR',
    enunciado: '¿Qué crees que demuestra un error público acerca de quién eres tú?',
    propositoPastoral: 'Discernir la confusión entre "cometer un error" y "ser un fracaso".',
    opciones: [
      'Demuestra que en el fondo soy un fraude y tarde o temprano se descubriría',
      'Demuestra que no merezco las responsabilidades que me han dado',
      'Demuestra simplemente que soy una criatura finita en aprendizaje',
      'Demuestra que bajé la guardia cuando debí haber estado más atento/a'
    ]
  },

  // --- INTERACCIÓN: ACEPTACIÓN SOCIAL RELACIONADA CON CONTROL O RENDIMIENTO ---
  {
    id: 'val-soc-1',
    bloqueTrigger: 'aprobacion-social',
    heartTarget: 'TEMOR',
    enunciado: '¿Qué temes perder si una persona clave desaprueba abiertamente una decisión tuya?',
    propositoPastoral: 'Examinar el temor al rechazo o pérdida de pertenencia.',
    opciones: [
      'Temo perder su afecto, respeto y cercanía',
      'Temo que comience a hablar mal de mí ante otros',
      'Temo la confrontación y la incomodidad del conflicto',
      'Temo dudar de mí mismo/a y convencerme de que me equivoqué'
    ],
    permiteTextoLibre: true
  },
  {
    id: 'val-soc-2',
    bloqueTrigger: 'aprobacion-social',
    heartTarget: 'INTERPRETACIÓN',
    enunciado: '¿Qué opinión de otras personas suele tener mayor peso sobre tu paz interior?',
    propositoPastoral: 'Ubicar las figuras de autoridad o validación que ejercen tiranía mental.',
    opciones: [
      'La de mis líderes, jefes o pastores',
      'La de mi cónyuge, padres o familia directa',
      'La de mis pares, colegas de trabajo o amistades cercanas',
      'La de la comunidad o grupo general que me observa'
    ]
  },
  {
    id: 'val-soc-3',
    bloqueTrigger: 'aprobacion-social',
    heartTarget: 'CONTROL',
    enunciado: '¿Qué maniobra sueles emplear para evitar ser desaprobado/a o criticado/a?',
    propositoPastoral: 'Hacer visible el mecanismo de complacencia o camuflaje social.',
    opciones: [
      'Callar mi verdadera postura y acomodarme a lo que el grupo espera',
      'Hiper-prepararme para que mi trabajo sea intachable e incriticable',
      'Aislarme y no exponerme a situaciones donde puedan evaluarme',
      'Agradar a todos diciendo que sí aunque esté colapsado/a de tiempo'
    ]
  },

  // --- INTERACCIÓN: TIEMPO, URGENCIA Y PERFECCIONISMO ---
  {
    id: 'val-time-1',
    bloqueTrigger: 'tiempo-urgencia',
    heartTarget: 'RESPUESTA',
    enunciado: '¿Cuánto tiempo y energía adicionales sueles dedicar a preparar algo antes de atreverte a presentarlo?',
    propositoPastoral: 'Medir el sobrecosto de tiempo generado por el perfeccionismo.',
    opciones: [
      'Mucho más de lo necesario; reviso una y otra vez detalles minúsculos',
      'Lo postergo hasta el último minuto por temor a que no quede perfecto',
      'El tiempo justo y razonable para una buena mayordomía',
      'Me paralizo en la investigación y me cuesta pasar a la acción final'
    ]
  },
  {
    id: 'val-time-2',
    bloqueTrigger: 'tiempo-urgencia',
    heartTarget: 'INTERPRETACIÓN',
    enunciado: '¿Qué tendría que suceder exactamente para que consideres que una tarea está «suficientemente buena» para cerrarla?',
    propositoPastoral: 'Evaluar estándares inalcanzables o rigidez cognitiva.',
    opciones: [
      'Que no tenga ni un solo defecto visible para nadie',
      'Que me sienta 100% seguro/a de que nadie podrá cuestionarla',
      'Que cumpla con el objetivo con excelencia dentro del tiempo disponible',
      'Casi nunca siento que está lista; la entrego solo cuando el plazo me obliga'
    ]
  },
  {
    id: 'val-time-3',
    bloqueTrigger: 'tiempo-urgencia',
    heartTarget: 'TEMOR',
    enunciado: '¿Qué temes que ocurra si entregas o presentas algo imperfecto o incompleto?',
    propositoPastoral: 'Conectar el manejo del tiempo con la raíz de autoimagen y descanso.',
    opciones: [
      'Que me consideren descuidado/a, mediocre o falto/a de compromiso',
      'Que se destruya la confianza que habían depositado en mí',
      'Que me obligue a soportar la vergüenza de una crítica correctiva',
      'Que pierda una oportunidad que no volverá'
    ]
  },

  // --- BLOQUE: RENDIMIENTO Y DESEMPEÑO ---
  {
    id: 'val-rend-1',
    bloqueTrigger: 'rendimiento-desempeno',
    heartTarget: 'DESEO',
    enunciado: '¿Qué sientes que obtienes cuando alcanzas un logro sobresaliente o de alto rendimiento?',
    propositoPastoral: 'Discernir si el anhelo es la gloria de Dios o la autoafirmación de valor.',
    opciones: [
      'Un breve respiro de alivio («por fin estoy a salvo por ahora»)',
      'La confirmación momentánea de que sí valgo y sirvo para algo',
      'Gozo genuino de servir a Dios con mis talentos',
      'Una presión inmediata por superar la siguiente meta sin poder celebrar'
    ]
  },
  {
    id: 'val-rend-2',
    bloqueTrigger: 'rendimiento-desempeno',
    heartTarget: 'FRUTO',
    enunciado: '¿Cómo afecta esta constante búsqueda de resultados a tus relaciones y descanso espiritual?',
    propositoPastoral: 'Medir el impacto desgastante en la paz interior y el reposo en el Evangelio.',
    opciones: [
      'Me cuesta desconectar la mente y disfrutar del reposo sin culpa',
      'Me impaciento con quienes van más despacio o son menos rigurosos',
      'Siento un cansancio crónico en el cuerpo y aridez devocional',
      'Mantengo un equilibrio saludable entre trabajo, gracia y descanso'
    ]
  }
];

/**
 * Selecciona dinámicamente el conjunto de preguntas de validación para el usuario
 * basándose en sus puntajes de tamizaje y cruces activos.
 */
export function selectDynamicValidationQuestions(
  screeningScores: Record<string, number>,
  dominantBlockId: string
): DynamicValidationQuestion[] {
  const selected: DynamicValidationQuestion[] = [];
  const selectedIds = new Set<string>();

  const controlScore = screeningScores['control-entorno'] ?? 0;
  const capacidadScore = screeningScores['capacidad-recursos'] ?? 0;
  const socialScore = screeningScores['aprobacion-social'] ?? 0;
  const tiempoScore = screeningScores['tiempo-urgencia'] ?? 0;
  const rendimientoScore = screeningScores['rendimiento-desempeno'] ?? 0;

  // 1. Si CONTROL es alto (>= 3 o es dominante)
  if (controlScore >= 3 || dominantBlockId === 'control-entorno') {
    VALIDATION_QUESTION_BANK
      .filter(q => q.bloqueTrigger === 'control-entorno')
      .slice(0, 3)
      .forEach(q => {
        if (!selectedIds.has(q.id)) {
          selected.push(q);
          selectedIds.add(q.id);
        }
      });
  }

  // 2. Si CAPACIDAD está relacionado con CONTROL (ambos >= 3)
  if ((capacidadScore >= 3 && controlScore >= 3) || (dominantBlockId === 'capacidad-recursos' && controlScore >= 3)) {
    VALIDATION_QUESTION_BANK
      .filter(q => q.bloqueTrigger === 'capacidad-control')
      .forEach(q => {
        if (!selectedIds.has(q.id)) {
          selected.push(q);
          selectedIds.add(q.id);
        }
      });
  }

  // 3. Si ACEPTACIÓN SOCIAL está alto o relacionado con Control/Rendimiento
  if (socialScore >= 3 || dominantBlockId === 'aprobacion-social') {
    VALIDATION_QUESTION_BANK
      .filter(q => q.bloqueTrigger === 'aprobacion-social')
      .slice(0, 2)
      .forEach(q => {
        if (!selectedIds.has(q.id)) {
          selected.push(q);
          selectedIds.add(q.id);
        }
      });
  }

  // 4. Si TIEMPO y URGENCIA están presentes con perfeccionismo
  if (tiempoScore >= 3 || dominantBlockId === 'tiempo-urgencia') {
    VALIDATION_QUESTION_BANK
      .filter(q => q.bloqueTrigger === 'tiempo-urgencia')
      .slice(0, 2)
      .forEach(q => {
        if (!selectedIds.has(q.id)) {
          selected.push(q);
          selectedIds.add(q.id);
        }
      });
  }

  // 5. Si RENDIMIENTO está alto
  if (rendimientoScore >= 3 || dominantBlockId === 'rendimiento-desempeno') {
    VALIDATION_QUESTION_BANK
      .filter(q => q.bloqueTrigger === 'rendimiento-desempeno')
      .slice(0, 2)
      .forEach(q => {
        if (!selectedIds.has(q.id)) {
          selected.push(q);
          selectedIds.add(q.id);
        }
      });
  }

  // Si por alguna razón los puntajes son bajos o no se alcanzaron suficientes preguntas (mínimo 3):
  if (selected.length < 3) {
    VALIDATION_QUESTION_BANK.slice(0, 4).forEach(q => {
      if (!selectedIds.has(q.id) && selected.length < 4) {
        selected.push(q);
        selectedIds.add(q.id);
      }
    });
  }

  return selected.slice(0, 6); // Max 6 focused questions to maintain user engagement
}
