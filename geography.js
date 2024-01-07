class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Geography {
  constructor(...args) {
    this.coordinates = [];
    for (let i = 0; i < args.length; i += 2) {
      this.coordinates.push(new Coordinate(args[i], args[i + 1]));
    }
  }
  get landingZone() {
    for (let i = 0; i < this.coordinates.length; i += 2) {
      const { x: x1, y: y1 } = this.coordinates[i];
      const { x: x2, y: y2 } = this.coordinates[i + 1];
      if (y2 === y1) return { x1, x2, y: y2 };
    }
  }
  calculateElevation(x) {
    for (let i = 0; i < this.coordinates.length; i += 2) {
      const { x: x1, y: y1 } = this.coordinates[i];
      const { x: x2, y: y2 } = this.coordinates[i + 1];
      if (x >= x1 && x <= x2) {
        const slope = (y2 - y1) / (x2 - x1);
        const yIntercept = y1 - slope * x1;
        return slope * x + yIntercept;
      }
    }
  }
}

export default Geography;
