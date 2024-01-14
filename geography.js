class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Geography {
  constructor(coordinateArr) {
    this.coordinates = [];
    for (let i = 0; i < coordinateArr.length; i += 2) {
      this.coordinates.push(
        new Coordinate(coordinateArr[i], coordinateArr[i + 1])
      );
    }
  }
  get landingZone() {
    for (let i = 1; i < this.coordinates.length; i++) {
      const { x: x1, y: y1 } = this.coordinates[i - 1];
      const { x: x2, y: y2 } = this.coordinates[i];
      if (y2 === y1) return { lzx1: x1, lzy1: y1, lzx2: x2, lzy2: y2 };
    }
  }
  calculateElevation(x) {
    for (let i = 1; i < this.coordinates.length; i++) {
      const { x: x1, y: y1 } = this.coordinates[i - 1];
      const { x: x2, y: y2 } = this.coordinates[i];
      if (x >= x1 && x <= x2) {
        const slope = (y2 - y1) / (x2 - x1);
        const yIntercept = y1 - slope * x1;
        return slope * x + yIntercept;
      }
    }
  }
}

export default Geography;
