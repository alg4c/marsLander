import Geography from "./geography.js";
import Ship from "./ship.js";

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

const ship = new Ship(2500, 2700, 0, 0, 0, 0, 5501);

const cmd = { rotation: 0, thrust: 0 };

let count = 0;
while (ship.y > geo.calculateElevation(ship.x)) {
  console.log(
    count++,
    Object.entries(ship).map(([k, v]) => ({ [k]: Math.round(v) }))
  );
  ship.updateParameters(cmd);
}
console.log(ship);
