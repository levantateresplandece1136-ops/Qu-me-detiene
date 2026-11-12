/**
 * Plan de 30 días — Proverbios 3:5-9 (plan manuscrito de Josue).
 * Los 4 elementos del plan, cada uno con sus 6 líneas, y el reparto de
 * los 30 días entre ellos. Lo usan igual la pantalla final (App.tsx)
 * y el reporte descargado (pdfGenerator.ts), para que digan lo mismo.
 */

export const CITA_BASE = "Proverbios 3:5-9";

export const TEXTO_CITA_BASE =
  "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. " +
  "Reconócelo en todos tus caminos, y él enderezará tus veredas. " +
  "No seas sabio en tu propia opinión; teme a Jehová, y apártate del mal; " +
  "porque será medicina a tu cuerpo, y refrigerio para tus huesos. " +
  "Honra a Jehová con tus bienes, y con las primicias de todos tus frutos.";

export interface PlanElement {
  id: string;
  numero: number;
  titulo: string;
  diasInicio: number;
  diasFin: number;
  /** Con qué tiene que ver */
  tieneQueVer: string;
  /** Para esto hay que... */
  hacer: string;
  /** De qué se disfruta */
  disfruta: string;
  /** Qué se define / derrota / decide / dedica */
  define: string;
  /** El llamado a la acción */
  llamado: string;
  llamadoCita: string;
  /** Qué se añade (cadena de crecimiento) */
  anade: string;
  anadeCita: string;
  /** Semana del plan semanal existente (fase5) que corresponde a este elemento */
  semanaIndex: number;
}

export const PLAN_PROVERBIOS: PlanElement[] = [
  {
    id: "confia",
    numero: 1,
    titulo: "Confía en Él",
    diasInicio: 1,
    diasFin: 7,
    tieneQueVer: "Fe",
    hacer: "Conocerte (conocer a Dios)",
    disfruta: "sus Atributos",
    define: "Defines lo que Dios dice con un Concepto",
    llamado: "Memorizar",
    llamadoCita: "Salmo 119",
    anade: "Fe (conoces, confías) → Virtud",
    anadeCita: "2ª Pedro",
    semanaIndex: 0,
  },
  {
    id: "contesta",
    numero: 2,
    titulo: "Contesta al llamado de Dios",
    diasInicio: 8,
    diasFin: 15,
    tieneQueVer: "Fidelidad",
    hacer: "Responder en Adoración",
    disfruta: "tu Identidad en Cristo",
    define: "Derrotas y Conquistas todo pensamiento y concepto equivocado",
    llamado: "Reconocerlo en todos tus caminos",
    llamadoCita: "Efesios 5, Colosenses 3",
    anade: "conocimiento → Dominio Propio",
    anadeCita: "",
    semanaIndex: 1,
  },
  {
    id: "confiesa",
    numero: 3,
    titulo: "Confiesa tu necesidad de Él",
    diasInicio: 16,
    diasFin: 22,
    tieneQueVer: "Formación",
    hacer: "Confesar mi necesidad de Él",
    disfruta: "Su Obra en ti (tú rogando)",
    define: "Decides tomarlo en serio (Temerle)",
    llamado: "Crecer en Santidad",
    llamadoCita: "1 Juan 1:9, Efesios 4:32, Mateo 18:15",
    anade: "paciencia → Piedad",
    anadeCita: "",
    semanaIndex: 2,
  },
  {
    id: "consagra",
    numero: 4,
    titulo: "Consagra todo",
    diasInicio: 23,
    diasFin: 30,
    tieneQueVer: "Fruto",
    hacer: "Consagrar cada área a Él",
    disfruta: "la Esperanza que tenemos en Él y sus Recursos",
    define: "Dedicas tus recursos a Él",
    llamado: "Honrar a Dios con TODA tu vida",
    llamadoCita: "Santiago 1:22-25, Efesios 4",
    anade: "al afecto fraternal → Amor",
    anadeCita: "",
    semanaIndex: 3,
  },
];

export const elementForDay = (dayNum: number): PlanElement =>
  PLAN_PROVERBIOS.find((el) => dayNum >= el.diasInicio && dayNum <= el.diasFin) ||
  PLAN_PROVERBIOS[PLAN_PROVERBIOS.length - 1];

/** Las 6 líneas de un elemento, ya redactadas para pantalla y PDF. */
export const elementLines = (el: PlanElement): { label: string; text: string }[] => [
  { label: "Tiene que ver con", text: el.tieneQueVer },
  { label: "Para esto hay que", text: el.hacer },
  { label: "Disfrutas de", text: el.disfruta },
  { label: "Y tú", text: el.define },
  {
    label: "Llamado a la acción",
    text: `${el.llamado} (${el.llamadoCita})`,
  },
  {
    label: "Añades",
    text: el.anadeCita ? `${el.anade} (${el.anadeCita})` : el.anade,
  },
];
