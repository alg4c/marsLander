const GRAVITY = -3.711;
const vSpeedMax = -40;
const hSpeedMax = 20; // must be referenced with Absolute value at all times.
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
context.scale(0.1, 0.1);

//utility function to adapt to coordinate system of canvas
const getYCoord = (yCoord) => Math.abs(yCoord - 3000);
//Utility function to limit angle and thrust changes to maximum per turn
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

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

console.log(new Population(2, 4));

const geography = {
  g1: [0, 100],
  g2: [1000, 500],
  g3: [1500, 1500],
  g4: [3000, 1000],
  g5: [4000, 150],
  g6: [5500, 150],
  g7: [6999, 800],
  draw() {
    context.beginPath();
    context.moveTo(this.g1[0], getYCoord(this.g1[1]));
    Object.values(this).forEach((arr) =>
      context.lineTo(arr[0], getYCoord(arr[1]))
    );
    context.strokeStyle = "#fc0505";
    context.stroke();
  },
};

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

const spaceship = {
  X: 2500,
  Y: 2700,
  hSpeed: 0,
  vSpeed: 0,
  fuel: 5501,
  angle: 0,
  power: 0,
  draw(x = this.X, y = this.Y) {
    context.beginPath();
    context.arc(x, getYCoord(y), 50, 0, Math.PI * 2);
    context.fillStyle = this.altitude < 0 ? "red" : "black";
    context.fill();
  },
};

function updateSpaceship(rotation, thrust) {
  const initialVelocityX = spaceship.hSpeed;
  const initialVelocityY = spaceship.vSpeed;
  spaceship.angle = clamp(
    clamp(
      clamp(rotation, -15, 15) + spaceship.angle,
      -Math.abs(rotation),
      Math.abs(rotation)
    ),
    -90,
    90
  );
  spaceship.power = clamp(
    clamp(clamp(thrust, -1, 1) + spaceship.power, 0, thrust),
    0,
    4
  );
  spaceship.hSpeed +=
    spaceship.power * Math.sin(spaceship.angle * (Math.PI / 180));
  spaceship.vSpeed +=
    spaceship.power * Math.cos(spaceship.angle * (Math.PI / 180)) + GRAVITY;
  spaceship.X += (1 / 2) * (initialVelocityX + spaceship.hSpeed);
  spaceship.Y += (1 / 2) * (initialVelocityY + spaceship.vSpeed);
  spaceship.fuel -= spaceship.power * 10;
  spaceship["altitude"] = spaceship.Y - getSurfaceY(spaceship.X);
}

//RUN
let trajectory = new Member(80);
let rot = 0;
let pow = 0;
geography.draw();
spaceship.draw();
for (let i = 0; i < trajectory.cmd.length; i++) {
  if (spaceship.altitude < 0) break;
  //gameloop conditionals
  rot += Number.parseInt(trajectory.cmd[i].split(" ")[0]);
  pow += Number.parseInt(trajectory.cmd[i].split(" ")[1]);

  //update graphical position
  updateSpaceship(rot, pow);
  spaceship.draw();
  //create object clone to round numbers for display
  const spaceshipReadOut = { ...spaceship };
  //round numbers for display
  for (let key of Object.keys(spaceshipReadOut)) {
    if (
      typeof spaceshipReadOut[key] === "number" &&
      spaceshipReadOut[key] !== 0
    ) {
      spaceshipReadOut[key] = Math.round(spaceshipReadOut[key]);
    }
  }
  console.log(
    i,
    spaceshipReadOut,
    `altitude: ${spaceship.altitude}`,
    `surface: ${getSurfaceY(spaceship.X)}`
  );
}
