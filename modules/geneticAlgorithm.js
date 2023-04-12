import { shipFactory } from "./ship.js";
import { geography } from "./geography.js";
import { svg } from "./svg.js";

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const dist = (x1, x2) => Math.sqrt((x2 - x1) ** 2);

//gene is one vector pair [angle, pow]
function Gene() {
  this.rotation = random(-15, 16);
  this.thrust = random(-1, 2);
}

//chromosome is one set of vector pairs to be evaluated.
export function Chromosome(nGenes) {
  this.genes = new Array(nGenes).fill(null).map(() => new Gene());
  // fitness based on x dimension distance from nearest LZ border
  this.fitness = function ({ position, velocity, angle }) {
    //get the west and east borders of the landing zone
    const { x1: lzX1, x2: lzX2 } = geography.getLZ();
    //calculate distanceError
    const distanceError =
      position.x >= lzX1 && position.x <= lzX2
        ? 0
        : Math.min(dist(lzX1, position.x), dist(lzX2, position.x));

    const fitness = 1 / (1 + distanceError);
    return fitness;
  };
  this.crossover = function (partner) {
    const child = new Chromosome(nGenes);
    const midpoint = random(0, nGenes);

    for (let i = 0; i < length; i++) {
      if (i > midpoint) {
        child.genes[i] = this.genes[i];
      } else {
        child.genes[i] = partner.genes[i];
      }
    }
    return child;
  };
  this.mutate = function (mutationRate) {
    for (let i = 0; i < this.genes.length; i++) {
      if (Math.random() < mutationRate) {
        this.genes[i] = new Gene();
      }
    }
  };
}

export function Population(size, nGenes, mutationRate) {
  this.size = size || 1;
  this.members = [];
  this.mutationRate = mutationRate;

  for (let i = 0; i < size; i++) {
    this.members.push(new Chromosome(nGenes));
  }
  this._selectMembersForMating = function () {
    const matingPool = [];

    this.members.forEach((m) => {
      const f = Math.floor(m.fitness(shipFactory(m.genes)) * 100) || 1;
      for (let i = 0; i < f; i += 1) {
        matingPool.push(m);
      }
    });
    return matingPool;
  };
  this._reproduce = function (matingPool) {
    for (let i = 0; i < this.members.length; i++) {
      // Pick 2 random members/parents from the mating pool
      const parentA = matingPool[random(0, matingPool.length)];
      const parentB = matingPool[random(0, matingPool.length)];

      // Perform crossover
      const child = parentA.crossover(parentB);

      // Perform mutation
      child.mutate(this.mutationRate);

      this.members[i] = child;
    }
  };
  this.evolve = function (generations) {
    for (let i = 0; i < generations; i++) {
      const pool = this._selectMembersForMating();
      this._reproduce(pool);
    }
  };
}

export function generate(populationSize, nGenes, mutationRate, generations) {
  // Create a population and evolve for N generations
  const population = new Population(populationSize, nGenes, mutationRate);
  population.evolve(generations);
}

/*
svg
  .querySelectorAll(".vesselLine")
  .forEach((polyline) => polyline.remove());
*/
