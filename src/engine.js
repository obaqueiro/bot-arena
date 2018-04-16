import V from './vector'

const BOT_RADIUS = 10
const BOT_COLLISION_DIST = (BOT_RADIUS + BOT_RADIUS) * (BOT_RADIUS + BOT_RADIUS)
const BULLET_RADIUS = 3
const BULLET_SPEED = 2
const ARENA_RADIUS = 160
const RELOAD_TIME = 30
const BULLET_BOUNDARY = Math.pow(ARENA_RADIUS + BULLET_RADIUS, 2)
const BULLET_TO_BOT_BOUNDARY = Math.pow(BOT_RADIUS + BULLET_RADIUS, 2)

export default (bots, parentNode) => {
  const state = {
    running: true,
    winnerFound: false,
    frame: 0,
    frameAcc: 0,
    bullets: [],
    speed: 1
  }

  let winnerDom

  const createBullet = (pos, dir) => {
    const dom = document.createElement('div')
    dom.className = 'bullet'
    parentNode.appendChild(dom)

    // Handle null values
    dir.x = dir.x || 0
    dir.y = dir.y || 0
    if (dir.x === 0 && dir.y === 0) {
      dir.x = 1
    }

    return {
      // Move out of bot
      pos: V.add(pos, V.multScalar(dir, BOT_RADIUS + BULLET_RADIUS)),
      vel: V.multScalar(dir, BULLET_SPEED),
      dir,
      dom
    }
  }

  const winner = (bot) => {
    winnerDom = document.createElement('div')
    winnerDom.className = 'winner'
    if (bot) winnerDom.innerHTML = `Winner: ${bot.object.name}`
    else winnerDom.innerHTML = 'Draw'
    parentNode.appendChild(winnerDom)
  }

  const mapBot = (bot) => ({
    name: bot.object.name,
    health: bot.health,
    pos: V.clone(bot.pos),
    lastAction: { ...bot.lastAction }
  })

  const mapBullet = (bullet) => ({
    pos: V.clone(bullet.pos),
    vel: V.clone(bullet.vel),
    dir: V.clone(bullet.dir)
  })

  const update = () => {
    state.frameAcc += state.speed

    while (state.frameAcc >= 1) {
      state.frameAcc -= 1

      if (!state.running) return

      const actions = []
      const _bullets = state.bullets.map(mapBullet)

      // Bots decide their next action
      bots.forEach(bot => {
        const _me = mapBot(bot)
        const _enemies = bots.filter(b => b.key !== bot.key).map(mapBot)

        _me.reload = bot.reload

        if (bot.health <= 0) return

        if (bot.object.action) {
          let action = bot.object.action({
            me: _me,
            enemies: _enemies,
            bullets: _bullets,
            frame: state.frame
          })

          if (action) {
            actions.push({ ...action, bot })
          }
        }
      })

      // Execute actions
      actions.forEach(action => {
        switch (action.type) {
          case 'MOVE': {
            const movement = (
              V.magnitudeSquared(action) > 1
                ? V.normalize(action)
                : action
            )

            action.bot.pos = V.add(
              action.bot.pos,
              movement
            )
            break
          }
          case 'SHOOT': {
            if (action.bot.reload <= 0) {
              state.bullets.push(createBullet(
                action.bot.pos,
                V.normalize(action)
              ))
              action.bot.reload = RELOAD_TIME + 1
            }
            break
          }
        }

        action.bot.lastAction = { ...action }
      })

      bots.forEach(bot => {
        bot.reload = Math.max(0, bot.reload - 1)

        // Clamp inside boundary
        bot.pos = V.clamp(bot.pos, 0, ARENA_RADIUS - BOT_RADIUS)

        // Resolve collisions
        bots.forEach(bot2 => {
          if (bot === bot2) return

          if (V.distanceSquared(bot.pos, bot2.pos) < BOT_COLLISION_DIST) {
            const delta = V.sub(bot.pos, bot2.pos)
            const d = V.magnitude(delta)
            const mtd = V.multScalar(delta, ((BOT_RADIUS + BOT_RADIUS) - d) / d)
            bot.pos = V.add(bot.pos, V.multScalar(mtd, 0.5))
            bot2.pos = V.sub(bot2.pos, V.multScalar(mtd, 0.5))
          }
        })
      })

      // Run bullets
      state.bullets = state.bullets.filter(bullet => {
        bullet.pos = V.add(bullet.pos, bullet.vel)
        bullet.dom.style.transform = `translate(${bullet.pos.x}px, ${bullet.pos.y}px)`

        // Check if hit bot
        for (let bot of bots) {
          if (bot.health > 0 && V.distanceSquared(bot.pos, bullet.pos) < BULLET_TO_BOT_BOUNDARY) {
            bot.health -= 10
            parentNode.removeChild(bullet.dom)
            return false
          }
        }

        // Remove if outside boundary
        if (V.magnitudeSquared(bullet.pos) >= BULLET_BOUNDARY) {
          parentNode.removeChild(bullet.dom)
          return false
        }
        return true
      })

      // Render
      bots.forEach(bot => {
        if (bot.dom) {
          bot.dom.style.transform = `translate(${bot.pos.x}px, ${bot.pos.y}px)`
          bot.healthDom.style.transform = `scaleX(${bot.health / 100})`

          if (bot.health <= 0) {
            bot.dom.classList.add('-dead')
          }
        }
      })

      // Look for winner
      if (!state.winnerFound) {
        const botsLeft = bots.filter(b => b.health > 0)
        if (botsLeft.length <= 1) {
          winner(botsLeft[0])
          state.winnerFound = true
        }
      }

      state.frame += 1
    }

    window.requestAnimationFrame(update)
  }

  update()

  return {
    setSpeed: (speed) => {
      state.speed = speed || 1
    },
    dispose: () => {
      state.bullets.forEach(b => parentNode.removeChild(b.dom))
      state.bullets = []
      state.running = false

      if (winnerDom) {
        parentNode.removeChild(winnerDom)
        winnerDom = null
      }
    }
  }
}
