import Geography from "./geography.js";
import Ship from "./ship.js";
import Svg from "./svg.js";
import { calculateLinearDistance, randomInt, clamp } from "./utilities.js";

const geo = new Geography([
  0, 100, 1000, 500, 1500, 1500, 3000, 1000, 4000, 150, 5500, 150, 6999, 800,
]);
const svg = new Svg("svg");
svg.drawLine(
  "topography",
  geo.coordinates.map((coordinate) => [coordinate.x, coordinate.y])
);

class Gene {
  constructor() {
    this.rotation = randomInt(-15, 15);
    this.thrust = randomInt(-1, 1);
    // //TESTING impact EAST of LZ
    // this.rotation = 3;
    // this.thrust = 1;
    // //TESTING impact WEST of LZ
    // this.rotation = 0;
    // this.thrust = 0;
    // //TESTING impact INSIDE of LZ
    // this.rotation = 15;
    // this.thrust = 1;
    // //TESTING OUT OF BOUNDS
    // this.rotation = -15;
    // this.thrust = 1;
  }
}

class Chromosome {
  constructor(numOfGenes) {
    this.genes = new Array(numOfGenes).fill(null).map(() => new Gene());
    this.uid =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  fitness(_ship) {
    console.log(this.uid);
    //TODO add angle, vx, vy considerations to fitness
    const ship = _ship;
    let i = 0; // to iterate in while loop
    while (true) {
      ship.updateParameters(this.genes[i++] || { rotation: 0, thrust: 0 });
      if (ship.x < 0 || ship.x > 7000 || ship.y < 0 || ship.y > 3000) return 0;
      if (ship.y < geo.calculateElevation(ship.x)) {
        const { x, y } = ship.reportCrashLocation(geo.coordinates);
        ship.log = [...ship.log.slice(0, -1), { x, y }];
        ship.x = x;
        ship.y = y;
        break;
      }
    }
    svg.drawLine(
      "ship",
      ship.log.map((coord) => [coord.x, coord.y])
    );
    let array = [...geo.coordinates, { x: ship.x, y: ship.y }].sort(
      (a, b) => a.x - b.x
    );
    let distanceToLZ = 0;
    let distanceArr;
    if (ship.x < geo.landingZone.lzx1) {
      // if ship crashes WEST of LZ
      distanceArr = array.slice(
        array.findIndex((coordinate) => coordinate.x === ship.x),
        array.findIndex((coordinate) => coordinate.x === geo.landingZone.lzx1) +
          1
      );
      distanceToLZ = calculateLinearDistance(distanceArr);
    } else if (ship.x > geo.landingZone.lzx2) {
      // if ship crashes EAST of LZ
      distanceArr = array.slice(
        array.findIndex((coordinate) => coordinate.x === geo.landingZone.lzx2),
        array.findIndex((coordinate) => coordinate.x === ship.x) + 1
      );
      distanceToLZ = calculateLinearDistance(distanceArr);
    } else {
      // if ship crashes in LZ
      distanceToLZ = 0;
    }

    const greatestErrorDistance = Math.max(
      calculateLinearDistance(
        array.slice(
          0,
          array.findIndex(
            (coordinate) => coordinate.x === geo.landingZone.lzx1
          ) + 1
        )
      ),
      calculateLinearDistance(
        array.slice(
          array.findIndex((coordinate) => coordinate.x === geo.landingZone.lzx2)
        )
      )
    );
    const distanceErrorRatio = distanceToLZ / greatestErrorDistance;
    const distanceFactor = 0.5;
    const vyErrorRatio = ship.vy < -40 ? clamp(ship.vy - -40, -80, 0) / -80 : 0;
    const vyFactor = 0.5;
    console.log(
      { distanceToLZ },
      { greatestErrorDistance },
      { distanceErrorRatio },
      { distanceFitness: 1 - distanceErrorRatio },
      { distanceFactor },
      { shipVY: ship.vy },
      { greatestAllowableVYError: -80 },
      { vyErrorRatio },
      { vyFitness: 1 - vyErrorRatio },
      { vyFactor }
    );
    this.fitness =
      (1 - distanceErrorRatio) * distanceFactor + (1 - vyErrorRatio) * vyFactor;
    console.log(this.fitness);
    return this.fitness;
  }

  crossover(partner) {
    const child = new Chromosome(this.genes.length);
    const midpoint = randomInt(0, this.genes.length - 1);
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
      const f = Math.floor(chromosome.fitness(ship) * 100);
      for (let i = 0; i < f; i++) {
        matingPool.push(chromosome);
      }
    }
    return matingPool;
  }
  _reproduce(matingPool) {
    for (let i = 0; i < this.chromosomes.length; i++) {
      const parentA = matingPool[randomInt(0, matingPool.length - 1)];
      const parentB = matingPool[randomInt(0, matingPool.length - 1)];
      const child = parentA.crossover(parentB);
      child.mutate(this.mutationRate);
      this.chromosomes[i] = child;
    }
  }
  evolve(generations) {
    for (let i = 0; i < generations; i++) {
      console.log(`Generation ${i}`);
      const pool = this._selectMembersForMating();
      const fitnessThreshold = 1;
      if (pool.find((c) => c.fitness >= fitnessThreshold))
        return pool.find((c) => c.fitness >= fitnessThreshold);
      this._reproduce(pool);
    }
  }
}

function generate(populationSize, numOfGenes, mutationRate, generations) {
  const population = new Population(populationSize, numOfGenes, mutationRate);
  return population.evolve(generations);
}

const solution = generate(50, 40, 0.015, 10) || "No solution found";
console.log(solution);
