export interface HeartStageOption {
  id: string;
  label: string;
  relatedBlocks: string[];
}

export interface HeartStageQuestion {
  id: 'busca' | 'teme' | 'protege' | 'produce';
  stage: 3 | 4 | 5 | 6;
  stageTitle: string;
  prompt: string;
  multi: boolean;
  maxSelect: number;
  options: HeartStageOption[];
}

export const HEART_STAGE_QUESTIONS: HeartStageQuestion[] = [
  {
    id: 'busca',
    stage: 3,
    stageTitle: 'LO QUE BUSCAS',
    prompt: 'Cuando pienso en {area}, lo que más necesito asegurar es…',
    multi: false,
    maxSelect: 1,
    options: [
      {
        id: 'seguridad',
        label: 'Sentirme seguro/a y en control de lo que viene',
        relatedBlocks: ['control-entorno', 'tiempo-futuro']
      },
      {
        id: 'aceptacion',
        label: 'Que los demás me acepten y valoren',
        relatedBlocks: ['genero-identidad-social', 'relaciones-poder']
      },
      {
        id: 'capacidad',
        label: 'Demostrar que soy capaz y hago bien las cosas',
        relatedBlocks: ['capacidad-identidad', 'rendimiento-logro']
      },
      {
        id: 'amor',
        label: 'Sentirme amado/a y no quedarme solo/a',
        relatedBlocks: ['merecimiento-vinculo']
      },
      {
        id: 'dios',
        label: 'Tener paz con Dios y certeza de Su aprobación',
        relatedBlocks: ['espiritualidad-trascendencia']
      },
      {
        id: 'otra',
        label: 'Otra / no estoy seguro',
        relatedBlocks: []
      }
    ]
  },
  {
    id: 'teme',
    stage: 4,
    stageTitle: 'LO QUE TEMES',
    prompt: 'Si las cosas no salieran como espero, lo que más temo es…',
    multi: false,
    maxSelect: 1,
    options: [
      {
        id: 'desorden',
        label: 'Que todo se desordene y no pueda resolverlo',
        relatedBlocks: ['control-entorno', 'tiempo-futuro']
      },
      {
        id: 'rechazo',
        label: 'Que me rechacen o me critiquen',
        relatedBlocks: ['genero-identidad-social', 'relaciones-poder']
      },
      {
        id: 'insuficiencia',
        label: 'Quedar expuesto/a como alguien que no es suficiente',
        relatedBlocks: ['capacidad-identidad', 'rendimiento-logro']
      },
      {
        id: 'soledad',
        label: 'Perder a alguien importante o quedarme solo/a',
        relatedBlocks: ['merecimiento-vinculo', 'relaciones-poder']
      },
      {
        id: 'fallar-dios',
        label: 'Haberle fallado a Dios',
        relatedBlocks: ['espiritualidad-trascendencia']
      },
      {
        id: 'otra',
        label: 'Otra / no estoy seguro',
        relatedBlocks: []
      }
    ]
  },
  {
    id: 'protege',
    stage: 5,
    stageTitle: 'CÓMO TE PROTEGES',
    prompt: 'Cuando siento esa presión, lo que suelo hacer es…',
    multi: true,
    maxSelect: 2,
    options: [
      {
        id: 'controlar',
        label: 'Revisar, planear y controlar más de la cuenta',
        relatedBlocks: ['control-entorno']
      },
      {
        id: 'exigirme',
        label: 'Trabajar más y exigirme más',
        relatedBlocks: ['rendimiento-logro', 'capacidad-identidad']
      },
      {
        id: 'ceder',
        label: 'Callar o ceder para evitar conflictos',
        relatedBlocks: ['relaciones-poder', 'genero-identidad-social']
      },
      {
        id: 'aislarme',
        label: 'Alejarme o guardarme lo que siento',
        relatedBlocks: ['merecimiento-vinculo']
      },
      {
        id: 'postergar',
        label: 'Postergar o evitar decidir',
        relatedBlocks: ['tiempo-futuro']
      },
      {
        id: 'otra',
        label: 'Otra / no estoy seguro',
        relatedBlocks: []
      }
    ]
  },
  {
    id: 'produce',
    stage: 6,
    stageTitle: 'LO QUE ESTO PRODUCE',
    prompt: 'Donde más noto el desgaste es…',
    multi: true,
    maxSelect: 2,
    options: [
      {
        id: 'cuerpo',
        label: 'En mi cuerpo y mi descanso',
        relatedBlocks: ['cuerpo-salud']
      },
      {
        id: 'relaciones',
        label: 'En mi paciencia y trato con otros',
        relatedBlocks: ['relaciones-poder']
      },
      {
        id: 'dios',
        label: 'En mi paz y cercanía con Dios',
        relatedBlocks: ['espiritualidad-trascendencia']
      },
      {
        id: 'decisiones',
        label: 'En mi claridad para decidir',
        relatedBlocks: ['tiempo-futuro', 'control-entorno']
      },
      {
        id: 'animo',
        label: 'En mi alegría y ánimo',
        relatedBlocks: ['merecimiento-vinculo']
      },
      {
        id: 'otra',
        label: 'Otra / no estoy seguro',
        relatedBlocks: []
      }
    ]
  }
];

export function fillStagePrompt(prompt: string, areaTitle: string): string {
  return prompt.replace(/\{area\}/g, areaTitle.toLowerCase());
}
