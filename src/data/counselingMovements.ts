/**
 * CONSEJERÍA BÍBLICA INTEGRAL: PROMPTS 8, 9, 10, 11 Y 12
 * 
 * - Los 4 Movimientos de Consejería (Redefinir, Reenfocar, Rendir, Reestructurar)
 * - Dirección Bíblica Inteligente (Texto, Verdad, Conexión, Pregunta, Aplicación)
 * - Fidelidad vs. Perfección (Preguntas de discernimiento ante el control y desempeño)
 * - "Lo que todavía no sabemos" (Preguntas no resolubles con el test)
 * - Mapa Visual de Intervención (Cascada de 10 pasos interactiva)
 */

// ==========================================
// PROMPT 8: LOS 4 MOVIMIENTOS DE CONSEJERÍA
// ==========================================
export interface FourMovementsData {
  redefinir: {
    interpretacionAExaminar: string;
    dios: string;
    siMismo: string;
    demas: string;
    circunstancias: string;
  };
  reenfocar: {
    atencionACristo: string;
    verdadEvangelio: string;
    pasajeTransformador: {
      cita: string;
      principio: string;
    };
  };
  rendir: {
    queEntregarAlSenor: string;
    queEstaIntentandoControlar: string;
    deseoASometer: string;
    expectativaARendir: string;
  };
  reestructurar: {
    nuevaRespuesta: string;
    conductaConcreta: string;
    responsabilidadAsumir: string;
    conversacionNecesaria: string;
    limiteEstablecer: string;
    accionObediencia: string;
  };
}

// ==========================================
// PROMPT 9: DIRECCIÓN BÍBLICA INTELIGENTE
// ==========================================
export interface IntelligentBiblicalDirection {
  texto: string;
  verdadBiblica: string;
  conexionConElCaso: string;
  preguntaDeConsejeria: string;
  aplicacion: string;
}

// ==========================================
// PROMPT 10: FIDELIDAD VS PERFECCIÓN
// ==========================================
export interface FidelityVsPerfectionCheck {
  aplica: boolean;
  motivoActivacion: string;
  preguntasDiscernimiento: Array<{
    pregunta: string;
    enfoqueFidelidad: string;
    trampaPerfeccion: string;
  }>;
}

// ==========================================
// PROMPT 11: LO QUE TODAVÍA NO SABEMOS
// ==========================================
export interface LoQueTodaviaNoSabemosItem {
  id: string;
  enunciado: string;
  porQueImporta: string;
  preguntaParaLaSesion: string;
}

// ==========================================
// PROMPT 12: MAPA VISUAL DE INTERVENCIÓN (10 PASOS)
// ==========================================
export type InterventionStepId = 
  | 'circunstancia'
  | 'interpretacion'
  | 'deseo'
  | 'temor'
  | 'control'
  | 'respuesta'
  | 'fruto'
  | 'verdadBiblica'
  | 'nuevaRespuesta'
  | 'practica';

export interface VisualInterventionNode {
  id: InterventionStepId;
  pasoNumero: number;
  titulo: string;
  subtitulo: string;
  fase: 'diagnostico' | 'raiz' | 'fruto' | 'intervencion' | 'transformacion';
  evidencia: string;
  preguntas: string[];
  hipotesis: string;
  textosBiblicos?: {
    cita: string;
    texto: string;
    aplicacion: string;
  };
  aplicacion: string;
  color: string;
  icono: string;
}

/**
 * Generador de los 4 Movimientos según el bloque dominante
 */
export function getFourMovements(blockId: string): FourMovementsData {
  switch (blockId) {
    case 'control-entorno':
      return {
        redefinir: {
          interpretacionAExaminar: '«Si yo no anticipo y superviso cada variable, el desastre es inminente y mi valor o seguridad se derrumbarán».',
          dios: 'Cree que Dios es distante o que necesita la ayuda humana para que las cosas no se salgan de carril.',
          siMismo: 'Se percibe como el único muro de contención responsable entre el orden y el caos.',
          demas: 'Los ve como incompetentes, frágiles o desinteresados, incapaces de cuidar los detalles.',
          circunstancias: 'Las interpreta como amenazas constantes que deben ser domesticadas mediante hipervigilancia.'
        },
        reenfocar: {
          atencionACristo: 'Cristo sostiene el universo entero por la palabra de Su poder (Hebreos 1:3). Él nunca duerme ni se desborda.',
          verdadEvangelio: 'Nuestra paz no descansa en controlar los resultados futuros, sino en descansar en la victoria consumada de Cristo, quien gobierna con bondad aun en medio de la tormenta.',
          pasajeTransformador: {
            cita: 'Salmo 127:1-2',
            principio: 'Si el Señor no edifica la casa, en vano trabajan los que la edifican. Es vano madrugar y acostarse tarde comiendo pan de fatiga, pues a Su amado dará Dios el sueño.'
          }
        },
        rendir: {
          queEntregarAlSenor: 'La pretensión de preverlo todo y la carga de garantizar que nadie sufra ni cometa errores.',
          queEstaIntentandoControlar: 'Las decisiones y los tiempos de otras personas y el resultado final de los proyectos.',
          deseoASometer: 'El deseo desordenado de invulnerabilidad y la certeza terrenal antes de obedecer.',
          expectativaARendir: 'La exigencia de que el entorno funcione exactamente conforme a mis estándares y tiempos.'
        },
        reestructurar: {
          nuevaRespuesta: 'Practicar la mayordomía fiel delegando con instrucciones claras y soltando la supervisión compulsiva.',
          conductaConcreta: 'Establecer una «pausa de entrega» de 2 minutos antes de enviar recordatorios o corregir a otros.',
          responsabilidadAsumir: 'Hacerme cargo de mi propia fidelidad sin asumir la soberanía de los resultados ajenos.',
          conversacionNecesaria: 'Conversar con el equipo o la familia para admitir la sobrecarga y pedir apoyo con humildad.',
          limiteEstablecer: 'No revisar pendientes laborales ni correos después de las 8:00 PM.',
          accionObediencia: 'Orar entregando el proyecto a Dios y apagar el dispositivo a la hora pactada hoy mismo.'
        }
      };

    case 'capacidad-recursos':
      return {
        redefinir: {
          interpretacionAExaminar: '«No saber o cometer una falla demuestra que no soy suficiente y que tarde o temprano seré descalificado/a».',
          dios: 'Cree que Dios exige perfección técnica para conceder Su favor o encomendar Su obra.',
          siMismo: 'Se mide por su rendimiento inmediato y teme ser expuesto/a como un fraude.',
          demas: 'Los percibe como jueces minuciosos listos para notar cualquier vacilación o desconocimiento.',
          circunstancias: 'Las ve como exámenes implacables que ponen a prueba su valor personal.'
        },
        reenfocar: {
          atencionACristo: 'Nuestra suficiencia no proviene de nosotros mismos, sino de Dios (2 Corintios 3:5). El poder de Cristo se perfecciona en nuestra debilidad.',
          verdadEvangelio: 'En la Cruz, Jesús pagó por todas nuestras faltas y nos revistió con Su propia justicia perfecta. No tenemos nada que probar.',
          pasajeTransformador: {
            cita: '2 Corintios 12:9',
            principio: 'Bástate mi gracia; porque mi poder se perfecciona en la debilidad. De buena gana me gloriaré más bien en mis debilidades.'
          }
        },
        rendir: {
          queEntregarAlSenor: 'La obsesión con parecer omnisciente, autosuficiente e invulnerable ante los demás.',
          queEstaIntentandoControlar: 'La opinión ajena sobre su grado de competencia o inteligencia.',
          deseoASometer: 'El deseo carnal de no necesitar ayuda ni consejo de nadie.',
          expectativaARendir: 'La exigencia de dominar cualquier tema sin pasar por el proceso humilde de aprendizaje.'
        },
        reestructurar: {
          nuevaRespuesta: 'Aceptar los límites con gratitud, reconociendo con serenidad cuando algo no se sabe.',
          conductaConcreta: 'Decir con tranquilidad «No lo sé en este momento, lo consultaré y te respondo» sin angustia.',
          responsabilidadAsumir: 'Pedir mentoría o capacitación técnica en las áreas donde faltan habilidades prácticas.',
          conversacionNecesaria: 'Pedir retroalimentación formativa a un líder o mentor de confianza.',
          limiteEstablecer: 'Dejar de comparar mis inicios con los años de trayectoria de otros profesionales.',
          accionObediencia: 'Asumir la tarea asignada confiando en que el Señor guiará el paso a paso.'
        }
      };

    case 'aprobacion-social':
      return {
        redefinir: {
          interpretacionAExaminar: '«Si alguien me desaprueba o critica, mi pertenencia y mi valor quedan anulados».',
          dios: 'Cree que la aprobación de Dios no es suficiente para apagar la sed de aplauso o aceptación humana.',
          siMismo: 'Se considera condicionalmente aceptable solo si mantiene a todos contentos.',
          demas: 'Los erige como jurados absolutos de su dignidad y bienestar emocional.',
          circunstancias: 'Cualquier roce o desacuerdo se interpreta como una amenaza existencial de abandono.'
        },
        reenfocar: {
          atencionACristo: 'Cristo fue despreciado y desechado entre los hombres para que nosotros fuéramos amados y aceptados eternamente por el Padre.',
          verdadEvangelio: 'El temor del hombre pone lazo; mas el que confía en el Señor será puesto en alto (Proverbios 29:25). Ya somos amados con amor eterno.',
          pasajeTransformador: {
            cita: 'Gálatas 1:10',
            principio: '¿Busco ahora el favor de los hombres, o el de Dios? Pues si todavía agradara a los hombres, no sería siervo de Cristo.'
          }
        },
        rendir: {
          queEntregarAlSenor: 'La necesidad adictiva de consenso y simpatía unánime.',
          queEstaIntentandoControlar: 'Lo que los demás piensan, sienten y dicen en privado.',
          deseoASometer: 'El deseo idólatra de ser aplaudido/a y validado/a antes que de obedecer a Dios.',
          expectativaARendir: 'La ilusión de que es posible vivir el Evangelio sin experimentar incomodidad o rechazo social.'
        },
        reestructurar: {
          nuevaRespuesta: 'Hablar con verdad en amor, sosteniendo convicciones sin agresividad ni repliegue temeroso.',
          conductaConcreta: 'Dar una respuesta honesta («En este momento no podré asumir ese compromiso») con amabilidad.',
          responsabilidadAsumir: 'Aceptar que agradar a Dios a veces implicará no complacer las demandas ajenas.',
          conversacionNecesaria: 'Expresar una postura franca en una reunión donde antes prefería callar.',
          limiteEstablecer: 'No consultar con 4 personas antes de tomar una decisión que Dios ya aclaró en Su Palabra.',
          accionObediencia: 'Tomar la decisión correcta por convicción, descansando en el agrado del Padre celestial.'
        }
      };

    default: // Genérico robusto bíblico para cualquier otro bloque
      return {
        redefinir: {
          interpretacionAExaminar: '«Mi bienestar y descanso dependen de que mis condiciones actuales se resuelvan favorablemente».',
          dios: 'Se experimenta una tentación de dudar de Su bondad o de Su cuidado providencial cotidiano.',
          siMismo: 'Se siente sobrecargado/a por tener que sostener lo que solo la gracia de Dios puede sostener.',
          demas: 'Pueden verse como fuentes de exigencia o posibles causantes de dolor e inestabilidad.',
          circunstancias: 'Se perciben como abrumadoras y determinantes del destino final.'
        },
        reenfocar: {
          atencionACristo: 'Cristo es nuestro Pastor, nada nos faltará. En Él habita corporalmente toda la plenitud de la Deidad.',
          verdadEvangelio: 'El que no escatimó ni a Su propio Hijo, sino que lo entregó por todos nosotros, ¿cómo no nos dará también con Él todas las cosas? (Romanos 8:32).',
          pasajeTransformador: {
            cita: 'Mateo 11:28-30',
            principio: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar. Llevad mi yugo sobre vosotros y aprended de mí.'
          }
        },
        rendir: {
          queEntregarAlSenor: 'El peso de las expectativas desmedidas y la ansiedad por el día de mañana.',
          queEstaIntentandoControlar: 'El ritmo y la forma exacta en que Dios responderá a las oraciones.',
          deseoASometer: 'El deseo de autonomía y de tener el control del calendario divino.',
          expectativaARendir: 'La exigencia de que no haya pruebas ni aflicciones en el camino del discipulado.'
        },
        reestructurar: {
          nuevaRespuesta: 'Caminar en fe activa, dando un paso de obediencia a la vez en dependencia del Espíritu.',
          conductaConcreta: 'Establecer un tiempo diario innegociable de quietud y meditación en la Escritura.',
          responsabilidadAsumir: 'Asumir con fidelidad lo que está hoy en mis manos, soltando el mañana al Señor.',
          conversacionNecesaria: 'Compartir la carga con un hermano maduro en la fe para rendir cuentas.',
          limiteEstablecer: 'Poner freno a los pensamientos obsesivos llevando cautivo todo pensamiento a Cristo.',
          accionObediencia: 'Dar hoy el paso práctico postergado con oración y sencillez de corazón.'
        }
      };
  }
}

/**
 * Generador de Dirección Bíblica Inteligente (Prompt 9)
 */
export function getIntelligentBiblicalDirections(blockId: string): IntelligentBiblicalDirection[] {
  switch (blockId) {
    case 'control-entorno':
      return [
        {
          texto: '2 Corintios 3:4-5',
          verdadBiblica: 'Nuestra competencia y suficiencia provienen exclusivamente de Dios, no de nuestra capacidad de supervisión humana.',
          conexionConElCaso: 'La persona parece estar intentando establecer su seguridad mediante desempeño minucioso, anticipación y control sobre las personas y circunstancias.',
          preguntaDeConsejeria: '¿Qué cambia en tu nivel de ansiedad diaria si tu competencia ya no tiene que ser demostrada para tener valor delante de Dios?',
          aplicacion: 'Practicar la fidelidad responsable en lo que te corresponde hoy, sin exigir perfección ni pretender controlar el desenlace.'
        },
        {
          texto: 'Proverbios 3:5-6',
          verdadBiblica: 'Fiarte de Dios con todo el corazón exige explícitamente no apoyarte en tu propia prudencia ni en tu cálculo autónomo.',
          conexionConElCaso: 'Existe una tendencia a confiar en el plan personal más que en la providencia invisible de Dios.',
          preguntaDeConsejeria: '¿En qué área concreta de tu día te estás apoyando en tu propia prudencia hasta el agotamiento?',
          aplicacion: 'Hacer una lista de los 3 imprevistos que más temes y entregárselos al Señor en oración matutina, renunciando a fiscalizarlos.'
        },
        {
          texto: 'Salmo 46:10',
          verdadBiblica: '«Estad quietos y sabed que Yo soy Dios». La quietud es un acto de adoración donde reconocemos quién está en el trono.',
          conexionConElCaso: 'El desasosiego interior confunde la actividad frenética con mayordomía piadosa.',
          preguntaDeConsejeria: '¿Qué temes que se derrumbe si te quedas en silencio delante de Dios por 15 minutos sin revisar ningún pendiente?',
          aplicacion: 'Separar un espacio diario de quietud absoluta, respirando en la presencia de Dios y recordando Su soberanía.'
        }
      ];

    case 'capacidad-recursos':
      return [
        {
          texto: '2 Corintios 12:9-10',
          verdadBiblica: 'La gracia de Dios es suficiente; Su poder se perfecciona en nuestra debilidad creatural.',
          conexionConElCaso: 'La persona experimenta temor a equivocarse o a no saber, interpretando su límite como insuficiencia moral o incapacidad.',
          preguntaDeConsejeria: '¿Cómo glorificaría a Dios que hoy aceptes tu límite humano y pidas ayuda con sencillez?',
          aplicacion: 'Identificar una duda o tarea compleja y pedir consejo a un colega o líder sin avergonzarte.'
        },
        {
          texto: '1 Corintios 4:7',
          verdadBiblica: '¿Qué tienes que no hayas recibido? Y si lo recibiste, ¿por qué te jactas como si no te fuera dado?',
          conexionConElCaso: 'La presión de autosuficiencia hace olvidar que todo talento es un don recibido para servir, no un pedestal.',
          preguntaDeConsejeria: '¿De qué peso te libera saber que tus dones no son un mérito propio sino una mayordomía confiada por Dios?',
          aplicacion: 'Agradecer a Dios por los talentos recibidos y utilizarlos para bendecir a alguien sin buscar reconocimiento.'
        }
      ];

    default:
      return [
        {
          texto: 'Romanos 8:31-32',
          verdadBiblica: 'Si Dios es por nosotros, ¿quién contra nosotros? El Padre nos ha concedido gratuitamente todas las cosas con Cristo.',
          conexionConElCaso: 'Se busca garantizar el cuidado personal mediante esfuerzo ansioso, olvidando la generosidad demostrada en la Cruz.',
          preguntaDeConsejeria: 'Si el Padre ya entregó a Su Hijo por ti, ¿por qué dudar de que sostendrá tus necesidades de hoy?',
          aplicacion: 'Meditar diariamente en el amor incondicional del Padre y renovar la confianza filial en la provisión divina.'
        },
        {
          texto: 'Filipenses 4:6-7',
          verdadBiblica: 'La paz de Dios, que sobrepasa todo entendimiento, guarda nuestros corazones cuando presentamos todo con acción de gracias.',
          conexionConElCaso: 'La persona retiene sus inquietudes en rumiación mental en lugar de descargarlas en oración suplicante.',
          preguntaDeConsejeria: '¿Qué preocupación estás rumiando hoy que todavía no has convertido en súplica y gratitud?',
          aplicacion: 'Convertir cada pensamiento de preocupación recurrente en una oración de agradecimiento inmediata.'
        }
      ];
  }
}

/**
 * Generador de Preguntas de Fidelidad vs Perfección (Prompt 10)
 */
export function getFidelityVsPerfectionCheck(
  blockId: string, 
  score: number = 4
): FidelityVsPerfectionCheck {
  const triggerBlocks = [
    'control-entorno',
    'rendimiento-desempeno',
    'capacidad-recursos',
    'aprobacion-social',
    'tiempo-urgencia'
  ];

  const aplica = triggerBlocks.includes(blockId) || score >= 3;

  return {
    aplica,
    motivoActivacion: aplica 
      ? `Activado por presencia notable de patrones vinculados a ${blockId} (${score}/5).`
      : 'Evaluación de mayordomía estándar.',
    preguntasDiscernimiento: [
      {
        pregunta: '¿Estoy buscando ser fiel a Dios o demostrar que soy suficiente?',
        enfoqueFidelidad: 'La fidelidad mira a Cristo, descansando en Su suficiencia y buscando Su gloria con sencillez de corazón.',
        trampaPerfeccion: 'La perfección busca blindar el ego, asegurándose de que nadie pueda señalar un error o debilidad.'
      },
      {
        pregunta: '¿Estoy intentando obedecer a Dios o garantizar el resultado por mis fuerzas?',
        enfoqueFidelidad: 'La obediencia deja el resultado soberano en las manos de Dios, cumpliendo el deber encomendado.',
        trampaPerfeccion: 'El control intenta manipular o forzar las variables para que el resultado coincida exactamente con mi expectativa.'
      },
      {
        pregunta: '¿Estoy administrando responsablemente o intentando controlar por miedo?',
        enfoqueFidelidad: 'La mayordomía es paciente, delega, respeta a las personas y descansa en la noche sabiendo que Dios cuida Su obra.',
        trampaPerfeccion: 'La hipervigilancia fiscaliza, genera tensión relacional y no permite desconectar por temor a imprevistos.'
      },
      {
        pregunta: '¿Estoy buscando excelencia para el Señor o perfección para proteger mi imagen?',
        enfoqueFidelidad: 'La excelencia bíblica ofrece lo mejor disponible con gozo, sin paralizarse por lo que falte.',
        trampaPerfeccion: 'El perfeccionismo posterga y sobre-corrige para evitar el dolor del juicio social o la crítica ajena.'
      },
      {
        pregunta: '¿Estoy esperando sentirme completamente segura antes de obedecer?',
        enfoqueFidelidad: 'La fe avanza en medio del temblor, confiando en que Dios suplirá lo necesario en el camino.',
        trampaPerfeccion: 'La carne exige garantías humanas tangibles y ausencia total de riesgo antes de dar un paso.'
      },
      {
        pregunta: '¿Cómo se vería ser genuinamente fiel a Dios en estas circunstancias concretas?',
        enfoqueFidelidad: 'Hacer lo que Dios manda hoy con amor, soltar la ansiedad del mañana y tratar a los demás con gracia y paciencia.',
        trampaPerfeccion: 'Exigir a todos (y a uno mismo) un estándar inalcanzable de impecabilidad sin margen para el error.'
      }
    ]
  };
}

/**
 * Generador de "Lo que todavía no sabemos" (Prompt 11 - OBLIGATORIO)
 */
export function getLoQueTodaviaNoSabemos(
  blockId: string,
  screeningScores: Record<string, number> = {},
  selectedHypothesis?: string
): LoQueTodaviaNoSabemosItem[] {
  const items: LoQueTodaviaNoSabemosItem[] = [
    {
      id: 'unk-1',
      enunciado: 'No sabemos todavía si la necesidad de control surge principalmente del temor al rechazo o de una herida pasada de abandono.',
      porQueImporta: 'Un test captura conductas observables, pero solo una conversación pastoral cercana puede desvelar la raíz afectiva profunda del corazón.',
      preguntaParaLaSesion: '¿Recuerdas cuándo fue la primera vez que sentiste que si tú no te hacías cargo, todo se derrumbaría?'
    },
    {
      id: 'unk-2',
      enunciado: 'No sabemos si existe una historia previa de crítica severa o exigencia perfeccionista en tu hogar o liderazgo anterior.',
      porQueImporta: 'Muchos patrones de autoexigencia son lealtades invisibles aprendidas para evitar el castigo o la desaprobación en la infancia.',
      preguntaParaLaSesion: '¿Cómo reaccionaban tus padres o líderes de referencia cuando cometías una equivocación o sacabas una mala nota?'
    },
    {
      id: 'unk-3',
      enunciado: 'No sabemos con precisión cuánto de la dificultad corresponde a falta de habilidades prácticas de gestión y cuánto a raíces espirituales del corazón.',
      porQueImporta: 'Confundir falta de capacitación técnica con un problema moral produce culpa infructuosa; separar ambas cosas trae libertad y enfoque.',
      preguntaParaLaSesion: '¿Alguna vez te han capacitado con una metodología estructurada de delegación y manejo de agenda?'
    },
    {
      id: 'unk-4',
      enunciado: 'No sabemos si tu búsqueda de rendimiento y resultados está conectada con tu sentido de identidad o con una carga circunstancial temporal.',
      porQueImporta: 'Una etapa de alta exigencia laboral transitoria es diferente de un ídolo del corazón donde el valor depende del éxito profesional.',
      preguntaParaLaSesion: 'Si este proyecto o rol terminara mañana, ¿sentirías que pierdes tu valor como persona o que solo concluyó una etapa?'
    },
    {
      id: 'unk-5',
      enunciado: 'No sabemos cómo experimentas íntimamente la gracia y tu identidad en Cristo en los momentos de fracaso.',
      porQueImporta: 'Saber teológicamente que Dios nos ama es muy distinto de experimentar Su perdón y ternura cuando acabamos de fallar.',
      preguntaParaLaSesion: 'Cuando te das cuenta de que te equivocaste, ¿cuál es el primer pensamiento que tienes sobre lo que Dios siente hacia ti?'
    }
  ];

  return items;
}

/**
 * Generador del Mapa Visual de Intervención de 10 Pasos (Prompt 12)
 */
export function getVisualInterventionMap(
  blockId: string,
  userName: string,
  userGoal: string = 'vida diaria',
  hypData?: any
): VisualInterventionNode[] {
  return [
    {
      id: 'circunstancia',
      pasoNumero: 1,
      titulo: 'CIRCUNSTANCIA',
      subtitulo: 'Contexto real y detonante objetivo',
      fase: 'diagnostico',
      evidencia: `Situación reportada por ${userName} en el cuestionario vinculada a ${blockId} y su meta («${userGoal}»).`,
      preguntas: [
        '¿Qué está ocurriendo concretamente a tu alrededor en este momento?',
        '¿Quiénes son las personas involucradas y qué presiones objetivas existen?'
      ],
      hipotesis: 'Enfrentar tareas o responsabilidades donde no se tiene el control total de las variables o se teme una evaluación externa.',
      aplicacion: 'Nombrar los hechos objetivos separándolos de las suposiciones o catástrofes imaginadas.',
      color: 'from-sky-500/20 to-sky-950/40 border-sky-500/40 text-sky-300',
      icono: '🌐'
    },
    {
      id: 'interpretacion',
      pasoNumero: 2,
      titulo: 'INTERPRETACIÓN',
      subtitulo: 'Lectura o sentencia interna de la mente',
      fase: 'diagnostico',
      evidencia: 'Tendencia cognitiva detectada en las afirmaciones de autoevaluación.',
      preguntas: [
        '¿Qué te dices a ti mismo/a cuando algo no sale conforme al plan?',
        '¿Qué significado le atribuyes a una crítica o a un error ajeno?'
      ],
      hipotesis: '«Si algo sale mal o no soy competente, mi seguridad, paz y valor personal quedan comprometidos».',
      aplicacion: 'Llevar cautivo este pensamiento confrontándolo con la verdad de Romanos 8:1.',
      color: 'from-indigo-500/20 to-indigo-950/40 border-indigo-500/40 text-indigo-300',
      icono: '🧠'
    },
    {
      id: 'deseo',
      pasoNumero: 3,
      titulo: 'DESEO / ANHELO',
      subtitulo: 'Lo que el corazón intenta asegurar o demandar',
      fase: 'raiz',
      evidencia: 'Inclinación motivacional reflejada en los deseos de orden, respeto o seguridad.',
      preguntas: [
        '¿Qué es lo que más ansías experimentar en esta situación?',
        '¿Qué anhelo se ha vuelto tan prioritario que compite con tu paz en Dios?'
      ],
      hipotesis: 'Anhelo legítimo de seguridad, orden o aprobación que ha mutado en una demanda absoluta e innegociable.',
      aplicacion: 'Reconocer ante el Señor que un buen deseo se ha convertido en un ídolo de control.',
      color: 'from-amber-500/20 to-amber-950/40 border-amber-500/40 text-amber-300',
      icono: '🔥'
    },
    {
      id: 'temor',
      pasoNumero: 4,
      titulo: 'TEMOR',
      subtitulo: 'La vulnerabilidad profunda que se busca evitar',
      fase: 'raiz',
      evidencia: 'Reacción de alerta ante la incertidumbre o la exposición de límites.',
      preguntas: [
        '¿Qué es lo peor que imaginas que sucedería si sueltas la supervisión?',
        '¿A qué le tienes más miedo: al fracaso visible, al rechazo o a la impotencia?'
      ],
      hipotesis: 'Temor a quedar expuesto/a como insuficiente, perder el control o experimentar el desamparo.',
      aplicacion: 'Orar con el Salmo 56:3: «En el día que temo, yo en ti confío».',
      color: 'from-rose-500/20 to-rose-950/40 border-rose-500/40 text-rose-300',
      icono: '🛡️'
    },
    {
      id: 'control',
      pasoNumero: 5,
      titulo: 'ESTRATEGIA DE CONTROL',
      subtitulo: 'El mecanismo humano de autoprotección',
      fase: 'raiz',
      evidencia: 'Comportamientos de hiper-preparación, fiscalización o postergación.',
      preguntas: [
        '¿Qué maniobra recurrente empleas para no sentirte vulnerable?',
        '¿Cómo intentas blindarte contra los posibles errores propios o ajenos?'
      ],
      hipotesis: 'Mecanismo de autoexigencia implacable, microgestión de los demás o aislamiento para no exponerse.',
      aplicacion: 'Detener la maniobra automática y rendir voluntariamente el volante de la situación a Dios.',
      color: 'from-purple-500/20 to-purple-950/40 border-purple-500/40 text-purple-300',
      icono: '⚙️'
    },
    {
      id: 'respuesta',
      pasoNumero: 6,
      titulo: 'RESPUESTA / CONDUCTA',
      subtitulo: 'La acción manifiesta observable',
      fase: 'fruto',
      evidencia: 'Puntaje elevado en el cuestionario de tamizaje y respuestas al test.',
      preguntas: [
        '¿Cómo reaccionas en lo concreto con tu cuerpo, palabras y horarios?',
        '¿Qué dicen de ti tus hábitos de descanso, correos y conversaciones?'
      ],
      hipotesis: 'Supervisión constante, dificultad para delegar, trabajo hasta altas horas o tensión al responder.',
      aplicacion: 'Registrar la conducta concreta sin autojustificación para llevarla a la Cruz.',
      color: 'from-orange-500/20 to-orange-950/40 border-orange-500/40 text-orange-300',
      icono: '⚡'
    },
    {
      id: 'fruto',
      pasoNumero: 7,
      titulo: 'FRUTO / CONSECUENCIA',
      subtitulo: 'Impacto en paz, relaciones y vitalidad',
      fase: 'fruto',
      evidencia: 'Desgaste relacional, agotamiento mental y aridez devocional.',
      preguntas: [
        '¿Cuál es el costo emocional y relacional de sostener este patrón?',
        '¿Cómo están tus relaciones más cercanas y tu reposo interior?'
      ],
      hipotesis: 'Cansancio acumulado, resentimiento hacia quienes no cumplen las expectativas y pérdida de gozo espiritual.',
      aplicacion: 'Hacer duelo honesto por el dolor y distanciamiento que esta estrategia ha provocado.',
      color: 'from-red-500/20 to-red-950/40 border-red-500/40 text-red-300',
      icono: '🍂'
    },
    {
      id: 'verdadBiblica',
      pasoNumero: 8,
      titulo: 'VERDAD BÍBLICA',
      subtitulo: 'La Palabra de Gracia que interviene y transforma',
      fase: 'intervencion',
      evidencia: 'Promesa revelada en la Escritura apropiada para este patrón.',
      preguntas: [
        '¿Qué dice Dios acerca de Su suficiencia y de tu identidad en Cristo?',
        '¿Cómo desarma la Cruz de Jesús tu necesidad de auto-salvación?'
      ],
      hipotesis: '«Nuestra suficiencia proviene de Dios» (2 Cor 3:5). Dios es nuestro amparo y fortaleza (Salmo 46:1).',
      textosBiblicos: {
        cita: '2 Corintios 3:4-5',
        texto: 'Y tal confianza tenemos mediante Cristo para con Dios; no que seamos competentes por nosotros mismos para pensar algo como de nosotros mismos, sino que nuestra competencia proviene de Dios.',
        aplicacion: 'Descansar en que el favor y la dignidad vienen de Cristo, no de tu impecabilidad.'
      },
      aplicacion: 'Memorizar este pasaje y meditar en él cada vez que surja la pulsión de control.',
      color: 'from-emerald-500/20 to-emerald-950/40 border-emerald-500/40 text-emerald-300',
      icono: '📖'
    },
    {
      id: 'nuevaRespuesta',
      pasoNumero: 9,
      titulo: 'NUEVA RESPUESTA DE FE',
      subtitulo: 'La mente renovada que actúa en dependencia del Espíritu',
      fase: 'transformacion',
      evidencia: 'Fruto del Espíritu: templanza, paz, fe y mansedumbre.',
      preguntas: [
        '¿Cómo respondería hoy una persona que confía plenamente en la gracia de Dios?',
        '¿Qué palabra de gratitud y fe puedes pronunciar ante la incertidumbre?'
      ],
      hipotesis: 'Elegir la entrega activa: orar por la tarea, delegar con claridad y abstenerse de la fiscalización.',
      aplicacion: 'Practicar la respuesta bíblica: «Señor, esto está en Tus manos; yo haré con fidelidad mi parte y descansaré en Ti».',
      color: 'from-[#C9A84C]/25 to-yellow-950/40 border-[#C9A84C]/50 text-[#C9A84C]',
      icono: '🕊️'
    },
    {
      id: 'practica',
      pasoNumero: 10,
      titulo: 'PRÁCTICA CONCRETA',
      subtitulo: 'Hábito diario de obediencia y mayordomía',
      fase: 'transformacion',
      evidencia: 'Acción visible verificable agendada en el tiempo.',
      preguntas: [
        '¿Qué acción de obediencia específica realizarás hoy antes de dormir?',
        '¿Qué límite concreto pondrás a tu tendencia reactiva?'
      ],
      hipotesis: 'Establecer una «pausa de 3 minutos» antes de responder correos y fijar hora de apagado de dispositivos.',
      aplicacion: '1) Oración de rendición matutina. 2) Delegar una tarea sin supervisar el proceso antes de la hora acordada. 3) Dormir a tiempo celebrando la providencia divina.',
      color: 'from-amber-400/20 to-emerald-950/40 border-amber-400/40 text-amber-200',
      icono: '🌱'
    }
  ];
}
