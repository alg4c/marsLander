function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }
  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  // Lines are parallel
  if (denominator === 0) {
    return false;
  }
  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }
  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);
  return { x, y };
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const degToRad = (degrees) => degrees * (Math.PI / 180);

// randomInt is inclusive of min and max
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export { intersect, clamp, degToRad, randomInt };
