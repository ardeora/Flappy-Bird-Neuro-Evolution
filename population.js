class Population {
  constructor(pop, rate) {
    this.popmax = pop;
    this.mutationRate = rate;
    this.population = [];

    this.inactiveBirds = [];
    this.matingPool = [];
    this.generatePopulation();
    this.generation = 1;
    this.champ = null;
    this.saved = null;
  }

  generatePopulation() {
    for (let i = 0; i < this.popmax; i++) {
      this.population.push(new Bird());
    }
  }

  run() {
    if (this.population.length > 0 ) {
      let fitness = 0;
      for (let i = this.population.length - 1 ; i >= 0; i--) {
        let bird = this.population[i];
        if (!bird.dead) {
          bird.think();
          bird.update();
          bird.checkBorders();
          bird.checkCollision();
          bird.updateScore();
          bird.calcFitness();

          if (bird.fitness > fitness) {
            fitness = bird.fitness;
            this.champ = bird;
          }

        } else {
          this.population.splice(i,1);
          this.inactiveBirds.push(bird);
        }
      }
    } else {
      this.naturalSelection();
      this.generate();
      initPipes();
    }
    
  }

  naturalSelection() {
    this.matingPool = [];
    let maxFitness = this.getMaxFitness();
    for (let i = 0; i < this.inactiveBirds.length; i++) {
       let normalized = Math.floor(Math.pow(this.inactiveBirds[i].fitness, 1)/maxFitness * 100);
       for (let j = 0; j < normalized; j++) {
         this.matingPool.push(this.inactiveBirds[i].brain);
       }
    }
  }

  generate() {
    for (let i = 0; i < this.popmax; i++) {
      let index = Math.floor(Math.random() * this.matingPool.length);
      let child = this.matingPool[index].copy();     
      child.mutate(this.mutationRate);
      let newBird = new Bird();
      newBird.brain = child;
      this.population.push(newBird);
    }
    this.generation++;
    this.matingPool = [];
    this.inactiveBirds = [];
  }

  getMaxFitness() {
    let max = 0;
    for (const bird of this.inactiveBirds) {
      if (bird.fitness > max) {
        max = bird.fitness
      }
    }
    return Math.pow(max, 1);
  }

  saveChamp() {
    this.saved = this.champ.brain.copy();
  }
}
