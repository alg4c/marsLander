import { shipFactory } from "./ship.js";
import { geography } from "./geography.js";
import { clamp } from "./ship.js";

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const dist = (x1, x2) => Math.sqrt((x2 - x1) ** 2);

//gene is one vector pair [angle, pow]
function Gene() {
  this.rotation = random(-15, 16);
  this.thrust = random(-1, 2);
}

//Chromosome is one set of vector pairs to be evaluated.
export function Chromosome(nGenes) {
  this.genes = new Array(nGenes).fill(null).map(() => new Gene());
  // fitness based on x dimension distance from nearest LZ border
  this.fitness = function ({ position, velocity, angle }) {
    //get the west and east borders of the landing zone
    const { x1: lzX1, x2: lzX2 } = geography.getLZ();
    //calculate MAXIMUM error for each parameter
    const dErrorMAX = Math.max(dist(lzX1, 0), dist(lzX2, 6999));
    const vxErrorMAX = 100;
    const vyErrorMAX = 200;
    const aErrorMAX = 75;
    //calculate distanceError in x plane
    const dError =
      position.x >= lzX1 && position.x <= lzX2
        ? 0
        : Math.min(dist(lzX1, position.x), dist(lzX2, position.x));
    //calculate velocity error in x plane. Clamp maximum error to 100
    const vxError = clamp(Math.abs(velocity.x) - 20, 0, vxErrorMAX);
    //calculate velocity error in y plane. Clamp maximum error to 200
    const vyError = clamp(Math.abs(velocity.y) - 40, 0, vyErrorMAX);
    //calculate angleError
    const aError = clamp(Math.abs(angle) - 15, 0, aErrorMAX);

    const fit =
      1 -
      dError / dErrorMAX +
      (1 - vxError / vxErrorMAX) +
      //(1 - vyError / vyErrorMAX) +
      (1 - aError / aErrorMAX);

    console.log({
      dError,
      dErrorMAX,
      vxError,
      vxErrorMAX,
      vyError,
      vyErrorMAX,
      aError,
      aErrorMAX,
      position,
      angle,
      velocity,
      fit,
    });

    return fit;
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

    for (const m of this.members) {
      const fMax = 300; // maximum fitness based on fitness function
      const ship = shipFactory(m.genes);
      const f = Math.floor(m.fitness(ship) * 100) || 1;

      if (f === fMax) {
        return { Chromosome: m, Ship: ship };
      }

      for (let i = 0; i < f; i += 1) {
        matingPool.push(m);
      }
    }
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
      document.querySelector(".svg-info").textContent = `generation ${i}`;
      const pool = this._selectMembersForMating();
      //TODO rewrite function exit condition to handle complex object coming out Ex. {Chrom, ship}
      if (pool.hasOwnProperty("Chromosome")) return pool;
      this._reproduce(pool);
    }
  };
}

export function generate(populationSize, nGenes, mutationRate, generations) {
  // Create a population and evolve for N generations
  const population = new Population(populationSize, nGenes, mutationRate);
  return population.evolve(generations);
}
