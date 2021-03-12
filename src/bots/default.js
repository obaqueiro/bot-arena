export default (
  `// Bot radius is 10
// Bot speed is 1
// Bot health is 100
// Bullet radius is 3
// Bullet speed is 2
// Bullet does 10 damage
// Arena radius is 160
// Reload time is 30 frames
// Max movement speed per frame is 1

// Return an object with bot properties
  
  return {
  name: 'Examplus',
  image: 'https://robohash.org/robot.png?set=set2&size=80x80&bgset=bg2',

  /*
  * action() runs every frame
  * Return a direction to either move your bot or shoot a bullet
  *
  * @param {id, name, health, pos, lastAction} me
  * @param [{id, name, health, pos, lastAction}] enemies
  * @param [{pos, vel, dir, botId}] bullets
  * @param int frame
  * @returns MOVE(x,y) or SHOOT(x,y)
  */
  action: ({ me, enemies }) => {
    let enemy = enemies[0]
    let target = { x: 0, y: -80 }
    if (me.reload <= 0) {
      return SHOOT(enemy.pos.x - me.pos.x, enemy.pos.y - me.pos.y)
    }
    return MOVE(target.x - me.pos.x, target.y - me.pos.y)
  }
}`)
