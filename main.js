const GRAVITY = -3.711;
let canvas = document.getElementById("game");
let context = canvas.getContext("2d");

//utility function to adapt to coordinate system of canvas
function getYCoord(Y) {
  return Math.abs(Y - 3000);
}
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

//draw geography
context.scale(0.1, 0.1);
context.beginPath();
context.moveTo(0, getYCoord(100));
context.lineTo(1000, getYCoord(500));
context.lineTo(1500, getYCoord(1500));
context.lineTo(3000, getYCoord(1000));
context.lineTo(4000, getYCoord(150));
context.lineTo(5500, getYCoord(150));
context.lineTo(6999, getYCoord(800));
context.strokeStyle = "#fc0505";
context.stroke();

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

//clamping does not work if negative rotation. It moves in larger jumps that 15deg.
function updateSpaceship(rotation, thrust) {
  const initialVelocityX = spaceship.hSpeed;
  const initialVelocityY = spaceship.vSpeed;
  spaceship.angle = clamp(
    clamp(clamp(rotation, -15, 15) + spaceship.angle, -90, rotation),
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
spaceship.draw();
for (let t = 1; t < 72; t++) {
  updateSpaceship(21, 3);
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
