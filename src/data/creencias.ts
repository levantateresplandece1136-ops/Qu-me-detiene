export interface Versiculo {
  ref: string;
  txt: string;
}

export interface CreenciaRecord {
  id: number;
  bloque: string;
  bloqueId: string;
  creencia: string;
  alias: string;
  impacto: string;
  neuro: string;
  lenguaje: string[];
  conducta: string[];
  verdad: string;
  versiculos: Versiculo[];
  espiritu: string;
  declaracion: string;
  afirmacionTest: string;
  scoreMax: number;
}

export const bloquesDiagnostico: Record<string, { title: string; screeningPhrase: string }> = {
  "capacidad-identidad": {
    title: "Capacidad e Identidad",
    screeningPhrase: "Cuando tengo que hacer algo importante, una voz interna me dice que no estoy lo suficientemente preparado."
  },
  "merecimiento-vinculo": {
    title: "Merecimiento y Vínculo",
    screeningPhrase: "Cuando las cosas me van bien, espero que algo salga mal pronto."
  },
  "control-entorno": {
    title: "Control y Entorno",
    screeningPhrase: "Siento que mis circunstancias externas tienen más poder sobre mi vida que mis propias decisiones."
  },
  "rendimiento-logro": {
    title: "Rendimiento y Logro",
    screeningPhrase: "No entrego o publico algo hasta que está perfecto, aunque eso tome mucho más tiempo."
  },
  "relaciones-poder": {
    title: "Relaciones y Poder",
    screeningPhrase: "En los conflictos, siento que alguien tiene que ceder y generalmente soy yo o tengo que ganar."
  },
  "cuerpo-salud": {
    title: "Cuerpo y Salud",
    screeningPhrase: "Me cuesta descansar sin sentirme culpable por el tiempo que estoy perdiendo."
  },
  "espiritualidad-trascendencia": {
    title: "Espiritualidad y Trascendencia",
    screeningPhrase: "A veces siento que Dios está lejos o que mi vida no tiene un propósito claro."
  },
  "tiempo-futuro": {
    title: "Tiempo y Futuro",
    screeningPhrase: "Me preocupa constantemente no tener suficiente tiempo o tomar la decisión equivocada."
  },
  "genero-identidad-social": {
    title: "Género e Identidad Social",
    screeningPhrase: "Mi origen, género o historia personal me limita de alcanzar lo que realmente deseo."
  }
};

export const creenciasDatabase: CreenciaRecord[] = [
  // 1. Capacidad e Identidad (1-5)
  {
    id: 1,
    bloque: "Capacidad e Identidad",
    bloqueId: "capacidad-identidad",
    creencia: "Incompetencia Nuclear / Síndrome del Impostor",
    alias: "La Jaula del Impostor",
    impacto: "Vives bajo un temor constante a ser 'descubierto' como alguien incapaz o fraudulento, minimizando tus cualificaciones y atribuyendo tus triunfos puramente al azar o a la suerte externa.",
    neuro: "Ocasiona una hiperactivación de la amígdala que asocia el reconocimiento con amenaza. Bloquea la secreción natural de dopamina ante el éxito, produciendo un círculo insaciable de sobreesfuerzo sin recompensa interna.",
    lenguaje: ["Fue de suerte", "Cualquiera podría haberlo hecho", "Si supieran lo poco que sé de esto..."],
    conducta: ["Sobrepreparación obsesiva", "Rechazo de críticas constructivas", "Asumir proyectos menores para evitar riesgos"],
    verdad: "Tu capacidad real no proviene de tu propio rendimiento terrenal, sino de la suficiencia soberana de Aquel que te seleccionó y te otorgó dones invaluables.",
    versiculos: [
      { ref: "2 Corintios 3:5", txt: "No que seamos competentes por nosotros mismos para pensar algo como de nosotros mismos, sino que nuestra competencia proviene de Dios." },
      { ref: "Efesios 2:10", txt: "Porque somos hechura suya, creados en Cristo Jesús para buenas obras, las cuales Dios preparó de antemano para que anduviésemos en ellas." }
    ],
    espiritu: "El Espíritu Santo actúa como tu Testigo interior que sella tu identidad real, erradicando el miedo al rechazo y recordando tu origen celestial.",
    declaracion: "Declaro que mi suficiencia no se basa en lo que sé, en lo que produzco o en la suerte. Mi competencia ha sido establecida por Dios. Soy capaz, soy legítimo, y camino con fe en la tarea que Él me confió.",
    afirmacionTest: "Cuando alguien me felicita o me asigna un gran reto, pienso en el fondo que exageran y que pronto descubrirán que no soy apto.",
    scoreMax: 10
  },
  {
    id: 2,
    bloque: "Capacidad e Identidad",
    bloqueId: "capacidad-identidad",
    creencia: "Incapacidad de Elección / Dependencia Extrema",
    alias: "El Faro Ajeno",
    impacto: "Delegas la autoría de tu destino en la aprobación ajena. Sientes terror a equivocarte, lo que te paraliza a la hora de tomar decisiones importantes sin poseer el visto bueno de terceros.",
    neuro: "El córtex prefrontal ventromedial muestra menor conectividad con los centros evaluativos cuando estás solo/a, necesitando un 'espejo' social constante para reducir los niveles de cortisol sistémico.",
    lenguaje: ["¿Tú qué crees que deba hacer?", "Solo quiero hacer lo correcto según lo que dicen todos", "No sé tomar decisiones"],
    conducta: ["Consultar a múltiples personas antes de decidir", "Posponer compromisos cruciales", "Adoptar gustos de otros"],
    verdad: "Dios te ha dotado de un espíritu de sabiduría, discernimiento y dominio propio, confiriéndote la libertad gloriosa para elegir guiado por su Espíritu.",
    versiculos: [
      { ref: "2 Timoteo 1:7", txt: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio." },
      { ref: "Santiago 1:5", txt: "Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche, y le será dada." }
    ],
    espiritu: "El Espíritu te consuela dándote la paz sobrenatural que sobrepasa el entendimiento, mostrándote que tienes la mente de Cristo.",
    declaracion: "Renuncio al temor a errar y a buscar la aprobación compulsiva de los hombres. Yo poseo el discernimiento de Dios, mi sabiduría proviene de su consejo y tengo la valentía de avanzar.",
    afirmacionTest: "Consulto mi toma de decisiones con demasiadas personas porque siento que por mí mismo soy incapaz de elegir lo correcto.",
    scoreMax: 10
  },
  {
    id: 3,
    bloque: "Capacidad e Identidad",
    bloqueId: "capacidad-identidad",
    creencia: "Indefensión Aprendida",
    alias: "El Grillete del Pasado",
    impacto: "Un estado de rendición pasiva. Como sufriste fracasos o traumas acumulados de niño o en proyectos previos, asumes erróneamente que todo esfuerzo por cambiar tu situación actual será estéril.",
    neuro: "Se manifiesta en una supresión del circuito serotoninérgico en el núcleo dorsal del rafe, lo que reduce la motivación conductual y anula la plasticidad neural necesaria para buscar nuevas salidas.",
    lenguaje: ["¿Para qué intentarlo?", "Siempre ha sido así de difícil", "Esto es lo que me tocó"],
    conducta: ["Pasividad ante las oportunidades", "Apatía recurrente", "Falta de iniciativa en el trabajo"],
    verdad: "Cristo ha roto toda inercia de derrota. Su poder creador renueva tus fuerzas internas diariamente, rompiendo encadenamientos generacionales y mentales.",
    versiculos: [
      { ref: "Isaías 43:18-19", txt: "No os acordéis de las cosas pasadas... He aquí que yo hago cosa nueva; pronto saldrá a la luz; ¿no la conoceréis?" },
      { ref: "Isaías 40:29", txt: "En da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas." }
    ],
    espiritu: "El Espíritu del Señor infunde aliento vital en tus huesos secos, reviviendo tu fuerza motora y tu esperanza creativa.",
    declaracion: "Rompo hoy la mentira de que mi futuro será una copia de mis derrotas pasadas. El poder de Dios hace nuevas todas las cosas sobre mí. Mi pasado no tiene jurisdicción sobre mi gloria futura.",
    afirmacionTest: "He tenido tantos fracasos o desilusiones que he dejado de esforzarme por cambiar mi vida, asumiendo que mi esfuerzo no sirve.",
    scoreMax: 10
  },
  {
    id: 4,
    bloque: "Capacidad e Identidad",
    bloqueId: "capacidad-identidad",
    creencia: "Invisibilidad Protectora",
    alias: "El Refugio Invisible",
    impacto: "Mantienes ocultos tus talentos, tu voz y tu imagen física para evitar que el mundo te vea y te critique, creyendo falsamente que la invisibilidad es el único puerto seguro contra la humillación.",
    neuro: "Elevada reactividad en el tálamo y la ínsula ante estímulos visuales sociales, interpretando el foco público como una herida física inminente, lo que activa el sistema simpático de parálisis.",
    lenguaje: ["Prefiero que otros se lleven el crédito", "A mí no me gusta llamar la atención", "Es mejor pasar desapercibido"],
    conducta: ["Guardar silencio en reuniones clave", "Vestirse con tonos apagados para desaparecer", "Autosabotear ascensos"],
    verdad: "Tú has sido puesto como una luminaria radiante por la mano de Dios para bendición pública. Tu luz es hermosa y glorifica al Padre.",
    versiculos: [
      { ref: "Mateo 5:14-16", txt: "Vosotros sois la luz del mundo; una ciudad asentada sobre un monte no se puede esconder... Así alumbre vuestra luz delante de los hombres." },
      { ref: "Proverbios 28:1", txt: "Huye el impío sin que nadie lo persiga; mas el justo está confiado como un león." }
    ],
    espiritu: "El Espíritu Santo quita el velo de la vergüenza y te reviste de un denuedo majestuoso, dándote voz con autoridad espiritual.",
    declaracion: "Salgo de las sombras y del aislamiento defensivo. Mi Creador me diseñó para brillar e impactar mi entorno con la luz de su verdad. No tengo miedo a ser visto.",
    afirmacionTest: "Prefiero mantenerme en el anonimato o guardar silencio en los grupos para evitar llamar la atención y ser juzgado.",
    scoreMax: 10
  },
  {
    id: 5,
    bloque: "Capacidad e Identidad",
    bloqueId: "capacidad-identidad",
    creencia: "Rigidez de Identidad Estática",
    alias: "La Cáscara de Piedra",
    impacto: "Un diagnóstico de inmutabilidad: crees que tu personalidad defectuosa, tu carácter irascible o tu apatía son genéticas o imposibles de sanar, paralizando tu crecimiento integral.",
    neuro: "Anula la mentalidad de crecimiento (Growth Mindset) bajando la plasticidad sináptica adaptativa en el hipocampo, fijando redes neurales de reacciones reactivas repetitivas.",
    lenguaje: ["Yo soy así de nacimiento", "Genio y figura hasta la sepultura", "No me pidan que cambie a mi edad"],
    conducta: ["Resistencia total a sugerencias", "Justificar malos hábitos", "Apatía emocional ante el desarrollo"],
    verdad: "En Cristo, tú posees un diseño radical de metamorfosis espiritual y biológica constante mediante la asimilación de su palabra divina.",
    versiculos: [
      { ref: "Romanos 12:2", txt: "No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento, para que comprobéis cuál sea la buena voluntad de Dios." },
      { ref: "2 Corintios 3:18", txt: "Por tanto, nosotros todos, mirando a cara descubierta como en un espejo la gloria del Señor, somos transformados de gloria en gloria en la misma imagen." }
    ],
    espiritu: "El Espíritu opera diariamente la regeneración y el pulido de tu carácter, tallando en ti la imagen del Hijo de manera milagrosa.",
    declaracion: "Renuncio al fatalismo genético y relacional. Mi mente y mi temperamento están bajo el señorío de Jesucristo. Declaro que soy capaz de aprender, madurar y reflejar amor, paz y templanza.",
    afirmacionTest: "Justifico mis defectos de carácter bajo el supuesto de que 'yo ya soy así' y que es tarde para cambiar mi temperamento.",
    scoreMax: 10
  },

  // 2. Merecimiento y Vínculo (6-10)
  {
    id: 6,
    bloque: "Merecimiento y Vínculo",
    bloqueId: "merecimiento-vinculo",
    creencia: "Culpa Atávica / Autosabotaje de la Dicha",
    alias: "El Castigo de la Dicha",
    impacto: "Sientes un malestar ansioso cuando las cosas marchan bien en tus finanzas, salud o amor. Satisfecho un logro, actúas de manera insensata para arruinarlo y retornar a tu estado 'esperado' de crisis.",
    neuro: "El estriado ventral (núcleo del circuito de recompensa) interpreta la calma o la abundancia sostenidas como una anomalía peligrosa, generando picos de cortisol para buscar un estado de alerta familiar.",
    lenguaje: ["Todo está muy callado, algo malo viene", "Es demasiado bueno para ser verdad", "No merezco tanta paz"],
    conducta: ["Iniciar discusiones de la nada", "Gastar dinero compulsivamente tras ganar un incentivo", "Descuidar la salud"],
    verdad: "La gracia de Dios es un favor infinito e incondicional. No necesitas pagar tributos con dolor o autolimitación para tener su paz duradera.",
    versiculos: [
      { ref: "Romanos 8:1", txt: "Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús, los que no andan conforme a la carne, sino conforme al Espíritu." },
      { ref: "Efesios 1:6", txt: "Para alabanza de la gloria de su gracia, con la cual nos hizo aceptos en el Amado." }
    ],
    espiritu: "El Espíritu de Dios desaloja la mentira del castigo imprevisto, dándote el testimonio de que eres un heredero amado sin deudas.",
    declaracion: "Desactivo toda alarma interna que sabotea mi bienestar. Acepto la paz, la abundancia y el favor de Dios sobre mi hogar. No tengo que pagar con dolor lo que Cristo compró gratis.",
    afirmacionTest: "Cuando experimento felicidad o prosperidad inusual, me inunda el pánico de que una gran calamidad está a punto de suceder.",
    scoreMax: 10
  },
  {
    id: 7,
    bloque: "Merecimiento y Vínculo",
    bloqueId: "merecimiento-vinculo",
    creencia: "Fatalismo Vincular / Abandono Anticipado",
    alias: "La Muralla de Cristal",
    impacto: "Un blindaje que destruye el amor genuino. Esperas de antemano el engaño, la traición o el abandono de los tuyos, lo que te empuja a alejarte tú primero o a celar de forma destructiva.",
    neuro: "Falta de receptores de oxitocina estables. La amígdala procesa los gestos neutros o de cariño como potenciales traiciones, manteniendo el cuerpo en un tono simpático de ataque/huida.",
    lenguaje: ["Al final todos se van", "Nadie es leal", "Prefiero no encariñarme"],
    conducta: ["Terminar relaciones sanas de improvisto", "Monitoreo obsesivo de la pareja", "Ocultar intimidad emocional"],
    verdad: "Tú perteneces a una familia celestial eterna. Aunque el ser humano falle, el pacto fiel de Dios es tu asidero inquebrantable de pertenencia.",
    versiculos: [
      { ref: "Salmo 27:10", txt: "Aunque mi padre y mi madre me dejaran, con todo, Jehová me recogerá." },
      { ref: "Romanos 8:39", txt: "Ni lo alto, ni lo profundo... nos podrá separar del amor de Dios, que es en Cristo Jesús Señor nuestro." }
    ],
    espiritu: "El Espíritu susurra íntimamente a tu alma 'Abba Padre', dándote la sensación profunda de pertenencia afectiva incondicional.",
    declaracion: "Bajo mi guardia defensiva. Renuncio al miedo al abandono. Dios es mi refugio eterno y sanará mis relaciones con vínculos constructivos y sinceros de amor libre de pánico.",
    afirmacionTest: "Evito entregarme por completo afectivamente o creo muros invisibles porque vivo esperando a que la persona me traicione o me deje.",
    scoreMax: 10
  },
  {
    id: 8,
    bloque: "Merecimiento y Vínculo",
    bloqueId: "merecimiento-vinculo",
    creencia: "Deuda Emocional Perpetua",
    alias: "El Siervo Exhausto",
    impacto: "Crees que tu derecho a descansar o a ser amado depende de ser el salvador crónico de la vida de todos a tu alrededor, desgastando tus fuerzas en un sacrificio no pedido.",
    neuro: "Se asocia a un agotamiento en los circuitos mediales prefrontales y a niveles elevados de adrenalina sostenida. Tu cerebro no asocia el reposo con el merecimiento biológico autónomo.",
    lenguaje: ["Si no lo hago yo, nadie lo hará", "No puedo decir que no", "Tengo que solucionar sus vidas"],
    conducta: ["Asumir responsabilidades ajenas", "No delegar", "Ignorar necesidades básicas en favor de caprichos ajenos"],
    verdad: "Tu redención y valor humano ya fueron completamente saldados por Cristo. Eres amado por lo que eres en Él, no por tu servicio incansable.",
    versiculos: [
      { ref: "Mateo 11:28", txt: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." },
      { ref: "Gálatas 1:10", txt: "¿Pues busco ahora el favor de los hombres, o el de Dios? ¿O trato de agradar a los hombres?" }
    ],
    espiritu: "El Espíritu Santo te enseña a trazar límites saludables con amor, recordándote que tu mayor servicio brota de tu descanso en Él.",
    declaracion: "Confieso que el peso del mundo no descansa sobre mis hombros. Siento libertad para recibir amor, disfruto de mi descanso y reconozco que mi valor ya fue firmado con sangre real.",
    afirmacionTest: "Siento que si no estoy arreglando los problemas de mi familia o amigos, ellos me rechazarán o perderé mi valor ante sus ojos.",
    scoreMax: 10
  },
  {
    id: 9,
    bloque: "Merecimiento y Vínculo",
    bloqueId: "merecimiento-vinculo",
    creencia: "Exclusión Fundamental / El Desterrado",
    alias: "El Forastero del Alma",
    impacto: "Llevas a cuestas una sensación sorda de que eres una pieza defectuosa que no encaja en ningún círculo social, familiar o eclesial, forzando un exilio interior preventivo.",
    neuro: "El córtex cingulado anterior (área que procesa el dolor de la exclusión social de la misma forma que el dolor físico) emite señales de dolor de fondo crónico, aun en ambientes cálidos.",
    lenguaje: ["Yo no encajo en ningún lado", "Soy el bicho raro", "Nadie me entiende en verdad"],
    conducta: ["Rechazar invitaciones grupales", "Mantener una actitud distante o cínica", "Cambiar de congregación/grupo constantemente"],
    verdad: "El Señor te ha adoptado, injertándote de manera íntima en el cuerpo místico de Cristo, donde tu identidad única es indispensable.",
    versiculos: [
      { ref: "Efesios 2:19", txt: "Así que ya no sois extranjeros ni forasteros, sino conciudadanos de los santos, y miembros de la familia de Dios." },
      { ref: "1 Corintios 12:27", txt: "Vosotros, pues, sois el cuerpo de Cristo, y miembros cada uno en particular." }
    ],
    espiritu: "El Espíritu te provee de un lazo sobrenatural para amar y ser amado, tejiéndote de forma orgánica en la comunión dulce de los santos.",
    declaracion: "Derribo la mentira del exilio interno. No soy un paria errante. Tengo mi ciudadanía en el Reino del Amado, encajo con gracia en su familia y comparto dones únicos con amor legítimo.",
    afirmacionTest: "Siento una profunda soledad o una barrera que me hace sentir un forastero, incluso cuando estoy rodeado de personas amables.",
    scoreMax: 10
  },
  {
    id: 10,
    bloque: "Merecimiento y Vínculo",
    bloqueId: "merecimiento-vinculo",
    creencia: "Desamor Esencial / Inseguridad Primordial",
    alias: "La Semilla Vacía",
    impacto: "Un axioma desolador: consideras que dentro de ti hay un vacío o defecto inherente tan grande que si la gente te conociera en tu total vulnerabilidad, su amor se transformaría en asco o desprecio.",
    neuro: "Se asienta sobre una desconexión entre la ínsula y el circuito por defecto (DMN), impidiendo que el cerebro construya un autoconcepto compasivo, interpretando el yo íntimo como error.",
    lenguaje: ["Si supieras cómo soy en realidad...", "Nadie sabrá mi verdad", "Esconder mi fealdad interna"],
    conducta: ["Máscaras sociales de perfección", "Incapacidad de llorar ante otros", "Evitar preguntas sobre intimidad"],
    verdad: "Tu Creador te conoce exhaustivamente en tus rincones más oscuros y, aun así, ha pagado el precio supremo para poseer tu corazón.",
    versiculos: [
      { ref: "Salmo 139:1-2", txt: "Oh Jehová, tú me has examinado y conocido. Tú has conocido mi sentarme y mi levantarme; has entendido desde lejos mis pensamientos." },
      { ref: "Jeremías 31:3", txt: "Con amor eterno te he amado; por tanto, te prolongué mi misericordia." }
    ],
    espiritu: "El Espíritu de Verdad inunda tus áreas oscuras con una llovizna tierna de gracia que te asegura que eres santo, bello y profundamente amado.",
    declaracion: "Desecho el estigma de ser defectuoso. Me expongo a la luz de Aquel que me redimió. Dios no comete errores al crear; Él me formó con amor excelsior y me asume felizmente.",
    afirmacionTest: "Creo tener un defecto interior vergonzoso que, de ser conocido por mi pareja o amigos, haría que dejasen de amarme.",
    scoreMax: 10
  },

  // 3. Control y Entorno (11-15)
  {
    id: 11,
    bloque: "Control y Entorno",
    bloqueId: "control-entorno",
    creencia: "Omnipotencia de Control Directo",
    alias: "La Cúpula del Rey",
    impacto: "Te exiges a ti mismo la titánica tarea de controlar la conducta, pensamientos y decisiones de tu familia y esfera laboral, sufriendo rabia o desánimo asfixiante si algo escapa de tu guión.",
    neuro: "Un desequilibrio del neurotransmisor GABA. Ante la incertidumbre imprevista, la corteza cingulada anterior dispara descargas de adrenalina que bloquean el juicio analítico lógico.",
    lenguaje: ["Si no se hace a mi manera, saldrá mal", "Nadie sabe organizarse como yo", "Tengo que vigilar todo yo mismo"],
    conducta: ["Micromanagement invasivo", "Impaciencia extrema", "Estallidos de ira verbal ante cambios de planes"],
    verdad: "El gobierno del universo reside exclusivamente sobre los hombros del Altísimo. Tú estás llamado a servir con gozo, mas no a ser el soberano de las almas.",
    versiculos: [
      { ref: "Proverbios 3:5-6", txt: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas." },
      { ref: "Salmo 46:10", txt: "Estad quietos, y conoced que yo soy Dios; seré exaltado entre las naciones; enaltecido seré en la tierra." }
    ],
    espiritu: "El Espíritu Santo te convence de soltar el timón del prójimo espiritual y emocional, enseñándote el fruto de la paz y templanza.",
    declaracion: "Suelto el orgullo de querer controlarlo todo. Confío el rumbo de mis hijos, de mi trabajo y de mis seres queridos a las manos infalibles de mi Padre Celestial. Descanso en Dios.",
    afirmacionTest: "Sufro de ansiedad insoportable o frustración intensa cuando la gente a mi cargo no sigue mis instrucciones exactas o los planes cambian.",
    scoreMax: 10
  },
  {
    id: 12,
    bloque: "Control y Entorno",
    bloqueId: "control-entorno",
    creencia: "Desesperanza de Circunstancias / Prisión Exterior",
    alias: "La Cárcel Infinita",
    impacto: "Consideras que tu estancamiento relacional o de progreso material procede plenamente de factores externos rígidos como el clima económico o tu herencia material, declarando la parálisis.",
    neuro: "Desregulación de la corteza prefrontal dorsolateral que inhabilita la capacidad de planificar estrategias a largo plazo. Tu cerebro habita un sesgo de supervivencia en modo ahorro de energía.",
    lenguaje: ["A nadie le va bien en este país", "Nací en la familia equivocada", "El sistema no deja progresar"],
    conducta: ["Queja crónica en redes sociales", "No planificar finanzas", "Abandono de metas de superación al primer obstáculo"],
    verdad: "La provisión, la apertura de puertas y la promoción de tu llamado proceden de la soberanía del Reino celestial, que supera toda aridez material de esta tierra.",
    versiculos: [
      { ref: "Filipenses 4:19", txt: "Mi Dios, pues, suplirá todo lo que os falte conforme a sus riquezas en gloria en Cristo Jesús." },
      { ref: "Salmo 121:1-2", txt: "Alzaré mis ojos a los montes; ¿De dónde vendrá mi socorro? Mi socorro viene de Jehová, que hizo los cielos y la tierra." }
    ],
    espiritu: "El Espíritu de sabiduría te capacita con ideas creativas y abre portales de favor divino imposibles de bloquear por cualquier factor político o monetario de este siglo.",
    declaracion: "Mis circunstancias inmediatas no tienen la última palabra sobre mi destino. Mi provisión y mis oportunidades están firmadas por el Reino de Dios, que jamás conocerá la escasez.",
    afirmacionTest: "Considero que mi falta de avance financiero o estabilidad se debe en un 90% a factores de la economía gubernamental o de mis padres.",
    scoreMax: 10
  },
  {
    id: 13,
    bloque: "Control y Entorno",
    bloqueId: "control-entorno",
    creencia: "Hipervigilancia de la Adversidad / Alerta Roja",
    alias: "El Centinela de Sombras",
    impacto: "Un insomnio interior del sistema defensivo. Estás constantemente de ronda mental buscando qué puede fallar, qué accidente puede acontecer o qué persona albergará malicia, cancelando tu capacidad de gozo.",
    neuro: "Una secreción continua de cortisol y norepinefrina de baja intensidad proveniente del locus coeruleus, que deforma las cogniciones para ver intenciones malévolas o riesgos mortales en la bonanza.",
    lenguaje: ["Hay que desconfiar de las buenas intenciones", "Sé que algo malo se está gestando", "Tanta felicidad me da mala espina"],
    conducta: ["Revisión compulsiva de candados/seguros", "Evitar viajes por fobia a accidentes", "Interpretar el silencio del otro como conspiración"],
    verdad: "Tú descansas bajo la bóveda protectora del Altísimo. Su fidelidad resguarda tu sueño y acampa a tu favor para desarticular toda trampa furtiva.",
    versiculos: [
      { ref: "Salmo 91:1-2", txt: "El que habita al abrigo del Most High morará bajo la sombra del Omnipotente. Diré yo a Jehová: Esperanza mía, y castillo mío; Mi Dios, en quien confiaré." },
      { ref: "Proverbios 3:24", txt: "Cuando te acuestes, no tendrás temor, sino que te acostarás, y tu sueño será grato." }
    ],
    espiritu: "El Espíritu disuelve el velo del horror infundado con el tierno bálsamo de la confianza divina que aquieta los latidos de tu pecho.",
    declaracion: "Desactivo el radar de la catástrofe. Habito al abrigo del Omnipotente. El amor perfecto de Dios hecha fuera mi temor y confío en que el bien y la misericordia me escoltan hoy.",
    afirmacionTest: "Paso gran parte del día imaginando posibles accidentes, enfermedades familiares o escenarios de crisis extrema para estar 'prevenido'.",
    scoreMax: 10
  },
  {
    id: 14,
    bloque: "Control y Entorno",
    bloqueId: "control-entorno",
    creencia: "Victimización Sistémica",
    alias: "El Blanco Perfecto",
    impacto: "Asumes que existe una confabulación tácita del entorno, figuras de autoridad o colegas del trabajo enfocados específicamente en entorpecer tu desarrollo, utilizándolo como coartada moral para el rencor.",
    neuro: "El lóbulo prefrontal no inhibe la hiperactividad del hipotálamo, que perpetúa una sensación corporal de ser una 'presa herida' rodeada de hostilidad, reforzando la desconexión social.",
    lenguaje: ["Siempre me tocan los peores jefes", "Nadie me valora en este lugar", "Quieren hacerme la vida imposible"],
    conducta: ["Guardar un registro minucioso de agravios", "Aislamiento laboral", "Actitud defensiva grosera ante directrices"],
    verdad: "Ninguna confabulación terrenal puede torcer el llamado real y la bendición que Dios ha decretado irrevocablemente sobre tu cabeza.",
    versiculos: [
      { ref: "Isaías 54:17", txt: "Ninguna arma forjada contra ti prosperará, y condenarás toda lengua que se levante contra ti en juicio." },
      { ref: "Romanos 8:31", txt: "¿Qué, pues, diremos a esto? Si Dios es por nosotros, ¿quién contra nosotros?" }
    ],
    espiritu: "El Espíritu Santo sana tus heridas de persecución, devolviéndote la dulzura relacional y recordándote que tu promoción procede del Rey de reyes.",
    declaracion: "Renuncio al papel de víctima de conspiraciones. El favor de Dios me abre brecha, Él es mi abogado perfecto y extiendo perdón sincero a quienes intentaron cerrarme paso.",
    afirmacionTest: "Suelo sentir que las figuras directivas de mi empleo o el universo conspiran de forma premeditada para evitar mi triunfo.",
    scoreMax: 10
  },
  {
    id: 15,
    bloque: "Control y Entorno",
    bloqueId: "control-entorno",
    creencia: "Externalización de Responsabilidad Penal",
    alias: "La Coartada Sin Fin",
    impacto: "Vives atribuyendo el estancamiento de tu carácter y tus arranques iracundos puramente a las agresiones verbales o negligencias de tu pasado e historial familiar, eximiéndote del deber de edificar hoy.",
    neuro: "Incapacidad para modular el comportamiento reactivo desde el córtex del cuerpo calloso. El cerebro repite patrones subcorticales del sistema límbico eludiendo la toma de control de las emociones.",
    lenguaje: ["Yo no quería gritar, pero tú me provocaste", "Si mi padre hubiera sido distinto...", "Mi amargura es culpa del daño que me hicieron"],
    conducta: ["Evitar pedir disculpas sinceras", "Explicar defectos en lugar de erradicarlos", "Proyectar la culpa en las discusiones"],
    verdad: "Dios te ha otorgado libertad gloriosa y poder creador para edificar tu propio destino hoy, dándote la capacidad para no replicar maldiciones.",
    versiculos: [
      { ref: "Ezequiel 18:20", txt: "El alma que pecare, esa morirá; el hijo no llevará el pecado del padre... la justicia del justo será sobre él." },
      { ref: "Gálatas 6:5", txt: "Porque cada uno llevará su propia carga." }
    ],
    espiritu: "El Espíritu Santo te dota de madurez y un espejo de arrepentimiento dulce, impulsándote a asumir las riendas espirituales de tu propia vida hoy.",
    declaracion: "Asumo con gozo la autoría de mis decisiones bajo el amparo divino. No soy rehén de los errores de mis antepasados. Hoy edifico con Cristo un legado de paz y madurez.",
    afirmacionTest: "Justifico mis arranques de enojo, amargura o malos hábitos señalando que son consecuencia ineludible de lo que otros me hicieron.",
    scoreMax: 10
  },

  // 4. Rendimiento y Logro (16-20)
  {
    id: 16,
    bloque: "Rendimiento y Logro",
    bloqueId: "rendimiento-logro",
    creencia: "Perfeccionismo Paralizante",
    alias: "El Molde de Hielo",
    impacto: "El terror al fallo o a la falta de elegancia absoluta te lleva a retrasar las entregas, caer en una procrastinación crónica o abandonar propuestas hermosas antes de darlas a la luz.",
    neuro: "Elevada autocrítica que activa la corteza prefrontal medial y la ínsula de forma destructiva, interpretando el error menor de diseño como una catástrofe social inminente que hay que postergar.",
    lenguaje: ["Todavía no está lo suficientemente listo", "Para presentarlo con fallas, mejor no presento nada", "Debo retocarlo un poco más"],
    conducta: ["Procrastinación severa", "Reescribir proyectos infinitas veces", "No lanzar proyectos comerciales"],
    verdad: "La gracia de Dios acoge tus intenciones reales y tu labor devota, santificando tus obras humanas más allá de cualquier supuesta imperfección.",
    versiculos: [
      { ref: "Eclesiastés 11:4", txt: "El que al viento observa, no sembrará; y el que a las nubes mira, no segará." },
      { ref: "Eclesiastés 7:16", txt: "No seas demasiado justo, ni seas sabio con exceso; ¿por qué te destruirás?" }
    ],
    espiritu: "El Espíritu erradica el pánico a los ojos ajenos, infundiendo un amor por el proceso de aprendizaje activo, libre de la asfixia del perfeccionismo carnal.",
    declaracion: "Declaro libre de vergüenza mis pasos firmes en fe. Rompo la parálisis del perfeccionismo. Prefiero avanzar con valentía y aprender con gracia a congelarme en la perfección inservible.",
    afirmacionTest: "Tengo proyectos hermosos en mente que llevan meses o años paralizados porque siento que aún no tienen la calidad impecable necesaria.",
    scoreMax: 10
  },
  {
    id: 17,
    bloque: "Rendimiento y Logro",
    bloqueId: "rendimiento-logro",
    creencia: "Valor Condicionado de Producción",
    alias: "El Esclavo de la Arena",
    impacto: "Consideras que tu valor existencial real, tu redención e idoneidad como ser humano equivalen única y exclusivamente a la suma de tus triunfos públicos, tus títulos o tu solvencia económica.",
    neuro: "El circuito de recompensa se enciende únicamente ante marcadores numéricos de éxito (dinero, clics, medallas), sufriendo depresiones biológicas profundas ante la inactividad temporal.",
    lenguaje: ["Si no estoy ganando dinero, no soy nadie", "Soy lo que tengo en mi hoja de vida", "Detesto sentirme inútil un solo día"],
    conducta: ["Exhibir logros compulsivamente", "Negar el cansancio corporal", "Crisis existencial severa al perder un empleo"],
    verdad: "Tú has sido adoptado y amado por gracia soberana eterna del Padre antes de que pudieras realizar cualquier obra o producir una sola moneda terrenal.",
    versiculos: [
      { ref: "Lucas 12:15", txt: "Y les dijo: Mirad, y guardaos de toda avaricia; porque la vida del hombre no consiste en la abundancia de los bienes que posee." },
      { ref: "Gálatas 2:16", txt: "Sabiendo que el hombre no es justificado por las obras de la ley, sino por la fe de Jesucristo." }
    ],
    espiritu: "El Espíritu Santo te ancla con dulzura en la filiación divina incondicional, mostrándote que tu mayor identidad es la de un hijo amado.",
    declaracion: "Desactivo el engranaje del rendimiento carnal para ser aceptado. Mi valor fue decretado en la cruz del Calvario. Yo soy amado, soy digno, y produzco por gratitud, no por codicia existencial.",
    afirmacionTest: "Cuando atravieso temporadas de pocos ingresos o desempleo, me invade una tristeza tan honda que llego a dudar de mi valor como padre, esposo o persona.",
    scoreMax: 10
  },
  {
    id: 18,
    bloque: "Rendimiento y Logro",
    bloqueId: "rendimiento-logro",
    creencia: "Glorificación de la Prisa / Culto al Burnout",
    alias: "El Altar de la Prisa",
    impacto: "Un estado de asfixia autoprovocada: crees que tener tu agenda repleta de compromisos de sol a sol es el único estandarte de prestigio e importancia personal, castigando el reposo bíblico.",
    neuro: "Hiperestimulación simpática crónica de las glándulas suprarrenales que secreta adrenalina constante, confundiendo la taquicardia del estrés con vitalidad productiva real.",
    lenguaje: ["No tengo tiempo para tonterías", "El descanso es para flojos", "Ojalá el día tuviese 30 horas"],
    conducta: ["Interrumpir a las personas al hablar", "Comer apresuradamente frente a pantallas", "Agendar citas sin espacios de ocio"],
    verdad: "Dios ha santificado el principio divino del descanso como un acto hercúleo de confianza en su gobierno sobre todos tus proyectos cotidianos.",
    versiculos: [
      { ref: "Salmo 127:2", txt: "Por demás os es que os levantéis de madrugada, y vayáis tarde a reposar, y que comáis pan de dolores; pues que a su amado dará Dios el sueño." },
      { ref: "Éxodo 20:8", txt: "Acuérdate del sábado para santificarlo. Seis días trabajarás... mas el séptimo es reposo." }
    ],
    espiritu: "El Espíritu de calma aquieta los engranajes de la prisa carnal, enseñándote el valor fecundo de sentarse a los pies de Jesús.",
    declaracion: "Confieso que Dios gobierna mi tiempo. Declaro que el reposo es santo y sabio. Recibo mi sueño nocturno y mi tiempo de descanso como un regalo de identidad y confianza en su soberanía.",
    afirmacionTest: "Me invade una molesta culpa o una sensación de improductividad vergonzosa cuando decido tomarme una tarde libre o descansar.",
    scoreMax: 10
  },
  {
    id: 19,
    bloque: "Rendimiento y Logro",
    bloqueId: "rendimiento-logro",
    creencia: "Síndrome de la Meta Volante",
    alias: "El Ansia Sin Fin",
    impacto: "Una condena al desierto: nunca celebras, saboreas ni descansas en tus conquistas. Tan pronto cruzas un umbral ansiado, tu mente lo devalúa de inmediato y se aferra con frenesí al siguiente reto.",
    neuro: "Incapacidad para liberar serotonina duradera al concretar metas. El sistema dopaminérgico desplaza al instante el pico placentero hacia una expectativa futura inaccesible, inhabilitando la calma.",
    lenguaje: ["Sí, logré el título, pero ahora necesito el máster", "Eso ya es pasado", "Todavía me falta lo importante"],
    conducta: ["Bajar la mirada ante elogios", "No celebrar hitos comerciales", "Fijar nuevas metas el mismo día del éxito"],
    verdad: "Tú tienes el derecho divino a gozar, comer y alegrarte de todo el buen fruto que la mano generosa de tu Padre te permite cosechar.",
    versiculos: [
      { ref: "Eclesiastés 3:13", txt: "Y también que es don de Dios que todo hombre coma y beba, y goce el bien de toda su labor." },
      { ref: "Nehemías 8:10", txt: "Id, comed grosuras... y enviad porciones a los que no tienen nada preparado; porque día santo es a nuestro Señor; no os entristezcáis, porque el gozo de Jehová es vuestra fuerza." }
    ],
    espiritu: "El Espíritu Santo derrama un bálsamo de gratitud y quietud, revelándote que el viaje con Jesús se vive en el presente santo.",
    declaracion: "Abrazo el regocijo del logro obtenido. Agradezco a Dios mis conquistas de hoy y me tomo el tiempo para saborear sus dones antes de buscar la siguiente colina. Su gozo es mi vigor.",
    afirmacionTest: "Rara vez celebro o me alegro por un logro en mi carrera; inmediatamente siento que no es suficiente y me obsesiona el siguiente paso.",
    scoreMax: 10
  },
  {
    id: 20,
    bloque: "Rendimiento y Logro",
    bloqueId: "rendimiento-logro",
    creencia: "Descuento del Logro Sincero",
    alias: "La Moneda de Aire",
    impacto: "Un sesgo de minimización constante: ante un premio o reconocimiento, crees que la competencia era débil, que se debió a un error de juicio de las autoridades o que era sumamente fácil.",
    neuro: "Se asocia a un deterioro de la reentrada integradora en la corteza de asociación somatosensorial, lo que anula de forma biológica la incorporación del éxito en el esquema mental corporal propio.",
    lenguaje: ["No fue nada especial", "Estuvo fácil ese examen", "Fue solo rutina"],
    conducta: ["Hablar con tono condescendiente de los propios triunfos", "Desviar conversaciones de felicitación", "Rechazar galardones"],
    verdad: "Tus talentos, tu denuedo y tu perseverancia son dones legítimos que honran la gloria de Dios y merecen ser reconocidos públicamente.",
    versiculos: [
      { ref: "Romanos 12:6", txt: "De manera que, teniendo diferentes dones, según la gracia que nos es dada, úsenlos." },
      { ref: "Salmo 118:23", txt: "De parte de Jehová es esto, y es cosa maravillosa a nuestros ojos." }
    ],
    espiritu: "El Espíritu de humildad y verdad te enseña a agradecer con majestad tus capacidades sin caer en el menosprecio carnal que solapa el orgullo inverso.",
    declaracion: "Honro la habilidad que Dios depositó en mí. Recibo con gracias sinceras el elogio genuino y glorifico al Eterno por facultarme con vigor para materializar excelencia en esta tierra.",
    afirmacionTest: "Cuando tengo éxito en un gran proyecto, suelo devaluar mi propio logro pensando que era algo fácil que cualquiera en mi lugar habría hecho igual.",
    scoreMax: 10
  },

  // 5. Relaciones y Poder (21-25)
  {
    id: 21,
    bloque: "Relaciones y Poder",
    bloqueId: "relaciones-poder",
    creencia: "Complacencia Patológica",
    alias: "El Guardián Silente",
    impacto: "Consideras que cualquier expresión de tus propias opiniones o cualquier desacuerdo generará un conflicto destructivo apocalíptico, silenciando tu voz interna para que los otros estén complacidos.",
    neuro: "El circuito de dolor social se activa ante la sola idea de debate verbal minoritario. Las hormonas de calma (endorfina) se producen únicamente al adoptar posturas de sumisión preventiva, minando tu asertividad.",
    lenguaje: ["Lo que tú prefieras está bien", "No quiero causar molestias", "Me da igual"],
    conducta: ["Aceptar tareas pesadas no deseadas", "Ocultar la fe o valores personales", "Cambiar de opinión ante la menor directriz"],
    verdad: "Dios no te ha dado voz de cobardía, y tu autenticidad expresada con paciencia divina es un pilar necesario para traer luz y edificación a tu comunidad.",
    versiculos: [
      { ref: "Gálatas 1:10", txt: "¿Busco ahora el favor de los hombres, o el de Dios? ¿O trato de agradar a los hombres? Pues si todavía agradara a los hombres, no sería siervo de Cristo." },
      { ref: "Efesios 4:15", txt: "Sino que siguiendo la verdad en amor, crezcamos en todo en aquel que es la cabeza, esto es, Cristo." }
    ],
    espiritu: "El Espíritu te consagra con una valentía dulce, enseñándote a decir 'Sí' y 'No' con la firmeza del carácter apostólico de Cristo.",
    declaracion: "Suelto la complacencia cobarde. Hablo con la verdad en amor, trazo límites firmes que resguardan mi alma y camino libre del temor a la disconformidad ajena.",
    afirmacionTest: "Prefiero guardar silencio o dar la razón a personas con temperamento fuerte, aunque sienta por dentro que están equivocadas, para evitar una discusión.",
    scoreMax: 10
  },
  {
    id: 22,
    bloque: "Relaciones y Poder",
    bloqueId: "relaciones-poder",
    creencia: "Desconfianza Defensiva",
    alias: "El Escudo de Espinas",
    impacto: "Un axioma de sospecha: crees que mostrar tu dolor íntimo, tu fracaso comercial o tus flaquezas existenciales servirá de munición a otros para atacarte al primer desacuerdo.",
    neuro: "Bajo acoplamiento dinámico en los circuitos por defecto asociados a la empatía relacional. La respuesta defensiva automática de la amígdala bloquea el lóbulo límbico cariñoso.",
    lenguaje: ["No confíes en nadie del todo", "Si les das tu dedo, te tomarán el brazo", "La información es poder, no cuentes tus miserias"],
    conducta: ["Hablar con evasivas", "No tener amigos íntimos confesores", "Asumir que todo cumplido guarda una doble agenda"],
    verdad: "Tú cuentas con un confidente y protector definitivo, delante de quien puedes desnudarte sin temor a la descalificación, y que te asiste para tejer hermandades seguras.",
    versiculos: [
      { ref: "Salmo 118:8", txt: "Mejor es confiar en Jehová que confiar en el hombre." },
      { ref: "Eclesiastés 4:9-10", txt: "Mejores son dos que uno... Porque si cayeren, el uno levantará a su compañero; pero ¡ay del solo! que cuando cayere, no habrá segundo que lo levante." }
    ],
    espiritu: "El Espíritu Santo derriba el pánico a los ojos humanos y te guía de forma providencial hacia amigos con alma de pacto santo, libres de traición.",
    declaracion: "Rompo el aislamiento paranoico. Declaro que el amor de Dios me envuelve. Me abro a compartir vulnerabilidad madura con personas confiables y ungidas, según la dirección celestial.",
    afirmacionTest: "Suelo guardar mis verdaderas flaquezas o luchas secretas en absoluto hermetismo porque creo que la gente usará esa vulnerabilidad en mi contra.",
    scoreMax: 10
  },
  {
    id: 23,
    bloque: "Relaciones y Poder",
    bloqueId: "relaciones-poder",
    creencia: "Competencia Hostil / Espacio Finito",
    alias: "La Selva de Hierro",
    impacto: "Un sesgo de competitividad feroz: asumes que el éxito y la atención son limitados. Si no eres el más destacado o dejas en evidencia al rival de debate, te sientes invisible o amenazado.",
    neuro: "Incapacidad para modular la competitividad límbica desde los circuitos corticales superiores, activando constantemente respuestas neurobiológicas de 'depredador de estatus' que desgastan la empatía.",
    lenguaje: ["El segundo lugar es el primer perdedor", "Tengo que demostrar quién sabe más", "Hay que ganar cueste lo que cueste"],
    conducta: ["Interrumpir debates con sarcasmo", "Alegar conocimiento de temas ignotos", "Desvalorizar el crecimiento de colegas"],
    verdad: "Tú tienes un llamado singular y majestuoso asignado exclusivamente para ti. Los triunfos ajenos no disminuyen en absoluto tu corona gloriosa.",
    versiculos: [
      { ref: "Filipenses 2:3", txt: "Nada hagáis por contienda o por vanagloria; antes bien con humildad, estimando cada uno a los demás como superiores a él mismo." },
      { ref: "Gálatas 5:26", txt: "No nos hagamos vanagloriosos, irritándonos unos a otros, envidiándonos unos a otros." }
    ],
    espiritu: "El Espíritu Santo inunda tu alma de una gozosa seguridad del Reino, eliminando toda rivalidad odiosa y despertando un amor paternal que goza del brillo del hermano.",
    declaracion: "Declaro que mi lugar en el Reino es definitivo. Suelto mi afán competitivo. Me gozo sinceramente de las victorias de mis hermanos y decido ser su mayor animador en fe.",
    afirmacionTest: "Me obsesiona tener la última palabra o demostrar mi superioridad intelectual ante cualquier discrepancia en mis conversaciones.",
    scoreMax: 10
  },
  {
    id: 24,
    bloque: "Relaciones y Poder",
    bloqueId: "relaciones-poder",
    creencia: "Aislamiento Autorreferente / Autosuficiencia Orgullosa",
    alias: "La Torre de Marfil",
    impacto: "Asumes que solicitar ayuda en tus finanzas, en tu dolor de luto o en tus proyectos comerciales es una bajeza humillante o molestará a las personas, forzando un esfuerzo estéril solitario.",
    neuro: "El córtex prefrontal ventromedial suprime selectivamente el deseo biológico de apoyo grupal, sobrecargando las redes neuronales de autorregulación del dolor emocional.",
    lenguaje: ["Puedo yo solo con esto", "Pedir ayuda es molestar", "Si quieres algo bien hecho, hazlo tú mismo"],
    conducta: ["Rechazar ofertas de auxilio", "No derivar tareas en el empleo", "Atravesar depresiones o duelos en total silencio"],
    verdad: "El diseño de la vida en Cristo es un tejido de interdependencia gloriosa. Estamos llamados a llevar las cargas de los otros con sencillez de corazón.",
    versiculos: [
      { ref: "Gálatas 6:2", txt: "Sobrellevad los unos las cargas de los otros, y cumplid así la ley de Cristo." },
      { ref: "Romanos 12:5", txt: "Así nosotros, siendo muchos, somos un solo cuerpo en Cristo, y todos miembros los unos de los otros." }
    ],
    espiritu: "El Espíritu Santo ablanda el orgullo de tu torre solitaria, infundiendo una humildad tierna para abrir las manos y recibir el heraldo de la bendición grupal.",
    declaracion: "Renuncio al mito de la autosuficiencia de piedra. Declaro que necesito del cuerpo de Cristo. Tengo la humildad para pedir y recibir auxilio afectivo, espiritual y material con sencillez.",
    afirmacionTest: "Prefiero aguantar dolores físicos profundos o sobrecargas de quehaceres extremas antes de solicitar ayuda a mis seres cercanos.",
    scoreMax: 10
  },
  {
    id: 25,
    bloque: "Relaciones y Poder",
    bloqueId: "relaciones-poder",
    creencia: "Resentimiento Cronificado de Salvaguardia",
    alias: "El Carbón Encendido",
    impacto: "Considéras que el rencor persistente contra quienes vulneraron tu infancia o finanzas funciona como una coraza protectora imprescindible para que el agresor no vuelva a herirte, eternizando el sufrimiento.",
    neuro: "A nivel biológico, el resentimiento crónico perpetúa la estimulación del eje hipotalámico-hipofisario-adrenal, desgastando tu sistema inmunitario y acelerando el envejecimiento cerebral.",
    lenguaje: ["Quien me la hace, me la paga", "El perdón es debilidad de carácter", "No olvido ni perdonaré"],
    conducta: ["Mencionar de forma recurrente ofensas pasadas", "Desear en secreto catástrofes ajenas", "Cortar vínculos afectivos de forma gélida"],
    verdad: "El perdón que otorgas es la llave gloriosa para desatar tus propias cadenas. Dejas la venganza en el altar soberano de Dios y caminas en total soltura.",
    versiculos: [
      { ref: "Colosenses 3:13", txt: "Soportándoos unos a otros, y perdonándoos unos a otros... de la manera que Cristo os perdonó, así también hacedlo vosotros." },
      { ref: "Efesios 4:32", txt: "Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo." }
    ],
    espiritu: "El Espíritu Santo derrama un bálsamo de perdón compasivo y milagroso, desmantelando los nudos del rencor en tu corazón y dándote la libertad real.",
    declaracion: "Hoy decido perdonar y soltar de mi juicio terrenal a todos mis ofensores. Entrego mi cuenta pendiente al altar celestial. Soy libre de las garras del rencor y camino en liviandad de espíritu.",
    afirmacionTest: "Conservo enojos del ayer latentes y creo que si perdono del todo a quien me hirió, le estaré quitando importancia al daño imperdonable que perpetró.",
    scoreMax: 10
  },

  // 6. Cuerpo y Salud (26-30)
  {
    id: 26,
    bloque: "Cuerpo y Salud",
    bloqueId: "cuerpo-salud",
    creencia: "Desconexión Somática / Máquina de Carne",
    alias: "La Máquina Silenciosa",
    impacto: "Ves tu organismo únicamente como una herramienta inerte enfocada a producir dinero o metas intelectuales, silenciando con pastillas el dolor o el sueño crónico hasta colapsar biológicamente.",
    neuro: "Disminución profunda de la conectividad en la ínsula posterior, inhabilitando la introcepción básica (la capacidad para procesar señales viscerales de cansancio, hambre o estrés).",
    lenguaje: ["Mi cuerpo aguanta todo", "No hay tiempo para enfermarse", "Una pastilla más y sigo"],
    conducta: ["Consumo excesivo de cafeína/estimulantes", "Pocas horas de sueño recurrente", "Ignorar dolores articulares graves"],
    verdad: "Tu integridad física no es un residuo material carente de valor. Es el santuario sagrado comprado por Dios donde mora el Espíritu.",
    versiculos: [
      { ref: "1 Corintios 6:19-20", txt: "¿O ignoráis que vuestro cuerpo es templo del Espíritu Santo, el cual está en vosotros, el cual tenéis de Dios, y que no sois vuestros? Porque habéis sido comprados por precio." },
      { ref: "Romanos 12:1", txt: "Que presentéis vuestros cuerpos en sacrificio vivo, santo, agradable a Dios, que es vuestro culto racional." }
    ],
    espiritu: "El Espíritu de vida te enseña a escuchar con compasión y sabiduría las alarmas protectoras físicas de tu cuerpo, honrando el diseño milagroso de la creación.",
    declaracion: "Honro y bendigo mi cuerpo como herencia santa del Padre Celestial. Le doy descanso reparador, alimento con cordura su diseño y me detengo con reverencia antes de forzar su límite natural.",
    afirmacionTest: "Ignoro de forma sistemática el cansancio físico severo o mis migrañas hasta que mi propio organismo me obliga a parar mediante un colapso de salud.",
    scoreMax: 10
  },
  {
    id: 27,
    bloque: "Cuerpo y Salud",
    bloqueId: "cuerpo-salud",
    creencia: "Castigo Corporal / Vergüenza Orgánica",
    alias: "El Espejo Roto",
    impacto: "Un auto-odio somático: asumes que los rasgos físicos heredados, tu peso u otra imperfección del aspecto de tu cuerpo son una anomalía de la que debes avergonzarte crónicamente ante los ojos ajenos.",
    neuro: "El córtex prefrontal medial asocia el reflejo en el espejo con una activación persistente del circuito de aversión sensorial, generando picos constantes de cortisol y baja autoestima general.",
    lenguaje: ["Odio mi reflejo", "Estaría bien si no tuviese este físico", "Qué injusticia nacer con este cuerpo"],
    conducta: ["Evitar mirarse al espejo", "Crítica severa a la propia imagen corporal", "Ropa sobredimensionada para esconderse"],
    verdad: "Tú has sido tallado de manera formidable y milagrosa por el Altísimo, quien no comete errores de proporción ni estética en su diseño santo.",
    versiculos: [
      { ref: "Salmo 139:13-14", txt: "Porque tú formaste mis entrañas; tú me hiciste en el vientre de mi madre. Te alabaré; porque formidables, maravillosas son tus obras; estoy maravillado." },
      { ref: "Efesios 5:29", txt: "Porque nadie aborreció jamás a su propia carne, sino que la sustenta y la cuida, como también Cristo a la iglesia." }
    ],
    espiritu: "El Espíritu Santo aquieta tu autocrítica ruda, dándote unos anteojos de gracia celestial para admirar el diseño que Él creó con amor soberano.",
    declaracion: "Celebro el diseño de mi cuerpo. Soy asombrosa y divinamente tallado según los planos estéticos de mi Creador. Abandono la autodenigración y trato mi templo con honra.",
    afirmacionTest: "Experimento una profunda incomodidad o tristeza al mirar mi reflejo en el espejo, sintiendo desprecio hacia partes o todo mi aspecto físico.",
    scoreMax: 10
  },
  {
    id: 28,
    bloque: "Cuerpo y Salud",
    bloqueId: "cuerpo-salud",
    creencia: "Fatalismo Hereditario Somático",
    alias: "La Sangre de las Sombras",
    impacto: "Consideras que estás condenado biológicamente a heredar, desarrollar y fallecer de los mismos achaques oncológicos, cardiovasculares o degenerativos de tu árbol genealógico inmediato, declarando el declive prematuro.",
    neuro: "La epigenética demuestra que la angustia y el trauma sostenidos alteran la metilación del ADN, activando marcadores inflamatorios precisamente de las familias de estrés de tus ancestros.",
    lenguaje: ["Es mi destino, mi madre murió de eso", "En mi familia todos somos débiles de salud", "A mí también me dará de viejo"],
    conducta: ["Evitar chequeos médicos por terror", "Abandonar hábitos dietéticos sanos bajo futilidad", "Conversar recurrentemente de males hereditarios"],
    verdad: "Cristo ha quebrado toda maldición y asidero hereditario dañino. Tú has sido injertado en el torrente de una nueva herencia real imperecedera.",
    versiculos: [
      { ref: "Mateo 8:17", txt: "Él mismo tomó nuestras enfermedades, y llevó nuestras dolencias." },
      { ref: "Gálatas 3:13", txt: "Cristo nos redimió de la maldición de la ley, hecho por nosotros maldición." }
    ],
    espiritu: "El Espíritu de salud implanta vitalidad restauradora sobre tu sistema celular, renovando constantemente el vigor creador de tu cuerpo.",
    declaracion: "No soy rehén de los fallos orgánicos de mis ancestros terrenales. Mi linaje proviene de Cristo de donde mana la salud. Mis células se renuevan en vida plena.",
    afirmacionTest: "Presumo con resignada amargura que estoy predestinado por mi genética familiar a padecer de las mismas enfermedades crónicas graves de mis padres.",
    scoreMax: 10
  },
  {
    id: 29,
    bloque: "Cuerpo y Salud",
    bloqueId: "cuerpo-salud",
    creencia: "Autocuidado Culpable / Ascetismo Egoísta",
    alias: "El Templo Abandonado",
    impacto: "Un sesgo de desatención de la salud: asumes que gastar recursos monetarios en nutrición de calidad, ocio, descanso o masajes musculares es un despilfarro inmoral que resta valor a las necesidades del entorno.",
    neuro: "Anula el autocuidado biológico activando el circuito de culpa anterior ante la compra de bienes relajantes, manteniendo un estado crónico de estrés que daña tu digestión y tus tejidos corticales.",
    lenguaje: ["Invertir tanto en mí es de egoístas", "Primero está el dinero de los otros", "No necesito cosas caras para estar bien"],
    conducta: ["Adquirir los insumos alimentarios de menor calidad por tacañería", "Posponer consultas médicas preventivas", "No comprar ropa nueva en años"],
    verdad: "La buena administración de tu vida empieza por cuidar amorosamente el santuario físico con el que ejecutas tu llamado en este plano terrenal.",
    versiculos: [
      { ref: "3 Juan 1:2", txt: "Amado, yo deseo que tú seas prosperado en todas las cosas, y que tengas salud, así como prospera tu alma." },
      { ref: "Mateo 22:39", txt: "Amarás a tu prójimo como a ti mismo." }
    ],
    espiritu: "El Espíritu Santo te inspira a abrazar el amor equilibrado, rompiendo la culpa ascética que desgasta tu biología.",
    declaracion: "Destruyo la culpa al invertir en mi bienestar físico. Cuidar mi salud, mi descanso y mi alimentación es un acto de amor y administración sabia de mí mismo que honra a mi Creador.",
    afirmacionTest: "Siento una molesta culpa o reparos económicos que me impiden ir a médicos privados, masajes o adquirir comida de alta calidad para mi propio bienestar.",
    scoreMax: 10
  },
  {
    id: 30,
    bloque: "Cuerpo y Salud",
    bloqueId: "cuerpo-salud",
    creencia: "Ansiedad Hipocondríaca",
    alias: "El Grito en el Espejo",
    impacto: "Interpretas un espasmo gástrico casual, un mareo menor o un lunar común como el heraldo definitivo de un tumor maligno catastrófico, sometiendo tu vida a exámenes médicos infinitos.",
    neuro: "Un bucle de hiperatención selectiva. La ínsula anterior magnifica los impulsos biológicos inofensivos de fondo del cuerpo, gatillando el lóbulo de pánico para buscar confirmación catastrófica en el entorno.",
    lenguaje: ["Creo que esto que siento en el pecho es grave", "Los doctores no encuentran mi mal verdadero", "Siento que me da un infarto"],
    conducta: ["Búsqueda sistemática de síntomas en internet", "Visitas constantes a urgencias", "Chequeo obsesivo del pulso cordial"],
    verdad: "Dios tiene la potestad de tu vida sostenida con amor. Puedes habitar en paz corporal absoluta libre de las garras del espanto de la plaga o de la muerte prematura.",
    versiculos: [
      { ref: "Salmo 91:5-6", txt: "No temerás el terror nocturno, ni saeta que vuele de día, ni pestilencia que ande en oscuridad, ni mortandad que en medio del día destruya." },
      { ref: "Filipenses 4:6", txt: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias." }
    ],
    espiritu: "El Espíritu Santo te ancla en un reposo somático pleno, silenciando el radar interno y susurrándole calma divina a tus latidos y respiración.",
    declaracion: "Desactivo el terror a las enfermedades mortales. El aliento santo sostiene mi vida de pie. Mi Padre Celestial resguarda mi salud diaria y habito en paz confiado en su custodia.",
    afirmacionTest: "Cualquier señal inusual de mi cuerpo (un lunar, un dolor estomacal leve) despierta en mí la sospecha angustiante de que padezco una enfermedad terminal.",
    scoreMax: 10
  },

  // 7. Espiritualidad y Trascendencia (31-34)
  {
    id: 31,
    bloque: "Espiritualidad y Trascendencia",
    bloqueId: "espiritualidad-trascendencia",
    creencia: "Dios Castigador / Vigilancia Iracunda",
    alias: "El Ojo del Trueno",
    impacto: "Vives con el terror sordo de que un desliz ético menor en tu mente removerá toda protección de un Dios fiscalizador, atribuyendo tus accidentes diarios a su ira personal.",
    neuro: "El lóbulo límbico asocia la espiritualidad con la detección de depredadores, lo que inhibe de forma persistente la secreción de oxitocina cerebral, impidiendo el amor místico.",
    lenguaje: ["Pequé, por eso me robaron el carro hoy", "Dios se cansará de mí", "Sé que Él me está castigando con esta crisis"],
    conducta: ["Expiación mental coercitiva", "Fobia ante los sermones", "Sentirse indigno de orar tras fallar"],
    verdad: "La ira justa sobre tus pecados reales fue saciada de forma absoluta sobre la cruz. Su favor hoy es eterno e inmutable.",
    versiculos: [
      { ref: "Romanos 5:9", txt: "Pues mucho más, estando ya justificados en su sangre, por él seremos salvos de la ira." },
      { ref: "Romanos 8:31", txt: "Si Dios es por nosotros, ¿quién contra nosotros?" }
    ],
    espiritu: "El Espíritu Santo te convence de reconciliación pacífica celestial plena con Cristo, sanando tu imagen distorsionada de un Padre punitivo.",
    declaracion: "Rompo la mentira de un Dios fiscalizador y hostil. Abrazo la gracia del Padre de Misericordias. Sé que mi deuda fue saldada, soy santo y Él me abraza con tierna alegría celestial.",
    afirmacionTest: "Suelo relacionar las contrariedades comunes (descomposturas del coche, pérdidas de llaves) directas con un misterioso castigo de Dios por mis fallas pasadas.",
    scoreMax: 10
  },
  {
    id: 32,
    bloque: "Espiritualidad y Trascendencia",
    bloqueId: "espiritualidad-trascendencia",
    creencia: "Orfandad Espiritual / Abandono de la Gracia",
    alias: "El Huérfano de Luz",
    impacto: "Sientes un vacío espiritual álgido creyendo que las promesas gloriosas de prosperidad y unción son reales para otros creyentes eminentes, pero que a ti Dios te ha dejado a tus propias fuerzas cansadas.",
    neuro: "Disminución de la actividad gamma en el córtex cingulado posterior. Las redes neuronales asocian la invocación de Dios con un 'eco inerte' solitario del circuito de aislamiento existencial.",
    lenguaje: ["Dios no responde a alguien insignificante como yo", "A todos les pasa milagros menos a mí", "Me siento espiritualmente abandonado"],
    conducta: ["Oraciones mecánicas sin convicción", "Abandonar la devoción regular", "Envidia sorda ante testimonios ajenos"],
    verdad: "Tú has sido tatuado en las palmas excelsiores de tu Dios, quien jamás se olvidará ni se alejará de los pasos de tu camino.",
    versiculos: [
      { ref: "Hebreos 13:5", txt: "No te desampararé, ni te dejaré." },
      { ref: "Isaías 49:15-16", txt: "¿Se olvidará la mujer de lo que dio a luz...? Aunque se olviden ellas, yo no me olvidaré de ti. He aquí que en las palmas de las manos te tengo esculpido." }
    ],
    espiritu: "El Espíritu de adopción celestial desaloja los susurros de la soledad, inyectando un gozo palpable de intimidad santa.",
    declaracion: "Suelto la sospecha de orfandad espiritual. Mi Dios me escucha, me consiente, se regocija de mi vida íntima y camina tomado de mi mano paso a paso hoy.",
    afirmacionTest: "Siento que mis oraciones rebotan en un techo de metal frío y que para mí no están disponibles los milagros o el favor tierno de Dios.",
    scoreMax: 10
  },
  {
    id: 33,
    bloque: "Espiritualidad y Trascendencia",
    bloqueId: "espiritualidad-trascendencia",
    creencia: "Salvación Psíquica por Obras Mentales",
    alias: "La Balanza Invisible",
    impacto: "Una paranoia mística intelectual: crees que un error de pensamiento fortuito, una duda sobre el dogma o un mal sentimiento de rabia fugaz te costará de inmediato la salvación, viviendo en constante compulsión religiosa.",
    neuro: "Hiperactividad obsesiva-compulsiva en el circuito cortico-estriado-tálamo-cortical (CETC) que traduce las cogniciones indeseadas en peligros inminentes que exigen una expiación compulsiva.",
    lenguaje: ["¿Habré pecado contra el Espíritu Santo?", "Un mal pensamiento arruinará mi destino", "Debo estar espiritualmente purificado a cada segundo"],
    conducta: ["Confesiones repetitivas por sospecha", "Lectura neurótica de textos sagrados buscando condenaciones", "Ansiedad espiritual crónica"],
    verdad: "La firmeza de tu salvación celestial divina se arraiga en la perfección eterna de la Cruz y de la Palabra firme de Dios, libre de tus fluctuaciones cognitivas.",
    versiculos: [
      { ref: "Juan 10:28-29", txt: "Y yo les doy vida eterna; y no perecerán jamás, ni nadie las arrebatará de mi mano. Mi Padre que me las dio, es mayor que todos." },
      { ref: "Filipenses 1:6", txt: "Estando persuadido de esto, que el que comenzó en vosotros la buena obra, la perfeccionará hasta el día de Jesucristo." }
    ],
    espiritu: "El Espíritu de consolación inunda tu mente cansada con una quietud incombustible, mostrándote que Él es el autor y consumador de tu fe.",
    declaracion: "Mi salvación no tambalea ante mis pensamientos intrusivos. Descanso en la roca inquebrantable de mi Redención. Mi alma está resguardada de forma irrevocable en sus manos sagradas.",
    afirmacionTest: "Me aterroriza incurrir de forma involuntaria en pecados mentales imperdonables y que mi salvación eterna se desmorone a cada minuto.",
    scoreMax: 10
  },
  {
    id: 34,
    bloque: "Espiritualidad y Trascendencia",
    bloqueId: "espiritualidad-trascendencia",
    creencia: "Vacío de Propósito Existencial",
    alias: "El Accidente Cósmico",
    impacto: "Un destierro de sentido: asumes que tu paso por la tierra carece de metas excelsas de herencia eterna, viéndote únicamente como un engranaje cotidiano enfocado a subsistir consumiendo materias.",
    neuro: "Un adormecimiento en la corteza prefrontal anteromedial que inabilita la visualización de un 'yo futuro' significativo, apagando los motores hormonales metabólicos de la trascendencia.",
    lenguaje: ["La vida no tiene mayor sentido", "Solo vivimos para trabajar y morir", "Qué vacío insoportable"],
    conducta: ["Búsqueda de placeres de consumo rápidos", "Cinismo ideológico", "Apatía ante misiones de caridad"],
    verdad: "Tú has sido detallado con un llamado sideral específico para bendecir a tu época, con un diseño insustituible.",
    versiculos: [
      { ref: "Jeremías 29:11", txt: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis." },
      { ref: "Efesios 1:11", txt: "En él asimismo tuvimos herencia, habiendo sido predestinados conforme al propósito del que hace todas las cosas según el designio de su voluntad." }
    ],
    espiritu: "El Espíritu Santo enciende tu corazón con un fuego divino de convicción, te muestra la visión de tu misión santa y guía tus pies hacia tus obras designadas.",
    declaracion: "No soy un residuo casual en esta tierra. Declaro que mi existencia ha sido firmada por el soberano Dios con un propósito eterno. Vivo con dirección, pasión y para gloria celestial.",
    afirmacionTest: "Me asalta un doloroso sentimiento de vacío de que mi existencia terrestre carece de un propósito celestial o misión real importante.",
    scoreMax: 10
  },

  // 8. Tiempo y Futuro (35-38)
  {
    id: 35,
    bloque: "Tiempo y Futuro",
    bloqueId: "tiempo-futuro",
    creencia: "Futuro Trágico / Ansiedad Anticipatoria",
    alias: "El Guionista de Ruinas",
    impacto: "Un secuestro de la esperanza: preparas tus finanzas, tu salud y tus relaciones familiares asumiendo que tu jubilación o el desarrollo de tu país será una caída inevitable hacia la miseria o el abandono.",
    neuro: "Hiperestimulación dinámica de la amígdala derecha que deforma de manera selectiva la simulación de escenarios del córtex prefrontal, creando películas catastróficas mentales involuntarias.",
    lenguaje: ["Esto va a terminar mal", "Mejor me preparo para lo peor", "La desunión es inevitable de viejo"],
    conducta: ["Acaparamiento de insumos inútiles", "Ataques de pánico recurrentes", "Hablar de forma macabra del mañana"],
    verdad: "El mañana pertenece a las manos cariñosas de tu Creador, que promete que tu sendero irá en un constante florecimiento de aumento luminoso.",
    versiculos: [
      { ref: "Proverbios 4:18", txt: "Mas la senda de los justos es como la luz de la aurora, que va en aumento hasta que el día es perfecto." },
      { ref: "Mateo 6:34", txt: "Así que, no os afanéis por el día de mañana, porque el día de mañana traerá su propio afán. Basta a cada día su propio mal." }
    ],
    espiritu: "El Espíritu de Revelación despliega ante tus ojos la esperanza cierta de gloria, inundando tu presente con una alegre expectativa divina.",
    declaracion: "Renuncio al rodaje de finales trágicos en mi mente. Abrazo la confianza hermosa en mi porvenir. Mi futuro es un aumento glorioso de paz, favor y fortaleza espiritual.",
    afirmacionTest: "No disfruto mi estabilidad presente porque dedico horas a redactar mentalmente escenarios trágicos de mi ruina financiera o jubilación desastrosa.",
    scoreMax: 10
  },
  {
    id: 36,
    bloque: "Tiempo y Futuro",
    bloqueId: "tiempo-futuro",
    creencia: "Escasez Temporal / El Reloj Asfixiante",
    alias: "La Arena Veloz",
    impacto: "El síndrome de que el tiempo se agota: consideras que las mejores ventanas de tus proyectos amorosos o profesionales ya concluyeron por tu edad, asumiendo la vida como un declive inevitable.",
    neuro: "Una pérdida de variabilidad de los osciladores neuronales dopaminérgicos que distorsiona la percepción del paso del tiempo como un 'atropello acelerado', gatillando desespero simpático.",
    lenguaje: ["Ya se me pasó el tren", "A mi edad ya no se puede", "Se me acabó el tiempo para triunfar"],
    conducta: ["Crisis de los 30/40/50 severas", "Toma de decisiones imprudentes por supuesta premura", "Desgana ocupacional"],
    verdad: "Dios está por encima de todo orden temporal del hombre. Él posee el majestuoso imperio de rejuvenecer tus años y redimir el tiempo desperdiciado con creces.",
    versiculos: [
      { ref: "Salmo 103:5", txt: "El que sacia de bien tu boca de modo que te rejuvenezcas como el águila." },
      { ref: "Joel 2:25", txt: "Y os restituiré los años que comió la orruga, el saltón, el revoltón y la langosta." }
    ],
    espiritu: "El Espíritu Santo renueva tu juventud, restaurando tu vigor físico e inyectándote un denuedo fresco para conquistar nuevos retos sin importar tus canas.",
    declaracion: "Desecho la asfixia del reloj terrenal. Mi Dios es el soberano del tiempo y resucita mis sueños marchitos, restituyendo con creces cada año arruinado. Mis mejores días asoman hoy.",
    afirmacionTest: "Experimento temor sordo al envejecer creyendo con amargura que ya malgasté mi mejor momento y que es tarde para concretar mi destino.",
    scoreMax: 10
  },
  {
    id: 37,
    bloque: "Tiempo y Futuro",
    bloqueId: "tiempo-futuro",
    creencia: "Paralización de Opciones /FOMO Destructivo",
    alias: "El Laberinto Sin Salida",
    impacto: "Una indecisión lacerante: el terror de que decantarte por una sola especialidad laboral, un solo hogar o un solo proyecto eclesial te despoje de otras alternativas de ensueño, dejándote inmóvil.",
    neuro: "Elevada fricción sináptica medial. La corteza órbito-frontal se sobrecalienta sopesando ganancias ideales especulativas abstractas, suprimiendo la capacidad pragmática de la corteza motora.",
    lenguaje: ["¿Y si el otro camino era mejor?", "No quiero cerrarme puertas", "Es muy difícil decidirse del todo"],
    conducta: ["Flirteos sentimentales sin compromisos reales", "No consolidar un solo negocio propio", "Cambiar de carrera obsesivamente"],
    verdad: "La unción y el fruto glorioso de tu vida maduran bajo el principio del arraigo fecundo sobre un solo suelo sagrado bien cultivado.",
    versiculos: [
      { ref: "Salmo 1:3", txt: "Será como árbol plantado junto a corrientes de aguas, que da su fruto en su tiempo, y su hoja no cae; y todo lo que hace, prosperará." },
      { ref: "Santiago 1:8", txt: "El hombre de doble ánimo es inconstante en todos sus caminos." }
    ],
    espiritu: "El Espíritu de consejo aquieta tu ambición desordenada, guiándote a sumergir con fe tus raíces en el huerto específico donde florecerás.",
    declaracion: "Renuncio al delirio del doble ánimo. Abrazo el valor divino del compromiso. Planto mis raíces con fe divina y sé que Dios coronará con abundancia mi dirección elegida.",
    afirmacionTest: "Me quedo estancado en la inacción relacional o comercial porque me obsesiona pensar que si comprometo mi energía, me perderé de algo mejor.",
    scoreMax: 10
  },
  {
    id: 38,
    bloque: "Tiempo y Futuro",
    bloqueId: "tiempo-futuro",
    creencia: "Nostalgia Cronificada Egipcia",
    alias: "El Ancla de los Recuerdos",
    impacto: "Una fijación de la felicidad en tus años pasados. Crees que tu época de esplendor intelectual, material o espiritual ya expiró irremediablemente, asumiendo tu presente únicamente como un desierto de nostalgia.",
    neuro: "Se asienta sobre una hiperactivación de los centros de memoria episódica en el lóbulo temporal, que revisten los recuerdos anteriores con un sesgo edulcorado inalcanzable, apagando la dopamina de hoy.",
    lenguaje: ["Cualquier tiempo pasado fue mejor", "En mis buenos tiempos...", "Ya no volverá el gozo de antes"],
    conducta: ["Coleccionismo melancólico severo", "Conversaciones autocompasivas recurrentes del ayer", "Apatía ruda ante los inventos del hoy"],
    verdad: "Tu Creador prepara para ti senderos de gloria venideros que superarán con creces a tus victorias pasadas más brillantes.",
    versiculos: [
      { ref: "Eclesiastés 7:10", txt: "Nunca digas: ¿Cuál es la causa de que los tiempos pasados fueron mejores que estos? Porque nunca de esto preguntarás con sabiduría." },
      { ref: "Hageo 2:9", txt: "La gloria postrera de esta casa será mayor que la primera... y daré paz en este lugar, dice Jehová de los ejércitos." }
    ],
    espiritu: "El Espíritu Santo desclava tus pies de las arenas del ayer, despertando un entusiasmo fresco por experimentar la novedad amorosa de tu día presente.",
    declaracion: "Desato mis pensamientos de la melancolía del ayer. Agradezco mis victorias pasadas y confieso con fe que el esplendor venidero sobre mi hogar superará toda vieja gloria. Avanzo.",
    afirmacionTest: "Suelo habitar en un suspiro melancólico crónico creyendo que mis mejores momentos de felicidad afectiva o vital ya quedaron sepultados en el pasado.",
    scoreMax: 10
  },

  // 9. Género e Identidad Social (39-42)
  {
    id: 39,
    bloque: "Género e Identidad Social",
    bloqueId: "genero-identidad-social",
    creencia: "Condena de Origen Familiar / Destino de Ruinas",
    alias: "El Estigma de las Raíces",
    impacto: "Asumes que nacer en el nido de un hogar sumido en divorcios hostiles, infidelidades crónicas o violencia te condiciona mecánicamente a replicar exactamente la misma destrucción en tus propios lazos.",
    neuro: "Se asocia a un condicionamiento límbico temprano de miedo relacional. El cerebro imita los patrones parentales defensivos para autoprepararse ante la violencia social sorda, inhabilitando la confianza.",
    lenguaje: ["Vengo de un hogar roto, es mi sino", "Los de mi familia no sabemos amar", "Llevo el divorcio en la sangre"],
    conducta: ["Sabotear el noviazgo ante compromiso", "Tolerar abusos en el matrimonio civil", "Miedo agudo a procrear hijos"],
    verdad: "La Cruz celestial ha desmembrado todo encadenamiento generacional oscuro, inaugurando para ti un linaje divino sano.",
    versiculos: [
      { ref: "2 Corintios 5:17", txt: "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas." },
      { ref: "Ezequiel 18:2-3", txt: "¿Qué pensáis vosotros... diciendo: Los padres comieron las uvas agrias, y los dientes de los hijos tienen la dentera? Vivo yo, dice Jehová el Señor, que nunca más tendréis por qué usar este refrán." }
    ],
    espiritu: "El Espíritu te consagra como el primer eslabón glorioso de una generación de paz, modelando en ti un matrimonio santo y rebosante de bendición.",
    declaracion: "Decreto roto todo estigma y maldición de mi hogar de origen. Yo soy una nueva criatura en Cristo Jesús. Mi hogar, mi descendencia y mi conyugalidad florecerán en amor divino pleno.",
    afirmacionTest: "Creo que el divorcio, la traición sentimental o la debilidad emocional de mis raíces familiares son un destino inevitable que repetiré tarde o temprano.",
    scoreMax: 10
  },
  {
    id: 40,
    bloque: "Género e Identidad Social",
    bloqueId: "genero-identidad-social",
    creencia: "Marginación Cultural o Etnicidad",
    alias: "El Estigma de la Sangre",
    impacto: "Un sesgo de autorestricción social: crees que tu nacionalidad de inmigración, tu color de piel o tus raíces obreras son un impedimento definitivo para ser tratado con alta dignidad y respeto en altas esferas.",
    neuro: "Un estado permanente de rechazo capturado en el área del dolor social, manteniendo picos de hormonas de estrés y autodesprecio cada vez que te relacionas en ambientes de prestigio.",
    lenguaje: ["Los extranjeros siempre la tenemos más difícil", "Por mi acento me descalifican", "Las esferas altas no son para gente como yo"],
    conducta: ["Evitar puestos de jerarquía", "Sumisión excesiva ante ciertas nacionalidades", "Vergüenza de las raíces de cuna"],
    verdad: "Para el cielo no hay distinciones geográficas ni alcurnias de sangre terrenal. Tú eres de la realeza celestial ungido con gracia soberana.",
    versiculos: [
      { ref: "Gálatas 3:28", txt: "Ya no hay judío ni griego; no hay esclavo ni libre; no hay varón ni mujer; porque todos vosotros sois uno en Cristo Jesús." },
      { ref: "1 Pedro 2:9", txt: "Mas vosotros sois linaje escogido, real sacerdocio, nación santa, pueblo adquirido por Dios, para que anunciéis las virtudes de aquel que os llamó." }
    ],
    espiritu: "El Espíritu Santo derrama sobre ti una unción de distinción dulce y elegancia sobrenatural, abriéndote puertas de respeto ante hombres notables.",
    declaracion: "Bajo la unción del Reino del Amado, no hay pasaporte terrenal ni procedencia social que limite mi avance. Soy un embajador celestial majestuoso facultado para bendecir esferas de honor.",
    afirmacionTest: "Temo postularme a puestos de liderazgo o ingresar a ciertos círculos porque asumo que por mi origen nacional, color o acento seré rechazado.",
    scoreMax: 10
  },
  {
    id: 41,
    bloque: "Género e Identidad Social",
    bloqueId: "genero-identidad-social",
    creencia: "Limitación o Exclusión por Género",
    alias: "El Silencio Obligado",
    impacto: "Consideras que las pautas machistas o estereotipos rústicos de tu sociedad impiden de forma hermética el progreso de tu carrera, adoptando un cinismo defensivo o una resignación amarga.",
    neuro: "El lóbulo cingulado perpetúa respuestas defensivas de resentimiento sistémico, interpretando las interacciones profesionales neutras bajo el tamiz del desprecio al sexo opuesto.",
    lenguaje: ["Siendo mujer no respetarán mi opinión aquí", "Los hombres siempre tienen las de ganar", "Mi sexo me limita tener voz real"],
    conducta: ["Resignación ante brechas salariales sin negociar", "Comportarse con ruda masculinidad fingida en el mando", "Evitar roles ministeriales directivos"],
    verdad: "Tanto el varón como la mujer han sido consagrados como coherederos conjuntos de la gloriosa unción real divina y del gobierno sobre la tierra.",
    versiculos: [
      { ref: "Gálatas 3:28", txt: "Ya no hay varón ni mujer; porque todos vosotros sois uno en Cristo Jesús." },
      { ref: "1 Pedro 3:7", txt: "Dando honor... como a coherederas de la gracia de la vida, para que vuestras oraciones no tengan estorbo." }
    ],
    espiritu: "El Espíritu Santo te infunde de un manto de autoridad legítima inderrotable, dándote voz sabia y ungida que desmantela cualquier prejuicio del siglo.",
    declaracion: "Camino con la dignidad gloriosa de un hijo coheredero de la gracia de la vida entera. Mi género no restringe las llaves del ministerio ni las puertas del favor que Dios me abrió.",
    afirmacionTest: "Pienso con amargo resentimiento que las barreras machistas de mi entorno hacen del todo imposible que yo sea respetada, valorada o bien remunerada.",
    scoreMax: 10
  },
  {
    id: 42,
    bloque: "Género e Identidad Social",
    bloqueId: "genero-identidad-social",
    creencia: "El Estigma del Error Pasado",
    alias: "La Mancha Inmortal",
    impacto: "Un diagnóstico de inhabilitación: estimas que un trauma sexual del ayer, un fracaso matrimonial pretérito o un error moral destruyó irreversiblemente tu reputación y tu comunión divina para siempre.",
    neuro: "Un lazo destructivo entre las redes de memoria emotiva de la amígdala con el área somatosensorial cruda del autoconcepto, percibiendo un yo íntimo sucio o roto con imposibilidad de limpieza.",
    lenguaje: ["Después de lo que hice, Dios no me ungirá", "Eso arruinó mi reputación de por vida", "Llevo esa mancha secreta"],
    conducta: ["Excluirse voluntariamente de ministerios de caridad", "Ocultar el historial de divorcio con pánico", "No comprometerse con nuevas propuestas limpias"],
    verdad: "La sangre santa de Cristo Jesús limpia tu historial por completo, removiendo tu pecado al fondo de la fosa más profunda, declarando tu pureza celestial hoy.",
    versiculos: [
      { ref: "Miqueas 7:19", txt: "Él volverá a tener misericordia de nosotros; sepultará nuestras iniquidades, y echará en lo profundo del mar todos nuestros pecados." },
      { ref: "1 Juan 1:9", txt: "Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad." }
    ],
    espiritu: "El Espíritu Santo te unge con un aceite fresco de restauración magnífica, sellándote con vestiduras hermosas de pureza intachable para gloria de Dios.",
    declaracion: "Declaro roto el estigma de mis viejas caídas. Mi pasado está sumergido bajo el manto de perdón absoluto de Cristo. Camino con mi rostro en alto libre de vergüenza.",
    afirmacionTest: "Asumo en secreto que mis viejos fallos morales o traumas del ayer me han inhabilitado para ser una persona respetable o merecedora de la bendición hoy.",
    scoreMax: 10
  }
];
