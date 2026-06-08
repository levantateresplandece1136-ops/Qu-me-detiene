import { jsPDF } from "jspdf";

export const downloadPDFResults = (
  userName: string,
  userEmail: string,
  aiDiagnosis: any,
  results: any[],
  journalNotes: Record<string | number, string>,
  mode: "resumida" | "extensa" = "extensa"
) => {
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

  // Primary colors: Gold accent, Charcoal body, Light backgrounds for callouts
  const goldAccent = [201, 168, 76]; // #C9A84C
  const goldDark = [163, 128, 43];
  const charcoalDark = [33, 33, 33];
  const borderLight = [220, 220, 220];

  const drawHeader = () => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    const subTitleText = mode === "resumida" 
      ? "CUADERNO PRÁCTICO & HOJAS DE TRABAJO • REESTRUCTURACIÓN MENTAL"
      : "MANUAL COMPLETO DE TRANSFORMACIÓN INTERIOR • PROGRAMA DE RENOVACIÓN";
    doc.text(subTitleText, margin, margin - 10);
    doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, margin - 7, pageWidth - margin, margin - 7);
  };

  const drawFooter = () => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(145, 145, 145);
    doc.setDrawColor(225, 225, 225);
    doc.setLineWidth(0.15);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    const modeLabel = mode === "resumida" ? "Fichas & Hojas Prácticas" : "Tratado Completo Unificado";
    doc.text(`Participante: ${userName}  |  ${modeLabel}  |  Dirección: Josue Cortes`, margin, pageHeight - 10);
    doc.text(`Página ${pageNum}`, pageWidth - margin - 15, pageHeight - 10);
  };

  const checkNewPage = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 12) {
      drawFooter();
      doc.addPage();
      pageNum++;
      y = margin;
      drawHeader();
    }
  };

  const writeHeading = (text: string) => {
    checkNewPage(18);
    y += 5;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(goldDark[0], goldDark[1], goldDark[2]);
    doc.text(text, margin, y);
    y += 2.5;
    doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5.5;
  };

  const writeKeyValue = (label: string, value: string) => {
    const wrappedValue = doc.splitTextToSize(value || "Sin registrar", maxWidth - 35);
    const neededHeight = (wrappedValue.length * 5) + 6;
    checkNewPage(neededHeight);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(45, 45, 45);
    doc.text(`• ${label}:`, margin, y);
    
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(75, 75, 75);
    doc.text(wrappedValue, margin + 33, y);
    y += (wrappedValue.length * 5) + 1;
  };

  const writeTextBlock = (title: string, text: string, isAlert = false) => {
    const wrappedText = doc.splitTextToSize(text || "No provisto en el reporte", maxWidth - 12);
    const neededHeight = (wrappedText.length * 4.8) + 14;
    checkNewPage(neededHeight);

    // Callout box setup
    doc.setFillColor(isAlert ? 254 : 249, isAlert ? 243 : 247, isAlert ? 243 : 241);
    doc.setDrawColor(isAlert ? 230 : goldAccent[0], isAlert ? 150 : goldAccent[1], isAlert ? 150 : goldAccent[2]);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, maxWidth, (wrappedText.length * 4.8) + 9, "FD");

    y += 5;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(isAlert ? 165 : 120, isAlert ? 30 : 90, isAlert ? 30 : 25);
    doc.text(title, margin + 4, y);
    
    y += 4.5;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 55, 55);
    doc.text(wrappedText, margin + 4, y);
    y += (wrappedText.length * 4.8) + 4;
  };

  // Helper to draw clean lined worksheets for manual entry
  const drawWorksheetLines = (label: string, count: number) => {
    checkNewPage((count * 6.5) + 12);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(goldDark[0], goldDark[1], goldDark[2]);
    doc.text(`📝 ${label}`, margin, y);
    y += 4;

    doc.setDrawColor(215, 215, 215);
    doc.setLineWidth(0.2);
    for (let i = 0; i < count; i++) {
      doc.line(margin + 2, y + (i * 6.5), pageWidth - margin - 2, y + (i * 6.5));
    }
    y += (count * 6.5) + 4;
  };

  // Helper to draw a checkable option
  const drawCheckableItem = (label: string, note = "") => {
    const wrappedLabel = doc.splitTextToSize(label, maxWidth - 12);
    const needed = (wrappedLabel.length * 4.5) + (note ? 4.5 : 0) + 4;
    checkNewPage(needed);

    doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.setLineWidth(0.4);
    doc.rect(margin, y + 0.5, 3.5, 3.5); // Checkbox rectangle

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text(wrappedLabel, margin + 6, y + 3.2);
    y += (wrappedLabel.length * 4.5);

    if (note) {
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text(note, margin + 6, y + 2);
      y += 4;
    }
    y += 2;
  };

  // COVER DESIGN
  const drawCover = () => {
    // Outer Border Frame
    doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.setLineWidth(0.85);
    doc.rect(margin - 6, margin - 6, maxWidth + 12, pageHeight - (margin * 2) + 12);

    doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.setLineWidth(0.25);
    doc.rect(margin - 4, margin - 4, maxWidth + 8, pageHeight - (margin * 2) + 8);

    y = 45;
    
    // Header tag
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(goldDark[0], goldDark[1], goldDark[2]);
    doc.text("CURRÍCULUM DE TRANSFORMACIÓN COGNITIVA & REUBICACIÓN EN GRACIA", margin + 10, y);
    
    y += 12;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(mode === "resumida" ? 18 : 20);
    doc.setTextColor(25, 25, 25);
    const titleText = mode === "resumida" 
      ? "CUADERNO PRÁCTICO & HOJAS DE TRABAJO"
      : "MANUAL COMPLETO DE RENOVACIÓN DE MENTE";
    doc.text(titleText, margin + 10, y, { maxWidth: maxWidth - 15 });

    y += 10;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(110, 110, 110);
    const subText = mode === "resumida"
      ? "Un cuaderno interactivo de autoevaluación, cuestionarios activos, fichas de trabajo y control semanal de hábitos para la reestructuración espiritual."
      : "Un tratado de reencuadre neuro-psicológico y teológico unificado, diagnósticos abismales detallados y un itinerario devocional completo de 30 días.";
    doc.text(subText, margin + 10, y, { maxWidth: maxWidth - 20 });

    y += 22;
    // Romans Verse Highlight Box
    doc.setFillColor(252, 251, 246);
    doc.setFillColor(251, 249, 242);
    doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.setLineWidth(0.4);
    doc.rect(margin + 10, y, maxWidth - 20, 24, "FD");

    y += 8;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(goldDark[0], goldDark[1], goldDark[2]);
    doc.text('"Transformaos por medio de la renovación de vuestro entendimiento..."', margin + 14, y);
    y += 6;
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text("Romanos 12:2 — Para que comprobéis cuál sea la buena voluntad de Dios, agradable y perfecta.", margin + 14, y);

    y += 26;
    // Metadata block
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text("REGISTRO DE EXPEDICIÓN E IDENTIDAD:", margin + 10, y);

    y += 7;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    
    doc.setFont("Helvetica", "bold");
    doc.text("Participante Registrado/a:", margin + 10, y);
    doc.setFont("Helvetica", "normal");
    doc.text(userName, margin + 50, y);

    y += 5.5;
    doc.setFont("Helvetica", "bold");
    doc.text("Correo de Filiación:", margin + 10, y);
    doc.setFont("Helvetica", "normal");
    doc.text(userEmail || "Cifrado local / Sin registrar", margin + 50, y);

    y += 5.5;
    doc.setFont("Helvetica", "bold");
    doc.text("Fecha del Diagnóstico:", margin + 10, y);
    doc.setFont("Helvetica", "normal");
    doc.text(new Date().toLocaleDateString('es-ES'), margin + 50, y);

    y += 5.5;
    doc.setFont("Helvetica", "bold");
    doc.text("Protocolo Metódico:", margin + 10, y);
    doc.setFont("Helvetica", "normal");
    doc.text("Neurobiología Afectiva y Teología de la Gracia del Pacto Perpetuo", margin + 50, y, { maxWidth: maxWidth - 60 });

    y += 24;
    // Descriptive text for mode
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    const purposeDesc = mode === "resumida"
      ? "Este cuaderno resumido está optimizado para imprimir. Contiene cuadros listos para rellenar a mano, checklists de autoconfrontación mental, fichas semanales de reencuadre y un rastreador sintético para los 30 días de micro-acciones, empoderando la acción directa diaria."
      : "Este manual extenso actúa como tu guía teológica y reflexiva definitiva de cabecera. Consolida todo el discernimiento de mentiras desmanteladas, las justificaciones bíblicas de tu nueva identidad cristocéntrica, la secuencia conceptual de tus 4 semanas y los 30 días devocionales completamente explicados.";
    doc.text(purposeDesc, margin + 10, y, { maxWidth: maxWidth - 20 });

    // Director Sign Off at cover base
    y = pageHeight - 48;
    doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.setLineWidth(0.4);
    doc.line(margin + 10, y, margin + 70, y);

    y += 5;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(45, 45, 45);
    doc.text("Josue Cortes", margin + 10, y);

    y += 4;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.text("Dirección de Consejería y Renovación Interior", margin + 10, y);

    drawFooter();
    doc.addPage();
    pageNum++;
    y = margin;
    drawHeader();
  };

  drawCover();

  // ==========================================
  // SECTION 1: FASE 1 & FASE 2
  // ==========================================
  writeHeading("FASE 1 Y 2: IDENTIFICACIÓN Y DIAGNÓSTICO COGNITIVO");
  
  if (mode === "extensa") {
    writeTextBlock(
      "EL DIAGNÓSTICO CONCEPTUAL DE LOS SCRIPT INCONSCIENTES",
      "Cada ser humano opera bajo libretos o de 'scripts' forjados en su infancia y confirmados por su entorno. Cuando la mente no asume la Gracia como justificación primaria, crea mecanismos compensatorios carnales de autosuficiencia. Estos se revelan en el perfil detectado a continuación.",
      false
    );
  }

  writeKeyValue("Determinación Principal", aiDiagnosis?.fase1?.principalBelief || (results && results[0]?.creencia));
  writeKeyValue("Temor Raíz Subyacente", aiDiagnosis?.fase1?.rootFear || 'Temor de orfandad y desprotección.');
  writeKeyValue("Emoción Dominante de Activación", aiDiagnosis?.fase1?.dominantEmotion || 'Hipervigilancia / Agobio Simpático');
  writeKeyValue("Sector de Vida Altamente Afectado", aiDiagnosis?.fase1?.affectedArea || 'Maternidad/Paternidad, Finanzas o Identidad Social');

  y += 2.5;
  writeTextBlock(
    "❌ MENTIRA RAÍZ DETECTADA (FORTALEZA DE ENGAÑO DEL ADVERSARIO)", 
    aiDiagnosis?.fase2?.rootLie || 'Mi valor depende completamente de salvaguardar el control total de mi entorno.',
    true
  );

  writeTextBlock(
    "💬 MECANISMO DE AUTOSABOTAJE AUTOMÁTICO",
    aiDiagnosis?.fase2?.selfSabotageMechanism || 'Evitación y rumiación obsesiva antes de tomar riesgos de obediencia de fe.',
    false
  );

  y += 2;
  checkNewPage(42);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(charcoalDark[0] || 35, charcoalDark[1] || 35, charcoalDark[2] || 35);
  doc.text("🔍 ESTIMACIÓN DE COSTOS DE LA MENTIRA EN TUS 4 DIMENSIONES:", margin, y);
  y += 5.5;

  writeKeyValue("En Decisiones de Peso", aiDiagnosis?.fase2?.currentCost?.decisions || "Parálisis cerebral o rumiación extrema postergando el paso.");
  writeKeyValue("En la Esfera Emocional", aiDiagnosis?.fase2?.currentCost?.emotions || "Culpabilidad soterrada al disfrutar del descanso o bienestar.");
  writeKeyValue("En tus Diseños de Relación", aiDiagnosis?.fase2?.currentCost?.relationships || "Control excesivo de la reacción ajena o timidez defensiva.");
  writeKeyValue("En tu Propósito de Reino", aiDiagnosis?.fase2?.currentCost?.potentialFuture || "Ocultación de talentos y unción por soslayar la crítica.");

  // For Resumida worksheets, provide a self-reflection log box
  if (mode === "resumida") {
    y += 1.5;
    drawWorksheetLines("Cuestionario Activo: Describe situaciones reales donde este costo emocional o parálisis en tus decisiones te cobró factura esta última semana:", 4);
  }

  // ==========================================
  // SECTION 2: FASE 3 & FASE 4
  // ==========================================
  writeHeading("FASE 3 Y 4: RENOVACIÓN BÍBLICA Y NUEVA IDENTIDAD CRISTOCÉNTRICA");

  if (mode === "extensa") {
    writeTextBlock(
      "EL PRINCIPIO CLÍNICO-BÍBLICO DE LA SUSTITUCIÓN DE VERDAD",
      "El cerebro posee plasticidad. Romanos 12:2 enseña que el cambio no es por fuerza de voluntad, sino por 'renovación' (sustitución). No puedes forzarte a dejar de creer la mentira; debes inundar la ruta neural forjando una carretera superior: la Verdad Teológica firmada en la Cruz del Calvario.",
      false
    );
  }

  writeTextBlock(
    "🛑 LA MENTIRA CARNAL ENFRENTADA CON CRITERIO DIVINO",
    aiDiagnosis?.fase3?.mentira || (results && results[0]?.afirmacionTest),
    true
  );

  writeTextBlock(
    "🟢 LA VERDAD ETERNA SUSTITUTORIA DE REENCUADRE",
    aiDiagnosis?.fase3?.verdadBiblica || (results && results[0]?.verdad),
    false
  );

  checkNewPage(32);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text("📖 VERSÍCULO ANCLERO SELECCIONADO (Tu espada de combate mental):", margin, y);
  y += 5;

  const verseText = `"${aiDiagnosis?.fase3?.versiculo?.texto || (results && results[0]?.versiculos && results[0]?.versiculos[0]?.txt) || ''}"`;
  const wrappedVerse = doc.splitTextToSize(verseText, maxWidth - 10);
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(65, 65, 65);
  doc.text(wrappedVerse, margin + 4, y);
  y += (wrappedVerse.length * 4.8) + 1.5;
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.text(`— Promesa: ${aiDiagnosis?.fase3?.versiculo?.referencia || (results && results[0]?.versiculos && results[0]?.versiculos[0]?.ref) || ''}`, margin + 4, y);
  y += 7.5;

  writeTextBlock(
    "✨ DETERMINACIÓN DE NUEVA IDENTIDAD (Tu proclamación audible de filiación)",
    aiDiagnosis?.fase4?.declaracionIdentidad || (results && results[0]?.declaracion),
    false
  );

  if (mode === "resumida") {
    drawWorksheetLines("Declarar con denuedo: Define aquí tu plan práctico y horarios específicos del día para proclamarla con voz audible y activar tu lóbulo frontal (ej. primera hora del amanecer, al cepillarte):", 3);
  }

  // ==========================================
  // SECTION 3: FASE 5 (WEEKS HOJA DE RUTA)
  // ==========================================
  writeHeading("FASE 5: HOJA DE RUTA SEMANAL DE RESTRUCTURACIÓN NEURO-ESPIRITUAL");

  if (mode === "extensa") {
    writeTextBlock(
      "EL CRONOGRAMA CLÍNICO DE DESHABITUACIÓN EN 4 ETAPAS",
      "Para que una vieja pista neural de mentira pierda sus capas de mielina (mecanismo que acelera impulsos automáticos), debe cruzar por 4 fases consecutivas durante un ciclo mensual. No quemes etapas; respeta la velocidad de tu espíritu y tu cerebro.",
      false
    );
  }

  // Draw weekly schedules
  const drawWeekBlock = (weekNum: number, title: string, data: Record<string, string>) => {
    checkNewPage(45);
    doc.setFillColor(243, 241, 235);
    doc.rect(margin, y, maxWidth, 6.5, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(goldDark[0], goldDark[1], goldDark[2]);
    doc.text(`SEMANA ${weekNum}: ${title}`, margin + 2.5, y + 4.8);
    y += 9;

    Object.entries(data).forEach(([key, val]) => {
      writeKeyValue(key, val);
    });

    if (mode === "resumida") {
      y += 1;
      drawWorksheetLines(`Evidencias y Bitácora de la Semana ${weekNum} (Fijación de metas y victorias):`, 3);
    }
    y += 2.5;
  };

  drawWeekBlock(1, "Consciencia Mental de la Mentira", {
    "Objetivo Primario": aiDiagnosis?.fase5?.semana1?.objetivo || "Identificar y cazar en tiempo real la mentira y rumiación.",
    "Tema de Reflexión": aiDiagnosis?.fase5?.semana1?.reflexion || "Cuándo se gatillan tus nudos emocionales y bajo qué justificaciones terrenas.",
    "Pregunta de Choque": aiDiagnosis?.fase5?.semana1?.autoconfrontacion || "¿Por qué permito que una Sospecha ruede más rápido que el Favor Divino en mi mente?",
    "Diario Práctico": aiDiagnosis?.fase5?.semana1?.registroPensamientos || "Anotar en tu Diario de Oración apenas la rumiación comience a ensordecer tu espíritu.",
    "Oración Conductora": aiDiagnosis?.fase5?.semana1?.oracionGuiada || "Señor, saca mi alma del calabozo carnal para que yo pueda bendecir hoy tu gracia inmerecida."
  });

  drawWeekBlock(2, "Desmantelamiento y Cuestionamiento Cognitivo", {
    "Objetivo Primario": aiDiagnosis?.fase5?.semana2?.objetivo || "Debilitar la falsa fortaleza de tus argumentos tradicionales.",
    "Contratación de Evidencia": aiDiagnosis?.fase5?.semana2?.evidenciaContraria || "Analizar tus victorias previas y reconocer que Dios te sostuvo sin necesidad de tu control carnal.",
    "Reencuadre de Gracia": aiDiagnosis?.fase5?.semana2?.reencuadreBiblico || "Asumirte como hijo eterno favorecido en la cruz, no como huérfano con deudas.",
    "Desafío Práctico": aiDiagnosis?.fase5?.semana2?.desafiosPracticos || "Tomar una decisión contraria a lo que el temor o la culpa sugieren.",
    "Interrupción de Patrón": aiDiagnosis?.fase5?.semana2?.interrupcionPatrones || "Gritar internamente ¡Suficiente! y abrazar tu versículo anclero cuando empiece el bucle."
  });

  drawWeekBlock(3, "Instalación de la Autopista (Renovación Cerebral)", {
    "Objetivo Primario": aiDiagnosis?.fase5?.semana3?.objetivo || "Fijar y cablear nuevos senderos mediante meditación focalizada.",
    "Meditación Constante": aiDiagnosis?.fase5?.semana3?.meditacionDiaria || "Visualizar y respirar el amor del Padre 3 veces al día de forma sosegada.",
    "Fijación de Promesa": aiDiagnosis?.fase5?.semana3?.memorizacionVersiculo || "Memorizar y recitar el versículo ancla con total certeza interior.",
    "Vectores de Gratitud": aiDiagnosis?.fase5?.semana3?.diarioGratitud || "Registrar al final del día 3 milagros, favores u obsequios inmerecidos de Dios.",
    "Ensayo Mental Teologal": aiDiagnosis?.fase5?.semana3?.visualizacionBiblica || "Sentir y reclamar tu justificación antes de cerrar tus párpados para dormir."
  });

  drawWeekBlock(4, "Consolidación en la Práctica y Acción de Fe", {
    "Objetivo Primario": aiDiagnosis?.fase5?.semana4?.objetivo || "Garantizar la habituación mediante acciones de obediencia reales.",
    "Reto de Provocación": aiDiagnosis?.fase5?.semana4?.retosReales || "Cruzar resueltamente tu zona de antiguos temores sociales o de rendimiento.",
    "Hechos Reales de Fe": aiDiagnosis?.fase5?.semana4?.accionesFe || "Ofrecer o dar un paso de audacia generosa sin pedir recompensas terrenas.",
    "Fronteras Limítrofes": aiDiagnosis?.fase5?.semana4?.conversacionesDificiles || "Decir un 'No' rotundo o un 'Sí' limpio que cuide tu paz mental interna.",
    "Tránsito en Filiación": aiDiagnosis?.fase5?.semana4?.pasosObediencia || "Habitar permanentemente en el rol y herencia que la crucifixión te compró."
  });

  // ==========================================
  // SECTION 4: FASE 6 (30-DAY DEVOTIONAL)
  // ==========================================
  writeHeading("FASE 6: ITINERARIO DEVOCIONAL DE 30 DÍAS DE ACTIVACIÓN");

  const hasDays = aiDiagnosis?.fase6 && Array.isArray(aiDiagnosis.fase6);

  if (mode === "resumida") {
    writeTextBlock(
      "HOJA DE CONTROL Y SEGUIMIENTO: CALENDARIO DE CONQUISTA DE HÁBITOS (30 DÍAS)",
      "Usa esta planilla compacta para registrar tu sendero diario. Al despertar, lee la promesa sugerida, realiza la micro-acción física requerida de obediencia, y marca con un visto [X] en tu checkbox de progreso. Se constante e inamovible.",
      false
    );

    if (hasDays) {
      aiDiagnosis.fase6.forEach((day: any) => {
        const titleLine = `F-6 [ ] DÍA ${day.dia}: ${day.enfoque.toUpperCase()}`;
        const detailLine = `📖 Pasaje: ${day.versiculo.texto} (${day.versiculo.referencia})`;
        const actionLine = `⚡ Micro-Acción: ${day.accion}`;
        
        drawCheckableItem(titleLine, `${detailLine}\n${actionLine}`);
      });
    } else {
      // Fallback checklist if no data loaded
      for (let dayNum = 1; dayNum <= 30; dayNum++) {
        drawCheckableItem(
          `F-6 [ ] DÍA ${dayNum}: Lectura y Meditación de Filiación en Romanos`,
          "Práctica: Recita tu determinación de identidad audible durante 3 minutos frente a un espejo y agradece. Oración de rendición."
        );
      }
    }
  } else {
    // EXTENSA MODE: Beautiful detailed full devotionals (fits fully with details)
    writeTextBlock(
      "EL MÉTODO DE CONTROL SINÁPTICO DIARIO",
      "Cada uno de estos 30 días presenta una medicina espiritual. Consta de un ancla bíblica, una micro-acción (gesto conductual para consolidar físicamente la fe en tus músculos y agenda), una autoconfrontación para romper desvíos existenciales, y una oración audible inspirada.",
      false
    );

    if (hasDays) {
      aiDiagnosis.fase6.forEach((day: any) => {
        const neededSpace = 39; 
        checkNewPage(neededSpace);

        doc.setFillColor(255, 254, 250);
        doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
        doc.setLineWidth(0.25);
        doc.rect(margin, y, maxWidth, 35, "FD");

        doc.setFont("Helvetica", "bold").setFontSize(9).setTextColor(20, 20, 20);
        doc.text(`DÍA ${day.dia}: ${day.enfoque.toUpperCase()}`, margin + 45, y + 4.5, { align: "center" });

        // Left accent block
        doc.setFillColor(goldAccent[0], goldAccent[1], goldAccent[2]);
        doc.rect(margin, y, 4, 35, "F");

        doc.setFont("Helvetica", "normal").setFontSize(8).setTextColor(50, 50, 50);
        
        const dayVerse = `• Pasaje Divino: "${day.versiculo.texto}" (${day.versiculo.referencia})`;
        const vText = doc.splitTextToSize(dayVerse, maxWidth - 10);
        doc.text(vText, margin + 6, y + 10);

        const actionText = `• Micro-Acción Práctica: ${day.accion}`;
        const actText = doc.splitTextToSize(actionText, maxWidth - 10);
        doc.text(actText, margin + 6, y + 15.5);

        const reflectionText = `• Autoconfrontación: ${day.reflexion}`;
        const rText = doc.splitTextToSize(reflectionText, maxWidth - 10);
        doc.text(rText, margin + 6, y + 21.5);

        const prayerText = `• Oración: "${day.oracion}"`;
        const prText = doc.splitTextToSize(prayerText, maxWidth - 10);
        doc.setFont("Helvetica", "bold");
        doc.text(prText, margin + 6, y + 27.5);
        doc.setFont("Helvetica", "normal");

        y += 38;
      });
    } else {
      writeTextBlock(
        "Tránsito Devocional de Consolidación de 30 Días",
        "Toma 15 minutos cada mañana. 1) Recita tu determinación en voz audible. 2) Medita en tu versículo anclero. 3) Efectúa la micro-acción corporal para fijar obediencia en tus hábitos neurales. 4) Escribe tus conquistas emocionales de paz.",
        false
      );
    }
  }

  // ==========================================
  // SECTION 5: FASE 8 (ACUERDO & BENDICIÓN)
  // ==========================================
  writeHeading("FASE 8: ACUERDO DE FILIACIÓN DE FE Y CLAUSURA");

  if (mode === "extensa") {
    writeTextBlock(
      "EL ACUERDO LEGAL DE TU HERENCIA CELESTIAL",
      "El desmantelamiento adquiere carácter firme en el espíritu cuando se sella con un acuerdo de Filiación. Rompes la sospecha de orfandad y asumes que el Trono de Gracia firmó tu herencia de libertad y paz de forma irrevocable y eterna.",
      false
    );
  }

  writeKeyValue("Tu Estado del Ayer", aiDiagnosis?.reporteFinal?.antes || "Frecuentemente cansado, rumiante e hipervigilante de la descalificación.");
  writeKeyValue("Tu Estado Libre de Gracia", aiDiagnosis?.reporteFinal?.ahora || "Bajo reposo sagrado, justificado por cruz e impulsado por el gozo.");
  writeKeyValue("Sentencia a la Mentira", aiDiagnosis?.reporteFinal?.creenciaDerribada || "Se revoca toda fianza basada en mi rendimiento o control humano.");
  writeKeyValue("Sentencia de la Verdad", aiDiagnosis?.reporteFinal?.verdadEstablecida || "Establezco soberanamente que soy heredero amado predilecto de mi Creador.");
  writeKeyValue("Próximo Hábito Duradero", aiDiagnosis?.reporteFinal?.proximoPaso || "Rumiar la determinación de identidad 3 minutos frente al espejo diariamente.");

  y += 2.5;
  writeTextBlock(
    "✨ EXHORTACIÓN BIBLICA & BENDICIÓN PASTORAL DE CLAUSURA",
    aiDiagnosis?.reporteFinal?.exhortacionBiblica || 'Por tanto, mi hijo/a predilecto/a, camina firme y constante, sabiendo que tu labor en el Señor jamás es vana. La gracia del Señor Jesucristo custodie hoy y siempre tus autopistas emocionales de paz. ¡Levántate y resplandece!',
    false
  );

  // Journal entries review in extensive mode
  if (mode === "extensa") {
    y += 4;
    checkNewPage(35);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text("HISTORIAL DE VALORACIONES DE TU DIARIO DE ORACIÓN PERSONAL:", margin, y);
    y += 6;

    if (results && results.length > 0) {
      results.forEach((r: any) => {
        const note = journalNotes[r.id] || '(No se registraron notas de oración personal para esta materia en el dispositivo).';
        const cellValue = `• Región de Clima: "${r.creencia}" (${r.alias})\n  Notas de tu diario personal escritas: "${note}"`;
        const wrappedCell = doc.splitTextToSize(cellValue, maxWidth - 10);
        checkNewPage((wrappedCell.length * 4.5) + 6);
        
        doc.setFont("Helvetica", "normal").setFontSize(8.2).setTextColor(65, 65, 65);
        doc.text(wrappedCell, margin + 4, y);
        y += (wrappedCell.length * 4.5) + 4;
      });
    } else {
      doc.setFont("Helvetica", "italic").setFontSize(8.5).setTextColor(120, 120, 120);
      doc.text("(Sin valoraciones pasadas de diario registradas aún)", margin + 4, y);
      y += 6;
    }
  }

  // Custom Printable Worksheet Elements in Resumida mode
  if (mode === "resumida") {
    y += 2.5;
    checkNewPage(45);
    doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.setLineWidth(0.5);
    doc.setFillColor(254, 253, 248);
    doc.rect(margin, y, maxWidth, 40, "FD");

    y += 5;
    doc.setFont("Helvetica", "bold").setFontSize(9).setTextColor(goldDark[0], goldDark[1], goldDark[2]);
    doc.text("🤝 FIRMA DE CLAUSURA & PACTO DE GRACIA INAMOVIBLE", margin + 5, y);

    y += 5;
    doc.setFont("Helvetica", "italic").setFontSize(8).setTextColor(80, 80, 80);
    const sealPact = `"Hoy decido firmar que rechazo vivir como huérfano emocional cargando con mis sospechas. Me rindo a la unción de mi Padre Celestial. Asumo con obediencia corporal mis 30 días de renovación neuro-espiritual de fe bajo Romanos 12:2."`;
    doc.text(doc.splitTextToSize(sealPact, maxWidth - 10), margin + 5, y);

    y += 18;
    // Signature lines
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.35);
    doc.line(margin + 5, y, margin + 75, y); // Participant signature line
    doc.line(pageWidth - margin - 75, y, pageWidth - margin - 5, y); // Witness signature line

    y += 4.5;
    doc.setFont("Helvetica", "bold").setFontSize(7.5).setTextColor(100, 100, 100);
    doc.text(`Firma del Participante: ${userName}`, margin + 5, y);
    doc.text("Director Acompañante: Josue Cortes", pageWidth - margin - 75, y);
    y += 9;
  }

  // End of manual sign-off
  checkNewPage(30);
  y += 55; // Leave some safety space at the terminal part of the pdf
  y = pageHeight - 25;
  doc.setLineWidth(0.35).setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;
  doc.setFont("Helvetica", "bold").setFontSize(8).setTextColor(75, 75, 75);
  doc.text("Programa de Transformación Interior - Ministerio Levántate y Resplandece", margin, y);
  y += 4;
  doc.setFont("Helvetica", "normal").setFontSize(7.5).setTextColor(110, 110, 110);
  doc.text("Soporte y Consultas WhatsApp Directo: wa.me/5491122334455  |  Plataforma: levantateresplandece1136.com", margin, y);

  drawFooter();

  // Save File
  const filePrefix = mode === "resumida" ? "Fichas_de_Trabajo" : "Manual_Completo";
  doc.save(`${filePrefix}-Transformacion-Interior-${userName.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf`);
};
