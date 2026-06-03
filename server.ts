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
    const { userName, userEmail, primaryBelief, activeBeliefs } = req.body;

    if (!userName || !primaryBelief) {
      return res.status(400).json({ error: "Missing required fields: userName and primaryBelief." });
    }

    if (!aiClient) {
      // Return flag indicating that AI is not configged, so frontend must fall back
      return res.json({ useFallback: true, message: "GEMINI_API_KEY is not configured on the server." });
    }

    const prompt = `
Actúa como un experto de calibre mundial en neurociencia de la fe, consejería bíblica pastoral profunda, psicología de la reestructuración cognitiva, coaching de transformación espiritual y discipulado cristiano centrado en la gracia de Cristo.

Tu tarea es analizar los datos de diagnóstico de ${userName} (${userEmail || "Sin correo"}) para generar un diagnóstico e itinerario de renovación mental y de filiación incondicional de 8 Fases.

DATOS DEL USUARIO:
- Nombre: ${userName}
- Creencia Limitante Principal Detectada: ${primaryBelief.creencia} (${primaryBelief.alias})
- Descripción de Impacto: ${primaryBelief.impacto}
- Aspecto Neurobiológico de esta creencia: ${primaryBelief.neuro}
- Declaración de Temor: "${primaryBelief.afirmacionTest}"
- Respuestas de apoyo / creencias secundarias activadas en su diagnóstico: ${JSON.stringify(activeBeliefs)}

Debes generar una análisis pastoral y científico profundo estructurado de acuerdo con el siguiente formato JSON. Adhiérete estrictamente a los pilares de la VERDAD BÍBLICA, la GRACIA DE CRISTO, la NEUROPLASTICIDAD como herramienta de aprendizaje diseñada por Dios, y la ACCIÓN CONSISTENTE. No uses autodecretos humanistas, ley de atracción ni psicología secular de forma auto-idólatra. Toda la gloria y fuerza provienen del Salvador Jesucristo.

Estructura el JSON devuelto conforme al responseSchema configurado. No añadas explicaciones fuera del JSON.
`;

    const systemInstruction = `
Eres un consejero bíblico y pastor con amplio dominio en neurociencia cognitiva y plasticidad neural (dirigida por la verdad de Romanos 12:2).
Tu tono es compasivo, solemne, clínico-pastoral, profundamente sincero y lleno de fe en la obra terminada de Cristo Jesús.
Evitas ideas de atracción, manifestación o declaraciones de autosuficiencia humanista ("yo soy el capitán de mi destino"). Al contrario, declaras herencia por filiación, adopción y redención inmerecida.
Genera un plan de 30 días real, interactivo, profundo, no repetitivo y de alta calidad pastoral.
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
            fase1: {
              type: Type.OBJECT,
              description: "Fase 1: Identificación y categorización de la creencia",
              required: ["principalBelief", "secondaryBeliefs", "rootFear", "dominantEmotion", "affectedArea"],
              properties: {
                principalBelief: { type: Type.STRING, description: "La creencia limitadora primordial identificada" },
                secondaryBeliefs: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "2 o 3 creencias limitantes complementarias o relacionadas"
                },
                rootFear: { type: Type.STRING, description: "El temor subyacente absoluto que sustenta esta mentira" },
                dominantEmotion: { type: Type.STRING, description: "La emoción crónica predominante (ej. angustia, culpa, apatía, frustración)" },
                affectedArea: { type: Type.STRING, description: "La esfera vital más herida (ej. Identidad, Finanzas, Matrimonio, Liderazgo, etc.)" }
              }
            },
            fase2: {
              type: Type.OBJECT,
              description: "Fase 2: Diagnóstico profundo del problema",
              required: ["limitingBeliefExplanation", "rootLie", "currentCost", "selfSabotageMechanism"],
              properties: {
                limitingBeliefExplanation: { type: Type.STRING, description: "Análisis neuro-espiritual de la creencia" },
                rootLie: { type: Type.STRING, description: "La mentira del diablo o de la carne que el usuario asume involuntariamente" },
                currentCost: {
                  type: Type.OBJECT,
                  description: "Efectos limitantes reales en las 4 dimensiones vitales",
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
