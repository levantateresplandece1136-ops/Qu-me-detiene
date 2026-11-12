import { jsPDF } from "jspdf";
import {
  PLAN_PROVERBIOS,
  CITA_BASE,
  TEXTO_CITA_BASE,
  elementLines,
} from "./planProverbios";

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

/**
 * Reporte descargado de ¿Qué Me Detiene?
 * Dice lo mismo que la pantalla final: (a) un reporte pequeño con la
 * creencia principal detectada, y (b) el plan de 30 días en los 4 elementos
 * de Proverbios 3:5-9, con el cierre que pide Josue. Sin secciones largas.
 */
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
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let pageNum = 1;
  const margin = 20;
  const pageWidth = 210;
  const pageHeight = 297;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const drawHeader = () => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      sanitizePdfText("TRANSFORMACIÓN INTERIOR • ¿QUÉ ME DETIENE?"),
      margin,
      margin - 10
    );
    doc.setDrawColor(201, 168, 76);
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
    doc.text(
      sanitizePdfText(`Participante: ${userName}  |  Ministerio Levántate Resplandece`),
      margin,
      pageHeight - 10
    );
    doc.text(
      sanitizePdfText(`Página ${pageNum}`),
      pageWidth - margin - 15,
      pageHeight - 10
    );
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

  const writeHeading = (text: string) => {
    const cleanText = sanitizePdfText(text);
    if (!cleanText) return;
    checkNewPage(18);
    y += 6;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(175, 142, 45);
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
    if (!cleanValue || cleanValue.trim() === "" || cleanValue === "No provisto")
      return;
    const wrappedValue = doc.splitTextToSize(cleanValue, maxWidth - 35);
    const neededHeight = wrappedValue.length * 5 + 6;
    checkNewPage(neededHeight);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text(`• ${cleanLabel}:`, margin, y);

    doc.setFont("Helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    doc.text(wrappedValue, margin + 32, y);
    y += wrappedValue.length * 5 + 1;
  };

  const writeTextBlock = (title: string, text: string, isAlert = false) => {
    const cleanTitle = sanitizePdfText(title);
    const cleanText = sanitizePdfText(text);
    if (!cleanText || cleanText.trim() === "" || cleanText === "No provisto")
      return;
    const wrappedText = doc.splitTextToSize(cleanText, maxWidth - 16);
    const neededHeight = wrappedText.length * 5 + 15;
    checkNewPage(neededHeight);

    doc.setFillColor(
      isAlert ? 254 : 249,
      isAlert ? 242 : 248,
      isAlert ? 242 : 236
    );
    doc.setDrawColor(
      isAlert ? 248 : 201,
      isAlert ? 180 : 168,
      isAlert ? 180 : 76
    );
    doc.setLineWidth(0.5);
    doc.rect(margin, y, maxWidth, wrappedText.length * 5 + 10, "FD");

    y += 6;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(
      isAlert ? 153 : 133,
      isAlert ? 27 : 97,
      isAlert ? 27 : 33
    );
    doc.text(cleanTitle, margin + 5, y);

    y += 5;
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(wrappedText, margin + 5, y);
    y += wrappedText.length * 5 + 5;
  };

  const primary = (results && results[0]) || {};
  const primaryAlias: string = primary.alias || "Tu creencia limitante";
  const primaryName: string =
    primary.creencia || primaryAlias;
  const primaryLie: string =
    aiDiagnosis?.fase3?.mentira || primary.afirmacionTest || "";
  const primaryTruth: string =
    aiDiagnosis?.fase3?.verdadBiblica || primary.verdad || "";
  const verseText: string =
    aiDiagnosis?.fase3?.versiculo?.texto ||
    (primary.versiculos && primary.versiculos[0]?.txt) ||
    "";
  const verseRef: string =
    aiDiagnosis?.fase3?.versiculo?.referencia ||
    (primary.versiculos && primary.versiculos[0]?.ref) ||
    "";
  const declaration: string =
    aiDiagnosis?.fase4?.declaracionIdentidad || primary.declaracion || "";
  const detectedNames: string[] = (results || [])
    .slice(0, 3)
    .map((r: any) => r?.alias || r?.creencia)
    .filter(Boolean);
  const days: any[] = Array.isArray(aiDiagnosis?.fase6)
    ? aiDiagnosis.fase6
    : [];
  const weeks: any[] = [
    aiDiagnosis?.fase5?.semana1,
    aiDiagnosis?.fase5?.semana2,
    aiDiagnosis?.fase5?.semana3,
    aiDiagnosis?.fase5?.semana4,
  ];

  // ---------- PORTADA CORTA ----------
  drawHeader();
  y = 40;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(20, 20, 20);
  doc.text(sanitizePdfText("Transformación Interior"), margin + 10, y);

  y += 10;
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(201, 168, 76);
  doc.text(
    sanitizePdfText(
      '"Transformaos por medio de la renovación de vuestro entendimiento" - Romanos 12:2'
    ),
    margin + 10,
    y,
    { maxWidth: maxWidth - 20 }
  );

  y += 14;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(sanitizePdfText(`Participante: ${userName}`), margin + 10, y);
  y += 6;
  doc.text(
    sanitizePdfText(`Correo: ${userEmail || "No provisto"}`),
    margin + 10,
    y
  );
  y += 6;
  doc.text(
    sanitizePdfText(
      `Fecha: ${new Date().toLocaleDateString("es-ES")}`
    ),
    margin + 10,
    y
  );

  y += 12;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    doc.splitTextToSize(
      sanitizePdfText(
        "Herramienta de autoexploración basada en principios de consejería bíblica. No es un diagnóstico clínico ni sustituye la atención profesional."
      ),
      maxWidth - 20
    ),
    margin + 10,
    y
  );

  // ---------- (a) TU REPORTE ----------
  writeHeading("TU REPORTE");
  writeKeyValue("Tu creencia principal", `${primaryAlias} — ${primaryName}`);
  if (primaryLie) {
    writeTextBlock("LA MENTIRA QUE SE ROMPE", primaryLie, true);
  }
  if (primaryTruth) {
    writeTextBlock("LA VERDAD QUE TE REDIME", primaryTruth, false);
  }
  if (verseText) {
    writeKeyValue(
      "Versículo",
      `"${verseText}"${verseRef ? ` — ${verseRef}` : ""}`
    );
  }
  if (declaration) {
    writeTextBlock(
      "TU DECLARACIÓN — REPÍTELA CADA MAÑANA",
      declaration,
      false
    );
  }

  // ---------- (b) TU PLAN DE 30 DÍAS · PROVERBIOS 3:5-9 ----------
  writeHeading(`TU PLAN DE 30 DÍAS · ${CITA_BASE}`);
  writeTextBlock(
    `CITA BASE · ${CITA_BASE}`,
    TEXTO_CITA_BASE,
    false
  );

  PLAN_PROVERBIOS.forEach((el) => {
    checkNewPage(50);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(175, 142, 45);
    doc.text(
      sanitizePdfText(
        `${el.numero}. ${el.titulo.toUpperCase()} · DÍAS ${el.diasInicio}–${el.diasFin}`
      ),
      margin,
      y
    );
    y += 6;

    elementLines(el).forEach(({ label, text }) => {
      const line = `• ${label}: ${text}`;
      const wrapped = doc.splitTextToSize(
        sanitizePdfText(line),
        maxWidth
      );
      checkNewPage(wrapped.length * 5 + 4);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 5 + 1;
    });

    const week = weeks[el.semanaIndex];
    if (week?.objetivo) {
      writeKeyValue("Enfoque de la semana", week.objetivo);
    }
    y += 3;

    // Días de este elemento, con el contenido diario existente
    const elementDays = days.filter(
      (d: any) => d?.dia >= el.diasInicio && d?.dia <= el.diasFin
    );
    elementDays.forEach((day: any) => {
      checkNewPage(34);
      doc.setFillColor(254, 253, 248);
      doc.setDrawColor(201, 168, 76);
      doc.setLineWidth(0.2);
      const boxH = 26;
      doc.rect(margin, y, maxWidth, boxH, "FD");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(20, 20, 20);
      doc.text(
        sanitizePdfText(
          `DÍA ${day.dia}: ${(day.enfoque || "").toUpperCase()}`
        ),
        margin + 4,
        y + 4.5
      );

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      const lines: string[] = [];
      if (day.versiculo?.texto) {
        lines.push(
          `Versículo: "${day.versiculo.texto}" (${day.versiculo.referencia || ""})`
        );
      }
      if (day.accion) lines.push(`Acción: ${day.accion}`);
      if (day.reflexion) lines.push(`Pregunta: ${day.reflexion}`);
      if (day.oracion) lines.push(`Oración: "${day.oracion}"`);
      const wrapped = doc.splitTextToSize(
        sanitizePdfText(lines.join(" | ")),
        maxWidth - 8
      );
      doc.text(wrapped.slice(0, 3), margin + 4, y + 9.5);
      y += boxH + 3;
    });

    if (elementDays.length === 0) {
      writeKeyValue(
        `Días ${el.diasInicio}–${el.diasFin}`,
        "Dedica cada día a este elemento: medita su llamado a la acción, memoriza su cita y practica lo que añade."
      );
    }
    y += 4;
  });

  // ---------- CIERRE ----------
  writeHeading("PARA CERRAR");
  const closingBeliefs =
    detectedNames.length > 0
      ? detectedNames.join(", ")
      : primaryName;
  writeTextBlock(
    "MUY PROBABLEMENTE ESTÁS LIDIANDO CON ESTA CREENCIA O CREENCIAS",
    closingBeliefs,
    true
  );
  writeTextBlock(
    "LA FORMA EN QUE DIOS PUEDE REDIMIRLAS ES",
    primaryTruth
      ? `${primaryTruth} Por eso tu plan se sostiene en ${CITA_BASE}: confía en Él, contesta a su llamado, confiesa tu necesidad de Él y consagra todo. Él es quien endereza tus veredas.`
      : `Cambiando la mentira por la verdad de su Palabra y caminándola un día a la vez. Por eso tu plan se sostiene en ${CITA_BASE}: confía en Él, contesta a su llamado, confiesa tu necesidad de Él y consagra todo. Él es quien endereza tus veredas.`,
    false
  );

  checkNewPage(20);
  y += 5;
  doc.setLineWidth(0.3);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text(
    sanitizePdfText(
      "Desarrollado con amor y cuidado pastoral por Levántate Resplandece • Transformación Interior"
    ),
    margin,
    y
  );

  drawFooter();

  doc.save(
    `Manual-Transformacion-Interior-${userName.replace(/\s+/g, "_")}-${
      new Date().toISOString().split("T")[0]
    }.pdf`
  );
};
