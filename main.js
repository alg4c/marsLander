import { Chromosome } from "./geneticAlgorithm.js";
import Ship from "./ship.js";

const ship = new Ship(2500, 2700, 0, 0, 0, 0, 5501);

const c = new Chromosome(40);

console.log(c.fitness(ship));
