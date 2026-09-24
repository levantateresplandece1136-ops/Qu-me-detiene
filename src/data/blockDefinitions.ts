export interface BlockInteractionRule {
  id: string;
  blockAId: string;
  blockBId: string;
  blockATitle: string;
  blockBTitle: string;
  triggerDescription: string;
  hipotesisInteraccion: string;
  preguntaClave: string;
  direccionPastoral: string;
}

export interface BlockDefinition {
  id: string;
  name: string;
  shortTitle: string;
  queMide: string;
  queNoMide: string;
  noEsProblemaAutomatico: string;
  comportamientosRelacionados: string[];
  hipotesisPosibles: string[];
  preguntasAdicionales: string[];
  posiblesRelaciones: Array<{
    otherBlockId: string;
    otherBlockTitle: string;
    condicion: string;
    hipotesisInteraccion: string;
    preguntaClave: string;
  }>;
}

export const blockDefinitions: Record<string, BlockDefinition> = {
  "control-entorno": {
    id: "control-entorno",
    name: "Control y Entorno",
    shortTitle: "Control",
    queMide: "El grado en que una persona siente la necesidad de supervisar, prever, intervenir o asegurar resultados, circunstancias y personas de su entorno para experimentar orden, seguridad y calma interior.",
    queNoMide: "NO mide que la persona sea 'controladora', 'manipuladora' o 'autoritaria'. Tampoco evalúa defectos morales ni diagnósticos clínicos cerrados.",
    noEsProblemaAutomatico: "Un puntaje alto no significa necesariamente un problema. Puede reflejar alta diligencia, sentido de mayordomía, cuidado de los detalles, responsabilidad por la familia o el equipo, o una respuesta prudente ante un entorno genuinamente caótico o sobrecargado.",
    comportamientosRelacionados: [
      "Dificultad para delegar tareas sin supervisar continuamente el proceso.",
      "Anticipación exhaustiva de escenarios negativos o imprevistos.",
      "Incomodidad notable ante la falta de planes claros o cambios repentinos de agenda.",
      "Asumir responsabilidades ajenas para asegurarse de que 'se hagan bien y a tiempo'.",
      "Tensión física o inquietud en momentos de espera o incertidumbre."
    ],
    hipotesisPosibles: [
      "Búsqueda de seguridad por temor a la incertidumbre o a que las cosas se desborden sin remedio.",
      "Perfeccionismo protector por miedo a la crítica o al error visible.",
      "Dificultad para confiar en otros derivada de experiencias previas donde faltó apoyo real o hubo decepciones.",
      "Sobrecarga circunstancial acumulada por falta de respaldo en el entorno cotidiano.",
      "Dificultad para descansar en la soberanía y providencia amorosa de Dios en el día a día."
    ],
    preguntasAdicionales: [
      "¿Qué imaginas concretamente que ocurriría si sueltas la supervisión de esto durante una semana entera?",
      "¿Qué temes en el fondo que quede expuesto si algo no sale conforme a lo planeado?",
      "¿En qué momentos tu cuidado diligente cruza la línea hacia la ansiedad o el desgaste personal?"
    ],
    posiblesRelaciones: [
      {
        otherBlockId: "capacidad-identidad",
        otherBlockTitle: "Capacidad e Identidad",
        condicion: "Control alto + Capacidad desafiada (Puntaje ≥ 3 en ambos o Capacidad en tensión)",
        hipotesisInteraccion: "¿Estoy intentando controlar minuciosamente el entorno para compensar una sensación interior de insuficiencia o duda sobre mi propia competencia?",
        preguntaClave: "¿Sientes que tener todo bajo control es la única forma de no ser descubierto/a como insuficiente?"
      },
      {
        otherBlockId: "genero-identidad-social",
        otherBlockTitle: "Aceptación Social e Identidad",
        condicion: "Control alto + Aceptación Social alta (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Estoy intentando vigilar y controlar mi desempeño o el entorno para proteger mi imagen frente a otros y evitar el rechazo?",
        preguntaClave: "¿Tu necesidad de control se intensifica cuando sientes que la mirada o juicio de los demás está en juego?"
      },
      {
        otherBlockId: "tiempo-futuro",
        otherBlockTitle: "Tiempo y Futuro",
        condicion: "Control alto + Tiempo alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿La necesidad de control está produciendo preparación excesiva, postergación o dificultad para decidir a tiempo por temor a equivocarte?",
        preguntaClave: "¿Demoras decisiones clave porque sientes que aún necesitas recabar más certezas antes de dar el paso?"
      },
      {
        otherBlockId: "espiritualidad-trascendencia",
        otherBlockTitle: "Espiritualidad y Trascendencia",
        condicion: "Control alto + Espiritualidad en búsqueda (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Me cuesta experimentar la paz de la soberanía de Dios porque siento que si yo no intervengo de inmediato, todo se vendrá abajo?",
        preguntaClave: "¿Descansar en la oración se siente a veces como pasividad o pérdida de tiempo para tu mente en alerta?"
      }
    ]
  },

  "tiempo-futuro": {
    id: "tiempo-futuro",
    name: "Tiempo y Futuro",
    shortTitle: "Tiempo",
    queMide: "La vivencia interior de la prisa, la urgencia subjetiva, la presión por el avance de plazos o años, y la ansiedad asociada a la toma de decisiones sobre el porvenir.",
    queNoMide: "NO mide falta de productividad, pereza, desorganización ni incompetencia ejecutiva.",
    noEsProblemaAutomatico: "Un puntaje alto puede obedecer a un cronograma genuinamente demandante, una etapa de transición crítica (mudanza, nuevo rol, nacimiento) o un celo sincero por redimir el tiempo sabiamente para el Reino (Efesios 5:16).",
    comportamientosRelacionados: [
      "Sensación interna de retraso constante frente a metas planteadas.",
      "Rumiación antes de tomar decisiones por temor al costo de oportunidad.",
      "Dificultad para habitar el presente sin que la mente vuele a la siguiente tarea.",
      "Prisa física o mental al realizar actividades de la vida diaria."
    ],
    hipotesisPosibles: [
      "Temor a perder oportunidades irrepetibles o a 'quedarse atrás' respecto a los demás.",
      "Presión por un reloj social o expectativas familiares sobre dónde 'deberías estar' en esta etapa de la vida.",
      "Dificultad para confiar en los tiempos providenciales (kairós) y en los procesos formativos de Dios.",
      "Creencia de que el valor personal depende de la velocidad con que se concretan los logros."
    ],
    preguntasAdicionales: [
      "¿Quién o qué definió el reloj según el cual sientes que vas retrasado/a?",
      "¿Qué pasaría en tu corazón si un proyecto madura un año más tarde de lo previsto?",
      "¿Tu prisa actual es fruto de una exigencia interior aprendida o de una demanda real del entorno?"
    ],
    posiblesRelaciones: [
      {
        otherBlockId: "control-entorno",
        otherBlockTitle: "Control y Entorno",
        condicion: "Tiempo alto + Control alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿La urgencia de certezas sobre el futuro alimenta la necesidad de hipervigilancia en el presente?",
        preguntaClave: "¿Sientes que si no aceleras el control ahora, el futuro será impredecible y doloroso?"
      },
      {
        otherBlockId: "rendimiento-logro",
        otherBlockTitle: "Rendimiento y Logro",
        condicion: "Tiempo alto + Rendimiento alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Sientes que cada minuto no dedicado a producir o avanzar es un desperdicio o motivo de culpa personal?",
        preguntaClave: "¿Te permites celebrar un avance sin opacarlo pensando en todo lo que aún falta por completar?"
      },
      {
        otherBlockId: "cuerpo-salud",
        otherBlockTitle: "Cuerpo y Salud",
        condicion: "Tiempo alto + Cuerpo alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿La urgencia del tiempo te lleva a postergar sistemáticamente el descanso físico, la alimentación sana o el reposo reparador?",
        preguntaClave: "¿Tu cuerpo está pagando con síntomas de fatiga la prisa que tu mente no logra desacelerar?"
      }
    ]
  },

  "capacidad-identidad": {
    id: "capacidad-identidad",
    name: "Capacidad e Identidad",
    shortTitle: "Capacidad",
    queMide: "La autopercepción de competencia personal, confianza en los recursos recibidos de Dios y el grado de duda o temor de 'no estar a la altura' ante desafíos clave.",
    queNoMide: "NO mide la capacidad real, el talento ni el coeficiente intelectual de la persona. Tampoco mide falta de dones espirituales conferidos por Dios.",
    noEsProblemaAutomatico: "Un puntaje alto de duda no es un defecto: puede reflejar humildad bíblica (reconocer que las fuerzas propias son limitadas), el inicio de un desafío superior donde Dios busca manifestar su gracia (2 Corintios 12:9) o una etapa de aprendizaje sincero.",
    comportamientosRelacionados: [
      "Cuestionar internamente las propias decisiones tras haberlas tomado.",
      "Atribuir los éxitos a la casualidad y los fallos a incompetencia propia.",
      "Rehuir nuevos desafíos o demorar proyectos por sentir que 'falta preparación'.",
      "Comparación desfavorable con personas percibidas como más seguras o preparadas."
    ],
    hipotesisPosibles: [
      "Temor a ser expuesto/a como insuficiente o farsante (síndrome del impostor).",
      "Anclaje de la valía en el nivel de maestría técnica en lugar de en la identidad de hijo/a amado/a en Cristo.",
      "Memoria de críticas pasadas o exigencias familiares desmedidas que invalidaron los primeros intentos."
    ],
    preguntasAdicionales: [
      "Cuando logras algo valioso, ¿puedes agradecerlo con gozo genuino o una voz interna lo descalifica?",
      "¿Cuál es el estándar de 'suficiencia' con el que te estás midiendo, y quién lo definió?",
      "¿De qué manera el evangelio de la suficiencia en Cristo (2 Corintios 3:5) redefine tu concepto de competencia?"
    ],
    posiblesRelaciones: [
      {
        otherBlockId: "control-entorno",
        otherBlockTitle: "Control y Entorno",
        condicion: "Capacidad en tensión + Control alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Estoy intentando controlar minuciosamente el entorno para compensar una sensación interior de insuficiencia?",
        preguntaClave: "¿El control exhaustivo funciona como un escudo protector para que nadie descubra tus dudas internas?"
      },
      {
        otherBlockId: "genero-identidad-social",
        otherBlockTitle: "Aceptación Social e Identidad",
        condicion: "Capacidad en tensión + Aceptación Social alta (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿La duda sobre tu propia capacidad alimenta la necesidad urgente de aprobación externa para sentirte validado/a?",
        preguntaClave: "¿Necesitas que otros confirmen constantemente tu valor para creer que hiciste un buen trabajo?"
      },
      {
        otherBlockId: "rendimiento-logro",
        otherBlockTitle: "Rendimiento y Logro",
        condicion: "Capacidad en tensión + Rendimiento alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿El perfeccionismo es una coraza para evitar que otros noten tus dudas de capacidad interior?",
        preguntaClave: "¿Te exiges un 100% perfecto porque sientes que un 90% revelaría tu supuesta 'incompetencia'?"
      }
    ]
  },

  "genero-identidad-social": {
    id: "genero-identidad-social",
    name: "Aceptación Social e Identidad",
    shortTitle: "Aceptación Social",
    queMide: "La sensibilidad ante la evaluación, juicio, aprobación, rechazo o expectativas del entorno social y cultural, y cómo estas miradas condicionan la libertad interior.",
    queNoMide: "NO mide falta de personalidad, cobardía ni superficialidad moral. No significa que la persona no ame a Dios ni que busque la vanagloria mundana.",
    noEsProblemaAutomatico: "Puede reflejar un deseo legítimo de empatía, sentido de pertenencia, cuidado pastoral de la comunidad o sensibilidad para preservar el testimonio cristiano entre los demás.",
    comportamientosRelacionados: [
      "Filtrar opiniones personales por temor al qué dirán o a ser excluido/a.",
      "Inquietud o rumiación tras una interacción donde hubo frialdad o silencio del otro.",
      "Dificultad para decir 'no' a peticiones ajenas por evitar decepcionar o generar desaprobación.",
      "Adaptar la conducta al grupo para pasar desapercibido/a o asegurar pertenencia."
    ],
    hipotesisPosibles: [
      "Temor profundo al rechazo, al juicio público o a la marginación relacional.",
      "Búsqueda de afirmación externa para calmar una fragilidad identitaria previa.",
      "Heridas de rechazo en etapas tempranas o dinámicas familiares de afecto condicional."
    ],
    preguntasAdicionales: [
      "¿De la opinión o aprobación de quién depende en mayor medida tu paz diaria?",
      "¿Qué decisiones tomarías hoy si supieras con total certeza que nadie te va a juzgar?",
      "¿Cómo transforma tu libertad saber que ya fuiste aceptado/a incondicionalmente en Cristo (Efesios 1:6)?"
    ],
    posiblesRelaciones: [
      {
        otherBlockId: "control-entorno",
        otherBlockTitle: "Control y Entorno",
        condicion: "Aceptación Social alta + Control alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Estoy intentando controlar mi desempeño o el entorno para proteger mi imagen frente a otros y evitar el rechazo?",
        preguntaClave: "¿Sientes que si todo sale impecable, nadie tendrá motivos para criticarte o apartarte?"
      },
      {
        otherBlockId: "relaciones-poder",
        otherBlockTitle: "Relaciones y Vínculos",
        condicion: "Aceptación Social alta + Relaciones alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Guardo silencio en desacuerdos y cedo mis límites sanos por temor a perder la aprobación del vínculo?",
        preguntaClave: "¿Confundes ser pacificador/a con callar lo que verdaderamente piensas o sientes?"
      },
      {
        otherBlockId: "rendimiento-logro",
        otherBlockTitle: "Rendimiento y Logro",
        condicion: "Aceptación Social alta + Rendimiento alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Asocio mi valor como persona a la admiración o reconocimiento que mis logros despiertan en los demás?",
        preguntaClave: "¿Buscas logros para agradar a Dios y bendecir, o para blindarte del juicio ajeno?"
      }
    ]
  },

  "rendimiento-logro": {
    id: "rendimiento-logro",
    name: "Rendimiento y Logro",
    shortTitle: "Rendimiento",
    queMide: "El estándar interior de exigencia, perfeccionismo, necesidad de entregar resultados impecables y la tendencia a condicionar el descanso personal a lo producido.",
    queNoMide: "NO evalúa apatía ni falta de ética de trabajo. De hecho, suele aparecer en personas de altísima responsabilidad, integridad y entrega.",
    noEsProblemaAutomatico: "La excelencia es un valor bíblico (hacer todo para la gloria de Dios, Colosenses 3:23). Un puntaje alto puede reflejar pasión por la calidad, fidelidad en lo poco y amor por bendecir a otros con trabajos bien hechos.",
    comportamientosRelacionados: [
      "Retener proyectos o retrasar entregas por revisar detalles una y otra vez.",
      "Sensación de vacío o inquietud tras alcanzar una meta, pasando de inmediato a la siguiente.",
      "Dificultad para celebrar lo bueno si no alcanzó la perfección absoluta.",
      "Autocrítica severa ante fallos menores que nadie más nota."
    ],
    hipotesisPosibles: [
      "Perfeccionismo como coraza protectora para blindarse contra cualquier crítica externa.",
      "Confusión entre 'lo que hago' y 'lo que valgo' ante Dios y ante los demás.",
      "Justificación por obras trasladada inadvertidamente al plano emocional cotidiano."
    ],
    preguntasAdicionales: [
      "¿Cuándo fue la última vez que te sentiste plenamente satisfecho/a con un trabajo terminado?",
      "¿Qué sientes en el cuerpo cuando descubres un error menor en algo que ya compartiste?",
      "¿Puedes descansar en paz sabiendo que tu identidad reposa en la obra consumada de Cristo y no en tu rendimiento?"
    ],
    posiblesRelaciones: [
      {
        otherBlockId: "merecimiento-vinculo",
        otherBlockTitle: "Merecimiento y Vínculo",
        condicion: "Rendimiento alto + Merecimiento alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Siento que solo merezco bienestar, afecto sincero o descanso si antes he producido de forma impecable?",
        preguntaClave: "¿Sientes que el descanso es un premio que debes ganarte con sudor antes de poder disfrutarlo?"
      },
      {
        otherBlockId: "cuerpo-salud",
        otherBlockTitle: "Cuerpo y Salud",
        condicion: "Rendimiento alto + Cuerpo alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Mi autoexigencia de logro me hace sentir culpa al descansar físicamente o pausar para recuperarme?",
        preguntaClave: "¿Sientes que reposar es tiempo perdido que le estás robando a tu rendimiento?"
      },
      {
        otherBlockId: "tiempo-futuro",
        otherBlockTitle: "Tiempo y Futuro",
        condicion: "Rendimiento alto + Tiempo alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿El afán de rendimiento perfecto genera retrasos acumulados y prisa continua en mis plazos?",
        preguntaClave: "¿El perfeccionismo te está robando la paz del tiempo presente?"
      }
    ]
  },

  "merecimiento-vinculo": {
    id: "merecimiento-vinculo",
    name: "Merecimiento y Vínculo",
    shortTitle: "Merecimiento",
    queMide: "La facilidad o resistencia interior para recibir bendición, descanso, afecto incondicional y bondad sin esperar que sobrevenga una catástrofe inmediata o una factura oculta.",
    queNoMide: "NO mide soberbia, ingratitud ni falta de aprecio por las dádivas divinas.",
    noEsProblemaAutomatico: "Puede reflejar sobriedad ante las vicisitudes de la vida, prudencia forjada en temporadas difíciles pasadas, o una etapa de maduración de expectativas.",
    comportamientosRelacionados: [
      "Inquietud cuando las cosas van 'demasiado bien' (esperar que la calma no dure).",
      "Incomodidad o sospecha ante regalos, elogios o muestras de aprecio espontáneas.",
      "Dificultad para disfrutar plenamente de un momento de gozo por anticipar su final.",
      "Tendencia a ponerse siempre en el último lugar de atención."
    ],
    hipotesisPosibles: [
      "Condicionamiento por vivencias donde la alegría terminaba en dolor repentino.",
      "Dificultad para interiorizar la naturaleza gratuita e inmerecida del Evangelio de la gracia.",
      "Convicción de que hay que sacrificarse el doble para tener derecho a respirar en paz."
    ],
    preguntasAdicionales: [
      "¿Por qué sientes que cuando hay paz duradera, algo malo tiene que ocurrir pronto?",
      "¿Qué te cuesta más: brindar ayuda generosa a otros o dejar que otros te sirvan a ti?",
      "¿Cómo impactaría tu vida cotidiana asimilar que Dios se deleita en bendecirte sin condiciones ocultas?"
    ],
    posiblesRelaciones: [
      {
        otherBlockId: "rendimiento-logro",
        otherBlockTitle: "Rendimiento y Logro",
        condicion: "Merecimiento alto + Rendimiento alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Condiciono mi derecho a estar en paz a haber rendido al 100% de manera intachable?",
        preguntaClave: "¿Te cuesta recibir afecto o descanso sin sentir que tienes una deuda pendiente?"
      },
      {
        otherBlockId: "relaciones-poder",
        otherBlockTitle: "Relaciones y Vínculos",
        condicion: "Merecimiento alto + Relaciones alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Me mantengo en vínculos donde siempre soy quien da y sostiene, pero nunca permito que me cuiden?",
        preguntaClave: "¿Sientes que si dejas de servir a los demás, perderán el interés en estar cerca de ti?"
      },
      {
        otherBlockId: "espiritualidad-trascendencia",
        otherBlockTitle: "Espiritualidad y Trascendencia",
        condicion: "Merecimiento alto + Espiritualidad en búsqueda (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Sospecho en el fondo de la bondad de Dios esperando siempre una demanda o castigo venidero?",
        preguntaClave: "¿Te relacionas con Dios desde la gracia inmerecida o desde el temor al reclamo?"
      }
    ]
  },

  "relaciones-poder": {
    id: "relaciones-poder",
    name: "Relaciones y Vínculos",
    shortTitle: "Relaciones",
    queMide: "El manejo de la vulnerabilidad relacional, los desacuerdos, la asertividad, los límites personales y la tendencia a polarizarse entre la evasión del conflicto (apaciguamiento) o la hiperdefensa.",
    queNoMide: "NO mide que la persona sea conflictiva, manipuladora, cobarde ni hostil.",
    noEsProblemaAutomatico: "Bienaventurados los pacificadores (Mateo 5:9). Puede reflejar deseo sincero de armonía, mansedumbre, respeto por la autoridad, paciencia con los defectos ajenos y amor que todo lo sufre.",
    comportamientosRelacionados: [
      "Guardar silencio en desacuerdos para evitar discusiones, acumulando tensión interior.",
      "Ponerse a la defensiva rápidamente cuando se siente un cuestionamiento o juicio.",
      "Dificultad para poner límites firmes con serenidad y sin pedir disculpas por ellos.",
      "Ansiedad relacional tras una conversación donde hubo opiniones divergentes."
    ],
    hipotesisPosibles: [
      "Miedo a que una conversación honesta sobre desacuerdos resulte en ruptura del vínculo o abandono.",
      "Falta de modelos sanos de resolución asertiva y pacífica de conflictos en la historia previa.",
      "Temor a la confrontación por haber vivido autoritarismo o invalidación emocional."
    ],
    preguntasAdicionales: [
      "¿Qué imaginas que ocurriría si dices con amor y firmeza: 'no puedo asumir esto en este momento'?",
      "¿Sueles ceder por auténtico amor y servicio, o por temor a la tensión del conflicto?",
      "¿Cómo te capacita el Señor para hablar la verdad con amor (Efesios 4:15) sin perder tu paz interior?"
    ],
    posiblesRelaciones: [
      {
        otherBlockId: "genero-identidad-social",
        otherBlockTitle: "Aceptación Social e Identidad",
        condicion: "Relaciones alto + Aceptación Social alta (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Cedo mis límites y sacrifico mi bienestar por temor a perder la aprobación o el afecto del entorno?",
        preguntaClave: "¿El miedo a decepcionar a otros te impide cuidar tu propia salud espiritual y física?"
      },
      {
        otherBlockId: "control-entorno",
        otherBlockTitle: "Control y Entorno",
        condicion: "Relaciones alto + Control alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Intento controlar las reacciones o emociones de los demás para evitar que surjan roces imprevistos?",
        preguntaClave: "¿Sientes la carga de mantener a todos en calma para que tú puedas estar en paz?"
      },
      {
        otherBlockId: "capacidad-identidad",
        otherBlockTitle: "Capacidad e Identidad",
        condicion: "Relaciones alto + Capacidad en tensión (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Dudo de mi competencia para sostener una conversación difícil con calma y por eso prefiero ceder o callar?",
        preguntaClave: "¿Sientes que en una discusión tus argumentos o sentimientos no tendrán suficiente peso?"
      }
    ]
  },

  "cuerpo-salud": {
    id: "cuerpo-salud",
    name: "Cuerpo y Salud",
    shortTitle: "Cuerpo",
    queMide: "La relación con los límites biológicos, el descanso reparador, el cuidado del templo del Espíritu Santo y la somatización del estrés o la culpa ante la inactividad.",
    queNoMide: "NO mide debilidad física, pereza ni desobediencia espiritual. No sustituye la evaluación médica ante afecciones clínicas reales.",
    noEsProblemaAutomatico: "Puede reflejar una entrega sacrificada al servicio del prójimo o la familia, una etapa laboral de altísima demanda donde la persona está poniendo el cuerpo con nobleza, o una alta resistencia física.",
    comportamientosRelacionados: [
      "Culpa intensa al acostarse o tomar un tiempo de reposo sin 'hacer algo útil'.",
      "Ignorar señales claras de fatiga física hasta que el cuerpo colapsa o enferma.",
      "Tensión muscular, bruxismo o insomnio asociados a la sobrecarga mental.",
      "Postergar consultas de salud, alimentación adecuada o pausas regenerativas."
    ],
    hipotesisPosibles: [
      "Convicción de que parar es perder el tiempo o mostrar debilidad frente a otros.",
      "Dificultad para rendir el cuerpo a la disciplina bíblica del reposo como acto de fe en la provisión de Dios.",
      "Uso de la hiperactividad corporal como distractor para no enfrentar vacíos o dolores emocionales."
    ],
    preguntasAdicionales: [
      "¿Qué pensamientos te asaltan cuando te sientas 30 minutos sin realizar ninguna tarea?",
      "¿Tratas a tu cuerpo como un templo que Dios te confió o como una herramienta que debe rendir sin descanso?",
      "¿Cómo refleja el descanso físico tu fe en que Dios sigue sustentando tu vida mientras tú duermes (Salmo 127:2)?"
    ],
    posiblesRelaciones: [
      {
        otherBlockId: "rendimiento-logro",
        otherBlockTitle: "Rendimiento y Logro",
        condicion: "Cuerpo alto + Rendimiento alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿El reposo físico detona culpa porque tu mente lo equipara automáticamente con falta de productividad o pereza?",
        preguntaClave: "¿Sientes que el cuerpo solo tiene valor si está rindiendo y produciendo?"
      },
      {
        otherBlockId: "tiempo-futuro",
        otherBlockTitle: "Tiempo y Futuro",
        condicion: "Cuerpo alto + Tiempo alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿La urgencia constante del tiempo te lleva a recortar horas de sueño, descanso y cuidado personal?",
        preguntaClave: "¿Sientes que 'no hay tiempo' para cuidar el templo que Dios te dio?"
      },
      {
        otherBlockId: "control-entorno",
        otherBlockTitle: "Control y Entorno",
        condicion: "Cuerpo alto + Control alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Cargas en tu cuerpo físico la tensión muscular de intentar sostener y vigilar todo lo que te rodea?",
        preguntaClave: "¿Sientes que tus hombros o cuello cargan el peso de que las cosas no se desborden?"
      }
    ]
  },

  "espiritualidad-trascendencia": {
    id: "espiritualidad-trascendencia",
    name: "Espiritualidad y Trascendencia",
    shortTitle: "Espiritualidad",
    queMide: "La vivencia de la intimidad con Dios, la claridad en el propósito trascendente, la capacidad de reposar en Su gracia frente al silencio o la duda, y la coherencia interior de fe.",
    queNoMide: "NO mide que la persona 'no sea salva', 'esté en pecado oculto' ni que tenga una fe deficiente o culpable.",
    noEsProblemaAutomatico: "Puede reflejar un tiempo de desierto formativo (vivido por Moisés, Elías o David), un anhelo sincero de autenticidad que rechaza la religiosidad hueca, o un proceso de duelo o fatiga acumulada.",
    comportamientosRelacionados: [
      "Sensación periódica de que Dios está distante o de que las oraciones no traspasan el techo.",
      "Inquietud sobre cuál es el propósito o llamado específico de Dios para la propia vida.",
      "Desconexión entre lo que se cree teológicamente y la paz real que se experimenta en el pecho.",
      "Sentimiento de culpa por experimentar dudas o cansancio en la vida cristiana."
    ],
    hipotesisPosibles: [
      "Desgaste por una religiosidad legalista de esfuerzo humano en lugar del reposo en la obra consumada de Cristo.",
      "Temporada de maduración donde Dios está purificando la fe de apoyos externos y fórmulas mágicas.",
      "Sobrecarga mental o emocional que nubla la capacidad de percibir la presencia consoladora de Dios."
    ],
    preguntasAdicionales: [
      "¿Sientes que debes ganarte el afecto o la respuesta de Dios antes de acercarte a Su trono de gracia?",
      "En tus momentos de oración, ¿hay espacio para expresar dolor, dudas o silencio honesto delante de Dios?",
      "¿De qué manera el saber que Cristo intercede por ti hoy (Romanos 8:34) te da descanso aun en momentos de silencio?"
    ],
    posiblesRelaciones: [
      {
        otherBlockId: "control-entorno",
        otherBlockTitle: "Control y Entorno",
        condicion: "Espiritualidad en búsqueda + Control alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Me cuesta experimentar la paz de la soberanía de Dios porque siento que si yo no intervengo, todo se derrumbará?",
        preguntaClave: "¿Confundes la soberanía de Dios con una excusa para que todo dependa de tus propias fuerzas?"
      },
      {
        otherBlockId: "merecimiento-vinculo",
        otherBlockTitle: "Merecimiento y Vínculo",
        condicion: "Espiritualidad en búsqueda + Merecimiento alto (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Sospecho en el fondo de la gracia de Dios, creyendo que su favor depende de mi rendimiento impecable?",
        preguntaClave: "¿Te cuesta recibir el amor inmerecido del Padre sin sentir la obligación de pagar por él?"
      },
      {
        otherBlockId: "capacidad-identidad",
        otherBlockTitle: "Capacidad e Identidad",
        condicion: "Espiritualidad en búsqueda + Capacidad en tensión (Puntaje ≥ 3)",
        hipotesisInteraccion: "¿Dudo de que Dios pueda usar mi vida por sentir que no tengo la suficiencia o madurez necesaria?",
        preguntaClave: "¿Crees que Dios solo usa a personas que no tienen dudas sobre su propia competencia?"
      }
    ]
  }
};

export interface DetectedInteraction {
  id: string;
  blockA: { id: string; name: string; score: number };
  blockB: { id: string; name: string; score: number };
  tag: string;
  hipotesis: string;
  preguntaClave: string;
  direccionPastoral: string;
}

/**
 * Detecta dinámicamente interacciones relevantes entre bloques a partir de los puntajes
 * del usuario (Puntuaciones 1 a 5).
 * Siempre formula HIPÓTESIS de exploración pastoral, nunca diagnósticos deterministas.
 */
export function detectBlockInteractions(scores: Record<string, number>): DetectedInteraction[] {
  const interactions: DetectedInteraction[] = [];

  const controlScore = scores["control-entorno"] || 0;
  const capacidadScore = scores["capacidad-identidad"] || 0;
  const socialScore = scores["genero-identidad-social"] || 0;
  const tiempoScore = scores["tiempo-futuro"] || 0;
  const rendimientoScore = scores["rendimiento-logro"] || 0;
  const merecimientoScore = scores["merecimiento-vinculo"] || 0;
  const relacionesScore = scores["relaciones-poder"] || 0;
  const cuerpoScore = scores["cuerpo-salud"] || 0;
  const espiritualidadScore = scores["espiritualidad-trascendencia"] || 0;

  // Interacción 1: Control + Capacidad
  if (controlScore >= 3 && capacidadScore >= 3) {
    interactions.push({
      id: "control-capacidad",
      blockA: { id: "control-entorno", name: "Control", score: controlScore },
      blockB: { id: "capacidad-identidad", name: "Capacidad", score: capacidadScore },
      tag: "Compensación de Insuficiencia",
      hipotesis: "Hipótesis a discernir: ¿Podría ser que estás intentando controlar minuciosamente el entorno exterior para compensar o amortiguar una sensación interna de duda sobre tu propia suficiencia?",
      preguntaClave: "¿Sientes que tener todo estrictamente vigilado es tu única defensa para que otros no noten tus dudas de capacidad?",
      direccionPastoral: "Descansar en que nuestra verdadera suficiencia proviene de Dios (2 Corintios 3:5), soltando la necesidad de demostrar competencia absoluta mediante el control."
    });
  }

  // Interacción 2: Control + Aceptación Social
  if (controlScore >= 3 && socialScore >= 3) {
    interactions.push({
      id: "control-social",
      blockA: { id: "control-entorno", name: "Control", score: controlScore },
      blockB: { id: "genero-identidad-social", name: "Aceptación Social", score: socialScore },
      tag: "Protección de Imagen y Aprobación",
      hipotesis: "Hipótesis a discernir: ¿Estás intentando controlar minuciosamente tu desempeño o el entorno para proteger tu imagen ante otros y evitar a toda costa el juicio o el rechazo?",
      preguntaClave: "¿Tu necesidad de control se dispara cuando sientes que la mirada evaluativa o la aprobación de los demás está en juego?",
      direccionPastoral: "Afirmarse en la aceptación irrevocable que ya tienes en Cristo (Efesios 1:6), liberando la carga de sostener una imagen impecable ante los hombres."
    });
  }

  // Interacción 3: Control + Tiempo
  if (controlScore >= 3 && tiempoScore >= 3) {
    interactions.push({
      id: "control-tiempo",
      blockA: { id: "control-entorno", name: "Control", score: controlScore },
      blockB: { id: "tiempo-futuro", name: "Tiempo", score: tiempoScore },
      tag: "Parálisis por Búsqueda de Certezas",
      hipotesis: "Hipótesis a discernir: ¿La necesidad de tener todo bajo control está produciendo preparación excesiva, postergación de decisiones o una prisa angustiante por no equivocarte en el porvenir?",
      preguntaClave: "¿Demoras pasos importantes porque sientes que aún no cuentas con el 100% de las variables bajo tu dominio?",
      direccionPastoral: "Aprender a dar pasos de fe serenos en medio de la incertidumbre, confiando en que el mañana está en las manos providenciales de Dios (Mateo 6:34)."
    });
  }

  // Interacción 4: Rendimiento + Merecimiento
  if (rendimientoScore >= 3 && merecimientoScore >= 3) {
    interactions.push({
      id: "rendimiento-merecimiento",
      blockA: { id: "rendimiento-logro", name: "Rendimiento", score: rendimientoScore },
      blockB: { id: "merecimiento-vinculo", name: "Merecimiento", score: merecimientoScore },
      tag: "Condicionamiento del Reposo a la Producción",
      hipotesis: "Hipótesis a discernir: ¿Sientes que solo mereces bienestar, descanso o afecto si antes has producido de manera intachable, creyendo que la paz debe ser 'ganada' con sudor?",
      preguntaClave: "¿Te asalta la culpa cuando intentas descansar sin haber dejado todo terminado al 100%?",
      direccionPastoral: "Renovar el entendimiento en el principio de la Gracia: Dios te ama y te concede descanso por quién es Él, no por tu volumen de producción (Hebreos 4:9-10)."
    });
  }

  // Interacción 5: Rendimiento + Capacidad
  if (rendimientoScore >= 3 && capacidadScore >= 3 && !interactions.some(i => i.id === "control-capacidad")) {
    interactions.push({
      id: "rendimiento-capacidad",
      blockA: { id: "rendimiento-logro", name: "Rendimiento", score: rendimientoScore },
      blockB: { id: "capacidad-identidad", name: "Capacidad", score: capacidadScore },
      tag: "Autoexigencia de Defensa",
      hipotesis: "Hipótesis a discernir: ¿Tu perfeccionismo y exigencia de logro funcionan como una coraza para evitar que otros descubran tus dudas internas de competencia?",
      preguntaClave: "¿Te exiges un estándar sobrehumano porque temes que un error revele una supuesta 'incompetencia'?",
      direccionPastoral: "Reconocer que el poder de Dios se perfecciona en nuestras debilidades (2 Corintios 12:9), permitiéndote ser humano sin condenación."
    });
  }

  // Interacción 6: Relaciones + Aceptación Social
  if (relacionesScore >= 3 && socialScore >= 3) {
    interactions.push({
      id: "relaciones-social",
      blockA: { id: "relaciones-poder", name: "Relaciones", score: relacionesScore },
      blockB: { id: "genero-identidad-social", name: "Aceptación Social", score: socialScore },
      tag: "Apaciguamiento por Temor al Rechazo",
      hipotesis: "Hipótesis a discernir: ¿Sueles callar en desacuerdos y ceder tus límites sanos por temor a que la tensión resulte en distanciamiento o pérdida de afecto?",
      preguntaClave: "¿Confundes la paz bíblica con el sacrificio silencioso de tus propias necesidades y convicciones?",
      direccionPastoral: "Aprender a hablar la verdad con amor (Efesios 4:15), recordando que poner límites claros no destruye los vínculos sanos sino que los preserva."
    });
  }

  // Interacción 7: Cuerpo + Rendimiento
  if (cuerpoScore >= 3 && rendimientoScore >= 3) {
    interactions.push({
      id: "cuerpo-rendimiento",
      blockA: { id: "cuerpo-salud", name: "Cuerpo", score: cuerpoScore },
      blockB: { id: "rendimiento-logro", name: "Rendimiento", score: rendimientoScore },
      tag: "Culpa en el Reposo Físico",
      hipotesis: "Hipótesis a discernir: ¿El descanso corporal te genera incomodidad o culpa porque tu mente lo equipara automáticamente con pereza o falta de compromiso?",
      preguntaClave: "¿Sientes que detenerte físicamente es un lujo peligroso en lugar de una mayordomía fiel del templo del Espíritu?",
      direccionPastoral: "Honrar a Dios cuidando el cuerpo que Él te ha confiado (1 Corintios 6:19-20), recordando que el reposo es un mandato sagrado y no una debilidad."
    });
  }

  // Interacción 8: Espiritualidad + Control
  if (espiritualidadScore >= 3 && controlScore >= 3 && !interactions.some(i => i.id === "espiritualidad-control")) {
    interactions.push({
      id: "espiritualidad-control",
      blockA: { id: "espiritualidad-trascendencia", name: "Espiritualidad", score: espiritualidadScore },
      blockB: { id: "control-entorno", name: "Control", score: controlScore },
      tag: "Tensión entre Soberanía y Vigilancia Propia",
      hipotesis: "Hipótesis a discernir: ¿Te cuesta experimentar la paz de la soberanía de Dios porque sientes que si tú no intervienes continuamente, las cosas se derrumbarán?",
      preguntaClave: "¿Tus tiempos de oración se convierten a veces en un inventario de preocupaciones más que en un espacio de entrega y reposo?",
      direccionPastoral: "Aprender la distinción entre responsabilidad fiel y soberanía divina: tú siembras y riegas, pero el crecimiento y el sustento provienen de Dios (1 Corintios 3:6)."
    });
  }

  // Interacción 9: Tiempo + Relaciones
  if (tiempoScore >= 3 && relacionesScore >= 3) {
    interactions.push({
      id: "tiempo-relaciones",
      blockA: { id: "tiempo-futuro", name: "Tiempo", score: tiempoScore },
      blockB: { id: "relaciones-poder", name: "Relaciones", score: relacionesScore },
      tag: "Postergación de Vínculos por Urgencia",
      hipotesis: "Hipótesis a discernir: ¿La prisa y la presión del tiempo te llevan a posponer conversaciones importantes o a replegarte para no asumir el desgaste emocional de los desacuerdos?",
      preguntaClave: "¿Sientes que 'no tienes tiempo ni energía' para abordar con calma lo que ocurre en tus relaciones más cercanas?",
      direccionPastoral: "Priorizar el amor y la comunión honesta por encima de la agenda apretada, recordando que las relaciones son el tesoro eterno del Reino."
    });
  }

  return interactions;
}
