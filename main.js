const GRAVITY = -3.711;
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
context.scale(0.1, 0.1);

//utility function to adapt to coordinate system of canvas
function getYCoord(Y) {
  return Math.abs(Y - 3000);
}
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

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
geography.draw();
spaceship.draw();
for (let t = 1; t < 80; t++) {
  updateSpaceship(21, 3);
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
    t,
    spaceshipReadOut,
    `altitude: ${spaceship.altitude}`,
    `surface: ${getSurfaceY(spaceship.X)}`,
    context.fillStyle
  );
}
