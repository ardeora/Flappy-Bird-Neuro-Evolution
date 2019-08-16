class Pipes {
  // this.distance is the distance between pipes
  // this.limit is the shortest length a pipe can be
  // this.max is the maximum height the top pipe can have
  // this.topHeight is the height of the top pipe
  // this.x is the xPos of the pipes
  // this.crossed denotes whether a bird has crossed the pipes

  constructor(x) {
    this.distance = floor(random(180, 220));
    this.limit = 50;
    this.max = height - this.distance - this.limit - 120;
    this.topHeight = random(this.limit, this.max);
    this.x = x;
    this.width = 60;
    this.crossed = false;
  }

  // Displays the pipes
  // if imgToggle is false, a rectangle is drawn instead of the bird sprite
  // to improve performance
  show(){
    fill('#6613EA');
    let top = topP.get(0, 400 - this.topHeight, 60, this.topHeight);
    if (imgToggle) {
      image(top, this.x, 0, this.width, this.topHeight)
      image(botP, this.x, this.topHeight + this.distance, this.width, 400)
    } else {
      rect(this.x, 0, this.width, this.topHeight);
      rect(this.x, this.topHeight + this.distance, this.width, height - (this.topHeight + this.distance));
    }
  }

  // Checks to see if the pipe left the canvas
  outOfBounds() {
    if (this.x < -this.width) return true;
    return false;
  }

  // Moves the pipes to the left
  update() {
    this.x -= 2;
  }

  // Checks to see if the given bird has crossed the farther end of the pipe;
  checkCrossed(bird) {
    if (bird.x + bird.w/2 >= this.x + this.width && !this.crossed && !bird.dead) {
      this.crossed = true;
      return true;
    }
  }

  // Collision detection for each bird
  // AABB Collision check
  collided(bird) {
    let b1 = [bird.x - bird.w/2, bird.y - bird.h/2];
    let b2 = [bird.x + bird.w/2, bird.y - bird.h/2];
    let b3 = [bird.x + bird.w/2, bird.y + bird.h/2];
    if (this.x < b2[0] && this.x + this.width > b1[0] && b3[1] >= 0 && this.topHeight > b2[1]) {
      return true;
    }
    if (this.x < b2[0] && this.x + this.width > b1[0] && b3[1] >= this.topHeight + this.distance && ((this.topHeight + this.distance) + 640) > b2[1]) {
      return true;
    }
    return false;
  }
}