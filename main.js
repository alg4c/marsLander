import Geography from "./geography.js";
import Ship from "./ship.js";
import Svg from "./svg.js";

const geo = new Geography(
  0,
  100,
  1000,
  500,
  1500,
  1500,
  3000,
  1000,
  4000,
  150,
  5500,
  150,
  6999,
  800
);
const svg = new Svg("svg");
svg.drawLine(
  "topography",
  geo.coordinates.map((coordinate) => [coordinate.x, coordinate.y])
);

const ship = new Ship(2500, 2700, 0, 0, 0, 0, 5501);

const cmd = { rotation: 1, thrust: 1 };

while (true) {
  ship.updateParameters(cmd);
  if (ship.x < 0 || ship.x > 7000 || ship.y < 0 || ship.y > 3000)
    throw new Error("Ship out of bounds");
  if (ship.y < geo.calculateElevation(ship.x)) {
    const { x, y } = ship.reportCrashLocation(geo.coordinates);
    ship.log = [...ship.log.slice(0, -1), { x, y }];
    ship.x = x;
    ship.y = y;
    break;
  }
}

console.log(ship);
console.log(ship.log);
svg.drawLine(
  "ship",
  ship.log.map((coord) => [coord.x, coord.y])
);
