import doHacks from './hacks'

let botCounter = 0

export const setupBots = (bots) => {
  doHacks()

  return bots.map((bot, i) => ({
    ...bot,
    key: ++botCounter,
    object: bot.constructor.call({}),
    health: 100,
    reload: 30,
    pos: (
      i === 0 ? { x: -50, y: -50 }
      : { x: 50, y: 50 }
    )
  }))
}
