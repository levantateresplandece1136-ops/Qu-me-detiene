export interface HeartMapStepData {
  contenido: string;
  justificacion: string;
}

export interface BlockHeartMap {
  circunstancia: HeartMapStepData;
  interpretacion: HeartMapStepData;
  deseo: HeartMapStepData;
  temor: HeartMapStepData;
  estrategiaControl: HeartMapStepData;
  respuesta: HeartMapStepData;
  fruto: HeartMapStepData;
}

export interface BlockPracticalGuide {
  blockId: string;
  blockTitle: string;
  shortTitle: string;
  // Principio: DATO → PATRÓN → HIPÓTESIS → PREGUNTAS POR EXPLORAR → VALIDACIÓN → DIRECCIÓN DE AYUDA
  dato: string;
  patron: string;
  hipotesis: string[];
  preguntasPorExplorar: string[];
  validacionPrompt: string;
  direccionDeAyuda: string;
  heartMap: BlockHeartMap;
  explanation: string;
  rootExplanationHint: string;
  action1: string;
  action2: string;
  verse: {
    text: string;
    ref: string;
  };
  dimensionCosts: {
    decisions: string;
    emotions: string;
    relationships: string;
    potentialFuture: string;
  };
}

export const practicalStepsByBlock: Record<string, BlockPracticalGuide> = {
  "control-entorno": {
    blockId: "control-entorno",
    blockTitle: "Control y Entorno",
    shortTitle: "Control",
    dato: "Nivel elevado de autoafinidad en el área de Control y Entorno.",
    patron: "Existe una fuerte necesidad percibida de supervisión minuciosa, anticipación y control sobre las circunstancias y las personas del entorno.",
    hipotesis: [
      "Hipótesis A (Temor a la incertidumbre): Búsqueda de seguridad ante el miedo a que las cosas se desborden o salgan mal si no intervienes personalmente.",
      "Hipótesis B (Perfeccionismo protector): Necesidad de evitar errores o críticas ajenas asumiendo el mando absoluto.",
      "Hipótesis C (Sobrecarga circunstancial): Hiper-responsabilidad por haber vivido situaciones pasadas donde nadie más se hizo cargo."
    ],
    preguntasPorExplorar: [
      "¿Qué es lo peor que imaginas que ocurriría si sueltas la supervisión de esta tarea?",
      "¿Sientes que tu tranquilidad o valor personal dependen de que todo funcione sin fallas?",
      "¿Es esta necesidad de control un patrón de vida o responde a un período reciente de alta exigencia o traición?"
    ],
    validacionPrompt: "¿Cuál de estas hipótesis describe con mayor fidelidad lo que experimentas en tu interior?",
    direccionDeAyuda: "Diferenciar entre mayordomía fiel y control ansioso, aprendiendo a delegar y descansar activamente en la soberanía y el cuidado de Dios.",
    heartMap: {
      circunstancia: {
        contenido: "Enfrentar tareas complejas, decisiones compartidas o imprevistos familiares y laborales.",
        justificacion: "Dato confirmado en tus respuestas: Puntuación destacada en el bloque de Control y Entorno."
      },
      interpretacion: {
        contenido: "“Si no intervengo y superviso cada variable personalmente, las cosas se saldrán de control y el resultado será caótico o perjudicial.”",
        justificacion: "Hipótesis pastoral: Lectura cognitiva interna a contrastar en oración."
      },
      deseo: {
        contenido: "Seguridad previsible, orden blindado y tranquilidad sin sobresaltos.",
        justificacion: "Hipótesis del corazón: Anhelo legítimo que se intenta garantizar por esfuerzo propio."
      },
      temor: {
        contenido: "Quedar desprotegido ante la incertidumbre, perder el dominio o ser culpado/a por errores ajenos.",
        justificacion: "Hipótesis de raíz: Vulnerabilidad de fondo que se busca evitar a toda costa."
      },
      estrategiaControl: {
        contenido: "Microgestión, dificultad para delegar, anticipación exhaustiva y vigilancia constante del entorno.",
        justificacion: "Hipótesis de mecanismo: Estrategia de autoprotección empleada por la carne."
      },
      respuesta: {
        contenido: "Asumir la carga total, revisar repetidamente el trabajo de otros o exigir rigidez en los procesos.",
        justificacion: "Dato confirmado en tus respuestas: Conducta y síntoma reportado en el cuestionario."
      },
      fruto: {
        contenido: "Fatiga crónica, tensión en los vínculos, ansiedad constante y asfixia en el equipo o la familia.",
        justificacion: "Hipótesis de consecuencia: Impacto en paz y relaciones para validar personalmente."
      }
    },
    explanation: "Tus respuestas reflejan una marcada tendencia a vigilar y controlar los detalles. Este patrón conductual es una señal que conviene explorar: puede surgir como un escudo protector ante la incertidumbre o por miedo al desorden, pero con frecuencia genera agotamiento y tensión vincular.",
    rootExplanationHint: "este patrón conductual suele originarse en el temor a la incertidumbre o en la dificultad de confiar en que Dios y los demás pueden sostener lo que tú sueltas.",
    action1: "Delega una tarea concreta esta semana sin supervisar el proceso hasta la fecha de entrega acordada.",
    action2: "Identifica un imprevisto menor y practica soltarlo conscientemente en oración en lugar de forzar una solución inmediata.",
    verse: {
      text: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.",
      ref: "Proverbios 3:5-6"
    },
    dimensionCosts: {
      decisions: "Tendencia a centralizar cada decisión o postergar delegar por desconfianza en el criterio ajeno.",
      emotions: "Cansancio acumulado, tensión en el cuerpo e inquietud cuando algo escapa a la planificación.",
      relationships: "Riesgo de roces y microgestión con familiares o colaboradores al imponer un estándar rígido.",
      potentialFuture: "Desgaste de energía en resolver pequeñeces cotidianas, restando fuerza a proyectos de mayor propósito."
    }
  },
  "tiempo-futuro": {
    blockId: "tiempo-futuro",
    blockTitle: "Tiempo y Futuro",
    shortTitle: "Tiempo",
    dato: "Nivel elevado de urgencia percibida en el área de Tiempo y Futuro.",
    patron: "Presencia constante de prisa interna, anticipación ansiosa de escenarios futuros y temor a tomar decisiones equivocadas o irreversibles.",
    hipotesis: [
      "Hipótesis A (Mentalidad de escasez): Sensación subjetiva de que el tiempo se agota y las oportunidades no se repetirán.",
      "Hipótesis B (Temor al rumbo equivocado): Ansiedad por tomar una decisión incorrecta que cierre puertas o cause arrepentimiento.",
      "Hipótesis C (Sobrecarga de demandas): Dificultad para delimitar prioridades, intentando abarcar más de lo humanamente viable."
    ],
    preguntasPorExplorar: [
      "Cuando sientes que el tiempo no alcanza, ¿te enfocas en lo que realmente importa o en la prisa por terminar?",
      "¿Te resulta difícil disfrutar el momento presente por estar pensando en lo que debes resolver después?",
      "¿Temes defraudar a Dios o a otros si no avanzas al ritmo que te autoexiges?"
    ],
    validacionPrompt: "¿Cuál de estas posibles explicaciones resuena más con la prisa que sientes?",
    direccionDeAyuda: "Recuperar el ritmo de la gracia de Dios, viviendo un día a la vez y reconociendo que los tiempos y sazones están en Sus manos.",
    heartMap: {
      circunstancia: {
        contenido: "Administrar la agenda cotidiana, tomar decisiones con impacto a mediano o largo plazo y enfrentar múltiples demandas simultáneas.",
        justificacion: "Dato confirmado en tus respuestas: Puntuación destacada en el bloque de Tiempo y Futuro."
      },
      interpretacion: {
        contenido: "“El tiempo se me está agotando; si elijo mal o no me apresuro, perderé oportunidades irrecuperables y será mi culpa.”",
        justificacion: "Hipótesis pastoral: Lectura cognitiva interna a contrastar en oración."
      },
      deseo: {
        contenido: "Garantía de no equivocarse, certeza absoluta sobre el destino y aprovechamiento máximo de cada minuto.",
        justificacion: "Hipótesis del corazón: Anhelo de seguridad y trascendencia gestionado con prisa ansiosa."
      },
      temor: {
        contenido: "Quedarse atrás, equivocarse de rumbo irrevocablemente, fracasar en el llamado o defraudar expectativas.",
        justificacion: "Hipótesis de raíz: Temor a la escasez de tiempo y al desamparo en el futuro."
      },
      estrategiaControl: {
        contenido: "Aceleración interior perpetua, abarcar más de lo humano y parálisis por sobreanálisis antes de dar un paso.",
        justificacion: "Hipótesis de mecanismo: Intentar controlar el porvenir anticipando cada contingencia."
      },
      respuesta: {
        contenido: "Prisa constante, postergar decisiones cruciales por falta de 'certeza total' y dificultad para estar presente.",
        justificacion: "Dato confirmado en tus respuestas: Conducta y síntoma reportado en el cuestionario."
      },
      fruto: {
        contenido: "Agotamiento mental, dificultad para disfrutar el día presente, impaciencia vincular y pérdida del reposo sabático.",
        justificacion: "Hipótesis de consecuencia: Desgaste en la serenidad diaria para validar con tu experiencia."
      }
    },
    explanation: "Tus respuestas muestran una marcada aceleración interna. Este patrón sugiere que tu mente vive anticipando el mañana, lo que dificulta la serenidad en el presente. Conviene explorar si esa prisa responde a demandas reales o a un temor de quedarte atrás.",
    rootExplanationHint: "esta sensación de urgencia suele asociarse a la creencia de escasez de tiempo y al temor a errar el camino.",
    action1: "Separa 15 minutos de silencio y oración sin mirar pantallas ni revisar pendientes al comenzar el día.",
    action2: "Toma una decisión sencilla que llevas días aplazando en las próximas 24 horas con la certeza de que Dios guía tus pasos.",
    verse: {
      text: "Así que, no os afanéis por el día de mañana, porque el día de mañana traerá su afán. Basta a cada día su propio mal.",
      ref: "Mateo 6:34"
    },
    dimensionCosts: {
      decisions: "Parálisis por sobreanálisis antes de dar un paso importante por miedo a que no sea el momento 'perfecto'.",
      emotions: "Ansiedad anticipatoria y dificultad para desconectar la mente al final de la jornada.",
      relationships: "Estar presente de cuerpo pero ausente de corazón durante momentos con la familia o amistades.",
      potentialFuture: "Correr permanentemente hacia la siguiente meta sin celebrar ni agradecer lo que Dios ya ha hecho hoy."
    }
  },
  "capacidad-identidad": {
    blockId: "capacidad-identidad",
    blockTitle: "Capacidad e Identidad",
    shortTitle: "Capacidad",
    dato: "Nivel elevado de autocrítica en el área de Capacidad e Identidad.",
    patron: "Tendencia observable a dudar de las propias competencias, sobreprepararse excesivamente o temer ser expuesto como no apto.",
    hipotesis: [
      "Hipótesis A (Temor a quedar expuesto/a): Miedo a que otros descubran supuestas falencias personales, atribuyendo los logros a la suerte.",
      "Hipótesis B (Herida de descalificación previa): Experiencias pasadas de juicio, rechazo o comparación que dejaron una huella de duda.",
      "Hipótesis C (Autoexigencia desmedida): Medir la propia valía contra un estándar inalcanzable de perfección sin margen para aprender."
    ],
    preguntasPorExplorar: [
      "¿De dónde proviene la voz que te dice que no estás preparado/a cuando se presenta una oportunidad?",
      "Si cometes un error en público, ¿qué crees que dice eso sobre tu valor como persona?",
      "¿Aceptas los elogios con gratitud genuina o tiendes a minimizarlos mentalmente?"
    ],
    validacionPrompt: "¿Cuál de estas hipótesis describe de forma más cercana la duda que surge en tu mente?",
    direccionDeAyuda: "Arraigar la confianza no en la autosuficiencia terrenal, sino en la competencia y filiación que Cristo otorga como don incondicional.",
    heartMap: {
      circunstancia: {
        contenido: "Asumir un nuevo desafío, exponer ideas en público, liderar un proyecto o recibir responsabilidades de mayor alcance.",
        justificacion: "Dato confirmado en tus respuestas: Puntuación destacada en Capacidad e Identidad."
      },
      interpretacion: {
        contenido: "“En cualquier momento descubrirán que no tengo lo suficiente; si cometo un error, quedará expuesta mi incapacidad.”",
        justificacion: "Hipótesis pastoral: Lectura interna de autocrítica a examinar delante de Dios."
      },
      deseo: {
        contenido: "Ser considerado/a competente, capaz, respetado/a y tener la certeza de no defraudar a nadie.",
        justificacion: "Hipótesis del corazón: Anhelo de validación y dignidad apoyado en el rendimiento propio."
      },
      temor: {
        contenido: "Ser expuesto/a como incompetente, hacer el ridículo o ser descalificado/a por quienes tienen autoridad.",
        justificacion: "Hipótesis de raíz: Miedo profundo al juicio y al rechazo por falta de aptitud."
      },
      estrategiaControl: {
        contenido: "Sobrepreparación extenuante, mantener un perfil bajo protector o rechazar iniciativas que impliquen visibilidad.",
        justificacion: "Hipótesis de mecanismo: Blindar la autoimagen evitando situaciones de evaluación directa."
      },
      respuesta: {
        contenido: "Postergar proyectos con impacto, dudar sistemáticamente del propio criterio y autocensurarse.",
        justificacion: "Dato confirmado en tus respuestas: Síntoma y patrón reportado en el test."
      },
      fruto: {
        contenido: "Estancamiento del potencial y del llamado de Dios, fatiga mental, culpa al recibir elogios e inseguridad crónica.",
        justificacion: "Hipótesis de consecuencia: Freno al florecimiento vocacional a validar personalmente."
      }
    },
    explanation: "Se observa una fuerte tendencia a cuestionar tus capacidades ante nuevos retos. Este patrón de autocrítica suele funcionar como una alarma preventiva ante el rechazo, pero te priva de avanzar con la libertad y autoridad que Dios te ha confiado.",
    rootExplanationHint: "esta autocrítica suele nacer de vincular el valor personal con no fallar y de olvidar que nuestra competencia proviene del Señor.",
    action1: "Comparte tu punto de vista en un espacio de trabajo o grupo sin comenzar con disculpas ni minimizar tu opinión.",
    action2: "Escribe dos momentos donde Dios te respaldó en una tarea difícil y dale gracias por los dones que puso en ti.",
    verse: {
      text: "No que seamos competentes por nosotros mismos para pensar algo como de nosotros mismos, sino que nuestra competencia proviene de Dios.",
      ref: "2 Corintios 3:5"
    },
    dimensionCosts: {
      decisions: "Autocensurar ideas o rechazar iniciativas por sentir que aún 'hace falta prepararse más'.",
      emotions: "Inseguridad de desempeño y desgaste por mantener una imagen de competencia continua.",
      relationships: "Dificultad para pedir orientación o ayuda oportuna por temor a que parezca una debilidad.",
      potentialFuture: "Limitar el alcance de tu ministerio, profesión o vocación a zonas seguras para evitar la mirada evaluadora."
    }
  },
  "merecimiento-vinculo": {
    blockId: "merecimiento-vinculo",
    blockTitle: "Merecimiento y Vínculo",
    shortTitle: "Merecimiento",
    dato: "Nivel elevado de alerta anticipatoria en el área de Merecimiento y Vínculo.",
    patron: "Incomodidad o recelo ante la calma y el bienestar, con una expectativa involuntaria de que algo malo sucederá para 'cobrar factura'.",
    hipotesis: [
      "Hipótesis A (Culpa inconsciente o legalismo): Dificultad para recibir el favor y la bendición de Dios como gracia pura sin tener que pagar un precio.",
      "Hipótesis B (Hipervigilancia por decepciones pasadas): Hábito adquirido de ponerse en guardia porque en el pasado la alegría fue seguida de dolor.",
      "Hipótesis C (Temor al desapego o abandono): Sentimiento de que la estabilidad emocional es frágil y podría desaparecer en cualquier instante."
    ],
    preguntasPorExplorar: [
      "Cuando algo te sale muy bien, ¿qué pensamiento automático cruza tu mente en los minutos siguientes?",
      "¿Sientes en el fondo que debes 'ganarte' el amor de Dios y de los demás mediante esfuerzo continuo?",
      "¿Te resulta natural recibir regalos, favores o cumplidos sin sentir la necesidad urgente de compensarlos?"
    ],
    validacionPrompt: "¿Cuál de estas hipótesis ilumina mejor ese recelo que sientes en momentos de paz?",
    direccionDeAyuda: "Desmantelar la lógica contractual del mérito humano para abrazar la gracia inmerecida y el amor seguro del Padre celestial.",
    heartMap: {
      circunstancia: {
        contenido: "Atravesar una etapa de favor, tranquilidad, éxito en un proyecto o recibir elogios y afecto de otros.",
        justificacion: "Dato confirmado en tus respuestas: Puntuación destacada en Merecimiento y Vínculo."
      },
      interpretacion: {
        contenido: "“Esta tranquilidad es engañosa; nada bueno dura tanto tiempo y pronto ocurrirá algo adverso para cobrarme el precio.”",
        justificacion: "Hipótesis pastoral: Lectura defensiva aprendida a contrastar con las Escrituras."
      },
      deseo: {
        contenido: "Una estabilidad segura y permanente que no esté sujeta a pérdidas abruptas ni a decepciones dolorosas.",
        justificacion: "Hipótesis del corazón: Anhelo de reposo sin el riesgo de ser lastimado/a de nuevo."
      },
      temor: {
        contenido: "A la pérdida repentina de la bendición, a la traición imprevista o a descubrir que no se merecía ese bienestar.",
        justificacion: "Hipótesis de raíz: Desconfianza hacia la bondad incondicional y temor a la vulnerabilidad."
      },
      estrategiaControl: {
        contenido: "Hipervigilancia en momentos de paz, autosabotaje anticipado y dificultad para recibir favores sin pagar por ellos.",
        justificacion: "Hipótesis de mecanismo: Ponerse la coraza antes de que el golpe ficticio llegue."
      },
      respuesta: {
        contenido: "Mantener recelo emocional ante lo bueno, distanciamiento de personas cercanas y rumiación pesimista en la calma.",
        justificacion: "Dato confirmado en tus respuestas: Conducta y actitud reportada en el cuestionario."
      },
      fruto: {
        contenido: "Incapacidad para descansar en la gracia de Dios, tensión continua en los mejores días y barreras con seres queridos.",
        justificacion: "Hipótesis de consecuencia: Pérdida del gozo que Dios concede para validar personalmente."
      }
    },
    explanation: "El patrón reportado indica dificultad para descansar plenamente en momentos de favor y paz. Es muy probable que tu mente haya aprendido a estar en guardia ante el dolor, interpretando la tranquilidad como una calma antes de la tormenta.",
    rootExplanationHint: "esta desconfianza suele relacionarse con una mentalidad de mérito y temor a que el bienestar traiga consigo una factura dolorosa.",
    action1: "Recibe un elogio o gesto de aprecio esta semana simplemente diciendo 'Muchas gracias', sin restarle valor ni excusarte.",
    action2: "Disfruta un momento de descanso o alegría consciente y dale gracias a Dios por Su gracia inmerecida.",
    verse: {
      text: "La bendición de Jehová es la que enriquece, y no añade tristeza con ella.",
      ref: "Proverbios 10:22"
    },
    dimensionCosts: {
      decisions: "Auto-sabotear proyectos exitosos o relaciones sanas en su mejor momento por temor a que el dolor sea mayor después.",
      emotions: "Dificultad para sentir paz profunda, manteniendo una tensión de fondo aun en días buenos.",
      relationships: "Levantar barreras defensivas con personas cercanas para no quedar expuesto al abandono o rechazo.",
      potentialFuture: "Poner un techo artificial a lo que Dios desea derramar en tu vida por creer que no es para ti."
    }
  },
  "rendimiento-logro": {
    blockId: "rendimiento-logro",
    blockTitle: "Rendimiento y Logro",
    shortTitle: "Rendimiento",
    dato: "Nivel elevado de exigencia en el área de Rendimiento y Logro.",
    patron: "Perfeccionismo marcado, postergación de entregas por búsqueda de excelencia absoluta y tendencia a medir el propio valor por resultados.",
    hipotesis: [
      "Hipótesis A (Idolatría de la imagen o del éxito): Asociación profunda entre productividad exterior y dignidad espiritual o social.",
      "Hipótesis B (Miedo al juicio): Uso del perfeccionismo como coraza para no ser criticado ni cuestionado.",
      "Hipótesis C (Adicción al reconocimiento): Dependencia de la validación externa y de tachar pendientes para sentir calma interior."
    ],
    preguntasPorExplorar: [
      "Si hoy no completas ninguna de las metas que planeaste, ¿cómo te sientes contigo mismo/a esta noche?",
      "¿Qué diferencia existe para ti entre hacer las cosas con excelencia para Dios y hacerlas con perfeccionismo ansioso?",
      "¿Te permites descansar sin sentir que estás desperdiciando el tiempo?"
    ],
    validacionPrompt: "¿Cuál de estas hipótesis se aproxima más a la presión que experimentas por rendir?",
    direccionDeAyuda: "Alinear la excelencia bíblica con la gracia, desvinculando la identidad de la productividad y redescubriendo el reposo sabático.",
    heartMap: {
      circunstancia: {
        contenido: "Debe entregar una tarea, presentar un proyecto, rendir cuentas o exponer su trabajo ante otros.",
        justificacion: "Dato confirmado en tus respuestas: Puntuación destacada en Rendimiento y Logro."
      },
      interpretacion: {
        contenido: "“Si fallo o entrego algo imperfecto, demostraré que no soy suficientemente competente ni valioso/a.”",
        justificacion: "Hipótesis pastoral: Lectura de autoexigencia a contrastar a la luz de la gracia."
      },
      deseo: {
        contenido: "Ser considerado/a competente, impecable, irreprochable y altamente reconocido/a.",
        justificacion: "Hipótesis del corazón: Búsqueda de justificación y valor a través de los resultados externos."
      },
      temor: {
        contenido: "Ser expuesto/a como insuficiente, mediocre o indigno/a de aprobación y respeto.",
        justificacion: "Hipótesis de raíz: Miedo a la reprobación y a no dar la talla ante los estándares ajenos."
      },
      estrategiaControl: {
        contenido: "Preparación excesiva, estándares inalcanzables, revisiones infinitas y dificultad extrema para delegar.",
        justificacion: "Hipótesis de mecanismo: Usar el perfeccionismo como muralla contra la crítica."
      },
      respuesta: {
        contenido: "Postergar entregas clave hasta que 'todo esté perfecto' o trabajar hasta la extenuación sin soltar nada.",
        justificacion: "Dato confirmado en tus respuestas: Conducta de postergación o sobreexigencia reportada."
      },
      fruto: {
        contenido: "Ansiedad, retraso en proyectos, pérdida de oportunidades y una sensación persistente de insuficiencia.",
        justificacion: "Hipótesis de consecuencia: Ciclo de desgaste y autofrustración para validar con tu experiencia."
      }
    },
    explanation: "Tus respuestas reflejan una elevada exigencia con los resultados. La búsqueda de calidad es una virtud, pero cuando se convierte en un requisito indispensable para sentirte en paz, suele ser un mecanismo protector contra el juicio o la desaprobación.",
    rootExplanationHint: "este perfeccionismo suele surgir de la falsa creencia de que nuestro valor ante Dios y los demás depende del volumen de nuestros aciertos.",
    action1: "Entrega un trabajo o mensaje al 85% de lo que considerarías perfecto, enfocándote en la utilidad real y no en los detalles menores.",
    action2: "Programa un bloque de 2 horas de ocio o descanso sin tareas productivas y vívelo como un acto de adoración y confianza en Dios.",
    verse: {
      text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar. Llevad mi yugo sobre vosotros, y aprended de mí, que soy manso y humilde de corazón; y hallaréis descanso para vuestras almas.",
      ref: "Mateo 11:28-29"
    },
    dimensionCosts: {
      decisions: "Retrasar lanzamientos o decisiones clave por esperar condiciones perfectas que rara vez se dan.",
      emotions: "Frustración recurrente, fatiga mental y sensación de que lo alcanzado nunca es suficiente.",
      relationships: "Impaciencia o crítica involuntaria hacia el ritmo de los demás al medir con la misma vara de autoexigencia.",
      potentialFuture: "Agotamiento crónico (burnout) por sostener un estándar que ni Dios mismo te ha pedido cargar."
    }
  },
  "relaciones-poder": {
    blockId: "relaciones-poder",
    blockTitle: "Relaciones y Poder",
    shortTitle: "Relaciones",
    dato: "Nivel elevado de tensión vincular en el área de Relaciones y Poder.",
    patron: "Tendencia a callar y complacer para evitar conflictos, o bien reaccionar a la defensiva cuando se percibe una amenaza o desacuerdo.",
    hipotesis: [
      "Hipótesis A (Temor al rechazo o abandono): Silenciar convicciones y necesidades propias para no incomodar y conservar la aprobación.",
      "Hipótesis B (Herida de invalidación): Creencia de que expresar lo que se siente empeorará las cosas o será usado en contra.",
      "Hipótesis C (Respuesta reactiva de protección): Ponerse a la defensiva o imponerse como forma de evitar ser controlado o herido."
    ],
    preguntasPorExplorar: [
      "Cuando estás en desacuerdo con alguien importante para ti, ¿qué sueles hacer en los primeros 30 segundos?",
      "¿Qué temes que suceda si pones un límite claro y firme con amabilidad?",
      "¿Te resulta más fácil retirarte en silencio o defenderte con vehemencia?"
    ],
    validacionPrompt: "¿Cuál de estas hipótesis describe mejor tu reacción típica ante un conflicto interpersonal?",
    direccionDeAyuda: "Desarrollar mansedumbre bíblica: poder bajo control para hablar la verdad en amor con límites sanos, sin temor a los hombres.",
    heartMap: {
      circunstancia: {
        contenido: "Surgimiento de diferencias de criterio, desacuerdos familiares, necesidad de poner un límite o tensiones de equipo.",
        justificacion: "Dato confirmado en tus respuestas: Puntuación destacada en Relaciones y Poder."
      },
      interpretacion: {
        contenido: "“Si expreso mi desacuerdo o pongo un límite firme, el conflicto destruirá la relación y seré rechazado/a o excluido/a.”",
        justificacion: "Hipótesis pastoral: Lectura interna de peligro relacional a examinar en oración."
      },
      deseo: {
        contenido: "Aprobación continua, armonía sin asperezas y garantía de no perder el afecto o pertenencia del grupo.",
        justificacion: "Hipótesis del corazón: Anhelo de paz relacional buscada a través del apaciguamiento humano."
      },
      temor: {
        contenido: "Al rechazo, al abandono afectivo, a la ira ajena o a ser catalogado/a como conflictivo/a o desleal.",
        justificacion: "Hipótesis de raíz: Pánico a la ruptura de vínculos afectivos significativos."
      },
      estrategiaControl: {
        contenido: "Complacer sistemáticamente, callar convicciones personales, decir 'sí' a costa del propio descanso y sonreír para calmar aguas.",
        justificacion: "Hipótesis de mecanismo: Ceder y apaciguar para comprar una paz superficial."
      },
      respuesta: {
        contenido: "Guardar silencio en momentos clave, asumir compromisos no deseados o retirarse a la defensiva cuando se acumula el malestar.",
        justificacion: "Dato confirmado en tus respuestas: Síntoma conductual reportado en el test."
      },
      fruto: {
        contenido: "Resentimiento acumulado hacia otros, relaciones superficiales o desgastantes y pérdida de la propia identidad.",
        justificacion: "Hipótesis de consecuencia: Desgaste afectivo y aislamiento interior a contrastar."
      }
    },
    explanation: "Se observa un patrón de fricción o retraimiento en momentos de tensión vincular. Esta conducta suele ser una estrategia de supervivencia aprendida: o bien se cede para apagar el fuego, o bien se levantan murallas para no ser lastimado.",
    rootExplanationHint: "estas reacciones suelen originarse en el temor a perder la relación o en el miedo a ser vulnerado si se muestra la verdad con apertura.",
    action1: "Expresa con serenidad una preferencia personal o un límite en una conversación cotidiana sin justificar de más tu postura.",
    action2: "Ante un desacuerdo esta semana, haz una pausa de 10 segundos antes de responder para escuchar el fondo antes de defenderte.",
    verse: {
      text: "Sino que siguiendo la verdad en amor, crezcamos en todo en aquel que es la cabeza, esto es, Cristo.",
      ref: "Efesios 4:15"
    },
    dimensionCosts: {
      decisions: "Tomar decisiones basadas en lo que otros esperan en lugar de lo que Dios te ha guiado a hacer.",
      emotions: "Resentimiento silencioso o culpa después de ceder, acompañado de desgaste emocional en conversaciones clave.",
      relationships: "Vínculos superficiales o asimétricos donde no se profundiza por temor a la discrepancia.",
      potentialFuture: "Quedarte atrapado en compromisos o dinámicas que no corresponden a tu llamado por no saber decir un 'no' a tiempo."
    }
  },
  "cuerpo-salud": {
    blockId: "cuerpo-salud",
    blockTitle: "Cuerpo y Salud",
    shortTitle: "Cuerpo",
    dato: "Nivel elevado de desconexión en el área de Cuerpo y Salud.",
    patron: "Dificultad recurrente para descansar sin experimentar culpa, postergación del cuidado físico y uso del cuerpo como instrumento de sobreexigencia.",
    hipotesis: [
      "Hipótesis A (Culpa del descanso): Creencia internalizada de que el reposo es pereza o tiempo perdido.",
      "Hipótesis B (Desconexión de señales biológicas): Hábito de desoír el dolor o el cansancio para no frenar compromisos.",
      "Hipótesis C (Escape a través del trabajo): Mantenerse ocupado físicamente para evitar conectar con emociones o vacíos internos."
    ],
    preguntasPorExplorar: [
      "¿Qué pensamientos surgen cuando te sientas a descansar sin hacer nada productivo?",
      "¿Tratas a tu cuerpo como un templo que Dios te dio a cuidar, o como una máquina que debe rendir sin descanso?",
      "¿Cuándo fue la última vez que dormiste o te alimentaste con verdadera atención y gratitud?"
    ],
    validacionPrompt: "¿Cuál de estas hipótesis ilumina mejor tu dificultad para reposar con tranquilidad?",
    direccionDeAyuda: "Honrar la mayordomía del cuerpo como templo del Espíritu Santo, recuperando el descanso como un mandamiento sabático y un acto de confianza.",
    heartMap: {
      circunstancia: {
        contenido: "Finalizar una jornada laboral, llegar a días de reposo o experimentar señales corporales evidentes de fatiga o dolor.",
        justificacion: "Dato confirmado en tus respuestas: Puntuación destacada en Cuerpo y Salud."
      },
      interpretacion: {
        contenido: "“Si me detengo a descansar sin producir nada, estoy perdiendo el tiempo y demostrando pereza o debilidad inaceptable.”",
        justificacion: "Hipótesis pastoral: Mandato interno de hiperactividad a discernir con las Escrituras."
      },
      deseo: {
        contenido: "Sentirse justificado/a y con valor ininterrumpido a través de la productividad y utilidad continua.",
        justificacion: "Hipótesis del corazón: Hacer de la actividad constante una fuente de autojustificación moral."
      },
      temor: {
        contenido: "Sentirse inútil, ser juzgado/a como holgazán o conectar con vacíos, tristezas y silencios internos al parar.",
        justificacion: "Hipótesis de raíz: Miedo a la quietud y a perder el sentido de utilidad terrenal."
      },
      estrategiaControl: {
        contenido: "Sobrecargar la agenda, ignorar las alertas biológicas del cuerpo y forzarse a continuar aun con dolor o sueño.",
        justificacion: "Hipótesis de mecanismo: Usar la actividad física como anestesia o armadura de rendimiento."
      },
      respuesta: {
        contenido: "Dormir menos de lo necesario, descansar con culpa de fondo y postergar revisiones o cuidados básicos de la salud.",
        justificacion: "Dato confirmado en tus respuestas: Patrón observable de descuido físico reportado en el test."
      },
      fruto: {
        contenido: "Agotamiento crónico ('burnout'), irritabilidad involuntaria con la familia, desajustes de salud y pérdida del gozo.",
        justificacion: "Hipótesis de consecuencia: Costo somático y anímico para validar personalmente."
      }
    },
    explanation: "Tus respuestas muestran una dificultad para disfrutar del descanso sin sentir culpa. Este patrón suele convertir la fatiga en un estado normalizado, postergando la salud física y olvidando que el descanso es un diseño de Dios para renovar las fuerzas.",
    rootExplanationHint: "esta culpa ante el descanso suele asociarse a creer que el reposo resta valor personal o a utilizar la actividad física como escape.",
    action1: "Establece un horario fijo para desconectar pantallas y prepararte para dormir al menos 3 noches esta semana.",
    action2: "Realiza una caminata de 20 minutos sin audífonos ni teléfono, orando y respirando con calma al aire libre.",
    verse: {
      text: "¿O ignoráis que vuestro cuerpo es templo del Espíritu Santo, el cual está en vosotros, el cual tenéis de Dios, y que no sois vuestros?",
      ref: "1 Corintios 6:19"
    },
    dimensionCosts: {
      decisions: "Aceptar más compromisos de los que tu cuerpo puede sostener sin considerar el costo biológico.",
      emotions: "Irritabilidad por falta de sueño, cansancio crónico y desánimo involuntario.",
      relationships: "Llegar a casa sin energía para convivir pacientemente con tu familia o círculo cercano.",
      potentialFuture: "Riesgo de problemas de salud acumulativos que te obliguen a parar de forma forzada más adelante."
    }
  },
  "espiritualidad-trascendencia": {
    blockId: "espiritualidad-trascendencia",
    blockTitle: "Espiritualidad y Trascendencia",
    shortTitle: "Espiritualidad",
    dato: "Nivel elevado de incertidumbre en el área de Espiritualidad y Trascendencia.",
    patron: "Percepción recurrente de lejanía con Dios, dudas sobre el propósito vital o dificultad para experimentar Su dirección y consuelo.",
    hipotesis: [
      "Hipótesis A (Sensación de desconexión emocional con Dios): Confundir la falta de emociones intensas con la ausencia real del Señor.",
      "Hipótesis B (Proyección de figuras de autoridad): Concebir a Dios como un juez severo o distante en lugar de un Padre cercano y lleno de gracia.",
      "Hipótesis C (Confusión vocacional): Búsqueda ansiosa de un 'llamado extraordinario', descuidando la fidelidad en lo cotidiano."
    ],
    preguntasPorExplorar: [
      "Cuando oras, ¿sientes que hablas con un Padre amoroso o que estás rindiendo cuentas ante un supervisor estricto?",
      "¿Condicionas la presencia de Dios a cómo te sientes emocionalmente en ese momento?",
      "¿Qué pasos concretos de servicio u obediencia en lo poco estás dando hoy?"
    ],
    validacionPrompt: "¿Cuál de estas hipótesis refleja con mayor fidelidad lo que sucede en tu vida espiritual?",
    direccionDeAyuda: "Fundamentar la fe no en fluctuaciones emocionales sino en las promesas firmes del Evangelio y en la comunión diaria de gracia.",
    heartMap: {
      circunstancia: {
        contenido: "Momentos de oración o lectura sin emociones intensas, etapas de sequedad espiritual o incertidumbre respecto a la vocación.",
        justificacion: "Dato confirmado en tus respuestas: Puntuación destacada en Espiritualidad y Trascendencia."
      },
      interpretacion: {
        contenido: "“Dios está lejos o decepcionado de mí; si no experimento una certeza vibrante, es porque mi fe es débil o Dios me ha dejado solo/a.”",
        justificacion: "Hipótesis pastoral: Interpretación sentimentalista de la comunión con Dios a examinar en la Palabra."
      },
      deseo: {
        contenido: "Certeza sensible inquebrantable, señales evidentes y aprobación divina tangible en todo momento.",
        justificacion: "Hipótesis del corazón: Anhelo de consuelo espiritual condicionado a manifestaciones sensoriales."
      },
      temor: {
        contenido: "A estar espiritualmente desamparado/a, a no tener un propósito claro o a ser reprobado/a por Dios.",
        justificacion: "Hipótesis de raíz: Miedo a la soledad existencial y al rechazo del Creador."
      },
      estrategiaControl: {
        contenido: "Activismo religioso para ganar la gracia, búsqueda ansiosa de señales externas o retraimiento en la culpa.",
        justificacion: "Hipótesis de mecanismo: Intentar fabricar la cercanía divina mediante mérito o introspección severa."
      },
      respuesta: {
        contenido: "Dejar de orar con confianza filial, juzgarse con severidad y dudar de las promesas bíblicas en días difíciles.",
        justificacion: "Dato confirmado en tus respuestas: Tendencia a la duda o sequedad reportada en el cuestionario."
      },
      fruto: {
        contenido: "Sequedad espiritual prolongada, desánimo en el ministerio, aislamiento de la comunidad de fe y fe basada en el esfuerzo propio.",
        justificacion: "Hipótesis de consecuencia: Desgaste en la intimidad con Dios a validar con tu experiencia."
      }
    },
    explanation: "Se reporta una sensación de distancia espiritual o falta de claridad en el propósito. Este patrón es común en etapas de transición o sequedad espiritual; explorarlo permite distinguir entre la verdad de la presencia de Dios y lo que nuestras emociones sugieren.",
    rootExplanationHint: "esta aparente lejanía suele vincularse a medir la relación con Dios por emociones variables o por un concepto legalista de la fe.",
    action1: "Lee un salmo en voz alta cada mañana (ej. Salmo 23 o Salmo 139) como recordatorio de la cercanía real de Dios sin importar tus emociones.",
    action2: "Anota una conversación o momento del día donde puedas ver la provisión y el cuidado silencioso del Señor.",
    verse: {
      text: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
      ref: "Jeremías 29:11"
    },
    dimensionCosts: {
      decisions: "Tomar rumbos basados en el desánimo momentáneo o la duda sobre si Dios realmente tiene un plan para tu vida.",
      emotions: "Sequedad espiritual, culpa innecesaria o sensación de vacío interior.",
      relationships: "Aislarse de la comunidad de fe o fingir fortaleza espiritual por vergüenza a mostrar las dudas.",
      potentialFuture: "Pospone dar pasos firmes en tu llamado por esperar una certeza absoluta que solo se descubre caminando en fe."
    }
  },
  "genero-identidad-social": {
    blockId: "genero-identidad-social",
    blockTitle: "Género e Identidad Social",
    shortTitle: "Ident. Social",
    dato: "Nivel elevado de limitación percibida en el área de Género e Identidad Social.",
    patron: "Percepción de que la edad, origen, historia familiar, género o condición social actúan como un techo o desventaja para el desarrollo personal y ministerial.",
    hipotesis: [
      "Hipótesis A (Etiquetas internalizadas): Creer que los límites impuestos por la cultura, la familia o los estereotipos definen lo que puedes alcanzar.",
      "Hipótesis B (Herida de comparación o marginación): Sensación de partir con desventaja frente a otros que tuvieron mayores privilegios o respaldo.",
      "Hipótesis C (Temor al rechazo colectivo): Miedo a asumir liderazgo o visibilidad por temor a no ser validado por el entorno social."
    ],
    preguntasPorExplorar: [
      "¿Qué etiqueta de tu historia o entorno sientes que más te ha pesado cargar?",
      "Cuando miras a personas en tu situación que han florecido en Dios, ¿qué crees que hizo la diferencia?",
      "¿Quién tiene la última palabra sobre tu destino: tu trasfondo terrenal o la soberanía de Dios en Cristo?"
    ],
    validacionPrompt: "¿Cuál de estas hipótesis describe de forma más cercana el peso o techo que has sentido?",
    direccionDeAyuda: "Desarraigar etiquetas sociales y familiares para afirmar la nueva ciudadanía y la herencia ilimitada de los hijos de Dios en Cristo.",
    heartMap: {
      circunstancia: {
        contenido: "Oportunidades de liderazgo, convocatorias a nuevos círculos o situaciones donde otros cuentan con mayor ventaja social o familiar.",
        justificacion: "Dato confirmado en tus respuestas: Puntuación destacada en Género e Identidad Social."
      },
      interpretacion: {
        contenido: "“Personas con mi trasfondo, origen o historia tienen un techo invisible; por más que me prepare nunca seré aceptado/a como igual.”",
        justificacion: "Hipótesis pastoral: Creencia de techo heredada para confrontar con la verdad de Cristo."
      },
      deseo: {
        contenido: "Dignidad, respeto genuino y justicia de ser valorado/a por el llamado de Dios y no por etiquetas humanas.",
        justificacion: "Hipótesis del corazón: Búsqueda legítima de equidad y reivindicación personal."
      },
      temor: {
        contenido: "A la marginación humillante, al rechazo social o a confirmar el prejuicio ajeno si se comete una falta.",
        justificacion: "Hipótesis de raíz: Miedo al desprecio cultural o familiar y a no encajar en espacios de influencia."
      },
      estrategiaControl: {
        contenido: "Desconfianza preventiva hacia autoridades, autoexclusión de espacios clave o hipercompetitividad defensiva.",
        justificacion: "Hipótesis de mecanismo: Retirarse antes de ser rechazado/a o luchar con amargura."
      },
      respuesta: {
        contenido: "No postularse a oportunidades de impacto, guardar distancia preventiva y actuar con sospecha ante los demás.",
        justificacion: "Dato confirmado en tus respuestas: Patrón observable de autoexclusión reportado en el test."
      },
      fruto: {
        contenido: "Dones y talentos enterrados por miedo, frustración acumulada, resentimiento hacia el entorno y freno al llamado divino.",
        justificacion: "Hipótesis de consecuencia: Limitación del alcance vocacional para validar personalmente."
      }
    },
    explanation: "Tus respuestas reflejan la carga de etiquetas o barreras heredadas que intentan condicionar tu futuro. Este patrón es una oportunidad para discernir qué voces del entorno han tenido más peso que la voz redentora de Dios en tu historia.",
    rootExplanationHint: "este peso suele originarse en haber asumido como verdades definitivas los techos impuestos por la cultura, la cuna o la opinión ajena.",
    action1: "Escribe en una hoja las etiquetas limitantes que otros te pusieron y táchalas con una cruz, proclamando Gálatas 3:28 sobre tu vida.",
    action2: "Da un paso de servicio o avance en tu meta personal que habías frenado por sentirte en 'desventaja'.",
    verse: {
      text: "Ya no hay judío ni griego; no hay esclavo ni libre; no hay varón ni mujer; porque todos vosotros sois uno en Cristo Jesús.",
      ref: "Gálatas 3:28"
    },
    dimensionCosts: {
      decisions: "No postularte o no avanzar en esferas de influencia por asumir de antemano que serás descartado/a.",
      emotions: "Resignación silenciosa, indignación o sensación de injusticia por el punto de partida.",
      relationships: "Desconfianza preventiva hacia personas de otros entornos o dificultad para conectar sin prevención.",
      potentialFuture: "Dejar enterrados talentos dados por el Reino por miedo a desafiar expectativas culturales o familiares."
    }
  }
};
