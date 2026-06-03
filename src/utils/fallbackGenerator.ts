import { CreenciaRecord } from "../data/creencias";

export interface UserResult extends CreenciaRecord {
  category: string;
  intensity: number;
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
  
  // Specific properties for Week 2, 3, 4 fallback mapping
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
}

export function generateFallbackData(
  primary: UserResult,
  userName: string,
  userEmail: string,
  activeBeliefs: UserResult[]
): AIDiagnosis {
  const blockId = primary.bloqueId || "capacidad-identidad";
  const name = userName || "Hermano/a";

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
      rootFear: "Temor al rechazo absoluto y a ser expuesto como insuficiente ante los demás.",
      dominantEmotion: "Ansiedad de desempeño y vergüenza sutil",
      affectedArea: "Identidad y Liderazgo Profesional",
      rootLie: "Mi valor es relativo a mis logros y disminuye drásticamente ante cualquier equivocación humana.",
      selfSabotage: "Ocultamiento preventivo de ideas brillantes, sobrepreparación rumiante dolorosa y miedo a delegar.",
      explanation: "Esta creencia limita tu capacidad al condicionar constantemente tu suficiencia. Tu cerebro percibe los retos como amenazas de humillación, bloqueando la creatividad mediante picos repetitivos de cortisol.",
      decisions: "Evitar tomar iniciativas por pánico a cometer desvíos visibles, postergando la entrega de resultados álgidos.",
      emotions: "Carga de insuficiencia permanente, sintiendo que eres un fraude que en breve será descubierto por su entorno.",
      relationships: "Distanciamiento defensivo u ocultamiento de debilidades reales para mantener un escudo de perfección ficticia.",
      potentialFuture: "Vivir a la sombra de lo que has sido llamado a ser, desgastando tu liderazgo por miedo al veredicto externo.",
      weeklyPlans: {
        semana1: {
          objetivo: "Detectar la mentira en tu diálogo interior.",
          reflexion: `Tu mente, ${name}, aprendió a defenderse mediante una voz crítica demandante. Registra cada frase de desprecio.`,
          autoconfrontacion: "¿A quién exalto cuando dudo de mi competencia? ¿Al acusador o a Aquel que me justificó?",
          registroPensamientos: "Anota cada vez que te digas 'No sé suficiente' o 'Voy a fracasar'.",
          oracionGuiada: "Señor Jesús, saca a la luz mi afán de autoprotección. Dame discernimiento espiritual para anular hoy la voz del impostor. Amén."
        },
        semana2: {
          objetivo: "Debilitar la creencia antigua mediante evidencia de gracia.",
          evidenciaContraria: "Haz una lista de 5 ocasiones en tu trayectoria donde Dios te guio con poder a pesar de tus dudas.",
          reencuadreBiblico: "Relee Efesios 2:10 y reconoce que tus buenas obras ya fueron predestinadas con excelencia.",
          desafiosPracticos: "Comparte una iniciativa ante tu equipo de forma espontánea, absteniéndote del rumiar repetitivo.",
          interrupcionPatrones: "Cuando sientas pánico de insuficiencia, haz una pausa, respira a ritmo regular y di: 'Su poder se perfecciona hoy en mi debilidad'."
        },
        semana3: {
          objetivo: "Renovación consciente mediante la ruminación santa.",
          meditacionDiaria: "Medita en 2 Corintios 3:5 por la mañana antes de abrir cualquier pantalla. Establece tu competencia divina.",
          memorizacionVersiculo: "Repite salmos de liberación y graba la referencia en las notas rápidas de tu smartphone.",
          diarioGratitud: "Suma 3 motivos concretos para dar gracias a Dios que no dependan en absoluto de tus méritos laborales.",
          visualizacionBiblica: "Dedica 5 minutos antes de dormir a imaginar tus labores del día con paz total, sintiendo el sostén de Jesús."
        },
        semana4: {
          objetivo: "Vivir según la nueva identidad real de hijo de Dios.",
          retosReales: "Sé voluntario para coordinar o guiar un proyecto álgido, asumiendo el liderazgo de manera asertiva.",
          accionesFe: "Reconoce generosamente las virtudes de un colega sin comparar tus méritos ni sentirte disminuido.",
          conversacionesDificiles: "Expresa honestamente tus límites temporales a un superior, sabiendo que decir 'no' no reduce tu valía.",
          pasosObediencia: "Da un paso concreto en el llamado espiritual que has estado postergando por temor a no estar listo."
        }
      },
      daysTemplate: [
        {
          enfoque: "El origen de tu competencia",
          versiculo: { texto: "Nuestra competencia proviene de Dios.", referencia: "2 Corintios 3:5" },
          accion: "Declara en voz alta 3 veces: 'Mi capacidad no proviene de mí, sino de Aquel que me llamó'.",
          reflexion: "¿Qué tareas estás cargando solo, olvidando que Dios es tu socio y proveedor?",
          oracion: "Padre Celestial, rindo a tus pies mis fuerzas limitadas. Concédeme descansar en Tu suficiencia incondicional."
        },
        {
          enfoque: "Identificando la voz del impostor",
          versiculo: { texto: "No hay condenación para los que están en Cristo Jesús.", referencia: "Romanos 8:1" },
          accion: "Cada vez que surja un pensamiento crítico, di: 'Cristo ya saldó mi cuenta; camino con gozo y perdón'.",
          reflexion: "¿De quién es la voz que repite en tu mente que eres inferior o fraudulento?",
          oracion: "Jesucristo, Tu herencia me libra del escrutinio de los hombres. Sello mi mente con Tu gracia liberadora."
        },
        {
          enfoque: "Diseñado para buenas obras",
          versiculo: { texto: "Somos hechura suya, creados en Cristo Jesús para buenas obras.", referencia: "Efesios 2:10" },
          accion: "Registra en una hoja blanco tres dones valiosos que Dios te confió para bendecir a otros.",
          reflexion: "¿Cómo estás honrando los dones espirituales que te fueron prestados para edificación del Reino?",
          oracion: "Espíritu Santo, dirígeme hoy a las buenas obras que preparaste de antemano para mí. Amén."
        },
        {
          enfoque: "Desmantelando el pánico al error",
          versiculo: { texto: "El perfecto amor echa fuera el temor.", referencia: "1 Juan 4:18" },
          accion: "Hoy asume una respuesta o decisión sin retrasarla en busca de un visto bueno innecesario.",
          reflexion: "¿El temor a fallar está encogiéndote del llamado generoso del Altísimo?",
          oracion: "Padre paternal, Tu amor perfecto disipa mi pánico a equivocarme. Declaro que soy guiado por Tu sabiduría santa."
        },
        {
          enfoque: "Libre para fallar en gracia",
          versiculo: { texto: "Bástate mi gracia; porque mi poder se perfecciona en la debilidad.", referencia: "2 Corintios 12:9" },
          accion: "Escribe en tu libreta un error del pasado y crúzalo con la palabra: 'REDIMIDO POR LA GRACIA'.",
          reflexion: "¿Te perdonas a ti mismo con la misma abundancia con la que Cristo te perdonó en la cruz?",
          oracion: "Señor, admito mis imperfecciones humanas con humildad, sabiendo que en mi insuficiencia se luce Tu gloria."
        },
        {
          enfoque: "El veredicto eterno",
          versiculo: { texto: "Si Dios es por nosotros, ¿quién contra nosotros?", referencia: "Romanos 8:31" },
          accion: "Haz una lista de las opiniones humanas que te pesan y ríndelas quemándolas simbólicamente en oración.",
          reflexion: "¿Cuyo veredicto tiene mayor peso sobre tu destino, el del hombre o de tu Salvador?",
          oracion: "Señor Soberano, abrazo Tu veredicto justificativo por sobre todas las voces de rechazo."
        },
        {
          enfoque: "Descanso en la herencia divina",
          versiculo: { texto: "Y si hijos, también herederos; herederos de Dios y coherederos con Cristo.", referencia: "Romanos 8:17" },
          accion: "Medita hoy sobre el estatus incondicional de ser adoptado por el Rey de reyes.",
          reflexion: "¿Qué ventajas prácticas tiene para tu paz diaria saberte coheredero de Cristo?",
          oracion: "Padre, gracias por adoptarme como Hijo de la Promesa. Dejo atrás la mentalidad de esclavo necesitado."
        }
      ]
    },
    "merecimiento-vinculo": {
      rootFear: "Temor al abandono emocional y al vacío de soledad prolongada.",
      dominantEmotion: "Resignación melancólica y hipervigilancia vincular",
      affectedArea: "Matrimonio y Relaciones Interpersonales",
      rootLie: "Las bendiciones de Dios tienen facturas ocultas y ser amado requiere un sobreesfuerzo agotador.",
      selfSabotage: "Boicotear momentos de paz duradera forzando tensiones para retornar a escenarios dolorosos conocidos.",
      explanation: "Asocias la paz y felicidad con una tormenta inminente. La falta de merecimiento sabotea los lazos afectivos sanos al activar defensas tempranas.",
      decisions: "Frenar la cercanía emocional íntima, rechazando halagos genuinos o guardando distancias por autoprotección.",
      emotions: "Tristeza silenciosa y tensión constante, temiendo que en cualquier momento te dejarán o castigarán.",
      relationships: "Provocar peleas inconscientes o reclamar atención mediante reclamos ruidosos y de culpa.",
      potentialFuture: "Destruir progresivamente los lazos familiares más amados, viviendo en soledad autoinducida.",
      weeklyPlans: {
        semana1: {
          objetivo: "Detectar el miedo al abandono.",
          reflexion: "La mente hipermuda percibe la calma de hoy como una antesala de la tormenta. Descubre esos nudos de culpa.",
          autoconfrontacion: "¿Creo realmente que Dios me mira con agrado sincero o vivo esperando Su castigo?",
          registroPensamientos: "Anota las frases internas como 'Esto es demasiado bueno para durar' o 'Se van a cansar de mí'.",
          oracionGuiada: "Señor, desarma mi sospecha vincular. Enséñame a recibir el gozo puro de ser amado sin deudas. Amén."
        },
        semana2: {
          objetivo: "Desmantelar la culpa de merecimiento.",
          evidenciaContraria: "Destaca 3 bendiciones inmerecidas que Dios te dio gratis por pura gracia amorosa.",
          reencuadreBiblico: "Interpreta el amor con base en Romanos 8:39. Nada te separará de Su amor.",
          desafiosPracticos: "Acepta un halago sincero o regalo agradeciendo cordialmente, sin restarle valor.",
          interrupcionPatrones: "Cuando sientas impulso de generar conflicto vincular, haz silencio, cuenta a 10 y di: 'Su bondad me habita'."
        },
        semana3: {
          objetivo: "Afianzar el amor incondicional del Padre.",
          meditacionDiaria: "Reflexiona en Sofonías 3:17: Él se regocija sobre ti con cantares. Cree en Su cantar.",
          memorizacionVersiculo: "Guarda Efesios 3:18 sobre la anchura y longitud del amor eterno de Jesús.",
          diarioGratitud: "Suma 3 agradecimientos sobre tus relaciones que hayan traído consuelo esta semana.",
          visualizacionBiblica: "Imagínate cobijado a los pies de la cruz, respirando el perdón de Jesús y abandonando toda culpa."
        },
        semana4: {
          objetivo: "Vivir bajo la filiación de amor audaz.",
          retosReales: "Pide ayuda expresa para algo personal a un ser querido, rompiendo la autosuficiencia temerosa.",
          accionesFe: "Escribe una nota de gratitud generosa a tu pareja o amigo sin esperar reciprocidad inmediata.",
          conversacionesDificiles: "Expresa con ternura y firmeza una necesidad emocional sin airarte ni culpar.",
          pasosObediencia: "Invita a cenar o ayuda a alguien que consideres que Dios te ha guiado a consolar esta semana."
        }
      },
      daysTemplate: [
        {
          enfoque: "El amor incondicional",
          versiculo: { texto: "No os dejaré huérfanos; vendré a vosotros.", referencia: "Juan 14:18" },
          accion: "Escribe en grande en tu diario: 'NUNCA máis seré huérfano; el Padre habita en mí'.",
          reflexion: "¿En qué momentos del día experimentas la mentira vincular de la orfandad?",
          oracion: "Padre de bondad, derriba los muros de mi autoprotección vincular y fúndeme en Tu tierno amor divino."
        },
        {
          enfoque: "La bendición limpia de Dios",
          versiculo: { texto: "La bendición de Jehová es la que enriquece, y no añade tristeza con ella.", referencia: "Proverbios 10:22" },
          accion: "Celebra hoy un logro o momento de paz en pareja o familia dando gracias a Dios genuinamente.",
          reflexion: "¿Esperas secretamente que tras cada bendición de Dios venga un golpe severo de dolor?",
          oracion: "Soberano Salvador, Tus dádivas son eternas y limpias. Me dispongo a gozar de Tus favores con fe."
        },
        {
          enfoque: "Irrompible amor de gracia",
          versiculo: { texto: "Ni lo alto ni lo profundo podrá separarnos del amor de Dios.", referencia: "Romanos 8:39" },
          accion: "Dibuja un círculo y dentro escribe tu nombre, rodeándolo con la palabra: 'AMADO SIN CONDICIONES'.",
          reflexion: "¿Existe alguna falla humana que sea más grande que la misericordia de Cristo?",
          oracion: "Jesús, Tu sacrificio de sangre me unió a tu Padre para siempre. Descanso seguro en la fidelidad celestial."
        }
      ]
    }
  };

  // Default block fallback if ID not found mapping
  const blockData = blockDataMap[blockId] || blockDataMap["capacidad-identidad"];

  // Generate 30 dynamic days of devotional plans
  const totalDays = 30;
  const rawDays: DayPlan[] = [];
  
  for (let i = 1; i <= totalDays; i++) {
    const templateIdx = (i - 1) % blockData.daysTemplate.length;
    const item = blockData.daysTemplate[templateIdx];
    
    // Customize title and days index
    rawDays.push({
      dia: i,
      enfoque: `Día ${i}: ${item.enfoque}`,
      versiculo: { ...item.versiculo },
      accion: item.accion,
      reflexion: `[Autoconfrontación Día ${i}] ${item.reflexion}`,
      oracion: item.oracion
    });
  }

  // Compile full dynamic 8-phase object matching requirements
  const secondaryKeywords = activeBeliefs
    .filter(b => b.id !== primary.id)
    .map(b => b.alias.concat(` (${b.creencia})`));

  const result: AIDiagnosis = {
    fase1: {
      principalBelief: primary.creencia,
      secondaryBeliefs: secondaryKeywords.length > 0 ? secondaryKeywords.slice(0, 3) : ["Incertidumbre Rumiante", "Sobreexilio Emocional"],
      rootFear: blockData.rootFear,
      dominantEmotion: blockData.dominantEmotion,
      affectedArea: blockData.affectedArea
    },
    fase2: {
      limitingBeliefExplanation: primary.impacto,
      rootLie: blockData.rootLie,
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
        texto: primary.versiculos[0]?.txt || "No que seamos competentes por nosotros mismos...",
        referencia: primary.versiculos[0]?.ref || "2 Corintios 3:5"
      },
      aplicacion: "Meditar el pasaje de forma rítmica 5 minutos por la mañana, respirando la paz del Espíritu Santo."
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
      antes: `Caminabas con el peso del autosabotaje, controlando el entorno en hipervigilancia extrema o escondiéndote por temor al juicio de los hombres.`,
      ahora: `Caminas bajo la bandera de redención total y filiación incondicional, sabiendo que tu capacidad y provisión descansan en los hombros del Altísimo.`,
      creenciaDerribada: `Se disuelve la mentira de que debes ganarte el agrado de Dios y de los hombres mediante tu rendimiento impecable, destruyendo el altar de la meritocracia secular.`,
      verdadEstablecida: `Se establece la herencia eterna de que eres hechura divina, un heredero de gracia que obra de reposo a labor en el reposo celestial.`,
      proximoPaso: `Sostener un diario semanal de gratitud íntima y congregarte bajo un mentor espiritual para cultivar la obediencia de fe diaria.`,
      exhortacionBiblica: `Mantén un celo continuo por tu renovación y madurez espiritual en Cristo Jesús. 'Por tanto, nosotros también, teniendo en derredor nuestro tan grande nube de testigos... despojémonos de todo peso... y corramos con paciencia la carrera...' (Hebreos 12:1-2).`
    }
  };

  return result;
}
