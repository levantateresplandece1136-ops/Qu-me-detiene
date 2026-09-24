/**
 * PROMPT 7: MATRIZ DE DISCERNIMIENTO PASTORAL
 * 
 * Separa nítidamente las 8 dimensiones para evitar moralizar dificultades
 * o llamar pecado a lo que es sufrimiento, debilidad o falta de habilidades.
 * 
 * 1. CIRCUNSTANCIAS
 * 2. SUFRIMIENTO
 * 3. DEBILIDAD
 * 4. TENTACIÓN
 * 5. PECADO
 * 6. PATRONES APRENDIDOS
 * 7. FALTA DE HABILIDADES
 * 8. RESPONSABILIDAD PERSONAL
 */

export interface PastoralDimensionItem {
  categoria: 
    | 'CIRCUNSTANCIAS' 
    | 'SUFRIMIENTO' 
    | 'DEBILIDAD' 
    | 'TENTACIÓN' 
    | 'PECADO' 
    | 'PATRONES APRENDIDOS' 
    | 'FALTA DE HABILIDADES' 
    | 'RESPONSABILIDAD PERSONAL';
  titulo: string;
  descripcion: string;
  posturaPastoral: string; // Consuelo, Paciencia, Enseñanza, Arrepentimiento, etc.
  icono: string;
  color: string;
  ejemploConcreto: string;
}

export interface DiscernmentAnalysis {
  bloquePrincipal: string;
  principioTeologico: string;
  items: PastoralDimensionItem[];
}

export const PASTORAL_DIMENSIONS_CONFIG: Record<string, {
  color: string;
  badgeBg: string;
  posturaRecomendada: string;
  icono: string;
}> = {
  'CIRCUNSTANCIAS': {
    color: 'text-sky-300',
    badgeBg: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
    posturaRecomendada: 'Reconocimiento realista y discernimiento de límites providenciales',
    icono: '🌐'
  },
  'SUFRIMIENTO': {
    color: 'text-rose-300',
    badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    posturaRecomendada: 'Consuelo, compasión, contención y lamento guiado (NO reprensión)',
    icono: '❤️🩹'
  },
  'DEBILIDAD': {
    color: 'text-amber-300',
    badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    posturaRecomendada: 'Aceptación de la finitud creatural, reposo y dependencia de la gracia',
    icono: '🌱'
  },
  'TENTACIÓN': {
    color: 'text-purple-300',
    badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    posturaRecomendada: 'Vigilancia espiritual, armadura de Dios y huida oportuna (NO es pecado en sí)',
    icono: '⚔️'
  },
  'PECADO': {
    color: 'text-red-400',
    badgeBg: 'bg-red-500/15 border-red-500/30 text-red-400',
    posturaRecomendada: 'Confesión sincera, arrepentimiento ante la Cruz y apropiación del perdón',
    icono: '✝️'
  },
  'PATRONES APRENDIDOS': {
    color: 'text-orange-300',
    badgeBg: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
    posturaRecomendada: 'Desaprendizaje paciente, renovación de la mente y nuevos hábitos guiados',
    icono: '🔄'
  },
  'FALTA DE HABILIDADES': {
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    posturaRecomendada: 'Entrenamiento práctico, mentoría, herramientas de organización y límites',
    icono: '🛠️'
  },
  'RESPONSABILIDAD PERSONAL': {
    color: 'text-[#C9A84C]',
    badgeBg: 'bg-[#C9A84C]/15 border-[#C9A84C]/30 text-[#C9A84C]',
    posturaRecomendada: 'Mayordomía voluntaria, pasos concretos de fe y obediencia gozosa',
    icono: '👑'
  }
};

/**
 * Genera el análisis de discernimiento pastoral según el bloque dominante
 */
export function generatePastoralDiscernment(blockId: string, score: number = 4): DiscernmentAnalysis {
  switch (blockId) {
    case 'control-entorno':
      return {
        bloquePrincipal: 'Control y Entorno',
        principioTeologico: 'La necesidad de control no es pecado automático: puede nacer de circunstancias difíciles, falta de destrezas para delegar o miedo reactivo. Debemos investigar antes de juzgar.',
        items: [
          {
            categoria: 'CIRCUNSTANCIAS',
            titulo: 'Cargas reales y entornos impredecibles',
            descripcion: 'Situaciones objetivas donde hay alta volatilidad, proyectos complejos o personas que no han cumplido compromisos en el pasado.',
            posturaPastoral: 'Validar la complejidad del contexto real sin exigir calma ingenua.',
            icono: '🌐',
            color: 'text-sky-300',
            ejemploConcreto: 'Un trabajo con plazos imposibles o liderar un equipo en transición.'
          },
          {
            categoria: 'SUFRIMIENTO',
            titulo: 'Heridas por traición o desamparo previo',
            descripcion: 'El dolor no resuelto de haber confiado en personas que fallaron, dejando a la persona sola con el desastre.',
            posturaPastoral: 'Ofrecer consuelo por las heridas pasadas; no acusar de desconfianza sin escuchar el dolor.',
            icono: '❤️🩹',
            color: 'text-rose-300',
            ejemploConcreto: '«En mi casa si yo no lo hacía, nadie lo hacía y todo se destruía».'
          },
          {
            categoria: 'DEBILIDAD',
            titulo: 'Finitud humana y fatiga cognitiva',
            descripcion: 'El cansancio natural del sistema nervioso que intenta procesar demasiadas variables a la vez.',
            posturaPastoral: 'Fomentar el descanso físico y la aceptación de los límites de energía.',
            icono: '🌱',
            color: 'text-amber-300',
            ejemploConcreto: 'Cansancio corporal acumulado que amplifica la ansiedad y la irritabilidad.'
          },
          {
            categoria: 'TENTACIÓN',
            titulo: 'Impulso a tomar el trono de las circunstancias',
            descripcion: 'La atracción recurrente de manipular personas, fiscalizar o forzar resultados para aliviar la angustia interna.',
            posturaPastoral: 'Identificar la tentación antes de que se consume en autoritarismo o manipulación.',
            icono: '⚔️',
            color: 'text-purple-300',
            ejemploConcreto: 'La voz interior que dice: «Nadie más puede; si sueltas, todo fracasará».'
          },
          {
            categoria: 'PECADO',
            titulo: 'Idolatría de la seguridad propia y desconfianza en Dios',
            descripcion: 'Cuando la persona decide deliberadamente actuar como soberana, desobedeciendo mandatos de gracia, amargándose con Dios o dominando a otros.',
            posturaPastoral: 'Conducir con amor a la confesión de auto-suficiencia y arrepentimiento.',
            icono: '✝️',
            color: 'text-red-400',
            ejemploConcreto: 'Exigir perfección a los demás con ira, juzgándolos como incompetentes.'
          },
          {
            categoria: 'PATRONES APRENDIDOS',
            titulo: 'Mecanismos de supervivencia familiares',
            descripcion: 'Costumbres asimiladas por imitación de figuras parentales que gestionaban la ansiedad controlando.',
            posturaPastoral: 'Ayudar a desaprender la inercia sin condenar los orígenes de crianza.',
            icono: '🔄',
            color: 'text-orange-300',
            ejemploConcreto: 'Revisar 5 veces los detalles por reflejo involuntario heredado.'
          },
          {
            categoria: 'FALTA DE HABILIDADES',
            titulo: 'Déficit de herramientas de delegación y gestión',
            descripcion: 'No saber cómo comunicar expectativas claras, cómo dar seguimiento estructurado o cómo negociar plazos.',
            posturaPastoral: 'Enseñar habilidades prácticas de administración y comunicación asertiva.',
            icono: '🛠️',
            color: 'text-emerald-300',
            ejemploConcreto: 'Hacerlo uno mismo porque nunca le enseñaron una metodología de delegación.'
          },
          {
            categoria: 'RESPONSABILIDAD PERSONAL',
            titulo: 'Elección voluntaria de rendición y fe',
            descripcion: 'La decisión de practicar la obediencia diaria, orar en lugar de manipular y soltar los resultados a Dios.',
            posturaPastoral: 'Animar a dar pasos concretos de entrega de control en el poder del Espíritu.',
            icono: '👑',
            color: 'text-[#C9A84C]',
            ejemploConcreto: 'Delegar una tarea hoy y abstenerse de enviar mensajes de supervisión innecesarios.'
          }
        ]
      };

    case 'tiempo-urgencia':
      return {
        bloquePrincipal: 'Tiempo y Urgencia',
        principioTeologico: 'Manejar mal el tiempo no es automáticamente pecado. Puede requerir herramientas de planificación o atender a un estado de agotamiento antes de exigir disciplina espiritual.',
        items: [
          {
            categoria: 'CIRCUNSTANCIAS',
            titulo: 'Demandas objetivas desproporcionadas',
            descripcion: 'Cargas laborales o familiares reales donde el tiempo matemático no alcanza para todo lo requerido.',
            posturaPastoral: 'Discernir la sobrecarga objetiva y ayudar a recortar compromisos insostenibles.',
            icono: '🌐',
            color: 'text-sky-300',
            ejemploConcreto: 'Cuidar de un familiar enfermo mientras se trabaja tiempo completo.'
          },
          {
            categoria: 'SUFRIMIENTO',
            titulo: 'Angustia por expectativas asfixiantes',
            descripcion: 'El sufrimiento emocional de vivir bajo el peso de nunca llegar a tiempo ni satisfacer a los demás.',
            posturaPastoral: 'Contener el dolor del desasosiego; orar por descanso interior.',
            icono: '❤️🩹',
            color: 'text-rose-300',
            ejemploConcreto: 'La tristeza sorda de sentir que los días pasan sin gozo ni paz.'
          },
          {
            categoria: 'DEBILIDAD',
            titulo: 'Ritmo biológico finito y necesidad de sueño',
            descripcion: 'Límites fisiológicos dados por el Creador que no pueden violarse sin cosechar desbalance.',
            posturaPastoral: 'Tratar el descanso como un acto de reverencia a Dios y aceptación de la criatura.',
            icono: '🌱',
            color: 'text-amber-300',
            ejemploConcreto: 'Dificultad para concentrarse debido a privación crónica de sueño.'
          },
          {
            categoria: 'TENTACIÓN',
            titulo: 'Evadir la confrontación mediante postergación',
            descripcion: 'La seducción de posponer lo importante para no sentir el temor al error o al juicio ajeno.',
            posturaPastoral: 'Desvelar la trampa de la procrastinación como evasión emocional.',
            icono: '⚔️',
            color: 'text-purple-300',
            ejemploConcreto: 'Distraerse en tareas secundarias para no escribir el informe crucial.'
          },
          {
            categoria: 'PECADO',
            titulo: 'Negligencia culpable o idolatría de la comodidad',
            descripcion: 'Cuando la postergación rompe pactos voluntariamente o daña al prójimo por falta deliberada de cuidado.',
            posturaPastoral: 'Llamar al arrepentimiento de la pereza y el quebrantamiento de promesas.',
            icono: '✝️',
            color: 'text-red-400',
            ejemploConcreto: 'Prometer entregar a tiempo sabiendo con desinterés que no se cumplirá.'
          },
          {
            categoria: 'PATRONES APRENDIDOS',
            titulo: 'Urgencia como adrenalina habitual',
            descripcion: 'Haber crecido en ambientes donde solo se reaccionaba ante la emergencia de última hora.',
            posturaPastoral: 'Enseñar el valor de la constancia serena frente a la cultura de la crisis.',
            icono: '🔄',
            color: 'text-orange-300',
            ejemploConcreto: 'Necesitar el estrés del último minuto para sentirse motivado/a.'
          },
          {
            categoria: 'FALTA DE HABILIDADES',
            titulo: 'Falta de formación en priorización y bloques de tiempo',
            descripcion: 'No conocer métodos sencillos de agenda, estimación realista o cómo decir un «no» cortés.',
            posturaPastoral: 'Proporcionar mentoría técnica en gestión del tiempo y límites saludables.',
            icono: '🛠️',
            color: 'text-emerald-300',
            ejemploConcreto: 'Agendar 8 reuniones consecutivas sin 5 minutos de amortiguador.'
          },
          {
            categoria: 'RESPONSABILIDAD PERSONAL',
            titulo: 'Mayordomía intencional de las horas dadas por Dios',
            descripcion: 'Tomar la decisión activa de ordenar la agenda bajo la soberanía de Dios y Su reino.',
            posturaPastoral: 'Guiar en la planificación semanal a la luz del Salmo 90:12.',
            icono: '👑',
            color: 'text-[#C9A84C]',
            ejemploConcreto: 'Fijar 30 minutos de devoción y un bloque de trabajo protegido sin distracciones.'
          }
        ]
      };

    default: // Genérico robusto para cualquier otro bloque
      return {
        bloquePrincipal: 'Área de Evaluación',
        principioTeologico: 'Separar el dolor, las limitaciones y las destrezas prácticas de las cuestiones morales del corazón es indispensable para una consejería llena de gracia y verdad.',
        items: [
          {
            categoria: 'CIRCUNSTANCIAS',
            titulo: 'Realidades y presiones objetivas',
            descripcion: 'Entornos, eventos fortuitos y dinámicas ajenas que la persona no escogió.',
            posturaPastoral: 'Examinar los hechos sin juzgar prematuramente las reacciones iniciales.',
            icono: '🌐',
            color: 'text-sky-300',
            ejemploConcreto: 'Crisis imprevistas o ambientes de alta presión externa.'
          },
          {
            categoria: 'SUFRIMIENTO',
            titulo: 'Dolor y quebranto emocional',
            descripcion: 'El impacto de heridas pasadas, rechazo o pérdidas no elaboradas.',
            posturaPastoral: 'Acompañar con compasión; consolar como Cristo consuela a los afligidos.',
            icono: '❤️🩹',
            color: 'text-rose-300',
            ejemploConcreto: 'El peso de palabras descalificadoras recibidas en la historia personal.'
          },
          {
            categoria: 'DEBILIDAD',
            titulo: 'Finitud y límites naturales',
            descripcion: 'Capacidad humana limitada en sabiduría, resistencia y fuerzas biológicas.',
            posturaPastoral: 'Recordar que Dios conoce nuestra condición y se acuerda de que somos polvo.',
            icono: '🌱',
            color: 'text-amber-300',
            ejemploConcreto: 'No poder abarcar todo ni tener respuesta a cada dilema.'
          },
          {
            categoria: 'TENTACIÓN',
            titulo: 'Presión interna/externa hacia la incredulidad',
            descripcion: 'El asedio del enemigo o de la carne para buscar salidas autónomas lejos de Dios.',
            posturaPastoral: 'Armar de discernimiento para no confundir la tentación con el pecado consumado.',
            icono: '⚔️',
            color: 'text-purple-300',
            ejemploConcreto: 'El pensamiento insistente de que Dios no cuidará de nosotros.'
          },
          {
            categoria: 'PECADO',
            titulo: 'Autonomía voluntaria y rebelión de corazón',
            descripcion: 'Respuestas de amargura, juicio hacia otros o búsqueda de gloria propia.',
            posturaPastoral: 'Invitar a confesar y recibir el perdón transformador de la Cruz.',
            icono: '✝️',
            color: 'text-red-400',
            ejemploConcreto: 'Endurecer el corazón y negarse a perdonar o confiar.'
          },
          {
            categoria: 'PATRONES APRENDIDOS',
            titulo: 'Hábitos automáticos de respuesta',
            descripcion: 'Reacciones reflejas grabadas por años de costumbre mental y social.',
            posturaPastoral: 'Guiar en la renovación de la mente a través de la Palabra de Dios.',
            icono: '🔄',
            color: 'text-orange-300',
            ejemploConcreto: 'Reaccionar con defensiva inmediata ante cualquier sugerencia.'
          },
          {
            categoria: 'FALTA DE HABILIDADES',
            titulo: 'Herramientas prácticas ausentes',
            descripcion: 'Brechas de formación práctica en comunicación, límites, resolución o planificación.',
            posturaPastoral: 'Proveer entrenamiento y recursos formativos claros.',
            icono: '🛠️',
            color: 'text-emerald-300',
            ejemploConcreto: 'No saber cómo entablar una conversación difícil sin atacar.'
          },
          {
            categoria: 'RESPONSABILIDAD PERSONAL',
            titulo: 'Respuesta de fe y obediencia ante Dios',
            descripcion: 'El espacio de mayordomía donde la persona decide someter su voluntad al Señor.',
            posturaPastoral: 'Empoderar en la gracia para caminar en obras dignas del Evangelio.',
            icono: '👑',
            color: 'text-[#C9A84C]',
            ejemploConcreto: 'Elegir hoy la mansedumbre y la oración en vez del repliegue.'
          }
        ]
      };
  }
}
