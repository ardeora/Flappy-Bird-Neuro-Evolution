let pipes = [];
let population;

// Image Assets
let bg;
let platform;
let topP;
let botP;
let birdSprite;
// BirdSprite Array
let bsarr = [];
let spriteIndex = 1;
let streaks;
// streakPos: Array that stores xPos of the streaks
let streakPos;

// Image Toggle
// This variable is used to add the image scene, bird sprites and other images
// this variable should be set to false if you face any performance issue while
// training the birds
let imgToggle = true;

// Variables declared for saving and displaying the best bird of the generations
let savedMode = false;
let sbInit = false;
let savedBird;

// cycle is the time speed variable that can be increased or decreased to make the birds learn
// faster or slower
let cycle = 2;
function preload() {
  bg = loadImage('img/background.png');
  platform = loadImage('img/platform.png');
  topP = loadImage('img/topP.png');
  botP = loadImage('img/botP.png');
  birdSprite = loadImage('img/birdSprite.png');
  streaks  = loadImage('img/streaks.png');
}

function setup() {
  let cnv = createCanvas(360, 640);
  cnv.parent('flappy-world');
  // Make a new population
  population = new Population(1000, 0.05);
  // Create the pipes
  initPipes();

  // Get the sprites from the sprite sheet
  for (let i = 0; i < 700; i += 175) {
    let img = birdSprite.get(i, 0, 175, 125);
    bsarr.push(img);
  }

  // set the position of the streaks
  streakPos = [0, 360];

  // saved bird will hold the best bird when the button is pressed
  savedBird = new Bird();
}

function draw() {
  // noLoop();
  if (imgToggle) {
    background(bg);
  } else {
    background('#141418');
  }
  
  for (let i = 0; i < cycle; i++) {
    for (let i = pipes.length - 1; i >= 0 ; i--) {
      pipes[i].show();
      pipes[i].update();
      if (pipes[i].outOfBounds()) {
        let newPipes = new Pipes(pipes[i+2].x + 205);
        pipes.splice(i,1);
        pipes.push(newPipes);
      } 
    }

    updateStreaks();
    if (!savedMode) {
      population.run();
    } else {
      if (!sbInit) {
        savedBird.brain = population.saved;
        initPipes();
        sbInit = true;
      }
      savedBird.think();
      savedBird.update();
      savedBird.checkBorders();
      savedBird.checkCollision();
      savedBird.updateScore();
      savedBird.calcFitness();
    }  
  }
  
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  // If Play Best button is pressed, only display the best bird
  // Else, display the whole population
  if (!savedMode) {
    for (const bird of population.population) {
      bird.show();
    }
  } else {
    savedBird.show();
  }
  
  if (imgToggle) {
    drawStreaks();
  } else {
    fill('#212329')
    strokeWeight(0);
    rect(0, 520, 360, 120);
  }
  
  if (!savedMode) {
    fill('white');
    text(`Generation: ${population.generation}`, 10, 630);
  } else {
    fill('white');
    text(`Generation: ${population.generation}`, 10, 610);
    text(`Score: ${savedBird.score}`, 10, 630);
    text(`Brain`, 190, 592);
    savedBird.brain.show(240);
  }
}

function drawStreaks() {
  image(platform, 0, 520, 360, 120);
  image(streaks, streakPos[0], 520, 360, 11);
  image(streaks, streakPos[1], 520, 360, 11);
}

function updateStreaks() {
  if (streakPos[0] <= -360) {
    streakPos[0] = 360;
  }

  if (streakPos[1] <= -360) {
    streakPos[1] = 360;
  }
  streakPos[0] -= 2;
  streakPos[1] -= 2;
}

function keyPressed(e) {  
  if (e.keyCode === 38) {
    population.population[0].flap();
  } else if (e.keyCode === 40) {
    imgToggle = !imgToggle;
  } else if (e.keyCode === 37) {
    savedMode = !savedMode;
  }
}

function initPipes() {
  pipes = [];
  pipes.push(new Pipes(width));
  pipes.push(new Pipes(width + 205));
  pipes.push(new Pipes(width + 410));
}

// Event Listeners for the buttons
var imgToggleBtn = document.getElementById('imgToggle');
var slider = document.getElementById('myRange');
var timeStr = document.getElementById('time');
var bestBtn = document.getElementById('play-best');
var reset = document.getElementById('reset');

imgToggleBtn.addEventListener('click', () => {
  imgToggle = !imgToggle;
})

slider.oninput = function() {
  timeStr.innerHTML = 'Time Speed: ' + this.value;
  cycle = this.value;
}

bestBtn.addEventListener('click', () => {
  population.saveChamp();
  savedMode = !savedMode;
  bestBtn.disabled = true;
})

reset.addEventListener('click', () => {
  population = new Population(1000, 0.05);
  initPipes();
  savedMode = false;
  sbInit = false;
  savedBird = new Bird();
  bestBtn.disabled = false;
})