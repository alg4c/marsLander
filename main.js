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
}

//RUN
geography.draw();
spaceship.draw();
for (let t = 1; t < 72; t++) {
  updateSpaceship(-21, 3);
  spaceship.draw();
  const spaceshipReadOut = { ...spaceship };
  for (let key of Object.keys(spaceshipReadOut)) {
    if (
      typeof spaceshipReadOut[key] === "number" &&
      spaceshipReadOut[key] !== 0
    ) {
      spaceshipReadOut[key] = Math.round(spaceshipReadOut[key]);
    }
  }
  console.log(t, spaceshipReadOut);
}
