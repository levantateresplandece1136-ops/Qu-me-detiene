import { jsPDF } from "jspdf";

/**
 * Sanitizes text for jsPDF using standard Helvetica.
 * Strips emojis and unsupported Unicode symbols, converts arrows to ASCII,
 * and preserves valid Latin-1 / Windows-1252 characters (accents, ñ, ¿, ¡, «, », —, •).
 */
export const sanitizePdfText = (text: any): string => {
  if (text === null || text === undefined) return "";
  let s = typeof text === "string" ? text : String(text);

  // Replace arrow symbols with clean ASCII equivalents
  s = s.replace(/↔/g, "<->").replace(/→/g, "->").replace(/←/g, "<-");

  // Remove emojis and miscellaneous pictographic symbols
  s = s.replace(/[\u{1F000}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{200D}]|[\u{20E3}]|[\u{E0020}-\u{E007F}]/gu, "");

  // Remove any character outside standard ASCII and Windows-1252 / Latin-1 ranges
  // Preserves: \r, \n, \t, space to ~, \xA0 to \xFF, plus en-dash, em-dash, curly quotes, and bullet •
  s = s.replace(/[^\r\n\t\x20-\x7E\xA0-\xFF\u2013\u2014\u2018\u2019\u201C\u201D\u2022]/g, "");

  // Clean leading spaces and multiple whitespace left behind by removed symbols
  s = s.replace(/^[ \t]+/, "").replace(/[ \t]{2,}/g, " ");

  return s;
};

export const downloadPDFResults = (
  userName: string,
  userEmail: string,
  aiDiagnosis: any,
  results: any[],
  _journalNotes: Record<string | number, string>,
  interactionConfidenceLevels?: Record<string, string>,
  stageSummary?: {
    busca?: string[];
    teme?: string[];
    protege?: string[];
    produce?: string[];
  },
  localInteractions?: any[],
  rejectedIds?: Record<string, boolean>
) => {
  const interactionsToPrint: any[] = localInteractions ? localInteractions : (aiDiagnosis?.interacciones || []);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let pageNum = 1;
  const margin = 20;
  const pageWidth = 210;
  const pageHeight = 297;
  const maxWidth = pageWidth - (margin * 2);
  let y = 20;

  const drawHeader = () => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(sanitizePdfText("TRANSFORMACIÓN INTERIOR • PROGRAMA DE RENOVACIÓN MENTAL"), margin, margin - 10);
    doc.setDrawColor(201, 168, 76); // Gold accent color
    doc.setLineWidth(0.3);
    doc.line(margin, margin - 7, pageWidth - margin, margin - 7);
  };

  const drawFooter = () => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    doc.text(sanitizePdfText(`Participante: ${userName}  |  Ministerio Levántate Resplandece`), margin, pageHeight - 10);
    doc.text(sanitizePdfText(`Página ${pageNum}`), pageWidth - margin - 15, pageHeight - 10);
  };

  const checkNewPage = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      drawFooter();
      doc.addPage();
      pageNum++;
      y = margin;
      drawHeader();
    }
  };

  // COVER / HEADER TITLE
  const drawTitle = () => {
    // Elegant border
    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(1);
    doc.rect(margin - 5, margin - 5, maxWidth + 10, pageHeight - (margin * 2) + 10);

    y = 40;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(20, 20, 20);
    doc.text(sanitizePdfText("Transformación Interior"), margin + 10, y);
    
    y += 10;
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(201, 168, 76); // Gold color
    doc.text(sanitizePdfText('"Transformaos por medio de la renovación de vuestro entendimiento" - Romanos 12:2'), margin + 10, y, { maxWidth: maxWidth - 20 });

    y += 20;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(sanitizePdfText("HISTORIAL DE TRANSFORMACIÓN PERSONAL"), margin + 10, y);

    y += 12;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(sanitizePdfText(`Participante: ${userName}`), margin + 10, y);
    y += 6;
    doc.text(sanitizePdfText(`Correo Registrado: ${userEmail || "No provisto"}`), margin + 10, y);
    y += 6;
    doc.text(sanitizePdfText(`Fecha de Diagnóstico: ${new Date().toLocaleDateString('es-ES')}`), margin + 10, y);
    y += 6;
    doc.text(sanitizePdfText("Metodología: Consejería Bíblica y Pastoral Cristocéntrica (Levántate Resplandece)"), margin + 10, y, { maxWidth: maxWidth - 20 });

    y += 15;
    // Advertencia de seguridad clínica en portada
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.4);
    doc.rect(margin + 5, y, maxWidth - 10, 22, "FD");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(180, 83, 9);
    doc.text(sanitizePdfText("AVISO ÉTICO Y SEGURIDAD CLÍNICA:"), margin + 8, y + 5);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(60, 60, 60);
    const disclaimer = "Esta herramienta formativa no constituye diagnóstico clínico y no sustituye evaluación psicológica o psiquiátrica profesional. Ante ideación suicida, autolesiones, violencia o crisis agudas, derive de inmediato a servicios médicos o líneas de emergencia especializadas.";
    doc.text(doc.splitTextToSize(sanitizePdfText(disclaimer), maxWidth - 16), margin + 8, y + 10);

    y += 28;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const introText = "Este documento representa el Mapa de Exploración del Corazón y el itinerario de acompañamiento pastoral. Contiene datos observables, hipótesis no deterministas para explorar, la pregunta central de sesión, la dirección bíblica en 4 movimientos y las prácticas de fidelidad.";
    doc.text(doc.splitTextToSize(sanitizePdfText(introText), maxWidth - 20), margin + 10, y);

    y += 30;
    doc.setDrawColor(201, 168, 76);
    doc.setFillColor(201, 168, 76);
    doc.rect(margin + 10, y, 60, 0.5, "F");
    y += 5;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(sanitizePdfText("Ministerio Levántate Resplandece"), margin + 10, y);

    drawFooter();
    doc.addPage();
    pageNum++;
    y = margin;
    drawHeader();
  };

  drawTitle();

  const writeHeading = (text: string) => {
    const cleanText = sanitizePdfText(text);
    if (!cleanText) return;
    checkNewPage(18);
    y += 6;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(175, 142, 45); // Darker gold for readability
    doc.text(cleanText, margin, y);
    y += 2;
    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  const writeKeyValue = (label: string, value: string) => {
    const cleanLabel = sanitizePdfText(label);
    const cleanValue = sanitizePdfText(value);
    if (!cleanValue || cleanValue.trim() === "" || cleanValue === "No provisto") return;
    const wrappedValue = doc.splitTextToSize(cleanValue, maxWidth - 35);
    const neededHeight = (wrappedValue.length * 5) + 6;
    checkNewPage(neededHeight);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text(`• ${cleanLabel}:`, margin, y);
    
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    doc.text(wrappedValue, margin + 32, y);
    y += (wrappedValue.length * 5) + 1;
  };

  const writeTextBlock = (title: string, text: string, isAlert = false) => {
    const cleanTitle = sanitizePdfText(title);
    const cleanText = sanitizePdfText(text);
    if (!cleanText || cleanText.trim() === "" || cleanText === "No provisto") return;
    const wrappedText = doc.splitTextToSize(cleanText, maxWidth - 16);
    const neededHeight = (wrappedText.length * 5) + 15;
    checkNewPage(neededHeight);

    // Callout box background
    doc.setFillColor(isAlert ? 254 : 249, isAlert ? 242 : 248, isAlert ? 242 : 236);
    doc.setDrawColor(isAlert ? 248 : 201, isAlert ? 180 : 168, isAlert ? 180 : 76);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, maxWidth, (wrappedText.length * 5) + 10, "FD");

    y += 6;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(isAlert ? 153 : 133, isAlert ? 27 : 97, isAlert ? 27 : 33);
    doc.text(cleanTitle, margin + 5, y);
    
    y += 5;
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(wrappedText, margin + 5, y);
    y += (wrappedText.length * 5) + 5;
  };

  // SECTION 1
  writeHeading("PRINCIPIO FUNDAMENTAL");
  writeTextBlock(
    "REGLA PASTORAL DE ORO • MAPA DE COMPRENSIÓN, NO ETIQUETA",
    "«La herramienta no pretende decirle al consejero quién es la persona. Pretende ayudarle a hacer mejores preguntas para comprender cómo esa persona está interpretando sus circunstancias, qué está buscando, qué teme, cómo responde y dónde necesita ser redirigida hacia la verdad de Dios y la suficiencia de Cristo.»\n\n• Meta del sistema: La meta no es producir una etiqueta; es producir un mapa de comprensión y una dirección de ayuda.\n• Dejar atrás: «¿Qué diagnóstico tiene esta persona?» (etiquetas estáticas).\n• Comprensión bíblica: «¿Qué está pasando en esta persona y cómo puedo ayudarla bíblicamente?»\n• Fidelidad en Cristo: «¿Cómo puede esta persona aprender a responder con fe y fidelidad a Dios en sus circunstancias concretas?»",
    false
  );

  writeHeading("FASE 1 Y 2: MAPA DE EXPLORACIÓN Y DISCERNIMIENTO PASTORAL");
  
  if (aiDiagnosis?.exploratorio) {
    const exp = aiDiagnosis.exploratorio;
    writeTextBlock("1. DATO OBSERVABLE REPORTADO", exp.dato?.descripcion, false);
    writeTextBlock("2. PATRÓN CONDUCTUAL OBSERVABLE", exp.patron?.observacion, false);

    if (exp.hipotesis && exp.hipotesis.length > 0) {
      checkNewPage(35);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text(sanitizePdfText("3. HIPÓTESIS DE TRABAJO (A DISCERNIR, NO ETIQUETAS FIJAS):"), margin, y);
      y += 6;
      exp.hipotesis.forEach((h: any) => {
        writeKeyValue(h.titulo, h.descripcion);
      });
    }

    if (exp.preguntasPorExplorar && exp.preguntasPorExplorar.length > 0) {
      checkNewPage(30);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text(sanitizePdfText("4. PREGUNTAS PARA EXPLORAR EN ORACIÓN Y CONSEJERÍA:"), margin, y);
      y += 6;
      exp.preguntasPorExplorar.forEach((p: string, idx: number) => {
        writeKeyValue(`Pregunta ${idx + 1}`, p);
      });
    }

    writeTextBlock("5. DIRECCIÓN DE AYUDA Y GRACIA", exp.direccionDeAyuda?.enfoque, false);
  } else {
    const primaryPatternText = aiDiagnosis?.fase1?.principalBelief || (results && (results[0]?.afirmacionTest ? `Posible patrón a contrastar: «${results[0].afirmacionTest}»` : (results[0]?.alias || results[0]?.creencia)));
    writeKeyValue("Patrón Principal", primaryPatternText);
    writeKeyValue("Hipótesis de Temor", aiDiagnosis?.fase1?.rootFear || 'Temor a la incertidumbre o al error.');
    writeKeyValue("Emoción Frecuente", aiDiagnosis?.fase1?.dominantEmotion || 'Inquietud o sobrecarga');
    writeKeyValue("Área Más Sensible", aiDiagnosis?.fase1?.affectedArea || 'Vida Diaria y Relaciones');
    
    y += 2;
    writeTextBlock(
      "HIPÓTESIS DE CREENCIA A CONTRASTAR", 
      aiDiagnosis?.fase2?.rootLie || 'Mi valía y seguridad dependen de mi propio control.',
      true
    );
    writeTextBlock(
      "TENDENCIA OBSERVABLE DE FRENO INVOLUNTARIO",
      aiDiagnosis?.fase2?.selfSabotageMechanism || 'Postergación o hipervigilancia excesiva.',
      false
    );
  }

  // SECCIÓN: LO QUE COMPARTISTE (ETAPAS 03–06)
  const hasStageData = Boolean(
    stageSummary &&
    ((stageSummary.busca && stageSummary.busca.length > 0) ||
     (stageSummary.teme && stageSummary.teme.length > 0) ||
     (stageSummary.protege && stageSummary.protege.length > 0) ||
     (stageSummary.produce && stageSummary.produce.length > 0))
  );

  if (hasStageData && stageSummary) {
    writeHeading("LO QUE COMPARTISTE");
    const stageItems = [
      { label: "Lo que buscas", values: stageSummary.busca },
      { label: "Lo que temes", values: stageSummary.teme },
      { label: "Cómo te proteges", values: stageSummary.protege },
      { label: "Dónde notas el desgaste", values: stageSummary.produce }
    ];

    stageItems.forEach(({ label, values }) => {
      if (!values || values.length === 0) return;
      const cleanLabel = sanitizePdfText(label);
      const cleanVal = sanitizePdfText(values.join(", "));
      if (!cleanVal) return;

      const prefix = `• ${cleanLabel}: `;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      const prefixWidth = doc.getTextWidth(prefix);

      const wrappedVal = doc.splitTextToSize(cleanVal, maxWidth - prefixWidth);
      checkNewPage((wrappedVal.length * 5) + 4);

      doc.setFont("Helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      doc.text(prefix, margin, y);

      doc.setFont("Helvetica", "normal");
      doc.setTextColor(70, 70, 70);
      doc.text(wrappedVal[0], margin + prefixWidth, y);

      if (wrappedVal.length > 1) {
        for (let i = 1; i < wrappedVal.length; i++) {
          y += 4.5;
          doc.text(wrappedVal[i], margin + 6, y);
        }
      }
      y += 6;
    });
    y += 2;
  }

  // MODELO DE ANÁLISIS DEL CORAZÓN (7 NIVELES)
  if (aiDiagnosis?.mapaDelCorazon) {
    const map = aiDiagnosis.mapaDelCorazon;
    writeHeading("MODELO DE ANÁLISIS DEL CORAZÓN (DINÁMICA BÍBLICA: CIRCUNSTANCIA -> FRUTO)");

    const writeHeartStep = (label: string, text: string | undefined, type: 'sabemos' | 'explorar', detail: string) => {
      const cleanText = sanitizePdfText(text);
      if (!cleanText || cleanText.trim() === "" || cleanText === "No provisto") {
        return; // Omit step if no content is provided
      }
      const isKnown = type === 'sabemos';
      const badge = isKnown ? "[LO QUE SABEMOS - DATO REPORTADO]" : "[PROPUESTO PARA EXPLORAR - HIPÓTESIS]";
      const wrappedText = doc.splitTextToSize(cleanText, maxWidth - 16);
      const neededHeight = (wrappedText.length * 5) + 16;
      checkNewPage(neededHeight);

      doc.setFillColor(isKnown ? 240 : 254, isKnown ? 253 : 250, isKnown ? 244 : 235);
      doc.setDrawColor(isKnown ? 74 : 201, isKnown ? 180 : 168, isKnown ? 120 : 76);
      doc.setLineWidth(0.4);
      doc.rect(margin, y, maxWidth, (wrappedText.length * 5) + 12, "FD");

      y += 5;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(isKnown ? 21 : 133, isKnown ? 128 : 97, isKnown ? 61 : 33);
      doc.text(sanitizePdfText(`${label} • ${badge}`), margin + 5, y);

      y += 4.5;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      doc.text(wrappedText, margin + 5, y);

      y += (wrappedText.length * 5) + 0.5;
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text(sanitizePdfText(detail), margin + 5, y);
      y += 6;
    };

    writeHeartStep("1. CIRCUNSTANCIA", map.circunstancia?.contenido, "sabemos", "Dato confirmado: Situación y respuestas reportadas en el test.");
    writeHeartStep("2. INTERPRETACIÓN", map.interpretacion?.contenido, "explorar", "Hipótesis pastoral: Lectura o sentencia interna de la mente.");
    writeHeartStep("3. DESEO / ANHELO", map.deseo?.contenido, "explorar", "Hipótesis del corazón: Anhelo profundo o ídolo sutil.");
    writeHeartStep("4. TEMOR", map.temor?.contenido, "explorar", "Hipótesis de raíz: Vulnerabilidad que se busca evitar.");
    writeHeartStep("5. ESTRATEGIA DE CONTROL", map.estrategiaControl?.contenido, "explorar", "Hipótesis de mecanismo: Maniobra de autoprotección humana.");
    writeHeartStep("6. RESPUESTA", map.respuesta?.contenido, "sabemos", "Dato confirmado: Conducta manifiesta reportada en el cuestionario.");
    writeHeartStep("7. FRUTO / CONSECUENCIA", map.fruto?.contenido, "explorar", "Hipótesis de impacto: Consecuencias emocionales y relacionales a validar.");
  }

  // Cross-block interactions
  if (interactionsToPrint.length > 0) {
    checkNewPage(45);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(201, 168, 76);
    doc.text(sanitizePdfText("INTERACCIONES DETECTADAS ENTRE BLOQUES (HIPÓTESIS DE TRABAJO):"), margin, y);
    y += 6;

    interactionsToPrint.forEach((inter: any) => {
      checkNewPage(32);
      doc.setFillColor(250, 248, 240);
      doc.setDrawColor(201, 168, 76);
      doc.roundedRect(margin, y, maxWidth, 24, 2, 2, "FD");

      const signalPrefix = inter.nivel === 'senal' ? '(A explorar) ' : '';
      const confLevel = interactionConfidenceLevels?.[inter.id];
      const confSuffix = confLevel ? ` - Confianza: ${confLevel}` : '';
      const rejectedSuffix = rejectedIds?.[inter.id] ? ' - No te identificaste' : '';
      const interTitle = sanitizePdfText(`${signalPrefix}[${inter.blockA?.name || ''} ${inter.blockA?.score || 1}/5] <-> [${inter.blockB?.name || ''} ${inter.blockB?.score || 1}/5] - ${inter.tag || ''}${confSuffix}${rejectedSuffix}`);
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);
      doc.text(interTitle, margin + 4, y + 5);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      const splitHyp = doc.splitTextToSize(sanitizePdfText(inter.hipotesis), maxWidth - 8);
      doc.text(splitHyp.slice(0, 2), margin + 4, y + 10);

      doc.setFont("Helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(120, 100, 60);
      const splitQ = doc.splitTextToSize(sanitizePdfText(`Pregunta clave: ${inter.preguntaClave}`), maxWidth - 8);
      doc.text(splitQ[0] || "", margin + 4, y + 20);

      y += 28;
    });
  }

  y += 2;
  checkNewPage(40);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(sanitizePdfText("COSTOS ESTIMADOS EN TU COGNICIÓN (LAS 4 DIMENSIONES):"), margin, y);
  y += 6;
  writeKeyValue("En Decisiones", aiDiagnosis?.fase2?.currentCost?.decisions || "Parálisis cerebral o rumiación antes de firmar compromisos.");
  writeKeyValue("En Emociones", aiDiagnosis?.fase2?.currentCost?.emotions || "Carga simpática de angustia y culpa constante al descansar.");
  writeKeyValue("En Relaciones", aiDiagnosis?.fase2?.currentCost?.relationships || "Distanciamiento defensivo por hipervigilancia de críticas.");
  writeKeyValue("En Tu Propósito", aiDiagnosis?.fase2?.currentCost?.potentialFuture || "Prisión de talentos escondidos bajo sospechas persistentes.");

  // SECTION 2
  writeHeading("FASE 3 Y 4: RENOVACIÓN BÍBLICA Y NUEVA IDENTIDAD CRISTOCÉNTRICA");
  writeTextBlock(
    "LA MENTIRA CARNAL ENFRENTADA DE FRENTE",
    aiDiagnosis?.fase3?.mentira || (results && results[0]?.afirmacionTest),
    true
  );
  writeTextBlock(
    "LA VERDAD ETERNA SUSTITUTORIA DE REENCUADRE",
    aiDiagnosis?.fase3?.verdadBiblica || (results && results[0]?.verdad),
    false
  );
  
  checkNewPage(30);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(sanitizePdfText("VERSÍCULO ANCLERO DE LA AUTOPISTA NUEVA:"), margin, y);
  y += 5;
  const rawVerse = aiDiagnosis?.fase3?.versiculo?.texto || (results && results[0]?.versiculos && results[0]?.versiculos[0]?.txt) || '';
  const verseText = rawVerse ? `"${rawVerse}"` : '';
  const wrappedVerse = doc.splitTextToSize(sanitizePdfText(verseText), maxWidth - 10);
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(70, 70, 70);
  doc.text(wrappedVerse, margin + 5, y);
  y += (wrappedVerse.length * 5) + 1;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(201, 168, 76);
  const refText = aiDiagnosis?.fase3?.versiculo?.referencia || (results && results[0]?.versiculos && results[0]?.versiculos[0]?.ref) || '';
  doc.text(sanitizePdfText(`- Cita: ${refText}`), margin + 5, y);
  y += 8;

  writeTextBlock(
    "PRINCIPAL CONFESIÓN DE NUEVA IDENTIDAD (Decir con voz firme diariamente)",
    aiDiagnosis?.fase4?.declaracionIdentidad || (results && results[0]?.declaracion),
    false
  );

  // CONSEJERÍA INTEGRAL: PREGUNTA CENTRAL, 4 MOVIMIENTOS Y TAREA DE CAMBIO
  if (aiDiagnosis?.heartExplorationMap || aiDiagnosis?.centralSessionQuestion) {
    const map = aiDiagnosis.heartExplorationMap;
    const centralQ = aiDiagnosis.centralSessionQuestion || map?.preguntaCentral;
    const four = aiDiagnosis.counselingPlan?.movimientos || map?.direccionBiblica;

    writeHeading("MAPA DE CONSEJERÍA PASTORAL Y PREGUNTA CENTRAL DE SESIÓN");

    if (centralQ) {
      checkNewPage(30);
      doc.setFillColor(254, 252, 240);
      doc.setDrawColor(201, 168, 76);
      doc.rect(margin, y, maxWidth, 22, "FD");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(180, 130, 20);
      doc.text(sanitizePdfText("PREGUNTA CENTRAL DE SESIÓN:"), margin + 4, y + 5);
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      const splitCQ = doc.splitTextToSize(sanitizePdfText(`"${centralQ.pregunta}"`), maxWidth - 8);
      doc.text(splitCQ, margin + 4, y + 10);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.text(sanitizePdfText(`Enfoque pastoral: ${centralQ.enfoquePastoral || ''}`), margin + 4, y + 19);
      y += 26;
    }

    if (four) {
      writeKeyValue("1. REDEFINIR (Examinar)", four.redefinir || four.redefinir?.interpretacionAExaminar || "Examinar la falsa creencia de autosuficiencia.");
      writeKeyValue("2. REENFOCAR (Hacia Cristo)", four.reenfocar || four.reenfocar?.verdadEvangelio || "Fijar los ojos en la gracia providencial del Padre.");
      writeKeyValue("3. RENDIR (Entregar Control)", four.rendir || four.rendir?.queEntregarAlSenor || "Someter la necesidad de predecir o blindarse ante fallos.");
      writeKeyValue("4. REESTRUCTURAR (Nueva Práctica)", four.reestructurar || four.reestructurar?.nuevaRespuesta || "Dar pasos medidos de delegación y reposo sabático.");
    }

    if (map?.loQueTodaviaNecesitamosInvestigar && map.loQueTodaviaNecesitamosInvestigar.length > 0) {
      checkNewPage(35);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(160, 100, 20);
      doc.text(sanitizePdfText("LO QUE TODAVÍA NO SABEMOS (EXPLORACIÓN PERSONAL OBLIGATORIA):"), margin, y);
      y += 5;
      map.loQueTodaviaNecesitamosInvestigar.slice(0, 3).forEach((item: any) => {
        writeKeyValue("Por explorar", `${item.enunciado} (Pregunta: «${item.preguntaParaLaSesion}»)`);
      });
    }

    if (aiDiagnosis?.behavioralTask || map?.proximoPaso) {
      const task = aiDiagnosis.behavioralTask || map?.proximoPaso;
      checkNewPage(30);
      writeTextBlock(
        "TAREA DE CAMBIO CONDUCTUAL (VERDAD -> FE -> CONDUCTA)",
        `${task.instruccionPrincipal || ''}\n• Verdad: ${task.verdadTeologica || ''}\n• Paso de Fe: ${task.pasoDeFe || ''}\n• Conducta Concreta: ${task.conductaConcreta || ''}`,
        false
      );
    }
  }

  // SECTION 3
  writeHeading("FASE 5: HOJA DE RUTA SEMANAL DE RESTRUCTURACIÓN");
  
  // Weekly structure
  const drawWeek = (weekNum: number, title: string, items: Record<string, string>) => {
    checkNewPage(42);
    doc.setFillColor(242, 240, 235);
    doc.rect(margin, y, maxWidth, 6, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(175, 142, 45);
    doc.text(sanitizePdfText(`SEMANA ${weekNum}: ${title}`), margin + 2, y + 4.5);
    y += 8;

    Object.entries(items).forEach(([k, v]) => {
      writeKeyValue(k, v);
    });
    y += 2;
  };

  drawWeek(1, "Consciencia Mental de la Mentira", {
    "Objetivo": aiDiagnosis?.fase5?.semana1?.objetivo || "Identificar pensamientos automáticos limitantes.",
    "Reflexión": aiDiagnosis?.fase5?.semana1?.reflexion || "Revisar cuándo se dispara el pánico o autosabotaje.",
    "Pregunta": aiDiagnosis?.fase5?.semana1?.autoconfrontacion || "¿A quién le crees?",
    "Registro": aiDiagnosis?.fase5?.semana1?.registroPensamientos || "Anotar el diario apenas ocurra el rumiar.",
    "Oración": aiDiagnosis?.fase5?.semana1?.oracionGuiada || "Señor, saca mi mente de esta prisión..."
  });

  drawWeek(2, "Desmantelamiento Cognitivo", {
    "Objetivo": aiDiagnosis?.fase5?.semana2?.objetivo || "Debilitar la fortaleza neural antigua.",
    "Evidencias": aiDiagnosis?.fase5?.semana2?.evidenciaContraria || "Exponer que tus temores son mentiras infundadas.",
    "Reencuadre": aiDiagnosis?.fase5?.semana2?.reencuadreBiblico || "Trazar el amor eterno del Padre.",
    "Desafío": aiDiagnosis?.fase5?.semana2?.desafiosPracticos || "Tomar decisiones de obediencia inmediatas.",
    "Anclaje": aiDiagnosis?.fase5?.semana2?.interrupcionPatrones || "Interrumpir los rulos de preocupación."
  });

  drawWeek(3, "Renovación y Cableado Nuevo", {
    "Objetivo": aiDiagnosis?.fase5?.semana3?.objetivo || "Fijar nuevas avenidas en el lóbulo prefrontal.",
    "Meditación": aiDiagnosis?.fase5?.semana3?.meditacionDiaria || "Rumiar en la palabra en cada respiración.",
    "Memorizar": aiDiagnosis?.fase5?.semana3?.memorizacionVersiculo || "Leer y recitar la promesa divinal.",
    "Gratitud": aiDiagnosis?.fase5?.semana3?.diarioGratitud || "Listar 3 milagros inmerecidos diarios.",
    "Ensayar": aiDiagnosis?.fase5?.semana3?.visualizacionBiblica || "Sentirme justificado antes de dormir."
  });

  drawWeek(4, "Consolidación y Obediencia", {
    "Objetivo": aiDiagnosis?.fase5?.semana4?.objetivo || "Plasmar la fe en actos de obediencia reales.",
    "Provocación": aiDiagnosis?.fase5?.semana4?.retosReales || "Salir de tu zona de confort con denuedo.",
    "Hechos": aiDiagnosis?.fase5?.semana4?.accionesFe || "Ofrecer ofrendas de sacrificios o bendiciones.",
    "Límites": aiDiagnosis?.fase5?.semana4?.conversacionesDificiles || "Establecer barreras a la ofensa.",
    "Obediencia": aiDiagnosis?.fase5?.semana4?.pasosObediencia || "Tomar el lugar en el propósito."
  });

  // SECTION 4 - THE 30-DAY CALENDAR IN DETAIL
  writeHeading("FASE 6: ITINERARIO DEVOCIONAL DE 30 DÍAS DE ACTIVACIÓN");
  
  if (aiDiagnosis?.fase6 && Array.isArray(aiDiagnosis.fase6)) {
    aiDiagnosis.fase6.forEach((day: any) => {
      const neededSpace = 32; // Optimized day structure height
      checkNewPage(neededSpace);

      doc.setFillColor(254, 253, 248).setDrawColor(201, 168, 76).setLineWidth(0.2);
      doc.rect(margin, y, maxWidth, 28, "FD");

      doc.setFont("Helvetica", "bold").setFontSize(9.5).setTextColor(20, 20, 20);
      doc.text(sanitizePdfText(`DÍA ${day.dia}: ${(day.enfoque || '').toUpperCase()}`), margin + 4, y + 4.5);

      doc.setFont("Helvetica", "normal").setFontSize(8).setTextColor(80, 80, 80);
      
      const dayVerse = `Pasaje: "${day.versiculo?.texto || ''}" (${day.versiculo?.referencia || ''})`;
      const vText = doc.splitTextToSize(sanitizePdfText(dayVerse), maxWidth - 8);
      doc.text(vText, margin + 4, y + 9);

      const actionText = `Práctica: ${day.accion || ''}`;
      const actText = doc.splitTextToSize(sanitizePdfText(actionText), maxWidth - 8);
      doc.text(actText, margin + 4, y + 14);

      const reflectionText = `Auto-Filtro: ${day.reflexion || ''}`;
      const rText = doc.splitTextToSize(sanitizePdfText(reflectionText), maxWidth - 8);
      doc.text(rText, margin + 4, y + 19);

      const prayerText = `Oración: "${day.oracion || ''}"`;
      const prText = doc.splitTextToSize(sanitizePdfText(prayerText), maxWidth - 8);
      doc.text(prText, margin + 4, y + 24);

      y += 31;
    });
  } else {
    writeTextBlock(
      "Guía Devocional Diaria",
      "Dedica de 15 a 20 minutos cada mañana para leer tu Versículo Anclero, respirar el Espíritu Santo, realizar la Micro-Acción sugerida para romper la inercia rumiadora, y sellar con oraciones audibles de filiación antes de entrar en tus quehaceres habituales.",
      false
    );
  }

  // SECTION 5
  writeHeading("FASE 8: ACUERDO DE FILIACIÓN DE FE Y CLAUSURA");
  writeKeyValue("Tu Estado Inicial", aiDiagnosis?.reporteFinal?.antes || "Atado por rumiaciones e inseguridad continua.");
  writeKeyValue("Tu Estado Libre", aiDiagnosis?.reporteFinal?.ahora || "Libre por el amor eterno y la justificación gloriosa.");
  writeKeyValue("Sentencia Mentira", aiDiagnosis?.reporteFinal?.creenciaDerribada || "Se desmorona la mentira del merecimiento material.");
  writeKeyValue("Sentencia Verdad", aiDiagnosis?.reporteFinal?.verdadEstablecida || "Establezco que mi herencia me define de antemano.");
  writeKeyValue("Hábito Sostenido", aiDiagnosis?.reporteFinal?.proximoPaso || "Meditar 5 minutos antes de tomar deisiones pastorales.");

  y += 3;
  writeTextBlock(
    "BENDICIÓN DE COMPROMISO PASTORAL DE CLAUSURA",
    aiDiagnosis?.reporteFinal?.exhortacionBiblica || 'Por lo tanto, mantén firmemente la mirada fija en Jesús...',
    false
  );

  // End of manual sign-off
  checkNewPage(30);
  y += 5;
  doc.setLineWidth(0.3).setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  doc.setFont("Helvetica", "bold").setFontSize(8.5).setTextColor(80, 80, 80);
  doc.text(sanitizePdfText("Desarrollado con amor y cuidado pastoral por Levántate Resplandece • Transformación Interior"), margin, y);
  y += 5;
  doc.setFont("Helvetica", "normal").setFontSize(7.5).setTextColor(120, 120, 120);
  doc.text(sanitizePdfText("Herramienta de autoexploración basada en principios de consejería bíblica. No es un diagnóstico clínico ni sustituye la atención profesional."), margin, y);

  // Finalize document page count and draw header/footer on last page
  drawFooter();

  // Save the PDF
  doc.save(`Manual-Transformacion-Interior-${userName.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf`);
};
