import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini API client if key exists
let aiClient: GoogleGenAI | null = null;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Route for comprehensive dynamic Christ-Centered Neuro-Spirituality Diagnosis (Fases 1-8)
app.post("/api/diagnostico", async (req, res) => {
  try {
    const { userName, userEmail, primaryBelief, activeBeliefs, userAge, userGoal, screeningAnswers = {} } = req.body;

    if (!userName || !primaryBelief) {
      return res.status(400).json({ error: "Missing required fields: userName and primaryBelief." });
    }

    if (!aiClient) {
      // Return flag indicating that AI is not configured, so frontend must fall back
      return res.json({ useFallback: true, message: "GEMINI_API_KEY is not configured on the server." });
    }

    const blockTitles: Record<string, string> = {
      "capacidad-identidad": "Capacidad e Identidad",
      "merecimiento-vinculo": "Merecimiento y Vínculo",
      "control-entorno": "Control y Entorno",
      "rendimiento-logro": "Rendimiento y Logro",
      "relaciones-poder": "Relaciones y Vínculos",
      "cuerpo-salud": "Cuerpo y Salud",
      "espiritualidad-trascendencia": "Espiritualidad y Trascendencia",
      "tiempo-futuro": "Tiempo y Futuro",
      "genero-identidad-social": "Aceptación Social e Identidad"
    };

    const screeningSummary = Object.keys(screeningAnswers).length > 0
      ? Object.entries(screeningAnswers).map(([k, v]) => `${blockTitles[k] || k}: ${v}`).join(", ")
      : "No provistos";

    const primaryBlockTitle = blockTitles[primaryBelief.bloqueId] || primaryBelief.bloque || primaryBelief.bloqueId;
    const primaryScore = screeningAnswers[primaryBelief.bloqueId] ?? primaryBelief.screeningScore ?? primaryBelief.score ?? 5;

    const sanitizedActiveBeliefs = Array.isArray(activeBeliefs)
      ? activeBeliefs.map((b: any) => ({
          bloqueId: b.bloqueId,
          afirmacionTest: b.afirmacionTest,
          intensity: b.intensity
        }))
      : [];

    const prompt = `
Actúa como un consejero bíblico pastoral sabio y empático, con profunda comprensión de la renovación mental (Romanos 12:2) y la consejería centrada en el Evangelio de la gracia de Cristo.

Tu tarea es analizar los datos de autoexploración de ${userName} (${userEmail || "Sin correo"}, Rango de edad: ${userAge || "No especificada"}, Meta vital de enfoque: ${userGoal || "Crecimiento integral"}) para generar un mapa de discernimiento, hipótesis de trabajo y un itinerario devocional de 30 días.

DATOS REPORTADOS POR EL USUARIO:
- Nombre: ${userName}
- Puntajes del screening (1 a 5) por área: ${screeningSummary}
- Área con mayor resonancia en el screening: ${primaryBlockTitle} (${primaryScore}/5)
- Afirmación marcada en el cuestionario: "${primaryBelief.afirmacionTest}"
- Respuestas en otras áreas activadas: ${JSON.stringify(sanitizedActiveBeliefs)}

FILOSOFÍA CENTRAL DE ATENCIÓN (OBLIGATORIA):
La aplicación NO diagnostica personas de forma dogmática ni etiqueta corazones.
Sigue estrictamente el principio:
DATOS → PATRONES → HIPÓTESIS → VALIDACIÓN → DIRECCIÓN DE AYUDA.
NUNCA presentes una inferencia o conjetura interna como un hecho incuestionable.
Por ejemplo:
- NO digas: "Control = 5. La raíz de tu corazón es miedo al rechazo y síndrome del impostor."
- SÍ debes formular:
  1. DATO: "Puntaje de 5/5 reportado en Control y Entorno."
  2. PATRÓN: "Existe una fuerte necesidad percibida de control, supervisión exhaustiva y vigilancia del entorno."
  3. HIPÓTESIS: "Este patrón podría estar relacionado con: (A) Búsqueda de seguridad por temor a la incertidumbre, (B) Perfeccionismo protector por miedo a la crítica o al error, o (C) Sobrecarga circunstancial acumulada por falta de apoyo."
  4. PREGUNTAS POR EXPLORAR: "¿Qué imaginas que ocurriría si sueltas la supervisión de esto? ¿Qué temes en el fondo que se desborde?"
  5. DIRECCIÓN DE AYUDA: "Aprender a discernir entre responsabilidad fiel y control ansioso, descansando en la gracia y soberanía de Cristo."

Toda conclusión que no sea directamente observable en los datos debe redactarse como HIPÓTESIS o LÍNEA DE REFLEXIÓN a explorar.

MODELO DE ANÁLISIS DEL CORAZÓN (OBLIGATORIO):
Debes generar también el objeto "mapaDelCorazon" con esta cascada de 7 pasos. Los ejemplos son solo de formato; basa el contenido en los puntajes y afirmaciones reales del usuario:
1. CIRCUNSTANCIA [categoryType: "sabemos", label: "CIRCUNSTANCIA", sublabel: "Contexto o detonante situacional"]: Situación concreta reportada por ${userName} a partir de su afirmación en el test ("${primaryBelief.afirmacionTest}") y su meta ("${userGoal || 'vida cotidiana'}"). (ej. Sobrecarga situacional de proyectos con plazos ajustados o relaciones cotidianas).
2. INTERPRETACIÓN [categoryType: "explorar", label: "INTERPRETACIÓN", sublabel: "Lectura o sentencia interna de la mente"]: Hipótesis de significado interior (ej. "Si no anticipo cada detalle, las cosas se desbordarán" o "Debo garantizar que todo salga bien").
3. DESEO / ANHELO [categoryType: "explorar", label: "DESEO / ANHELO", sublabel: "Lo que el corazón anhela o intenta asegurar"]: Hipótesis sobre la motivación del corazón (ej. seguridad, paz, honrar a Dios con fidelidad o agradar a los demás).
4. TEMOR [categoryType: "explorar", label: "TEMOR", sublabel: "La vulnerabilidad que se busca evitar a toda costa"]: Hipótesis sobre lo que más teme que quede expuesto (ej. incertidumbre, descontrol, rechazo o decepcionar a otros).
5. ESTRATEGIA DE CONTROL [categoryType: "explorar", label: "ESTRATEGIA DE CONTROL", sublabel: "Mecanismo humano de autoprotección"]: Hipótesis del mecanismo de respuesta (ej. hipervigilancia, asumir más tareas de las debidas o repliegue defensivo).
6. RESPUESTA [categoryType: "sabemos", label: "RESPUESTA", sublabel: "Conducta manifiesta y síntoma observable"]: Conducta o reacción concreta reportada en las respuestas (ej. postergar decisiones o revisar minuciosamente lo ajeno).
7. FRUTO / CONSECUENCIA [categoryType: "explorar", label: "FRUTO / CONSECUENCIA", sublabel: "Impacto en paz, relaciones y oportunidades"]: Hipótesis sobre el impacto desgastante (ej. tensión física, dificultad para reposar o desgaste relacional).

INTERACCIONES ENTRE BLOQUES (OBLIGATORIO):
Identifica 1 a 3 hipótesis de interacciones activas entre los bloques con puntajes notables del usuario (ejemplo: Control + Capacidad -> ¿controlar para compensar insuficiencia?; Control + Aceptación Social -> ¿controlar para proteger imagen?; Control + Tiempo -> ¿control generando sobrepreparación y retrasos?; Rendimiento + Merecimiento -> ¿condicionar el reposo a la producción?).
NO asumas que un bloque alto significa automáticamente un problema. Formula estas interacciones SIEMPRE como HIPÓTESIS de discernimiento con su correspondiente pregunta clave de exploración pastoral.

Distingue nítidamente: "sabemos" ("Lo que sabemos") para datos reportados, de "explorar" ("Lo que estamos proponiendo explorar") para hipótesis del corazón.
Estructura el JSON devuelto conforme al responseSchema configurado. No añadas explicaciones fuera del JSON.
`;

    const systemInstruction = `
Eres un consejero bíblico pastoral del ministerio Levántate Resplandece.
Tu tono es compasivo, cálido, respetuoso, libre de condenación y profundamente centrado en la gracia redentora de Jesucristo.
NUNCA etiquetes a la persona con diagnósticos psicológicos cerrados ni afirmaciones deterministas sobre su corazón.
Trata todo síntoma interior como una HIPÓTESIS pastoral a discernir conjuntamente con el usuario y en oración.
Usa un español sencillo, humano y edificante. No uses términos rebuscados ni exageraciones clínicas o pseudo-neurocientíficas.
Cita siempre el versículo bíblico con su texto exacto y referencia bíblica clara (ej. Proverbios 3:5-6).
Personaliza las 4 dimensiones de costo a la luz del área dominante y la meta vital seleccionada (${userGoal || "vida diaria"}).
`;


    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["fase1", "fase2", "fase3", "fase4", "fase5", "fase6", "reporteFinal"],
          properties: {
            exploratorio: {
              type: Type.OBJECT,
              description: "Estructura de exploración no determinista: DATO, PATRÓN, HIPÓTESIS, PREGUNTAS, VALIDACIÓN, DIRECCIÓN",
              properties: {
                dato: {
                  type: Type.OBJECT,
                  properties: {
                    bloque: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    descripcion: { type: Type.STRING }
                  }
                },
                patron: {
                  type: Type.OBJECT,
                  properties: {
                    titulo: { type: Type.STRING },
                    observacion: { type: Type.STRING }
                  }
                },
                hipotesis: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      titulo: { type: Type.STRING },
                      descripcion: { type: Type.STRING }
                    }
                  }
                },
                preguntasPorExplorar: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                validacion: {
                  type: Type.OBJECT,
                  properties: {
                    mensaje: { type: Type.STRING },
                    opciones: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                },
                direccionDeAyuda: {
                  type: Type.OBJECT,
                  properties: {
                    enfoque: { type: Type.STRING },
                    pasoInmediato: { type: Type.STRING },
                    acompanamientoRecomendado: { type: Type.STRING }
                  }
                }
              }
            },
            mapaDelCorazon: {
              type: Type.OBJECT,
              description: "MODELO DE ANÁLISIS DEL CORAZÓN (7 NIVELES: CIRCUNSTANCIA -> FRUTO)",
              properties: {
                circunstancia: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    label: { type: Type.STRING },
                    sublabel: { type: Type.STRING },
                    categoryType: { type: Type.STRING },
                    contenido: { type: Type.STRING },
                    justificacion: { type: Type.STRING }
                  }
                },
                interpretacion: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    label: { type: Type.STRING },
                    sublabel: { type: Type.STRING },
                    categoryType: { type: Type.STRING },
                    contenido: { type: Type.STRING },
                    justificacion: { type: Type.STRING }
                  }
                },
                deseo: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    label: { type: Type.STRING },
                    sublabel: { type: Type.STRING },
                    categoryType: { type: Type.STRING },
                    contenido: { type: Type.STRING },
                    justificacion: { type: Type.STRING }
                  }
                },
                temor: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    label: { type: Type.STRING },
                    sublabel: { type: Type.STRING },
                    categoryType: { type: Type.STRING },
                    contenido: { type: Type.STRING },
                    justificacion: { type: Type.STRING }
                  }
                },
                estrategiaControl: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    label: { type: Type.STRING },
                    sublabel: { type: Type.STRING },
                    categoryType: { type: Type.STRING },
                    contenido: { type: Type.STRING },
                    justificacion: { type: Type.STRING }
                  }
                },
                respuesta: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    label: { type: Type.STRING },
                    sublabel: { type: Type.STRING },
                    categoryType: { type: Type.STRING },
                    contenido: { type: Type.STRING },
                    justificacion: { type: Type.STRING }
                  }
                },
                fruto: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    label: { type: Type.STRING },
                    sublabel: { type: Type.STRING },
                    categoryType: { type: Type.STRING },
                    contenido: { type: Type.STRING },
                    justificacion: { type: Type.STRING }
                  }
                }
              }
            },
            interacciones: {
              type: Type.ARRAY,
              description: "Hipótesis de interacciones detectadas entre bloques del usuario",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  blockA: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      score: { type: Type.NUMBER }
                    }
                  },
                  blockB: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      score: { type: Type.NUMBER }
                    }
                  },
                  tag: { type: Type.STRING },
                  hipotesis: { type: Type.STRING },
                  preguntaClave: { type: Type.STRING },
                  direccionPastoral: { type: Type.STRING }
                }
              }
            },
            fase1: {
              type: Type.OBJECT,
              description: "Fase 1: Identificación y categorización de la conducta",
              required: ["principalBelief", "secondaryBeliefs", "rootFear", "dominantEmotion", "affectedArea"],
              properties: {
                principalBelief: { type: Type.STRING, description: "Patrón u observación conductual principal reportada" },
                secondaryBeliefs: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "2 o 3 áreas secundarias de tensión reportadas"
                },
                rootFear: { type: Type.STRING, description: "Hipótesis de temor subyacente a discernir" },
                dominantEmotion: { type: Type.STRING, description: "Emoción frecuente manifestada (ej. cansancio, inquietud, autoexigencia)" },
                affectedArea: { type: Type.STRING, description: "Área vital más sensible (ej. Identidad, Finanzas, Matrimonio, Liderazgo)" }
              }
            },
            fase2: {
              type: Type.OBJECT,
              description: "Fase 2: Exploración profunda mediante Datos, Patrón, Hipótesis y Preguntas",
              required: ["limitingBeliefExplanation", "rootLie", "currentCost", "selfSabotageMechanism"],
              properties: {
                limitingBeliefExplanation: { type: Type.STRING, description: "Análisis estructurado con DATO, PATRÓN, HIPÓTESIS y PREGUNTAS POR EXPLORAR" },
                rootLie: { type: Type.STRING, description: "Hipótesis de creencia limitante a contrastar con la Verdad de Dios" },
                currentCost: {
                  type: Type.OBJECT,
                  description: "Efectos en las 4 dimensiones vitales",
                  required: ["decisions", "emotions", "relationships", "potentialFuture"],
                  properties: {
                    decisions: { type: Type.STRING, description: "Costo en la toma de decisiones diarias" },
                    emotions: { type: Type.STRING, description: "Costo emocional de culpa o hipervigilancia" },
                    relationships: { type: Type.STRING, description: "Costo en los vínculos de pareja, familiares o amigos" },
                    potentialFuture: { type: Type.STRING, description: "Costo en el llamado espiritual y florecimiento futuro" }
                  }
                },
                selfSabotageMechanism: { type: Type.STRING, description: "Mecanismo cotidiano preciso de autosabotaje inconsciente" }
              }
            },
            fase3: {
              type: Type.OBJECT,
              description: "Fase 3: Renovación Bíblica Revelacional",
              required: ["mentira", "verdadBiblica", "versiculo", "aplicacion"],
              properties: {
                mentira: { type: Type.STRING, description: "Frase corta que personifica la mentira" },
                verdadBiblica: { type: Type.STRING, description: "La verdad revelada y sellada en la cruz para desmantelarla" },
                versiculo: {
                  type: Type.OBJECT,
                  required: ["texto", "referencia"],
                  properties: {
                    texto: { type: Type.STRING, description: "Voz textual del versículo seleccionado en su contexto real" },
                    referencia: { type: Type.STRING, description: "Cita bíblica precisa (ej. Romanos 8:1)" }
                  }
                },
                aplicacion: { type: Type.STRING, description: "Instrucciones de entrenamiento y aplicación espiritual diaria" }
              }
            },
            fase4: {
              type: Type.OBJECT,
              description: "Fase 4: Declaración de Filiación de Identidad Cristocéntrica",
              required: ["declaracionIdentidad"],
              properties: {
                declaracionIdentidad: { type: Type.STRING, description: "Declaración en primera persona fundamentada en la filiación de fe, la redención y la herencia en Cristo" }
              }
            },
            fase5: {
              type: Type.OBJECT,
              description: "Fase 5: Hoja de Ruta e Instrucciones Semanales de Reconfiguración",
              required: ["semana1", "semana2", "semana3", "semana4"],
              properties: {
                semana1: {
                  type: Type.OBJECT,
                  description: "Semana 1: Consciencia mental de la mentira",
                  required: ["objetivo", "reflexion", "autoconfrontacion", "registroPensamientos", "oracionGuiada"],
                  properties: {
                    objetivo: { type: Type.STRING, description: "Objetivo de la semana" },
                    reflexion: { type: Type.STRING, description: "Mensaje reflexivo sobre la mentira" },
                    autoconfrontacion: { type: Type.STRING, description: "Pregunta audaz que el usuario debe hacerse" },
                    registroPensamientos: { type: Type.STRING, description: "Cómo registrar y monitorizar los pensamientos" },
                    oracionGuiada: { type: Type.STRING, description: "Breve oración escrita para desarmarla" }
                  }
                },
                semana2: {
                  type: Type.OBJECT,
                  description: "Semana 2: Desmantelamiento cognitivo",
                  required: ["objetivo", "evidenciaContraria", "reencuadreBiblico", "desafiosPracticos", "interrupcionPatrones"],
                  properties: {
                    objetivo: { type: Type.STRING },
                    evidenciaContraria: { type: Type.STRING, description: "Instrucciones para listar evidencias que contradicen la mentira" },
                    reencuadreBiblico: { type: Type.STRING, description: "Cómo reencuadrar la historia bajo el lente de la soberanía de Dios" },
                    desafiosPracticos: { type: Type.STRING, description: "2 desafíos conductuales precisos para debilitar la creencia" },
                    interrupcionPatrones: { type: Type.STRING, description: "Técnica de anclaje físico para interrumpir el pensamiento rumiante" }
                  }
                },
                semana3: {
                  type: Type.OBJECT,
                  description: "Semana 3: Renovación y cableado nuevo",
                  required: ["objetivo", "meditacionDiaria", "memorizacionVersiculo", "diarioGratitud", "visualizacionBiblica"],
                  properties: {
                    objetivo: { type: Type.STRING },
                    meditacionDiaria: { type: Type.STRING, description: "Instrucción de ruminación santa de las escrituras" },
                    memorizacionVersiculo: { type: Type.STRING, description: "Pauta nemotécnica para guardar el versículo clave" },
                    diarioGratitud: { type: Type.STRING, description: "Método para registrar bendiciones sin meritocracia" },
                    visualizacionBiblica: { type: Type.STRING, description: "Ensayo mental imaginando caminar en victoria con Jesús" }
                  }
                },
                semana4: {
                  type: Type.OBJECT,
                  description: "Semana 4: Consolidación y obediencia de fe",
                  required: ["objetivo", "retosReales", "accionesFe", "conversacionesDificiles", "pasosObediencia"],
                  properties: {
                    objetivo: { type: Type.STRING },
                    retosReales: { type: Type.STRING, description: "Provocación de escenarios incómodos donde confiar en Dios" },
                    accionesFe: { type: Type.STRING, description: "Actos tangibles que honren su herencia de hijo" },
                    conversacionesDificiles: { type: Type.STRING, description: "Límites claros u honestos que debe hablar si aplica" },
                    pasosObediencia: { type: Type.STRING, description: "Siguiente paso ministerial o cotidiano de obediencia radical" }
                  }
                }
              }
            },
            fase6: {
              type: Type.ARRAY,
              description: "Fase 6: Itinerario de 30 Días de Reconfiguración de la Mente (30 días completos, no dejes espacios vacíos)",
              items: {
                type: Type.OBJECT,
                required: ["dia", "enfoque", "versiculo", "accion", "reflexion", "oracion"],
                properties: {
                  dia: { type: Type.INTEGER },
                  enfoque: { type: Type.STRING, description: "El título de enfoque devocional y mental de este día" },
                  versiculo: {
                    type: Type.OBJECT,
                    required: ["texto", "referencia"],
                    properties: {
                      texto: { type: Type.STRING, description: "El verso ancla corto para meditar este día" },
                      referencia: { type: Type.STRING, description: "Cita del libro capítulo:versículo" }
                    }
                  },
                  accion: { type: Type.STRING, description: "Una acción micro-comportamiento concreta para este día" },
                  reflexion: { type: Type.STRING, description: "Una pregunta o pensamiento de profunda autoconfrontación pastoral" },
                  oracion: { type: Type.STRING, description: "Oración sugerida, en primera persona, centrada en Cristo y el Espíritu Santo" }
                }
              }
            },
            reporteFinal: {
              type: Type.OBJECT,
              description: "Fase 8: Exhortación y Reporte Post-Renovación",
              required: ["antes", "ahora", "creenciaDerribada", "verdadEstablecida", "proximoPaso", "exhortacionBiblica"],
              properties: {
                antes: { type: Type.STRING, description: "Cómo operaba la mente bajo esclavitud anteriormente" },
                ahora: { type: Type.STRING, description: "Cómo camina libremente ahora gobernado por el Espíritu" },
                creenciaDerribada: { type: Type.STRING, description: "Breve sentencia del veredicto demolitorio de la limitación" },
                verdadEstablecida: { type: Type.STRING, description: "La verdad eterna de filiación que reescribe su porvenir" },
                proximoPaso: { type: Type.STRING, description: "Hábito duradero de santificación y crecimiento" },
                exhortacionBiblica: { type: Type.STRING, description: "Exhortación pastoral bíblica conclusiva con un pasaje motivador" }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text received from Gemini.");
    }

    const diagnosisResult = JSON.parse(resultText);
    res.json(diagnosisResult);

  } catch (error: any) {
    console.error("Error generating diagnosis with Gemini:", error);
    res.status(500).json({ error: error.message || "Failed to process diagnosis backend request." });
  }
});

// Serve static assets in production, otherwise Vite handles in development
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server starting on http://localhost:${PORT}`);
});
