import { randomInt } from "./utilities.js";
import Ship from "./ship.js";

class Gene {
  constructor() {
    this.rotation = randomInt(-15, 15);
    this.thrust = randomInt(-1, 1);
  }
}

class Chromosome {
  constructor(numOfGenes) {
    this.genes = new Array(numOfGenes).fill(null).map(() => new Gene());
  }
  fitness(ship) {}
  crossover(partner) {
    const child = new Chromosome(numOfGenes);
    const midpoint = randomInt(0, numOfGenes);
    for (let i = 0; i < child.genes.length; i++) {
      child.genes[i] = i < midpoint ? this.genes[i] : partner.genes[i];
    }
    return child;
  }
  mutate(mutationRate) {
    for (let i = 0; i < this.genes.length; i++) {
      if (Math.random() < mutationRate) this.genes[i] = new Gene();
    }
  }
}

class Population {
  constructor(size, numOfGenes, mutationRate) {
    this.size = size || 1;
    this.chromosomes = [];
    this.mutationRate = mutationRate;
    for (let i = 0; i < size; i++) {
      this.chromosomes.push(new Chromosome(numOfGenes));
    }
  }
  _selectMembersForMating() {
    const matingPool = [];
    for (const chromosome of this.chromosomes) {
      const ship = new Ship(2500, 2700, 0, 0, 0, 0, 5501);
      const f = Math.floor(chromosome.fitness(ship));
      for (let i = 0; i < f; i++) {
        matingPool.push(chromosome);
      }
    }
    return matingPool;
  }
  _reproduce(matingPool) {
    for (let i = 0; i < this.chromosomes.length; i++) {
      const parentA = matingPool[random(0, matingPool.length)];
      const parentB = matingPool[random(0, matingPool.length)];
      const child = parentA.crossover(parentB);
      child.mutate(this.mutationRate);
      this.chromosomes[i] = child;
    }
  }
  evolve(generations) {
    for (let i = 0; i < generations; i++) {
      const pool = this._selectMembersForMating();
      this._reproduce(pool);
    }
  }
}

function generate(populationSize, numOfGenes, mutationRate, generations) {
  const population = new Population(populationSize, numOfGenes, mutationRate);
  return population.evolve(generations);
}

export { Gene, Chromosome, Population, generate };
