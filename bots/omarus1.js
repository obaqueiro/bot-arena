// Bot radius is 10
// Bot speed is 1
// Bot health is 100
// Bullet radius is 3
// Bullet speed is 2
// Bullet does 10 damage
// Arena radius is 160
// Reload time is 30 frames
// Max movement speed per frame is 1

// Return an object with bot properties
// Alternatively return a Promise to load bot code remotely
// For example, to load a bot from a gist:
// return fetch('https://api.github.com/gists/GIST_ID').then(r => r.json())
return {
  name: 'My Bot',
  image: `https://robohash.org/${Math.random()}.png?set=set2&size=80x80&bgset=bg2`,

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
  action: ({ me, enemies,bullets }) => {
    let enemy = enemies[0]
    
    if (me.reload <= 0) { 
      return SHOOT(enemy.pos.x - me.pos.x, enemy.pos.y - me.pos.y)
    }
    
      
    let target = { x: enemy.pos.x, y: enemy.pos.y }
    let dirX = Math.round(Math.random()) < 1 ? -1 : 1;
    let dirY = Math.round(Math.random()) < 1 ? -1 : 1;
     
    
    bullets.forEach(b => {
      if (Math.abs(b.pos.x - me.pos.x) < 30 ) {
        if (Math.abs(b.pos.y - me.pos.y) < 30)
        if(b.botId !== me.id) {
          console.log(b.pos.x, me.pos.x, b.botId, me.id) 
            return MOVE(-b.dir.x, -b.dir.y)
        }
      }
    })
    
    if (!this.dir || Math.random() < .02 ){ 
     this.dir = { x: dirX*Math.random(), y: dirY *Math.random()};
    }
    return MOVE(this.dir.x, this.dir.y)
  }

}
