import { CreenciaRecord } from "../data/creencias";
import { practicalStepsByBlock } from "../data/practicalSteps";
import { detectBlockInteractions, DetectedInteraction } from "../data/blockDefinitions";
import { ConfidenceLevel, ConfidenceEvaluation, evaluateHypothesisConfidence } from "./confidenceScorer";

export interface UserResult extends CreenciaRecord {
  category: string;
  intensity: number;
  screeningScore?: number;
  score?: number;
}

export interface HypothesisItem {
  id: string;
  titulo: string;
  descripcion: string;
  confianza?: ConfidenceLevel;
  confianzaDetalle?: ConfidenceEvaluation;
}

export interface HeartMapNode {
  step: 'circunstancia' | 'interpretacion' | 'deseo' | 'temor' | 'estrategiaControl' | 'respuesta' | 'fruto';
  label: string;
  sublabel: string;
  categoryType: 'sabemos' | 'explorar';
  contenido: string;
  justificacion: string;
}

export interface HeartAnalysisMap {
  circunstancia: HeartMapNode;
  interpretacion: HeartMapNode;
  deseo: HeartMapNode;
  temor: HeartMapNode;
  estrategiaControl: HeartMapNode;
  respuesta: HeartMapNode;
  fruto: HeartMapNode;
}

export interface ExploratoryDiagnosis {
  dato: {
    bloque: string;
    score: number;
    descripcion: string;
  };
  patron: {
    titulo: string;
    observacion: string;
  };
  hipotesis: HypothesisItem[];
  preguntasPorExplorar: string[];
  validacion: {
    mensaje: string;
    opciones: string[];
  };
  direccionDeAyuda: {
    enfoque: string;
    pasoInmediato: string;
    acompanamientoRecomendado: string;
  };
}

export interface DayPlan {
  dia: number;
  enfoque: string;
  versiculo: {
    texto: string;
    referencia: string;
  };
  accion: string;
  reflexion: string;
  oracion: string;
}

export interface WeekPlan {
  objetivo: string;
  reflexion?: string;
  autoconfrontacion?: string;
  registroPensamientos?: string;
  oracionGuiada?: string;
  evidenciaContraria?: string;
  reencuadreBiblico?: string;
  desafiosPracticos?: string;
  interrupcionPatrones?: string;
  meditacionDiaria?: string;
  memorizacionVersiculo?: string;
  diarioGratitud?: string;
  visualizacionBiblica?: string;
  retosReales?: string;
  accionesFe?: string;
  conversacionesDificiles?: string;
  pasosObediencia?: string;
}

export interface AIDiagnosis {
  fase1: {
    principalBelief: string;
    secondaryBeliefs: string[];
    rootFear: string;
    dominantEmotion: string;
    affectedArea: string;
  };
  fase2: {
    limitingBeliefExplanation: string;
    rootLie: string;
    currentCost: {
      decisions: string;
      emotions: string;
      relationships: string;
      potentialFuture: string;
    };
    selfSabotageMechanism: string;
  };
  fase3: {
    mentira: string;
    verdadBiblica: string;
    versiculo: {
      texto: string;
      referencia: string;
    };
    aplicacion: string;
  };
  fase4: {
    declaracionIdentidad: string;
  };
  fase5: {
    semana1: WeekPlan;
    semana2: WeekPlan;
    semana3: WeekPlan;
    semana4: WeekPlan;
  };
  fase6: DayPlan[];
  reporteFinal: {
    antes: string;
    ahora: string;
    creenciaDerribada: string;
    verdadEstablecida: string;
    proximoPaso: string;
    exhortacionBiblica: string;
  };
  exploratorio?: ExploratoryDiagnosis;
  mapaDelCorazon?: HeartAnalysisMap;
  interacciones?: DetectedInteraction[];
}

export function generateFallbackData(
  primary: UserResult,
  userName: string,
  _userEmail: string,
  activeBeliefs: UserResult[]
): AIDiagnosis {
  const blockId = primary.bloqueId || "capacidad-identidad";
  const name = userName?.trim() || "Hermano/a";
  const practicalGuide = practicalStepsByBlock[blockId];

  const blockDataMap: Record<
    string,
    {
      rootFear: string;
      dominantEmotion: string;
      affectedArea: string;
      rootLie: string;
      selfSabotage: string;
      explanation: string;
      decisions: string;
      emotions: string;
      relationships: string;
      potentialFuture: string;
      weeklyPlans: {
        semana1: WeekPlan;
        semana2: WeekPlan;
        semana3: WeekPlan;
        semana4: WeekPlan;
      };
      daysTemplate: Omit<DayPlan, "dia">[];
    }
  > = {
    "capacidad-identidad": {
      rootFear: "Temor a equivocarte o a no ser suficiente ante los ojos de los demás.",
      dominantEmotion: "Inseguridad de desempeño y temor a la crítica",
      affectedArea: "Identidad personal, vocación y liderazgo",
      rootLie: "Mi valor depende de lo que sé o produzco; si fallo, perderé el respeto de quienes me rodean.",
      selfSabotage: "Sobreprepararte en exceso, dudar antes de dar un paso o guardar silencio sobre tus ideas por miedo a que descubran una debilidad.",
      explanation: "Tu mente aprendió a asociar el error con una amenaza a tu dignidad. Esto te lleva a esforzarte de más para estar a salvo, olvidando que tu competencia proviene de Dios.",
      decisions: "Aplazar proyectos valiosos o no postularte a nuevas metas por sentir que aún 'te falta preparación'.",
      emotions: "Cansancio mental, tensión y la sensación interna de que nunca es suficiente.",
      relationships: "Dificultad para pedir ayuda o mostrarte vulnerable por temor a ser juzgado/a.",
      potentialFuture: "Quedarte en un espacio pequeño y cómodo, sin poner en acción los dones que Dios te confió.",
      weeklyPlans: {
        semana1: {
          objetivo: "Identificar la voz de la insuficiencia.",
          reflexion: `Tu mente, ${name}, aprendió a protegerse con una autoexigencia implacable. Observa cuándo surge esa voz crítica esta semana.`,
          autoconfrontacion: "¿A quién le doy más autoridad: a mis dudas internas o a lo que Dios dice de mí?",
          registroPensamientos: "Anota cada momento en que pienses: 'No estoy a la altura' o 'Seguro me equivocaré'.",
          oracionGuiada: "Señor Jesús, ayúdame a reconocer las mentiras con las que me juzgo y a descansar en la suficiencia que tú me das. Amén."
        },
        semana2: {
          objetivo: "Recordar las evidencias de la fidelidad de Dios.",
          evidenciaContraria: "Haz una lista de 3 momentos en tu vida donde Dios te respaldó a pesar de tus temores.",
          reencuadreBiblico: "Lee 2 Corintios 3:5 reconociendo que tu capacidad proviene del Señor.",
          desafiosPracticos: "Comparte una sugerencia o idea en tu trabajo o comunidad sin disculparte antes de hablar.",
          interrupcionPatrones: "Cuando sientas miedo al error, haz una pausa, respira con calma y repite: 'Mi paz viene del Señor'."
        },
        semana3: {
          objetivo: "Afirmar tu valor en Cristo.",
          meditacionDiaria: "Medita 5 minutos cada mañana en Efesios 2:10: eres hechura de Dios para buenas obras.",
          memorizacionVersiculo: "Guarda en tu celular 2 Timoteo 1:7 sobre el espíritu de amor, poder y dominio propio.",
          diarioGratitud: "Anota 3 bendiciones de tu vida que no dependan de tu rendimiento laboral.",
          visualizacionBiblica: "Imagina tu día caminando con tranquilidad y confianza en la guía de Dios."
        },
        semana4: {
          objetivo: "Dar pasos concretos de valentía.",
          retosReales: "Acepta una responsabilidad que antes evitabas por dudar de ti.",
          accionesFe: "Reconoce los logros de otros con alegría, sin compararte ni sentirte en desventaja.",
          conversacionesDificiles: "Comunica con serenidad tus límites de tiempo sin temer que te juzguen.",
          pasosObediencia: "Inicia ese proyecto o paso de fe que habías postergado por sentirte incompleto/a."
        }
      },
      daysTemplate: [
        {
          enfoque: "El origen de tu capacidad",
          versiculo: { texto: "Nuestra competencia proviene de Dios.", referencia: "2 Corintios 3:5" },
          accion: "Recuerda hoy que tu capacidad para resolver tareas diarias viene de la sabiduría que Dios te da.",
          reflexion: "¿Qué responsabilidad estás cargando solo/a, olvidando pedir la ayuda del Señor?",
          oracion: "Padre celestial, rindo mi autosuficiencia y descanso en tu guía constante."
        },
        {
          enfoque: "Libre de la condenación",
          versiculo: { texto: "Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús.", referencia: "Romanos 8:1" },
          accion: "Ante cualquier fallo menor hoy, perdónate con amabilidad y continúa con paso firme.",
          reflexion: "¿Qué tan severo/a eres contigo cuando las cosas no salen como planeabas?",
          oracion: "Jesús, gracias porque tu perdón y tu gracia renuevan mis fuerzas cada mañana."
        },
        {
          enfoque: "Diseñado con propósito",
          versiculo: { texto: "Porque somos hechura suya, creados en Cristo Jesús para buenas obras.", referencia: "Efesios 2:10" },
          accion: "Escribe en una nota dos talentos que Dios te dio y proponte usarlos hoy para bendecir a alguien.",
          reflexion: "¿Cómo puedes poner tus dones al servicio del prójimo sin esperar aplausos?",
          oracion: "Señor, gracias por diseñarme con propósito; guíame a ser de bendición en este día."
        }
      ]
    },

    "merecimiento-vinculo": {
      rootFear: "Temor al rechazo, al abandono o a que la felicidad sea pasajera.",
      dominantEmotion: "Inquietud afectiva y dificultad para recibir paz duradera",
      affectedArea: "Relaciones cercanas, familia y serenidad interior",
      rootLie: "Las cosas buenas no duran; si algo va bien, pronto vendrá una tormenta o me quedaré solo/a.",
      selfSabotage: "Boicotear momentos de calma, desconfiar de gestos generosos o dar en exceso para no ser rechazado/a.",
      explanation: "Tu cuerpo aprendió a estar en alerta aun en los momentos de paz, creyendo que la tranquilidad es frágil y que debes protegerte anticipando el dolor.",
      decisions: "Aceptar tratos injustos o permanecer en relaciones donde sientes que siempre debes pagar un precio por ser querido/a.",
      emotions: "Culpa inexplicable cuando experimentas descanso, alegría o prosperidad.",
      relationships: "Distanciarte cuando alguien intenta acercarse con sinceridad, por miedo a salir lastimado/a.",
      potentialFuture: "Vivir con desconfianza en el amor de Dios y de los tuyos, perdiéndote el gozo de ser amado/a incondicionalmente.",
      weeklyPlans: {
        semana1: {
          objetivo: "Reconocer la desconfianza y el temor al abandono.",
          reflexion: `Es normal, ${name}, que si viviste momentos difíciles en el pasado, tu mente espere lo peor. Aprende a notar cuándo te preparas para el golpe.`,
          autoconfrontacion: "¿Creo de verdad que Dios me ama con bondad o imagino que me quitará lo bueno?",
          registroPensamientos: "Anota pensamientos como: 'Esto es demasiado bueno para ser real' o 'Pronto saldrá mal'.",
          oracionGuiada: "Padre amoroso, derriba el miedo a perder la paz. Enséñame a recibir tu bondad con gratitud y sin sospechas. Amén."
        },
        semana2: {
          objetivo: "Aprender a recibir con gratitud.",
          evidenciaContraria: "Recuerda 3 bendiciones que Dios te dio de forma inmerecida y que han permanecido en tu vida.",
          reencuadreBiblico: "Medita en Romanos 8:38-39: nada nos apartará del amor de Dios.",
          desafiosPracticos: "Acepta un cumplido o un gesto de ayuda con un simple 'Muchas gracias', sin justificarte.",
          interrupcionPatrones: "Cuando sientas el impulso de anticipar un problema, respira profundo y di: 'Dios cuida de mí'."
        },
        semana3: {
          objetivo: "Arraigar el amor incondicional.",
          meditacionDiaria: "Lee 1 Juan 4:18: el amor perfecto echa fuera el temor.",
          memorizacionVersiculo: "Guarda Proverbios 10:22: la bendición de Jehová es la que enriquece y no añade tristeza.",
          diarioGratitud: "Escribe 3 motivos diarios de gratitud por las personas que te rodean.",
          visualizacionBiblica: "Dedica un momento al inicio del día para imaginar el descanso seguro en la gracia de Dios."
        },
        semana4: {
          objetivo: "Disfrutar de relaciones sanas y seguras.",
          retosReales: "Pide ayuda o compañía a un amigo o ser querido sin pena ni vergüenza.",
          accionesFe: "Ten un detalle generoso con alguien especial, sin esperar nada a cambio.",
          conversacionesDificiles: "Habla con cariño de tus sentimientos sin usar la queja ni la distancia.",
          pasosObediencia: "Celebra un logro personal con quienes te aman, disfrutando el momento presente."
        }
      },
      daysTemplate: [
        {
          enfoque: "El amor que no falla",
          versiculo: { texto: "Con amor eterno te he amado; por tanto, te prolongué mi misericordia.", referencia: "Jeremías 31:3" },
          accion: "Tómate 5 minutos de calma para recordar que Dios te ama por quién eres, no por tus obras.",
          reflexion: "¿Te permites sentirte amado/a por Dios aun en tus días más difíciles?",
          oracion: "Señor, gracias por tu amor incondicional que sostiene mi vida en cada circunstancia."
        },
        {
          enfoque: "Bendición sin tristeza",
          versiculo: { texto: "La bendición de Jehová es la que enriquece, y no añade tristeza con ella.", referencia: "Proverbios 10:22" },
          accion: "Agradece una alegría de hoy sin temer que mañana se convierta en una dificultad.",
          reflexion: "¿Qué pensamiento de desconfianza necesitas entregar a Dios en oración?",
          oracion: "Padre, descanso en que tus intenciones para mi vida son siempre de bien y de paz."
        },
        {
          enfoque: "Vínculos de paz",
          versiculo: { texto: "En esto conocerán todos que sois mis discípulos, si tuviereis amor los unos con los otros.", referencia: "Juan 13:35" },
          accion: "Envía un mensaje sincero de ánimo a una persona querida para fortalecer su relación.",
          reflexion: "¿Cómo puedes expresar afecto hoy de manera clara y sin barreras defensivas?",
          oracion: "Jesús, enséñame a amar a otros con la misma paciencia con la que tú me amas."
        }
      ]
    },

    "control-entorno": {
      rootFear: "Temor a la incertidumbre y a que todo falle si no estás supervisando cada detalle.",
      dominantEmotion: "Tensión acumulada, necesidad constante de vigilar y dificultad para soltar",
      affectedArea: "Organización diaria, descanso mental y delegación",
      rootLie: "Si no tengo el control de todo, las cosas saldrán mal y nadie más se hará cargo.",
      selfSabotage: "Asumir tareas de los demás, negarte a delegar y revisar una y otra vez lo que otros hacen.",
      explanation: "Tu sistema aprendió a protegerse buscando anticipar y controlar todas las variables externas, olvidando que la verdadera seguridad descansa en la soberanía de Dios.",
      decisions: "Tomar decisiones rígidas o postergar acuerdos por temor a que el resultado no sea idéntico a lo previsto.",
      emotions: "Agotamiento físico, contracturas en cuello y hombros, e irritabilidad ante los cambios de planes.",
      relationships: "Generar roces con tu equipo, familia o pareja por querer que todo se realice bajo tus tiempos y métodos.",
      potentialFuture: "Terminar abrumado/a apagando fuegos cotidianos, sin energía para proyectos estratégicos de mayor impacto.",
      weeklyPlans: {
        semana1: {
          objetivo: "Notar la necesidad compulsiva de control.",
          reflexion: `Querido/a ${name}, intentar sostener todas las riendas de la vida en tus manos agota tu energía. Observa en qué momentos te cuesta soltar.`,
          autoconfrontacion: "¿Qué temo que suceda si delego o si algo sale de manera diferente a lo que imaginé?",
          registroPensamientos: "Anota cuándo te digas: 'Tengo que hacerlo yo mismo/a o saldrá mal'.",
          oracionGuiada: "Señor, admito que he querido controlar lo que no me corresponde. Te entrego el gobierno de mis circunstancias. Amén."
        },
        semana2: {
          objetivo: "Practicar la entrega activa a Dios.",
          evidenciaContraria: "Recuerda 3 ocasiones donde Dios acomodó las cosas mucho mejor de lo que tus planes preveían.",
          reencuadreBiblico: "Lee Proverbios 3:5-6 y confía en el Señor con todo tu corazón.",
          desafiosPracticos: "Delega una tarea sencilla hoy y no revises el resultado hasta que esté terminada.",
          interrupcionPatrones: "Cuando sientas urgencia por intervenir en lo de otros, haz 3 respiraciones profundas y di: 'Dios tiene el control'."
        },
        semana3: {
          objetivo: "Cultivar la paz en medio de la incertidumbre.",
          meditacionDiaria: "Medita en Salmos 46:10: 'Estad quietos, y conoced que yo soy Dios'.",
          memorizacionVersiculo: "Guarda Filipenses 4:6-7 sobre la paz de Dios que sobrepasa todo entendimiento.",
          diarioGratitud: "Escribe al final del día aquello que pudiste soltar con tranquilidad.",
          visualizacionBiblica: "Imagina que depositas tus preocupaciones en las manos seguras de Jesús."
        },
        semana4: {
          objetivo: "Vivir con flexibilidad y descanso.",
          retosReales: "Permite que un ser querido o compañero organice una actividad sin intervenir en los detalles.",
          accionesFe: "Acepta un imprevisto con serenidad, buscando qué lección de gracia tiene para ti.",
          conversacionesDificiles: "Comunica con amabilidad tus expectativas y luego confía en los tiempos del otro.",
          pasosObediencia: "Dedica un tiempo de descanso sin revisar pendientes ni mensajes de trabajo."
        }
      },
      daysTemplate: [
        {
          enfoque: "Soltar para descansar",
          versiculo: { texto: "Estad quietos, y conoced que yo soy Dios.", referencia: "Salmos 46:10" },
          accion: "Haz una pausa de 5 minutos al mediodía sin pantallas ni planes, rindiendo tus cargas al Señor.",
          reflexion: "¿Qué situación estás intentando resolver con fuerza propia en lugar de buscar la paz de Dios?",
          oracion: "Padre, te entrego el peso de este día. Confío en que tú obras aun cuando no puedo ver el final."
        },
        {
          enfoque: "Confianza en Su providencia",
          versiculo: { texto: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.", referencia: "Proverbios 3:5" },
          accion: "Hoy toma una decisión confiando en la guía de Dios sin dar vueltas innecesarias a los mismos datos.",
          reflexion: "¿En qué área te resulta más difícil soltar el volante de tus decisiones?",
          oracion: "Señor, reconozco mis limitaciones humanas y me apoyo con gozo en tu fidelidad."
        },
        {
          enfoque: "Paz ante los cambios",
          versiculo: { texto: "Por nada estéis afanosos... y la paz de Dios guardará vuestros corazones.", referencia: "Filipenses 4:6-7" },
          accion: "Si un plan cambia hoy, responde con amabilidad en lugar de quejarte o tensarte.",
          reflexion: "¿Cómo reacciona tu cuerpo cuando tus planes se modifican imprevistamente?",
          oracion: "Jesucristo, llena mi corazón de tu paz sobrenatural para caminar con paciencia y gracia."
        }
      ]
    },

    "rendimiento-logro": {
      rootFear: "Temor a ser considerado mediocre, insuficiente o perder el valor si bajas el ritmo.",
      dominantEmotion: "Autoexigencia implacable, prisa interior y culpa al descansar",
      affectedArea: "Trabajo, descanso, salud y equilibrio de vida",
      rootLie: "Mi dignidad vale por lo que logro; descansar o entregar algo imperfecto es señal de debilidad.",
      selfSabotage: "Perfeccionismo paralizante: pulir detalles indefinidamente perdiendo plazos o descuidar la salud por trabajar de más.",
      explanation: "Tu mente aprendió a asociar tu valor personal con tus diplomas, títulos o resultados, haciendo que el descanso se sienta como una pérdida de tiempo culpable.",
      decisions: "Postergar entregas clave por exigir una perfección inalcanzable, o asumir más compromisos de los que puedes atender.",
      emotions: "Insatisfacción permanente: la alegría de un logro dura poco y de inmediato buscas el siguiente desafío.",
      relationships: "Impaciencia con el ritmo de los demás y ausencia emocional en los momentos compartidos con seres queridos.",
      potentialFuture: "Agotamiento crónico (burnout), perdiendo la alegría de vivir y descuidando tu salud.",
      weeklyPlans: {
        semana1: {
          objetivo: "Desactivar la trampa del perfeccionismo.",
          reflexion: `Entiende, ${name}, que Dios te ama por ser su hijo/a, no por la montaña de tus logros. Aprende a notar la culpa ante el descanso.`,
          autoconfrontacion: "¿A quién intento demostrarle mi valor trabajando sin tregua?",
          registroPensamientos: "Anota frases como: 'Si no lo hago perfecto, no vale' o 'No puedo parar hoy'.",
          oracionGuiada: "Señor Jesús, quita la pesada carga de demostrar mi valía mediante el rendimiento. Enséñame a descansar en ti. Amén."
        },
        semana2: {
          objetivo: "Aprender el valor del descanso sagrado.",
          evidenciaContraria: "Recuerda momentos donde entregar algo 'suficientemente bueno' funcionó con total éxito.",
          reencuadreBiblico: "Medita en Mateo 11:28: 'Venid a mí todos los que estáis trabajados y cargados'.",
          desafiosPracticos: "Fija hoy una hora estricta para apagar el trabajo y no vuelvas a encender pantallas.",
          interrupcionPatrones: "Cuando sientas culpa por sentarte a descansar, repite: 'El descanso también es obediencia'."
        },
        semana3: {
          objetivo: "Reenfocar tu motivación en el amor.",
          meditacionDiaria: "Lee Colosenses 3:23-24, recordando que sirves a Cristo y no al aplauso de los hombres.",
          memorizacionVersiculo: "Guarda el Salmo 127:2: 'Por demás es que madruguéis... pues a su amado dará Dios el sueño'.",
          diarioGratitud: "Anota 3 bendiciones que recibiste hoy sin haber hecho ningún esfuerzo por merecerlas.",
          visualizacionBiblica: "Visualiza a Jesús recibiéndote con brazos abiertos, sin pedirte informes de rendimiento."
        },
        semana4: {
          objetivo: "Equilibrar labor y reposo.",
          retosReales: "Entrega un trabajo a tiempo con una calidad sólida, renunciando a pulir pequeñeces secundarias.",
          accionesFe: "Pasa una tarde libre de trabajo dedicada a tu familia, amigos o a una caminata al aire libre.",
          conversacionesDificiles: "Di 'no' con tranquilidad a un nuevo proyecto que sobrepase tus horas sanas.",
          pasosObediencia: "Establece un día de reposo semanal como un acto sagrado de confianza en Dios."
        }
      },
      daysTemplate: [
        {
          enfoque: "El reposo del alma",
          versiculo: { texto: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", referencia: "Mateo 11:28" },
          accion: "Regálate hoy una pausa de 20 minutos para orar, leer o caminar sin prisa ni teléfono.",
          reflexion: "¿Qué tan frecuentemente confundes tu identidad con tu productividad?",
          oracion: "Jesús, acepto tu invitación al reposo. En tu presencia encuentro la paz que mi alma anhela."
        },
        {
          enfoque: "Suficiencia de la gracia",
          versiculo: { texto: "Bástate mi gracia; porque mi poder se perfecciona en la debilidad.", referencia: "2 Corintios 12:9" },
          accion: "Acepta un límite humano de hoy sin recriminarte; Dios usa también tus imperfecciones.",
          reflexion: "¿Te das permiso de ser humano/a y cometer errores sin perder la paz?",
          oracion: "Padre, gracias porque tu gracia me basta y no tengo que vivir bajo la tiranía del perfeccionismo."
        },
        {
          enfoque: "Dios sostiene tus días",
          versiculo: { texto: "Por demás es que os levantéis de madrugada... pues que a su amado dará Dios el sueño.", referencia: "Salmos 127:2" },
          accion: "Esta noche ve a dormir a una hora prudente, confiando en que el mundo sigue en manos de Dios.",
          reflexion: "¿Crees que si no trabajas horas extras todo se vendrá abajo?",
          oracion: "Señor, encomiendo a ti el fruto de mi labor y duermo en paz sabiendo que tú cuidas de mí."
        }
      ]
    },

    "relaciones-poder": {
      rootFear: "Temor al conflicto, al rechazo o a quedar vulnerable y sin voz en una confrontación.",
      dominantEmotion: "Resentimiento contenido o frustración por ceder en exceso",
      affectedArea: "Límites saludables, pareja, amistades y relaciones laborales",
      rootLie: "Para mantener la paz debo callar siempre, o bien imponerme con fuerza para que no me lastimen.",
      selfSabotage: "Guardar silencio ante injusticias acumulando enojo, o reaccionar con dureza desmedida por autoprotección.",
      explanation: "Tu mente aprendió a ver los desacuerdos como amenazas a tu seguridad emocional. Esto te lleva a callar para agradar o a levantar murallas para no salir lastimado/a.",
      decisions: "Comprometerte con cosas que no quieres por miedo a decepcionar o a generar tensiones.",
      emotions: "Sensación de injusticia, aislamiento emocional y desgaste por sostener apariencias de calma.",
      relationships: "Vínculos donde sientes que no puedes ser tú mismo/a con sinceridad y libertad.",
      potentialFuture: "Relaciones marcadas por la distancia o el resentimiento acumulado por lo nunca dicho.",
      weeklyPlans: {
        semana1: {
          objetivo: "Reconocer cuándo callas por temor o atacas por defensa.",
          reflexion: `Dios no te llamó a vivir con miedo al juicio de los demás, ${name}. Hablar la verdad en amor es el camino de la verdadera paz.`,
          autoconfrontacion: "¿Qué conversación importante he estado evitando por miedo a la reacción del otro?",
          registroPensamientos: "Anota cuándo pienses: 'Mejor me callo para no tener problemas' o 'Nadie me va a pasar por encima'.",
          oracionGuiada: "Señor, dame sabiduría y mansedumbre para comunicarme con firmeza y sin temor al rechazo. Amén."
        },
        semana2: {
          objetivo: "Aprender a poner límites con gracia.",
          evidenciaContraria: "Recuerda una ocasión donde decir la verdad con respeto mejoró una relación.",
          reencuadreBiblico: "Lee Efesios 4:15: 'Siguiendo la verdad en amor, crezcamos en todo'.",
          desafiosPracticos: "Di un 'no' tranquilo a una petición que no puedas o no debas asumir.",
          interrupcionPatrones: "Si sientes enojo subir, haz una pausa, respira y espera a calmarte antes de responder."
        },
        semana3: {
          objetivo: "Perdonar y sanar heridas del pasado.",
          meditacionDiaria: "Medita en Colosenses 3:13: perdonad como Cristo os perdonó.",
          memorizacionVersiculo: "Guarda Proverbios 15:1: 'La blanda respuesta quita la ira; mas la palabra áspera hace subir el furor'.",
          diarioGratitud: "Agradece por una persona que te brinda un espacio seguro para hablar.",
          visualizacionBiblica: "Imagínate conversando con paz y templanza, sin necesidad de pelear ni de huir."
        },
        semana4: {
          objetivo: "Edificar vínculos transparentes.",
          retosReales: "Ten esa conversación honesta y pendiente con amabilidad, escuchando activamente.",
          accionesFe: "Pide perdón si heriste a alguien con tus palabras en días pasados.",
          conversacionesDificiles: "Expresa lo que necesitas con claridad sin culpar a la otra persona.",
          pasosObediencia: "Elige bendecir con tus palabras a quienes antes te costaba tratar."
        }
      },
      daysTemplate: [
        {
          enfoque: "Verdad con amor",
          versiculo: { texto: "Siguiendo la verdad en amor, crezcamos en todo en aquel que es la cabeza, esto es, Cristo.", referencia: "Efesios 4:15" },
          accion: "Expresa una opinión sincera en una conversación cotidiana con tono suave y seguro.",
          reflexion: "¿Qué verdad necesitas decir que has estado posponiendo por timidez?",
          oracion: "Espíritu Santo, pon gracia en mis labios para hablar con prudencia y amor genuino."
        },
        {
          enfoque: "Paz genuina, no fingida",
          versiculo: { texto: "Bienaventurados los pacificadores, porque ellos serán llamados hijos de Dios.", referencia: "Mateo 5:9" },
          accion: "Diferencia hoy entre ser pacificador (resolver con amor) y ser evadidor (callar con rencor).",
          reflexion: "¿Estás callando para no incomodar o estás buscando la paz real?",
          oracion: "Padre, hazme un instrumento de tu paz que busque sanidad y no apariencias."
        },
        {
          enfoque: "Respuesta mansa",
          versiculo: { texto: "La blanda respuesta quita la ira; mas la palabra áspera hace subir el furor.", referencia: "Proverbios 15:1" },
          accion: "Si alguien te habla con aspereza hoy, responde con calma y sin caer en provocaciones.",
          reflexion: "¿Cómo cambia el ambiente cuando eliges responder con mansedumbre?",
          oracion: "Señor Jesús, dame tu dominio propio y tu paciencia para tratar a mi prójimo."
        }
      ]
    },

    "cuerpo-salud": {
      rootFear: "Temor a la fragilidad física, a la enfermedad o a perder el ritmo por atender el cuerpo.",
      dominantEmotion: "Desconexión de tus necesidades físicas y culpa por descansar",
      affectedArea: "Salud física, vitalidad, sueño y hábitos cotidianos",
      rootLie: "Mi cuerpo es solo una máquina para trabajar; atenderlo es un lujo o una debilidad.",
      selfSabotage: "Ignorar señales de cansancio, alimentarte con prisa o recortar horas de sueño para seguir produciendo.",
      explanation: "Tu mente aprendió a desatender tu templo físico, tratándolo con exigencia en lugar de mayordomía amorosa.",
      decisions: "Postergar chequeos médicos, comidas nutritivas o descansos necesarios por cumplir con horarios de otros.",
      emotions: "Fatiga crónica, irritabilidad por falta de sueño y pérdida de entusiasmo diario.",
      relationships: "Estar presente con tus seres queridos físicamente pero con poca paciencia y energía para compartir.",
      potentialFuture: "Problemas de salud prevenibles y falta de vitalidad para disfrutar las etapas que Dios te da.",
      weeklyPlans: {
        semana1: {
          objetivo: "Reconectar con tu cuerpo como templo de Dios.",
          reflexion: `Tu cuerpo, ${name}, fue creado por Dios para ser cuidado con respeto y honra. Escucha lo que te dice hoy.`,
          autoconfrontacion: "¿Qué hábitos diarios están desgastando mi salud por no ponerles freno?",
          registroPensamientos: "Anota cuándo pienses: 'No tengo tiempo para comer bien' o 'Dormiré cuando termine todo'.",
          oracionGuiada: "Señor, perdóname por descuidar mi salud. Enséñame a ser un buen mayordomo del cuerpo que me diste. Amén."
        },
        semana2: {
          objetivo: "Restablecer hábitos básicos de cuidado.",
          evidenciaContraria: "Observa cómo mejora tu lucidez y ánimo cuando duermes tus horas completas.",
          reencuadreBiblico: "Medita en 1 Corintios 6:19: tu cuerpo es templo del Espíritu Santo.",
          desafiosPracticos: "Toma al menos 2 litros de agua y camina 15 minutos al aire libre hoy.",
          interrupcionPatrones: "Si estás trabajando sin parar más de 2 horas, levántate, estírate y respira profundo."
        },
        semana3: {
          objetivo: "Honrar el descanso reparador.",
          meditacionDiaria: "Lee el Salmo 139:14: 'Te alabaré; porque formidables, maravillosas son tus obras'.",
          memorizacionVersiculo: "Guarda 3 Juan 1:2: 'Deseo que seas prosperado en todas las cosas, y que tengas salud'.",
          diarioGratitud: "Agradece por cada función que tu cuerpo realiza de forma natural y fiel.",
          visualizacionBiblica: "Agradece a Dios antes de dormir por el descanso que renueva tus fuerzas."
        },
        semana4: {
          objetivo: "Sostener una rutina saludable y gozosa.",
          retosReales: "Agenda una consulta médica o dental que habías dejado pasar.",
          accionesFe: "Cocina o disfruta de una comida saludable con calma, agradeciendo cada alimento.",
          conversacionesDificiles: "Informa en tu entorno que respetarás tus horarios de descanso y alimentación.",
          pasosObediencia: "Convierte el cuidado de tu salud en una práctica de adoración constante a Dios."
        }
      },
      daysTemplate: [
        {
          enfoque: "Templo sagrado",
          versiculo: { texto: "¿O ignoráis que vuestro cuerpo es templo del Espíritu Santo, el cual está en vosotros?", referencia: "1 Corintios 6:19" },
          accion: "Dedica hoy un momento para cuidar tu cuerpo: hidrátate bien y evita la comida apresurada.",
          reflexion: "¿Cómo estás tratando el templo que Dios te prestó para vivir en esta tierra?",
          oracion: "Dios Santo, gracias por mi cuerpo. Ayúdame a honrarte con mis hábitos diarios y decisiones."
        },
        {
          enfoque: "Salud integral",
          versiculo: { texto: "Amado, yo deseo que tú seas prosperado en todas las cosas, y que tengas salud, así como prospera tu alma.", referencia: "3 Juan 1:2" },
          accion: "Haz una pausa de 15 minutos de caminata o descanso consciente en medio del día.",
          reflexion: "¿Qué señal de fatiga has ignorado últimamente?",
          oracion: "Señor, concédeme sabiduría para equilibrar la actividad con el reposo que mi cuerpo necesita."
        },
        {
          enfoque: "Fuerzas renovadas",
          versiculo: { texto: "Los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.", referencia: "Isaías 40:31" },
          accion: "Entrega tus preocupaciones a Dios antes de dormir y confía en el descanso reparador.",
          reflexion: "¿En qué fuente buscas tus energías cuando te sientes exhausto/a?",
          oracion: "Padre de bondad, renueva mi vitalidad física y espiritual para servirte con gozo cada día."
        }
      ]
    },

    "espiritualidad-trascendencia": {
      rootFear: "Temor a que Dios esté lejos, a no cumplir tu propósito o a que tu vida no tenga sentido.",
      dominantEmotion: "Sensación de lejanía espiritual o rutina religiosa sin vida",
      affectedArea: "Oración personal, intimidad con Dios y claridad de propósito",
      rootLie: "Dios es un juez distante que solo me acepta si soy intachable, o bien se ha olvidado de mí.",
      selfSabotage: "Rezar de forma mecánica por cumplir, alejarse de la iglesia o sentirte indigno/a de pedir la guía del Señor.",
      explanation: "Tu corazón aprendió a mirar a Dios a través del filtro de exigencias humanas o figuras distantes del pasado, perdiendo la cercanía de un Padre compasivo.",
      decisions: "Tomar decisiones importantes apoyándote solo en tu lógica humana, sin buscar la paz del Espíritu.",
      emotions: "Sensación de vacío o desánimo en tu caminar de fe, dudando de si tus oraciones son escuchadas.",
      relationships: "Dificultad para hablar de tu fe con gozo auténtico o para pedir apoyo en momentos de duda.",
      potentialFuture: "Vivir una fe fría y formal, perdiéndote el gozo del compañerismo diario con Cristo.",
      weeklyPlans: {
        semana1: {
          objetivo: "Redescubrir a Dios como Padre cercano.",
          reflexion: `Hermano/a ${name}, Dios no te pide fórmulas perfectas; Él busca tu corazón sincero y transparente. Acércate con confianza.`,
          autoconfrontacion: "¿Cómo imagino a Dios cuando me acerco a orar: como un Padre amoroso o como un juez severo?",
          registroPensamientos: "Anota cuándo sientas que Dios no te escucha o que tu vida carece de propósito.",
          oracionGuiada: "Señor Jesús, quita todo velo de religiosidad fría. Quiero conocerte de verdad como mi Padre y Salvador. Amén."
        },
        semana2: {
          objetivo: "Aprender a conversar con Dios con sencillez.",
          evidenciaContraria: "Recuerda oraciones que Dios contestó en tu pasado de maneras inesperadas.",
          reencuadreBiblico: "Medita en Romanos 8:15: hemos recibido el espíritu de adopción, por el cual clamamos: ¡Abba, Padre!",
          desafiosPracticos: "Dedica 10 minutos a hablar con Dios en voz audible y natural, como con tu amigo más cercano.",
          interrupcionPatrones: "Si sientes culpa al orar, recuerda que Cristo ya pagó tu entrada al trono de la gracia."
        },
        semana3: {
          objetivo: "Fortalecer tu sentido de propósito en el Reino.",
          meditacionDiaria: "Lee el Salmo 139 reconociendo que Dios conoce todos tus caminos y te sostiene.",
          memorizacionVersiculo: "Guarda Jeremías 29:11: 'Porque yo sé los pensamientos que tengo acerca de vosotros, pensamientos de paz'.",
          diarioGratitud: "Escribe 3 momentos donde sentiste la paz de Dios guiando tu corazón.",
          visualizacionBiblica: "Visualízate descansando en el regazo de tu Padre celestial con total seguridad."
        },
        semana4: {
          objetivo: "Vivir tu fe con testimonio gozoso.",
          retosReales: "Comparte una palabra de ánimo o un versículo con alguien que esté pasando por dificultades.",
          accionesFe: "Separa un tiempo a solas en la semana para alabar a Dios sin pedir nada, solo agradeciendo.",
          conversacionesDificiles: "Habla con madurez de tus dudas espirituales con un mentor o pastor de confianza.",
          pasosObediencia: "Da un paso de servicio en tu comunidad con alegría y generosidad de corazón."
        }
      },
      daysTemplate: [
        {
          enfoque: "Confianza filial",
          versiculo: { texto: "Mirad cuál amor nos ha dado el Padre, para que seamos llamados hijos de Dios.", referencia: "1 Juan 3:1" },
          accion: "Aparta 5 minutos al despertar para recordar que eres hijo/a amado/a de Dios.",
          reflexion: "¿Cómo cambia tu día cuando sabes que el Creador del universo cuida de ti con cariño paternal?",
          oracion: "Padre celestial, gracias por llamarme tu hijo/a. Descanso seguro en tus brazos de amor."
        },
        {
          enfoque: "Trono de gracia accesible",
          versiculo: { texto: "Acerquémonos, pues, confiadamente al trono de la gracia, para alcanzar misericordia.", referencia: "Hebreos 4:16" },
          accion: "Ora hoy con total transparencia, contando a Dios tus dudas y anhelos más profundos.",
          reflexion: "¿Qué estás callando ante Dios que necesitas desahogar en su presencia?",
          oracion: "Señor, vengo ante ti tal como soy, confiando en tu misericordia oportuna para mi vida."
        },
        {
          enfoque: "Planes de paz y esperanza",
          versiculo: { texto: "Porque yo sé los pensamientos que tengo acerca de vosotros... pensamientos de paz, y no de mal.", referencia: "Jeremías 29:11" },
          accion: "Entrega tus planes futuros a Dios con la certeza de que su voluntad es buena, agradable y perfecta.",
          reflexion: "¿Confías en que Dios tiene un camino de bien para tu porvenir?",
          oracion: "Dios soberano, pongo mi futuro en tus manos y camino con fe en tus promesas eternas."
        }
      ]
    },

    "tiempo-futuro": {
      rootFear: "Temor a que el tiempo se agote, a tomar la decisión equivocada o a un futuro incierto y doloroso.",
      dominantEmotion: "Prisa interior continua, impaciencia y angustia anticipatoria",
      affectedArea: "Toma de decisiones, serenidad cotidiana y proyectos a mediano plazo",
      rootLie: "Voy tarde en la vida; si elijo mal, arruinaré mi futuro y no habrá forma de remediarlo.",
      selfSabotage: "Parálisis por análisis: darle vueltas indefinidamente a una elección, o abarrotarte de tareas sin terminar ninguna.",
      explanation: "Tu sistema aprendió a vivir acelerado, creyendo que la seguridad proviene de calcular mentalmente cada posible escenario, lo que te desconecta del presente.",
      decisions: "Aplazar decisiones fundamentales por miedo al error, o tomarlas impulsivamente por desesperación.",
      emotions: "Inquietud permanente, dificultad para respirar con serenidad y sensación de que el reloj juega en tu contra.",
      relationships: "Estar presente físicamente con otros pero con la mente ocupada en las tareas de mañana.",
      potentialFuture: "Ver pasar los años en una carrera agotadora sin saborear las bendiciones que Dios pone en tu hoy.",
      weeklyPlans: {
        semana1: {
          objetivo: "Detener la carrera mental hacia el futuro.",
          reflexion: `Tranquilo/a, ${name}. Dios es el Señor del tiempo. No vas tarde en el reloj divino; aprende a habitar con paz en tu presente.`,
          autoconfrontacion: "¿Qué catástrofe imaginaria estoy anticipando que me roba la paz del día de hoy?",
          registroPensamientos: "Anota cuándo pienses: 'No tengo tiempo', 'Se me está haciendo tarde' o '¿Y si me equivoco?'.",
          oracionGuiada: "Señor del tiempo, calma la prisa de mi corazón. Enséñame a disfrutar y honrar el día de hoy. Amén."
        },
        semana2: {
          objetivo: "Aprender a decidir con sobriedad y fe.",
          evidenciaContraria: "Recuerda elecciones pasadas donde tuviste dudas pero Dios guio el resultado con bien.",
          reencuadreBiblico: "Medita en Mateo 6:34: 'No os afanéis por el día de mañana, pues el día de mañana traerá su afán'.",
          desafiosPracticos: "Toma una decisión sencilla que llevabas días posponiendo en los próximos 10 minutos.",
          interrupcionPatrones: "Cuando la mente se dispare al futuro trágico, di en voz alta: 'Hoy tengo lo necesario para hoy'."
        },
        semana3: {
          objetivo: "Anclarte en la fidelidad diaria de Dios.",
          meditacionDiaria: "Lee Lamentaciones 3:22-23: nuevas son sus misericordias cada mañana.",
          memorizacionVersiculo: "Guarda el Salmo 31:15: 'En tu mano están mis tiempos; líbrame de la angustia'.",
          diarioGratitud: "Escribe 3 cosas hermosas que viviste hoy y que no habías notado por andar de prisa.",
          visualizacionBiblica: "Visualiza que caminas un paso a la vez de la mano de Jesús, sin correr ni angustiarte."
        },
        semana4: {
          objetivo: "Caminar con serenidad y propósito.",
          retosReales: "Pasa una hora completa sin consultar el reloj ni el teléfono, enfocado/a en una sola tarea.",
          accionesFe: "Haz un plan de trabajo realista para esta semana, dejando márgenes amplios para descansar.",
          conversacionesDificiles: "Comunica con calma que necesitas un tiempo razonable para evaluar una propuesta importante.",
          pasosObediencia: "Da ese paso de fe para tu vocación hoy, confiando en que Dios sostendrá el mañana."
        }
      },
      daysTemplate: [
        {
          enfoque: "El valor del día de hoy",
          versiculo: { texto: "Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.", referencia: "Salmos 118:24" },
          accion: "Dedica los primeros 10 minutos del día a orar y respirar sin revisar noticias ni correos.",
          reflexion: "¿Qué bendición de tu presente te estás perdiendo por vivir mentalmente en el mañana?",
          oracion: "Señor, gracias por el regalo de este nuevo día. Enséñame a caminarlo con paz y gratitud."
        },
        {
          enfoque: "Cada día con su propio afán",
          versiculo: { texto: "No os afanéis por el día de mañana, pues el día de mañana traerá su afán. Basta a cada día su propio mal.", referencia: "Mateo 6:34" },
          accion: "Enfócate en resolver solo lo que corresponde al día de hoy, sin adelantar problemas futuros.",
          reflexion: "¿Qué porcentaje de tus preocupaciones futuras realmente terminan sucediendo?",
          oracion: "Jesús, pongo en tus manos mi futuro y decido vivir hoy bajo tu provisión y cuidado."
        },
        {
          enfoque: "Tus tiempos en sus manos",
          versiculo: { texto: "En tu mano están mis tiempos.", referencia: "Salmos 31:15" },
          accion: "Respira hondo y recuerda que los tiempos de Dios son perfectos; no vas tarde.",
          reflexion: "¿Te sientes presionado/a por comparar tus tiempos con los de otros?",
          oracion: "Padre soberano, confío en tu ritmo y calendario para mi vida. Camino en tu descanso."
        }
      ]
    },

    "genero-identidad-social": {
      rootFear: "Temor a ser marginado/a, subestimado/a o limitado/a por tu historia, cuna, edad o género.",
      dominantEmotion: "Resentimiento, timidez social o resignación ante techos impuestos por otros",
      affectedArea: "Seguridad pública, vocación y desenvolvimiento social",
      rootLie: "Por mi origen, género o edad no puedo aspirar a metas grandes; debo conformarme con un espacio menor.",
      selfSabotage: "Autodescartarte antes de intentar algo, no postular a nuevas posiciones o dudar de tu voz en público.",
      explanation: "Tu mente interiorizó etiquetas culturales o familiares que intentan poner un límite a tu llamado. Dios mira el corazón y derrama sus dones sin acepción de personas.",
      decisions: "Renunciar a oportunidades de desarrollo por asumir de antemano que preferirán a alguien diferente.",
      emotions: "Tristeza silenciosa o frustración ante comentarios injustos del entorno.",
      relationships: "Hipersensibilidad a la crítica social o retraimiento en grupos donde podrías aportar mucho valor.",
      potentialFuture: "Dejar sin fruto capacidades valiosas que Dios te dio para ser de bendición en tu comunidad.",
      weeklyPlans: {
        semana1: {
          objetivo: "Identificar las etiquetas humanas que te han limitado.",
          reflexion: `Amado/a ${name}, la opinión del mundo no determina tu destino. Tu identidad fue sellada por Dios en Cristo Jesús.`,
          autoconfrontacion: "¿Qué etiquetas del pasado sigo creyendo que me impiden crecer?",
          registroPensamientos: "Anota cuándo pienses: 'Gente como yo no llega a esos lugares' o 'Por mi edad/género no me escucharán'.",
          oracionGuiada: "Señor, renuncio a las etiquetas que otros me pusieron. Abrazo con fe la identidad digna que tú me diste. Amén."
        },
        semana2: {
          objetivo: "Afirmar tu valor en el Reino sin acepción de personas.",
          evidenciaContraria: "Recuerda a personajes bíblicos que Dios levantó sin importar su trasfondo humano humilde.",
          reencuadreBiblico: "Medita en Gálatas 3:28: todos somos uno en Cristo Jesús.",
          desafiosPracticos: "Participa con voz clara y firme en una reunión o grupo sin autolimitarte.",
          interrupcionPatrones: "Cuando sientas que no perteneces a un lugar, repite: 'Dios me puso aquí con un propósito'."
        },
        semana3: {
          objetivo: "Desarrollar una voz asertiva y sabia.",
          meditacionDiaria: "Lee 1 Samuel 16:7: 'El hombre mira lo que está delante de sus ojos, pero Jehová mira el corazón'.",
          memorizacionVersiculo: "Guarda 1 Pedro 2:9: 'Mas vosotros sois linaje escogido, real sacerdocio, nación santa'.",
          diarioGratitud: "Escribe 3 bendiciones únicas de tu historia que te han forjado con sabiduría.",
          visualizacionBiblica: "Imagínate sirviendo y hablando con gracia y autoridad del Señor ante otros."
        },
        semana4: {
          objetivo: "Caminar con dignidad y valentía.",
          retosReales: "Postula o prepárate para ese espacio de liderazgo o estudio que creías fuera de tu alcance.",
          accionesFe: "Apoya y anima a otra persona que se sienta limitada por su trasfondo social.",
          conversacionesDificiles: "Establece límites respetuosos ante comentarios que busquen disminuir tu dignidad.",
          pasosObediencia: "Comparte tu testimonio o experiencia de vida para edificación de otros."
        }
      },
      daysTemplate: [
        {
          enfoque: "Dios mira el corazón",
          versiculo: { texto: "Pues el hombre mira lo que está delante de sus ojos, pero Jehová mira el corazón.", referencia: "1 Samuel 16:7" },
          accion: "Mírate al espejo y recuerda que tu valor viene de la mirada redentora de Dios.",
          reflexion: "¿Qué mirada pesa más sobre tu vida: la de la sociedad o la del Señor?",
          oracion: "Padre, gracias porque me miras con amor y me das una identidad eterna en tu gracia."
        },
        {
          enfoque: "Linaje escogido",
          versiculo: { texto: "Mas vosotros sois linaje escogido, real sacerdocio, nación santa, pueblo adquirido por Dios.", referencia: "1 Pedro 2:9" },
          accion: "Camina hoy con la frente en alto sabiendo a qué linaje celestial perteneces.",
          reflexion: "¿Cómo cambia tu seguridad personal saber que Dios te escogió con un propósito sagrado?",
          oracion: "Jesús, gracias por hacerme parte de tu pueblo y revestirme de dignidad y salvación."
        },
        {
          enfoque: "Unidad y libertad en Cristo",
          versiculo: { texto: "Ya no hay judío ni griego; no hay esclavo ni libre; no hay varón ni mujer; porque todos vosotros sois uno en Cristo Jesús.", referencia: "Gálatas 3:28" },
          accion: "Trata hoy a todos los que te rodean con honra, reconociendo la imagen de Dios en cada uno.",
          reflexion: "¿Hay barreras o prejuicios que Dios te está llamando a derribar en tu corazón?",
          oracion: "Señor, hazme un constructor de unidad, justicia y amor genuino en mi comunidad."
        }
      ]
    }
  };

  const blockData = blockDataMap[blockId] || blockDataMap["capacidad-identidad"];

  // Generate 30 dynamic days of devotional plans
  const totalDays = 30;
  const rawDays: DayPlan[] = [];

  for (let i = 1; i <= totalDays; i++) {
    const templateIdx = (i - 1) % blockData.daysTemplate.length;
    const item = blockData.daysTemplate[templateIdx];

    rawDays.push({
      dia: i,
      enfoque: `Día ${i}: ${item.enfoque}`,
      versiculo: { ...item.versiculo },
      accion: item.accion,
      reflexion: item.reflexion,
      oracion: item.oracion
    });
  }

  const secondaryKeywords = activeBeliefs
    .filter((b) => b.id !== primary.id)
    .map((b) => `${b.alias} (${b.creencia})`);

  const observedScore = (primary as any).screeningScore || (primary as any).score || 4;

  const exploratorioData: ExploratoryDiagnosis = practicalGuide
    ? {
        dato: {
          bloque: practicalGuide.blockTitle,
          score: observedScore,
          descripcion: `DATO OBSERVABLE: ${practicalGuide.dato} (Puntaje: ${observedScore}/5)`
        },
        patron: {
          titulo: `Patrón en ${practicalGuide.shortTitle}`,
          observacion: practicalGuide.patron
        },
        hipotesis: practicalGuide.hipotesis.map((h, i) => {
          const parts = h.split(":");
          return {
            id: `hip-${i + 1}`,
            titulo: parts[0]?.trim() || `Hipótesis ${i + 1}`,
            descripcion: parts.length > 1 ? parts.slice(1).join(":").trim() : h
          };
        }),
        preguntasPorExplorar: practicalGuide.preguntasPorExplorar,
        validacion: {
          mensaje: practicalGuide.validacionPrompt,
          opciones: practicalGuide.hipotesis.map((h) => h.split(":")[0]?.trim() || h)
        },
        direccionDeAyuda: {
          enfoque: practicalGuide.direccionDeAyuda,
          pasoInmediato: practicalGuide.action1,
          acompanamientoRecomendado:
            "Acompañamiento pastoral personalizado para discernir las motivaciones del corazón a la luz de las Escrituras."
        }
      }
    : {
        dato: {
          bloque: (primary as any).category || (primary as any).categoria || primary.bloque || "Área Principal",
          score: observedScore,
          descripcion: `DATO OBSERVABLE: Registro con puntaje de ${observedScore}/5.`
        },
        patron: {
          titulo: "Patrón de Conducta Reportado",
          observacion: "Se observa una tendencia conductual que requiere discernimiento."
        },
        hipotesis: [
          {
            id: "hip-1",
            titulo: "Hipótesis A (Protección emocional)",
            descripcion: "Respuesta adaptativa para evitar dolor, rechazo o incertidumbre."
          },
          {
            id: "hip-2",
            titulo: "Hipótesis B (Autoexigencia aprendida)",
            descripcion: "Normas internas elevadas que dificultan el descanso y la gracia."
          }
        ],
        preguntasPorExplorar: [
          "¿Qué sientes que pasaría si dejas de sostener esta conducta por un día?",
          "¿Qué pensamiento recurrente acompaña este comportamiento?"
        ],
        validacion: {
          mensaje: "¿Cuál de estas hipótesis se acerca más a lo que experimentas?",
          opciones: ["Hipótesis A", "Hipótesis B"]
        },
        direccionDeAyuda: {
          enfoque: "Descansar en la verdad del Evangelio y examinar el corazón en oración.",
          pasoInmediato: "Tomar un tiempo diario de silencio delante de Dios.",
          acompanamientoRecomendado: "Acompañamiento pastoral centrado en la gracia."
        }
      };

  const rawHeartMap = practicalGuide?.heartMap;
  const mapaDelCorazon: HeartAnalysisMap = rawHeartMap
    ? {
        circunstancia: {
          step: "circunstancia",
          label: "CIRCUNSTANCIA",
          sublabel: "Contexto o detonante situacional",
          categoryType: "sabemos",
          contenido: rawHeartMap.circunstancia.contenido,
          justificacion: rawHeartMap.circunstancia.justificacion
        },
        interpretacion: {
          step: "interpretacion",
          label: "INTERPRETACIÓN",
          sublabel: "Lectura o sentencia interna de la mente",
          categoryType: "explorar",
          contenido: rawHeartMap.interpretacion.contenido,
          justificacion: rawHeartMap.interpretacion.justificacion
        },
        deseo: {
          step: "deseo",
          label: "DESEO / ANHELO",
          sublabel: "Lo que el corazón anhela o intenta asegurar",
          categoryType: "explorar",
          contenido: rawHeartMap.deseo.contenido,
          justificacion: rawHeartMap.deseo.justificacion
        },
        temor: {
          step: "temor",
          label: "TEMOR",
          sublabel: "La vulnerabilidad que se busca evitar a toda costa",
          categoryType: "explorar",
          contenido: rawHeartMap.temor.contenido,
          justificacion: rawHeartMap.temor.justificacion
        },
        estrategiaControl: {
          step: "estrategiaControl",
          label: "ESTRATEGIA DE CONTROL",
          sublabel: "Mecanismo humano de autoprotección",
          categoryType: "explorar",
          contenido: rawHeartMap.estrategiaControl.contenido,
          justificacion: rawHeartMap.estrategiaControl.justificacion
        },
        respuesta: {
          step: "respuesta",
          label: "RESPUESTA",
          sublabel: "Conducta manifiesta y síntoma observable",
          categoryType: "sabemos",
          contenido: rawHeartMap.respuesta.contenido,
          justificacion: rawHeartMap.respuesta.justificacion
        },
        fruto: {
          step: "fruto",
          label: "FRUTO / CONSECUENCIA",
          sublabel: "Impacto en paz, relaciones y oportunidades",
          categoryType: "explorar",
          contenido: rawHeartMap.fruto.contenido,
          justificacion: rawHeartMap.fruto.justificacion
        }
      }
    : {
        circunstancia: {
          step: "circunstancia",
          label: "CIRCUNSTANCIA",
          sublabel: "Situación reportada",
          categoryType: "sabemos",
          contenido: `Enfrentar situaciones vinculadas con ${primary.bloque || "el área principal de evaluación"}.`,
          justificacion: "Dato confirmado en tus respuestas del test."
        },
        interpretacion: {
          step: "interpretacion",
          label: "INTERPRETACIÓN",
          sublabel: "Lectura interna",
          categoryType: "explorar",
          contenido: `“Si algo no sale conforme a lo esperado, mi seguridad o valor personal quedan comprometidos.”`,
          justificacion: "Hipótesis pastoral a contrastar en oración."
        },
        deseo: {
          step: "deseo",
          label: "DESEO / ANHELO",
          sublabel: "Anhelo profundo",
          categoryType: "explorar",
          contenido: "Seguridad, validación y control sobre los resultados cotidianos.",
          justificacion: "Hipótesis sobre la motivación del corazón."
        },
        temor: {
          step: "temor",
          label: "TEMOR",
          sublabel: "Temor subyacente",
          categoryType: "explorar",
          contenido: "Ser descalificado/a, perder la aprobación o quedar expuesto/a ante la incertidumbre.",
          justificacion: "Hipótesis de raíz a examinar."
        },
        estrategiaControl: {
          step: "estrategiaControl",
          label: "ESTRATEGIA DE CONTROL",
          sublabel: "Mecanismo protector",
          categoryType: "explorar",
          contenido: "Autoexigencia, anticipación constante o repliegue defensivo.",
          justificacion: "Hipótesis sobre el mecanismo de respuesta."
        },
        respuesta: {
          step: "respuesta",
          label: "RESPUESTA",
          sublabel: "Conducta reportada",
          categoryType: "sabemos",
          contenido: primary.afirmacionTest || "Conducta recurrente identificada en el cuestionario.",
          justificacion: "Dato confirmado: Afirmación marcada en el cuestionario."
        },
        fruto: {
          step: "fruto",
          label: "FRUTO / CONSECUENCIA",
          sublabel: "Impacto observable",
          categoryType: "explorar",
          contenido: "Ansiedad de fondo, desgaste de energía y dificultad para experimentar el reposo de Dios.",
          justificacion: "Hipótesis sobre las consecuencias para validar."
        }
      };

  const scoresMap: Record<string, number> = {};
  if (primary.bloqueId) {
    scoresMap[primary.bloqueId] = observedScore;
  }
  if (Array.isArray(activeBeliefs)) {
    activeBeliefs.forEach(b => {
      if (b && b.bloqueId) {
        scoresMap[b.bloqueId] = b.score || b.screeningScore || 3;
      }
    });
  }
  const detectedInteractions = detectBlockInteractions(scoresMap);

  const result: AIDiagnosis = {
    exploratorio: exploratorioData,
    mapaDelCorazon: mapaDelCorazon,
    interacciones: detectedInteractions,
    fase1: {
      principalBelief: practicalGuide
        ? `Patrón de ${practicalGuide.shortTitle}: ${practicalGuide.patron}`
        : `Línea de exploración: ${primary.creencia}`,
      secondaryBeliefs:
        secondaryKeywords.length > 0
          ? secondaryKeywords.slice(0, 3)
          : ["Incertidumbre frecuente", "Tensión defensiva"],
      rootFear: `Hipótesis de temor: ${blockData.rootFear} (a explorar)`,
      dominantEmotion: blockData.dominantEmotion,
      affectedArea: blockData.affectedArea
    },
    fase2: {
      limitingBeliefExplanation: practicalGuide
        ? `DATO: ${practicalGuide.dato} (Puntaje: ${observedScore}/5).\n\nPATRÓN OBSERVABLE: ${practicalGuide.patron}\n\nHIPÓTESIS: Este patrón podría estar relacionado con temor a la incertidumbre, perfeccionismo de defensa o sobrecarga circunstancial. Se requieren preguntas adicionales para discernir cuál de estas hipótesis describe mejor la experiencia de ${name}.\n\nPREGUNTAS POR EXPLORAR:\n• ${practicalGuide.preguntasPorExplorar.join("\n• ")}`
        : primary.impacto,
      rootLie: `Hipótesis de creencia limitante a contrastar: "${primary.afirmacionTest}"`,
      currentCost: {
        decisions: blockData.decisions,
        emotions: blockData.emotions,
        relationships: blockData.relationships,
        potentialFuture: blockData.potentialFuture
      },
      selfSabotageMechanism: blockData.selfSabotage
    },
    fase3: {
      mentira: primary.afirmacionTest,
      verdadBiblica: primary.verdad,
      versiculo: {
        texto: primary.versiculos[0]?.txt || "Nuestra competencia proviene de Dios.",
        referencia: primary.versiculos[0]?.ref || "2 Corintios 3:5"
      },
      aplicacion: "Medita en este pasaje con calma por la mañana, respirando la paz que Dios te regala."
    },
    fase4: {
      declaracionIdentidad: primary.declaracion
    },
    fase5: {
      semana1: blockData.weeklyPlans.semana1,
      semana2: blockData.weeklyPlans.semana2,
      semana3: blockData.weeklyPlans.semana3,
      semana4: blockData.weeklyPlans.semana4
    },
    fase6: rawDays,
    reporteFinal: {
      antes: `Vivías bajo el desgaste de la autoexigencia o el miedo a la incertidumbre, tratando de sostener todo por tus propias fuerzas.`,
      ahora: `Caminas en la libertad y la paz de Cristo, sabiendo que tu identidad, sustento y destino descansan en las manos amorosas de Dios.`,
      creenciaDerribada: `Se desmantela la mentira de que debes ganarte el amor de Dios o la valía ante otros mediante tu rendimiento o control.`,
      verdadEstablecida: `Se establece la certeza de que eres amado/a y sustentado/a por pura gracia, con propósito eterno y descanso real.`,
      proximoPaso: `Mantener un momento diario de reflexión y agradecimiento, dando pasos pequeños de obediencia con serenidad.`,
      exhortacionBiblica: `Permanece firme en tu caminar con el Señor. 'Por tanto, despojémonos de todo peso... y corramos con paciencia la carrera que tenemos por delante, puestos los ojos en Jesús' (Hebreos 12:1-2).`
    }
  };

  return result;
}

