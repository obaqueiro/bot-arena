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

return {
  name: 'My Bot',
  image: \`https://robohash.org/\${Math.random()}.png?set=set2&size=40x40&bgset=bg2\`,

  /*
  * action() runs every frame
  * Return a direction to either move your bot or shoot a bullet
  *
  * @param {name, health, pos, lastAction} me
  * @param [{name, health, pos, lastAction}] enemies
  * @param [{pos, vel, dir}] bullets
  * @param int frame
  * @returns MOVE(x,y) or SHOOT(x,y)
  */
  action: ({ me, enemies, bullets, frame }) => {
    if (frame % 10 === 0) return MOVE(0, 1)
    return MOVE(1, 0)
  }
}`)
