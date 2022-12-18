const INITIAL_X_POS = 2500;
const INITIAL_Y_POS = 2700;
const GRAVITY = -3.711;
const FPgrid = document.querySelector(".FPgridContainer");
const canvas = document.querySelector("#game");
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

class Spaceship {
  constructor(iteration, X, Y) {
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
    context.fillStyle = this.altitude < 0 ? "red" : "black";
    context.fill();
  }
}

function updateSpaceship(rotation, thrust, vessel) {
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
let population = new Population(300, 80);
for (let m = 0; m < population.members.length; m++) {
  console.error(`Population# ${m + 1} / ${population.members.length}`);
  let trajectory = population.members[m];
  let rot = 0;
  let pow = 0;
  let vessel = new Spaceship(m, 2500, 2700);
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
    updateSpaceship(rot, pow, vessel);
    vessel.draw();
    //create object clone to round numbers for display
    const SpaceshipReadOut = { ...vessel };
    //round numbers for display
    for (let key of Object.keys(SpaceshipReadOut)) {
      if (
        typeof SpaceshipReadOut[key] === "number" &&
        SpaceshipReadOut[key] !== 0
      ) {
        SpaceshipReadOut[key] = Math.round(SpaceshipReadOut[key]);
      }
    }
    console.log(
      i,
      SpaceshipReadOut,
      `altitude: ${SpaceshipReadOut.altitude}`,
      `surface: ${getSurfaceY(SpaceshipReadOut.X)}`
    );
  }
  //create paragraphs to display final results for each FP here.
  const para = document.createElement("p");
  for (const [key, value] of Object.entries(vessel)) {
    let text = document.createTextNode(`\n${key}:${Math.ceil(value)},`);
    para.appendChild(text);
    FPgrid.appendChild(para);
  }
}
