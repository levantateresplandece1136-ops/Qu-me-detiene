export interface Belief {
  limiting: string;
  truth: string;
  verse: string;
  empowered: string;
}

export interface Category {
  title: string;
  description: string;
  beliefs: Belief[];
}

export const beliefsDatabase: Record<string, Category> = {
  "sobre_ti_mismo": {
    title: "Sobre Ti Mismo",
    description: "Tu identidad y valor personal",
    beliefs: [
      {
        limiting: "No soy suficiente / No valgo",
        truth: "Eres hechura de Dios, creado con propósito",
        verse: "Porque somos hechura suya, creados en Cristo Jesús para buenas obras - Efesios 2:10",
        empowered: "Soy una creación única y valiosa de Dios, diseñado con propósito específico"
      },
      {
        limiting: "No merezco ser feliz/exitoso/amado",
        truth: "Dios te ama incondicionalmente",
        verse: "Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros - Romanos 5:8",
        empowered: "Soy profundamente amado por el Creador del universo y merezco toda bendición"
      },
      {
        limiting: "Soy un fraude (síndrome del impostor)",
        truth: "Dios te ha dado poder y dominio propio",
        verse: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio - 2 Timoteo 1:7",
        empowered: "Tengo poder, amor y dominio propio de Dios para cumplir mi llamado"
      },
      {
        limiting: "No tengo fuerza de voluntad",
        truth: "Dios renueva tus fuerzas constantemente",
        verse: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas - Isaías 40:31",
        empowered: "Mis fuerzas son renovadas cada día por el poder de Dios"
      }
    ]
  },
  "capacidades": {
    title: "Tus Capacidades",
    description: "Habilidades y talentos",
    beliefs: [
      {
        limiting: "No soy bueno para aprender cosas nuevas",
        truth: "Dios te instruye y enseña",
        verse: "Instruiré y te enseñaré el camino en que debes andar - Salmos 32:8",
        empowered: "Tengo la capacidad de aprender y crecer en cualquier área que me proponga"
      },
      {
        limiting: "Es demasiado tarde para empezar",
        truth: "Dios tiene planes buenos para ti ahora",
        verse: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz - Jeremías 29:11",
        empowered: "Cada momento es una oportunidad perfecta para comenzar algo nuevo"
      },
      {
        limiting: "No tengo el talento necesario",
        truth: "Dios te ha dado dones únicos",
        verse: "Cada uno según el don que ha recibido, minístrelo a los otros - 1 Pedro 4:10",
        empowered: "Poseo dones únicos que Dios me ha dado para impactar al mundo"
      },
      {
        limiting: "No puedo cambiar mi personalidad",
        truth: "Puedes ser transformado completamente",
        verse: "Transformaos por medio de la renovación de vuestro entendimiento - Romanos 12:2",
        empowered: "Estoy en constante transformación hacia mi mejor versión"
      }
    ]
  },
  "dinero": {
    title: "Dinero y Abundancia",
    description: "Prosperidad y recursos",
    beliefs: [
      {
        limiting: "El dinero es malo o sucio",
        truth: "El amor al dinero es el problema, no el dinero",
        verse: "Raíz de todos los males es el amor al dinero - 1 Timoteo 6:10",
        empowered: "El dinero es una herramienta para bendecir y servir a otros"
      },
      {
        limiting: "No merezco ganar más dinero",
        truth: "Dios te da poder para hacer riquezas",
        verse: "Recuerda a Jehová tu Dios, porque Él te da el poder para hacer las riquezas - Deuteronomio 8:18",
        empowered: "Dios me capacita para generar recursos y bendecir a otros"
      },
      {
        limiting: "La riqueza es para otros, no para mí",
        truth: "Dios desea tu prosperidad integral",
        verse: "Amado, yo deseo que tú seas prosperado en todas las cosas - 3 Juan 1:2",
        empowered: "Merezco prosperar en todas las áreas de mi vida"
      },
      {
        limiting: "Hay que trabajar muy duro para ganar dinero",
        truth: "La bendición de Dios enriquece sin tristeza",
        verse: "La bendición de Jehová es la que enriquece, y no añade tristeza con ella - Proverbios 10:22",
        empowered: "La bendición de Dios me prospera con gozo y paz"
      }
    ]
  },
  "relaciones": {
    title: "Relaciones",
    description: "Vínculos y conexiones",
    beliefs: [
      {
        limiting: "No merezco amor verdadero",
        truth: "Eres hijo amado de Dios",
        verse: "Mirad cuál amor nos ha dado el Padre, para que seamos llamados hijos de Dios - 1 Juan 3:1",
        empowered: "Soy digno de amor verdadero y relaciones saludables"
      },
      {
        limiting: "Todos me van a abandonar/traicionar",
        truth: "Dios nunca te dejará",
        verse: "No te desampararé, ni te dejaré - Hebreos 13:5",
        empowered: "Atraigo relaciones leales y comprometidas a mi vida"
      },
      {
        limiting: "Debo complacer a todos para ser aceptado",
        truth: "Tu valor no depende de la aprobación humana",
        verse: "¿Busco ahora el favor de los hombres, o el de Dios? - Gálatas 1:10",
        empowered: "Soy aceptado por Dios y eso es suficiente"
      },
      {
        limiting: "Si muestro mi verdadero yo, me rechazarán",
        truth: "Dios te eligió tal como eres",
        verse: "Antes bien, Dios ha elegido lo necio del mundo para avergonzar a los sabios - 1 Corintios 1:27",
        empowered: "Mi autenticidad es mi mayor fortaleza y atrae a las personas correctas"
      }
    ]
  },
  "trabajo": {
    title: "Trabajo y Éxito",
    description: "Carrera y logros",
    beliefs: [
      {
        limiting: "El éxito requiere sacrificar la vida personal",
        truth: "Dios ordena descanso y balance",
        verse: "Seis días trabajarás... mas el séptimo día es reposo para Jehová - Éxodo 20:9-10",
        empowered: "Puedo tener éxito mientras mantengo balance y paz en mi vida"
      },
      {
        limiting: "No puedo tener éxito sin contactos",
        truth: "Dios es quien promueve",
        verse: "Porque exaltación ni de oriente ni de occidente... Mas Dios es el juez - Salmos 75:6-7",
        empowered: "Mi promoción viene de Dios, no de las personas"
      },
      {
        limiting: "El fracaso es permanente",
        truth: "El justo se levanta siete veces",
        verse: "Porque siete veces cae el justo, y vuelve a levantarse - Proverbios 24:16",
        empowered: "Cada caída es una oportunidad para levantarme más fuerte"
      },
      {
        limiting: "Debo ser perfecto para tener éxito",
        truth: "El poder de Dios se perfecciona en tu debilidad",
        verse: "Mi poder se perfecciona en la debilidad - 2 Corintios 12:9",
        empowered: "Mi imperfección es el espacio donde el poder de Dios se manifiesta"
      }
    ]
  },
  "salud": {
    title: "Salud y Cuerpo",
    description: "Bienestar físico",
    beliefs: [
      {
        limiting: "Mi cuerpo está roto/dañado",
        truth: "Tu cuerpo es templo del Espíritu Santo",
        verse: "¿O ignoráis que vuestro cuerpo es templo del Espíritu Santo? - 1 Corintios 6:19",
        empowered: "Mi cuerpo es sagrado y capaz de sanidad y restauración"
      },
      {
        limiting: "No puedo estar saludable",
        truth: "Dios es tu sanador",
        verse: "Yo soy Jehová tu sanador - Éxodo 15:26",
        empowered: "Tengo el poder de Dios para vivir en salud y vitalidad"
      },
      {
        limiting: "Mi cuerpo no es atractivo",
        truth: "Eres formidable y maravillosamente hecho",
        verse: "Te alabaré; porque formidables, maravillosas son tus obras - Salmos 139:14",
        empowered: "Soy una obra maestra diseñada por Dios con amor"
      },
      {
        limiting: "No puedo cambiar mi físico",
        truth: "Nada es imposible para Dios",
        verse: "Porque nada hay imposible para Dios - Lucas 1:37",
        empowered: "Con Dios puedo transformar mi cuerpo y mi salud"
      }
    ]
  },
  "cambio": {
    title: "Cambio y Crecimiento",
    description: "Transformación personal",
    beliefs: [
      {
        limiting: "Las personas no cambian",
        truth: "En Cristo eres nueva criatura",
        verse: "De modo que si alguno está en Cristo, nueva criatura es - 2 Corintios 5:17",
        empowered: "Estoy en constante transformación y renovación"
      },
      {
        limiting: "Cambiar es muy difícil",
        truth: "Todo lo puedes en Cristo",
        verse: "Todo lo puedo en Cristo que me fortalece - Filipenses 4:13",
        empowered: "Tengo el poder de Cristo para lograr cualquier cambio"
      },
      {
        limiting: "No puedo superar mi pasado",
        truth: "Olvida lo que queda atrás",
        verse: "Olvidando ciertamente lo que queda atrás, y extendiéndome a lo que está delante - Filipenses 3:13",
        empowered: "Mi pasado no define mi futuro, Dios hace nuevas todas las cosas"
      },
      {
        limiting: "Ya intenté y no funcionó",
        truth: "Dios es fiel para completar su obra",
        verse: "Fiel es el que os llama, el cual también lo hará - 1 Tesalonicenses 5:24",
        empowered: "Dios completará la buena obra que comenzó en mí"
      }
    ]
  },
  "tiempo": {
    title: "Tiempo y Oportunidad",
    description: "Gestión y momento",
    beliefs: [
      {
        limiting: "No tengo tiempo para lo importante",
        truth: "Aprovecha bien el tiempo",
        verse: "Aprovechando bien el tiempo, porque los días son malos - Efesios 5:16",
        empowered: "Tengo el tiempo necesario para lo que realmente importa"
      },
      {
        limiting: "Ya es demasiado tarde",
        truth: "Ahora es el tiempo aceptable",
        verse: "He aquí ahora el tiempo aceptable; he aquí ahora el día de salvación - 2 Corintios 6:2",
        empowered: "Este es mi momento perfecto para comenzar"
      },
      {
        limiting: "Soy demasiado viejo/joven para cambiar",
        truth: "Dios renueva tu juventud",
        verse: "Renuévate como el águila tu juventud - Salmos 103:5",
        empowered: "La edad es irrelevante cuando Dios está conmigo"
      },
      {
        limiting: "Mi mejor época ya pasó",
        truth: "Tu camino va en aumento",
        verse: "La senda de los justos es como la luz de la aurora, que va en aumento - Proverbios 4:18",
        empowered: "Mis mejores días están por delante, no atrás"
      }
    ]
  }
};
