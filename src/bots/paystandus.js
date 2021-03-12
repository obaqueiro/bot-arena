export default (`
return {
  // Asegurate de poner esta información
  name: 'Paystandus',
  builder: 'Omar Baqueiro',
  email: 'obaqueiro@paystand.com',
  image: 'http://posadev.paystand.mx/logo.png',

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
`)