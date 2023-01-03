/*
PROBLEM PARAMETERS
For a landing to be successful, the ship must:
land on flat ground
land in a vertical position (tilt angle = 0°)
vertical speed must be limited ( ≤ 40m/s in absolute value)
horizontal speed must be limited ( ≤ 20m/s in absolute value)
*/

const INITIAL_X_POS = 2500;
const INITIAL_Y_POS = 2700;
const GRAVITY = -3.711;

const geography = {
  //points = geo coordinates given as array of [x1,y1,...xN,Yn]
  points: [
    0, 100, 1000, 500, 1500, 1500, 3000, 1000, 4000, 150, 5500, 150, 6999, 800,
  ],
  getLZ() {
    // returns LZ data as Array [x1, x2, y]
    const valArr = geography.points;
    for (let i = 1; i < valArr.length; i += 2) {
      if (valArr[i] === valArr[i - 2]) {
        return [valArr[i - 3], valArr[i - 1], valArr[i]];
      }
    }
  },
};

const svg = document.getElementById("svg");

function drawLine(CoordArr, lineID) {
  if (CoordArr.length % 2 != 0)
    throw Error("Invalid Coordinate array. Not even number of points");
  const polyline = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline"
  );
  polyline.setAttribute("id", lineID);
  let points = "";
  for (let i = 0; i < CoordArr.length; i += 2) {
    const x = CoordArr[i];
    const y = CoordArr[i + 1];
    if (x < 0 || x > 7000 || y < 0 || y > 3000) break;
    points += `${x},${y} `;
  }
  polyline.setAttribute("points", points.trim());
  svg.appendChild(polyline);
}

drawLine(geography.points, "geoline");
console.log(polyline);

/*
const FPgrid = document.querySelector(".FPgridContainer");
const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
context.scale(0.1, 0.1);

const getYCoord = (yCoord) => Math.abs(yCoord - 3000);

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const dist = (x1, y1, x2, y2) =>
  Math.abs(Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)));

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateCmd() {
  // generate random command string, clamp rotation: -15-15, thrust: 0-1
  return `${random(-15, 16)} ${random(-1, 2)}`;
}

class Member {
  constructor(nCmd) {
    this.cmd = [];

    for (let i = 0; i < nCmd; i++) {
      this.cmd[i] = generateCmd();
    }
  }
  fitness(vessel) {
    // fitness function takes an object and evaluates its fitness
    //score angle, vSpeed, hSpeed, and fuel consumption; assign overall fitness factor
    //weighting percentages below
    const MAX_ANGLE = 90;
    const MAX_VSPEED = -40;
    const MAX_HSPEED = 20;
    const LZweightAvgRate = 0.2;
    const angleWeightRate = 0.2;
    const vSpeedWeightRate = 0.2;
    const hSpeedWeightRate = 0.2;
    const fuelWeightRate = 0.2;
    let [LZxCoordWest, LZxCoordEast, _] = geography.getLZ();
    let distanceFromNearestLZBorderXcoord = Math.min(
      Math.abs(LZxCoordWest - vessel.X),
      Math.abs(LZxCoordEast - vessel.X)
    );
    //LZ component
    let LZfitnessValue =
      LZweightAvgRate *
      (vessel.X > LZxCoordWest && vessel.X < LZxCoordEast
        ? // if vessel inside the LZ return 1
          1
        : // if its outside the LZ return distance adjusted fitness score
          1 - distanceFromNearestLZBorderXcoord / 6999);
    //angle component
    let angleFitnessValue =
      angleWeightRate *
      (Math.abs(vessel.angle) <= 15 ? 1 : 1 - Math.abs(vessel.angle) / 90);
    //vSpeed component
    let vSpeedFitnessValue =
      vSpeedWeightRate *
      (vessel.vSpeed >= MAX_VSPEED
        ? 1
        : Math.abs(vessel.vSpeed - MAX_VSPEED) / MAX_VSPEED);
    //hSpeed component
    let hSpeedFitnessValue =
      hSpeedWeightRate *
      (Math.abs(vessel.hSpeed) <= 20
        ? 1
        : 1 - (Math.abs(vessel.hSpeed) - MAX_HSPEED) / MAX_HSPEED);
    return (
      hSpeedFitnessValue +
      vSpeedFitnessValue +
      angleFitnessValue +
      LZfitnessValue
    );
  }
}

class Population {
  constructor(size, nCmd) {
    size = size || 1;
    this.members = [];

    for (let i = 0; i < size; i += 1) {
      this.members.push(new Member(nCmd));
    }
  }
}

function getSurfaceY(x) {
  //return undefined if x falls outside of field
  if (x < 0 || x > 7000) return undefined;
  let geoXCoords = [];
  let geoYCoords = [];
  Object.values(geography).forEach((arr) => {
    if (arr[0] != undefined) geoXCoords.push(arr[0]);
    if (arr[1] != undefined) geoYCoords.push(arr[1]);
  });
  //determine geography segment x falls on
  let x1 = 0;
  let y1 = 0;
  let x2 = 0;
  let y2 = 0;
  for (let i = 0; i < geoXCoords.length; i++) {
    // if x is a geogrpahy point, return associated Y
    if (x === geoXCoords[i]) {
      return geoYCoords[i];
    }
    if (x >= geoXCoords[i] && x < geoXCoords[i + 1]) {
      x1 = geoXCoords[i];
      y1 = geoYCoords[i];
      x2 = geoXCoords[i + 1];
      y2 = geoYCoords[i + 1];
    }
  }
  const m = (y2 - y1) / (x2 - x1);
  const b = y1 - m * x1;
  return m * x + b;
}

class Spaceship {
  constructor(iteration) {
    this.iteration = iteration + 1;
    this.X = INITIAL_X_POS;
    this.Y = INITIAL_Y_POS;
    this.hSpeed = 0;
    this.vSpeed = 0;
    this.fuel = 5501;
    this.angle = 0;
    this.power = 0;
  }
  draw(x = this.X, y = this.Y) {
    context.beginPath();
    context.arc(x, getYCoord(y), 50, 0, Math.PI * 2);
    context.fillStyle =
      this.altitude < 0 &&
      Math.abs(15 - this.angle) >= 0 &&
      this.vSpeed > -50 &&
      Math.abs(this.hSpeed) <= 25
        ? "green"
        : this.altitude < 0
        ? "red"
        : "black";
    context.fill();
  }
  printDisplay() {
    let display = {};
    for (let key of Object.keys(this)) {
      if (typeof this[key] === "number" && this[key] !== 0) {
        display[key] = Math.round(this[key]);
      }
    }
    return Object.entries(display).join(" | ").replaceAll(",", ":");
  }
}

function updateVessel(rotation, thrust, vessel) {
  const initialVelocityX = vessel.hSpeed;
  const initialVelocityY = vessel.vSpeed;
  vessel.angle = clamp(
    clamp(
      clamp(rotation, -15, 15) + vessel.angle,
      -Math.abs(rotation),
      Math.abs(rotation)
    ),
    -90,
    90
  );
  vessel.power = clamp(
    clamp(clamp(thrust, -1, 1) + vessel.power, 0, thrust),
    0,
    4
  );
  vessel.hSpeed += vessel.power * Math.sin(vessel.angle * (Math.PI / 180));
  vessel.vSpeed +=
    vessel.power * Math.cos(vessel.angle * (Math.PI / 180)) + GRAVITY;
  vessel.X += (1 / 2) * (initialVelocityX + vessel.hSpeed);
  vessel.Y += (1 / 2) * (initialVelocityY + vessel.vSpeed);
  vessel.fuel -= vessel.power * 10;
  vessel["altitude"] = vessel.Y - getSurfaceY(vessel.X);
}

//RUN
let population = new Population(20, 80);
for (let m = 0; m < population.members.length; m++) {
  console.error(`Population# ${m + 1} / ${population.members.length}`);
  let trajectory = population.members[m];
  let rot = 0;
  let pow = 0;
  let vessel = new Spaceship(m);
  geography.draw();
  vessel.draw();
  for (let i = 0; i < trajectory.cmd.length; i++) {
    if (vessel.altitude < 0) {
      continue;
    }
    //gameloop conditionals
    rot += Number.parseInt(trajectory.cmd[i].split(" ")[0]);
    pow += Number.parseInt(trajectory.cmd[i].split(" ")[1]);
    //update graphical position
    updateVessel(rot, pow, vessel);
    vessel.draw();
    //round numbers for display
    console.log(i, vessel.printDisplay());
  }
  console.log(`fitness: ${trajectory.fitness(vessel)}`);
  //after this code will loop and create new vessel
}
*/
