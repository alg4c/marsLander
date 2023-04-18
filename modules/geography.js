import { drawLine } from "./svg.js";

export const geography = {
  coordinates: [
    [0, 100],
    [1000, 500],
    [1500, 1500],
    [3000, 1000],
    [4000, 150],
    [5500, 150],
    [6999, 800],
  ],
  getLZ() {
    for (let i = 1; i < this.coordinates.length; i++) {
      const [x1, y1] = this.coordinates[i - 1];
      const [x2, y2] = this.coordinates[i];
      if (y2 === y1) return { x1, x2, y: y2 };
    }
  },
  getSurfaceElevation(x) {
    const geoCoords = geography.coordinates;
    for (let i = 1; i < geoCoords.length; i++) {
      var [x1_1, y1_1] = geoCoords[i - 1];
      var [x2_1, y2_1] = geoCoords[i];
      if (x1_1 <= x && x2_1 >= x) break;
    }
    const slope = (y2_1 - y1_1) / (x2_1 - x1_1);
    const yIntercept = y1_1 - slope * x1_1;
    return slope * x + yIntercept;
  },
};

drawLine(geography.coordinates, "geoline");
