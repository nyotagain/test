class Ball{
  constructor(id, x, y){
    this.id = id;
    this.justHit = -1;
    this.ppos = this.pos = new p5.Vector(x, y);
    this.velo = 1;
    this.rad = random(30, 50);
    let tempX = (random(0, 1) > 0.5)? random(-1.5, -0.5) :random(0.5, 1.5); 
    let tempY = (random(0, 1) > 0.5)? random(-1.5, -0.5) :random(0.5, 1.5); 
    this.dir = new p5.Vector(tempX, tempY);
  }
  
  move(walls, balls){
    this.ppos = this.pos;
    this.pos.add(this.dir.mult(this.velo));
    for (let i=0; i<walls.length; i++)
      this.hit(walls[i]);
    for(let i=0; i<balls.length; i++)
      this.collide(balls[i]);
  }
  
  dis(wall){
    let x1 = wall.start.x;
    let y1 = wall.start.y;
    let x2 = wall.end.x;
    let y2 = wall.end.y;
    
    // ax + by + c = 0;
    let a = y1 - y2;
    let b = x2 - x1;
    let c = -x2 * y1 + x1 * y2;
    
    let distance = abs(a*this.pos.x + b*this.pos.y + c) / sqrt(a*a + b*b);
    return distance;
  }
  
  hit(wall){
    if (this.dis(wall) <= this.rad/2 + 1){
      this.dir = new p5.Vector(this.dir.y, -this.dir.x);
    }
  }
  
  collide(ball){
    if(ball.id != this.id){
      
      if(dist(ball.pos.x, ball.pos.y, this.pos.x, this.pos.y) < (ball.rad/2 + this.rad/2 + 1)){
        let tempDir = this.dir;
        let tempBall = ball.dir
        if (this.id < ball.id && this.justHit != ball.id){
          this.dir = new p5.Vector(tempBall.y, -tempBall.x);
          ball.dir = new p5.Vector(tempDir.y, -tempDir.x);
          this.justHit = ball.id;
        }
      }

    }
  }
  
  render(){
    circle(this.pos.x, this.pos.y, this.rad);
  }
}

class Wall{
  constructor(x1, y1, x2, y2){
    this.start = new p5.Vector(x1, y1);
    this.end = new p5.Vector(x2, y2);
  }
}

let walls = [];
let balls = [];
let id = 0;

function setup() {
  createCanvas(400, 400);
  walls[0] = new Wall(0, 0, width, 0);
  walls[1] = new Wall(0, 0, 0, height);
  walls[2] = new Wall(0, height, width, height);
  walls[3] = new Wall(width, 0, height, width);
  
  balls[0] = new Ball(id, width/2, height/2);
  id++;
}

function draw() {
  background(220);
  for(let i=0; i<balls.length; i++){
    balls[i].move(walls, balls);
    balls[i].render();
  }
}

function mousePressed(){
  for (let i=0; i<balls.length; i++){
    if (dist(balls[i].pos.x, balls[i].pos.y, mouseX, mouseY) < balls[i].rad/2){
      console.log("cannot create new ball on ball");
      return;
    }
  }
  balls.push(new Ball(id, mouseX, mouseY));
  id++;
}
