class Bird {
  constructor() {
    this.x = 55;
    this.y = height/2 - 120;
    this.gravity = 0.4;
    this.velocity = 0;
    this.w = 42.5;
    this.h = 30;

    this.dead = false;
    this.score = 0;

    this.fitness = 0;
    this.brain = new NeuralNetwork(5, 8, 2);
  }

  // Applies gravity to the bird
  // Terminal velocity is capped at 15
  update() {
    if (this.velocity < 15) {
      this.velocity += this.gravity;
    }
    this.y += this.velocity;
  }

  // Checks if the bird hit the ceiling or the ground
  checkBorders() {
    if (this.y + this.h/2 > height - 120) {
      this.y = height - 120 - this.h/2;
      this.dead = true;
    } else if (this.y - this.h/2 < 0) {
      this.dead = true;
      this.y = this.h/2;
    }
  }

  // Allows the bird to think using a neural network
  // The closest pipe to the bird is decided by calculating the distance
  // between the farther end of the pipe and the tail of the bird
  think() {
    if (!this.dead) {
      let closestDist = 1000;
      let closestPipe = null;
      let inputs = [];
      for (let i = 0; i < pipes.length; i++) {
        let dist = (pipes[i].x + pipes[i].width) - (this.x - this.w/2);
        if ((dist) < closestDist && (dist) >= 0) {
          closestDist = dist;
          closestPipe = pipes[i];
        }
      }
      
      // Input 1: Y position of the bird
      inputs.push(map(this.y, 0, height, 0, 1));
      // Input 2: X position of the farther edge of the pipe
      inputs.push(map((closestPipe.x + closestPipe.width), 0, width, 0, 1));
      // Input 3: Y position of the top pipe edge
      inputs.push(map(closestPipe.topHeight, 0, height, 0, 1));
      // Input 4: Y position of the bottom pipe edge
      inputs.push(map((closestPipe.topHeight + closestPipe.distance) , 0, height, 0, 1));
      // Input 5: Y Velocity of the bird
      inputs.push(map(this.velocity, -10, 15, 0, 1))
      let output = this.brain.predict(inputs);
      if (output[0] > output[1]) {
        this.flap();
      }
    }
  }


  // Any Y Velocity added by gravity on the bird is nullified when the bird flaps
  // If initial Y velocity was positive, the flap will move the bird up by 8px
  // If the bird is already flying up, any consecutive flaps will move the bird up by 4px
  flap() {
    if (!this.dead) {
      if (this.velocity >= 0) {
        let force = this.velocity + 8;
        this.velocity -= force;
        this.y += this.velocity;
      } else {
        this.velocity -= 4;
        this.y += this.velocity;
      }
      
    }
  }
  
  // Calculates the fitness of the bird based on the distance travelled and how often it 
  // stayes between the pipes.
  calcFitness() {
    if (!this.dead) {
      this.fitness++;
       
      let closestDist = 1000;
      let closestPipe = null;
      for (let i = 0; i < pipes.length; i++) {
        let dist = pipes[i].x - this.x
        if ((dist) < closestDist && (dist) >= 0) {
          closestDist = dist;
          closestPipe = pipes[i];
        }
      }

      let pipeCent = createVector(closestPipe.x, closestPipe.h1 + (closestPipe.distance/2));
      let selfv = createVector(this.x, this.y)
      let upv = createVector(this.x, 0);
      let downv = createVector(this.x, height);

      let up = p5.Vector.sub(pipeCent, upv).mag()
      let down = p5.Vector.sub(pipeCent, downv).mag()
      let self = p5.Vector.sub(pipeCent, selfv).mag()


      let maxDist = 0;
      if (up > down) maxDist = up;
      else maxDist = down;

      let test = map(self, (closestPipe.x + closestPipe.width/2) - this.x, maxDist, 4, 0);
      
      this.fitness += test;
    }
  }

  // Checks for any collisions
  checkCollision() {
    for (let i = 0; i < pipes.length; i++) {
      if (pipes[i].collided(this)) this.dead = true;
    }
  }

  // Updates the score of the bird if it crosses a pipe
  updateScore() {
    for (let i = 0; i < pipes.length; i++) {
      if (pipes[i].checkCrossed(this)) this.score++;
    }
  }

  // Displays a sprite if imgToggle is true, else it shows a rectangle
  // imgToggle should be false to increase performance.
  show() {
    if (imgToggle) {
      if (this.dead) {
        image(bsarr[3], this.x - this.w/2, this.y - this.h/2, this.w, this.h)
      } else {
        push();
        image(bsarr[Math.floor(spriteIndex) % 3], this.x - this.w/2, this.y - this.h/2, this.w, this.h)
        spriteIndex += 0.1;
        pop();
      }
    } else {
      push();
      fill(255, 150);
      rectMode(CENTER);
      rect(this.x, this.y, this.w, this.h);
      pop();
    }
  }
}