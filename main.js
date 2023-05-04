import { generate } from "./modules/geneticAlgorithm.js";

const solution = generate(40, 40, 0.02, 20);
console.log(solution || "Solution not found :(");
