export default (
`return {
  name: 'CPU Bot',
  image: 'https://robohash.org/robot.png?set=set2&size=40x40&bgset=bg2',
  action: ({ me, enemies }) => {
    let enemy = enemies[0]
    let target = { x: 0, y: -80 }
    if (me.reload <= 0) {
      return SHOOT(enemy.pos.x - me.pos.x, enemy.pos.y - me.pos.y)
    }
    return MOVE(target.x - me.pos.x, target.y - me.pos.y)
  }
}`)
