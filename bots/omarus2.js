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
  name: 'Omarus2',
  bg: 'bg1', 
  image: `https://robohash.org/Omarus1.png?set=set2&size=80x80&bgset=bg1`,
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
   

    let dirX = Math.round(Math.random()) < 1 ? -1 : 1;
    let dirY = Math.round(Math.random()) < 1 ? -1 : 1;
    
    let newDir= null;
    bullets.forEach(b => {
      let distance = Math.sqrt( Math.pow((b.pos.x) - (me.pos.x),2) + 
        Math.sqrt( Math.pow((b.pos.y) - (me.pos.y),2))   )
      if (b.botId !== me.id && distance < 5) {  
        
        let x = -b.dir.y;
        let y = b.dir.x;  
        if (b.pos.y < me.pos.y && y < 0 ) { y*=-1; }
        if (b.pos.y > me.pos.y && y > 0 ) { y*=-1; }
        if (b.pos.x < me.pos.x && x < 0 ) { x*=-1; }
        if (b.pos.x > me.pos.x && x > 0 ) { x*=-1; }

        console.log(distance, x, y);
        if (newDir) {  
          if (newDir.distance > distance) { 
            newDir.x = x;
            newDir.y = y;
            newDir.distance = distance;
          }
        }
        else { 
          newDir = { distance: distance, x: x, y: y } 
        }
      }
    })
    
    if (newDir) { 
      this.dir = { x: newDir.x, y: newDir.y };  
      return MOVE(newDir.x, newDir.y);}
    if (!this.dir || Math.random() < .01 ){ 
     this.dir = { x: dirX*Math.random(), y: dirY *Math.random()};
    }
    if (me.reload <= 0) {  
       return SHOOT(enemy.pos.x - me.pos.x, enemy.pos.y - me.pos.y) 
    }

    return MOVE(this.dir.x, this.dir.y)
  }
}
