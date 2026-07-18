/**
 * ManchasBot — utilidades y constantes
 *
 * ManchasBot es el asistente virtual de TechCup que saluda al entrar a cualquier chat.
 * Se identifica por un prefijo especial en el contenido del mensaje.
 */

export const MANCHAS_BOT_PREFIX = '🤖 *ManchasBot*:'

export const MANCHAS_BOT_AVATAR = '/manchas-callcenter.png'

export const MANCHAS_BOT_GREETINGS = [
  '¡Hola! Soy ManchasBot 🤖 Bienvenidos al chat. Estoy aquí para ayudar con información sobre torneos, reglamento, inscripciones y más. ¿En qué puedo colaborarles?',
  '¡Bienvenidos! 🎮 Soy ManchasBot, su asistente virtual. Recuerden revisar el reglamento y las fechas importantes en la sección de Torneos. ¡Buena suerte!',
]

export function randomGreeting(): string {
  return MANCHAS_BOT_GREETINGS[Math.floor(Math.random() * MANCHAS_BOT_GREETINGS.length)]
}

/**
 * Verifica si un mensaje fue enviado por ManchasBot según su contenido.
 */
export function isManchasBotMessage(content: string): boolean {
  return content.startsWith(MANCHAS_BOT_PREFIX)
}

/**
 * Limpia el prefijo de ManchasBot para mostrar solo el texto legible.
 */
export function cleanManchasBotMessage(content: string): string {
  return content.replace(/^🤖 \*ManchasBot\*:\s*/, '')
}

// ═══════════════════════════════════════════════════════════════
// Base de conocimiento del bot — usada por ManchasFloating y Soporte
// ═══════════════════════════════════════════════════════════════

export interface BotEntry {
  keywords: string[]
  response: string
}

export const botKnowledge: BotEntry[] = [
  {
    keywords: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'saludos'],
    response: '¡Hola! 😊 Soy ManchasBot, el asistente de TechCup. ¿En qué puedo ayudarte hoy? Podés consultarme sobre torneos, inscripciones, equipos, reglamento, partidos y más.',
  },
  {
    keywords: ['como estas', 'como va', 'que haces', 'que paso', 'todo bien', 'bien y tu'],
    response: '¡Todo bien por acá! 🐾 Listo para ayudarte con lo que necesites. Contame, ¿en qué te puedo colaborar?',
  },
  {
    keywords: ['gracias', 'graciass', 'muchas gracias', 'te agradezco', 'thanks'],
    response: '¡De nada! 🙌 Para eso estoy. Si necesitás algo más, acá estoy. ¡Éxitos en TechCup! ⚽',
  },
  {
    keywords: ['inscribir', 'inscripcion', 'inscripción', 'registrarme', 'registro', 'anotarme'],
    response: 'Para inscribirte, tu capitán debe completar el registro del equipo y cargar el comprobante de pago. El organizador revisa y aprueba la inscripción. ¿Querés que te cuente más detalles?',
  },
  {
    keywords: ['torneo', 'torneos', 'competencias', 'categoria', 'categoría'],
    response: 'Los torneos disponibles los encontrás en la sección Torneos. Cada torneo tiene su fecha, categoría y costo de inscripción. Actualmente tenemos TechCup 2026-II y Torneo Relámpago, entre otros.',
  },
  {
    keywords: ['reglamento', 'reglas', 'normas', 'sanciones', 'falta', 'faltas'],
    response: 'El reglamento oficial está disponible en la sección Reglamento de cada torneo. Incluye normas de juego, sanciones, formato de competencia y criterios de fair play.',
  },
  {
    keywords: ['equipo', 'crear equipo', 'armar equipo', 'unirme', 'capitan', 'capitán'],
    response: 'Podés crear un equipo desde la sección "Crear equipo" o unirte a uno existente mediante invitación del capitán. Cada equipo necesita un capitán y mínimo 8 jugadores.',
  },
  {
    keywords: ['partido', 'partidos', 'calendario', 'fecha', 'programacion', 'programación'],
    response: 'Los partidos se programan automáticamente según el bracket del torneo. El calendario completo está en la sección Calendario. También podés ver los resultados en vivo desde el Panel.',
  },
  {
    keywords: ['pago', 'pagar', 'costo', 'precio', 'inscripcion costo', 'cuanto cuesta', 'mercado pago', 'pse'],
    response: 'El pago de inscripción se realiza por los medios indicados por la organización (Mercado Pago, PSE). Solo debés subir el comprobante desde la inscripción del equipo.',
  },
  {
    keywords: ['chat', 'mensaje', 'hablar', 'contacto', 'soporte', 'ayuda'],
    response: 'Acá estoy para ayudarte 😄. Si necesitás hablar con un organizador, podés escalar tu consulta desde la sección Soporte o escribir en el chat del equipo.',
  },
  {
    keywords: ['admin', 'administrador', 'organizador', 'panel', 'dashboard'],
    response: 'El Panel de Administración te permite gestionar torneos, equipos, partidos, jugadores y logística. También podés ver reportes y configurar el sistema.',
  },
  {
    keywords: ['estadisticas', 'estadísticas', 'tabla', 'posiciones', 'goleadores', 'ranking'],
    response: 'Las estadísticas completas están en la sección Rankings y Estadísticas. Incluyen tabla de posiciones, goleadores, ranking de arqueros, fair play y más.',
  },
]

/**
 * Obtiene la mejor respuesta para una consulta.
 * Busca coincidencia por keywords y devuelve la que tenga más matches.
 */
export function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim()
  if (!lower || lower.length < 2) return botKnowledge[0].response

  let best: { entry: BotEntry; score: number } | null = null
  for (const entry of botKnowledge) {
    const score = entry.keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0)
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score }
    }
  }

  if (best) return best.entry.response

  return 'No entendí bien tu consulta 🤔. Podés preguntarme sobre **torneos**, **inscripciones**, **equipos**, **partidos**, **reglamento** o **pagos**. ¿Sobre qué tema querés saber?'
}
