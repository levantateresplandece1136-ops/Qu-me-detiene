import { jsPDF } from "jspdf";

export const downloadPDFResults = (
  userName: string,
  userEmail: string,
  aiDiagnosis: any,
  results: any[],
  journalNotes: Record<string | number, string>
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

  const drawHeader = () => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("TRANSFORMACIÓN INTERIOR • PROGRAMA DE RENOVACIÓN MENTAL", margin, margin - 10);
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
    doc.text(`Participante: ${userName}  |  Desarrollado por Josue Cortes`, margin, pageHeight - 10);
    doc.text(`Página ${pageNum}`, pageWidth - margin - 15, pageHeight - 10);
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
    doc.text("MANUAL DE COGNICIÓN Y FE", margin + 10, y);
    
    y += 10;
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(201, 168, 76); // Gold color
    doc.text('"Transformaos por medio de la renovación de vuestro entendimiento" - Romanos 12:2', margin + 10, y, { maxWidth: maxWidth - 20 });

    y += 20;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("HISTORIAL DE TRANSFORMACIÓN PERSONAL", margin + 10, y);

    y += 12;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Participante: ${userName}`, margin + 10, y);
    y += 6;
    doc.text(`Correo Registrado: ${userEmail || "No provisto"}`, margin + 10, y);
    y += 6;
    doc.text(`Fecha de Diagnóstico: ${new Date().toLocaleDateString('es-ES')}`, margin + 10, y);
    y += 6;
    doc.text(`Metodología: Neurobiología y Consejería Bíblica Unificada (Levántate Resplandece)`, margin + 10, y, { maxWidth: maxWidth - 20 });

    y += 20;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const introText = "Este manual representa las 8 fases completas del proceso de reestructuración mental y renovación espiritual. Contiene el diagnóstico de rumiaciones y mentiras carnales desmanteladas, las determinaciones ancladas en la Verdad Divina y la guía devocional de 30 días para forjar nuevas autopistas sinápticas de fe, paz y obediencia.";
    doc.text(introText, margin + 10, y, { maxWidth: maxWidth - 20 });

    y += 35;
    doc.setDrawColor(201, 168, 76);
    doc.setFillColor(201, 168, 76);
    doc.rect(margin + 10, y, 60, 0.5, "F");
    y += 5;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text("Josue Cortes", margin + 10, y);
    y += 4;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Dirección Ministerial y Neuro-Pastoral", margin + 10, y);

    drawFooter();
    doc.addPage();
    pageNum++;
    y = margin;
    drawHeader();
  };

  drawTitle();

  const writeHeading = (text: string) => {
    checkNewPage(18);
    y += 6;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(175, 142, 45); // Darker gold for readability
    doc.text(text, margin, y);
    y += 2;
    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  const writeKeyValue = (label: string, value: string) => {
    const wrappedValue = doc.splitTextToSize(value || "N/A", maxWidth - 35);
    const neededHeight = (wrappedValue.length * 5) + 6;
    checkNewPage(neededHeight);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text(`• ${label}:`, margin, y);
    
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    doc.text(wrappedValue, margin + 32, y);
    y += (wrappedValue.length * 5) + 1;
  };

  const writeTextBlock = (title: string, text: string, isAlert = false) => {
    const wrappedText = doc.splitTextToSize(text || "No provisto", maxWidth - 16);
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
    doc.text(title, margin + 5, y);
    
    y += 5;
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(wrappedText, margin + 5, y);
    y += (wrappedText.length * 5) + 5;
  };

  // SECTION 1
  writeHeading("FASE 1 Y 2: IDENTIFICACIÓN Y DIAGNÓSTICO COGNITIVO");
  writeKeyValue("Creencia Principal", aiDiagnosis?.fase1?.principalBelief || (results && results[0]?.creencia));
  writeKeyValue("Temor Raíz", aiDiagnosis?.fase1?.rootFear || 'Temor de rechazo / de fracaso.');
  writeKeyValue("Emoción Dominante", aiDiagnosis?.fase1?.dominantEmotion || 'Ansiedad / Hipervigilancia');
  writeKeyValue("Área Afectada", aiDiagnosis?.fase1?.affectedArea || 'Identidad y Ministerio');
  
  y += 2;
  writeTextBlock(
    "❌ MENTIRA RAÍZ DETECTADA EN SCRIPT INCONSCIENTE", 
    aiDiagnosis?.fase2?.rootLie || 'Mi valía y capacidad dependen de mi esfuerzo carnal y de cumplir las expectativas.',
    true
  );
  writeTextBlock(
    "💬 MECANISMO DE AUTOSABOTAJE OBSERVADO",
    aiDiagnosis?.fase2?.selfSabotageMechanism || 'Postergación rumiante incesante buscando perfeccionismo de desempeño.',
    false
  );

  y += 2;
  checkNewPage(40);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text("🔍 COSTOS ESTIMADOS EN TU COGNICIÓN (LAS 4 DIMENSIONES):", margin, y);
  y += 6;
  writeKeyValue("En Decisiones", aiDiagnosis?.fase2?.currentCost?.decisions || "Parálisis cerebral o rumiación antes de firmar compromisos.");
  writeKeyValue("En Emociones", aiDiagnosis?.fase2?.currentCost?.emotions || "Carga simpática de angustia y culpa constante al descansar.");
  writeKeyValue("En Relaciones", aiDiagnosis?.fase2?.currentCost?.relationships || "Distanciamiento defensivo por hipervigilancia de críticas.");
  writeKeyValue("En Tu Propósito", aiDiagnosis?.fase2?.currentCost?.potentialFuture || "Prisión de talentos escondidos bajo sospechas persistentes.");

  // SECTION 2
  writeHeading("FASE 3 Y 4: RENOVACIÓN BÍBLICA Y NUEVA IDENTIDAD CRISTOCÉNTRICA");
  writeTextBlock(
    "🛑 LA MENTIRA CARNAL ENFRENTADA DE FRENTE",
    aiDiagnosis?.fase3?.mentira || (results && results[0]?.afirmacionTest),
    true
  );
  writeTextBlock(
    "🟢 LA VERDAD ETERNA SUSTITUTORIA DE REENCUADRE",
    aiDiagnosis?.fase3?.verdadBiblica || (results && results[0]?.verdad),
    false
  );
  
  checkNewPage(30);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text("📖 VERSÍCULO ANCLERO DE LA AUTOPISTA NUEVA:", margin, y);
  y += 5;
  const verseText = `"${aiDiagnosis?.fase3?.versiculo?.texto || (results && results[0]?.versiculos && results[0]?.versiculos[0]?.txt) || ''}"`;
  const wrappedVerse = doc.splitTextToSize(verseText, maxWidth - 10);
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(70, 70, 70);
  doc.text(wrappedVerse, margin + 5, y);
  y += (wrappedVerse.length * 5) + 1;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(201, 168, 76);
  doc.text(`— Cita: ${aiDiagnosis?.fase3?.versiculo?.referencia || (results && results[0]?.versiculos && results[0]?.versiculos[0]?.ref) || ''}`, margin + 5, y);
  y += 8;

  writeTextBlock(
    "✨ PRINCIPAL CONFESIÓN DE NUEVA IDENTIDAD (Decir con voz firme diariamente)",
    aiDiagnosis?.fase4?.declaracionIdentidad || (results && results[0]?.declaracion),
    false
  );

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
    doc.text(`SEMANA ${weekNum}: ${title}`, margin + 2, y + 4.5);
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
      doc.text(`DÍA ${day.dia}: ${day.enfoque.toUpperCase()}`, margin + 4, y + 4.5);

      doc.setFont("Helvetica", "normal").setFontSize(8).setTextColor(80, 80, 80);
      
      const dayVerse = `Pasaje: "${day.versiculo.texto}" (${day.versiculo.referencia})`;
      const vText = doc.splitTextToSize(dayVerse, maxWidth - 8);
      doc.text(vText, margin + 4, y + 9);

      const actionText = `Práctica: ${day.accion}`;
      const actText = doc.splitTextToSize(actionText, maxWidth - 8);
      doc.text(actText, margin + 4, y + 14);

      const reflectionText = `Auto-Filtro: ${day.reflexion}`;
      const rText = doc.splitTextToSize(reflectionText, maxWidth - 8);
      doc.text(rText, margin + 4, y + 19);

      const prayerText = `Oración: "${day.oracion}"`;
      const prText = doc.splitTextToSize(prayerText, maxWidth - 8);
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
    "✨ BENDICIÓN DE COMPROMISO PASTORAL DE CLAUSURA",
    aiDiagnosis?.reporteFinal?.exhortacionBiblica || 'Por lo tanto, mantén firmemente la mirada fija en Jesús...',
    false
  );

  y += 5;
  checkNewPage(35);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(40, 40, 40);
  doc.text("HISTORIAL DE VALORACIONES DE TU DIARIO DE ORACIÓN:", margin, y);
  y += 6;
  if (results && results.length > 0) {
    results.forEach((r: any) => {
      const note = journalNotes[r.id] || '(No guardaste notas de oración correspondientes en este casillero).';
      const cellValue = `Materia: "${r.creencia}" (${r.alias})\nDiario de Oración personal: "${note}"`;
      const wrappedCell = doc.splitTextToSize(cellValue, maxWidth - 10);
      checkNewPage((wrappedCell.length * 4.5) + 6);
      
      doc.setFont("Helvetica", "normal").setFontSize(8.5).setTextColor(70, 70, 70);
      doc.text(wrappedCell, margin + 5, y);
      y += (wrappedCell.length * 4.5) + 4;
    });
  } else {
    doc.setFont("Helvetica", "italic").setFontSize(8.5).setTextColor(120, 120, 120);
    doc.text("(Sin valoraciones pasadas de diario aún escritas)", margin + 5, y);
    y += 6;
  }

  // End of manual sign-off
  checkNewPage(30);
  y += 5;
  doc.setLineWidth(0.3).setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  doc.setFont("Helvetica", "bold").setFontSize(8.5).setTextColor(80, 80, 80);
  doc.text("Desarrollado con amor y rigor pastoral por Josue Cortes • Transformación Interior", margin, y);
  y += 5;
  doc.setFont("Helvetica", "normal").setFontSize(7.5).setTextColor(120, 120, 120);
  doc.text("Canal de WhatsApp Oficial: wa.me/5491122334455  |  Canal Digital: levantateresplandece1136.com", margin, y);

  // Finalize document page count and draw header/footer on last page
  drawFooter();

  // Save the PDF
  doc.save(`Manual-Transformacion-Interior-${userName.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf`);
};
