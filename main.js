const geography = [
  [0, 100],
  [1000, 500],
  [1500, 1500],
  [3000, 1000],
  [4000, 150],
  [5500, 150],
  [6999, 800],
];

const INITIAL_SHIP_X = 2500;
const INITIAL_SHIP_Y = 2700;

const svg = document.querySelector("#svg");

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const deg_to_rad = (degrees) => degrees * (Math.PI / 180);

//min inclusive, max exclusive
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const drawLine = (coordArr, name) => {
  const svgns = "http://www.w3.org/2000/svg";
  const polyline = document.createElementNS(svgns, "polyline");
  polyline.setAttribute("points", coordArr.join(" "));
  polyline.setAttribute("class", name);
  svg.appendChild(polyline);
};

function getLZ(g = geography) {
  for (let i = 1; i < g.length; i++) {
    const [x1, y1] = g[i - 1];
    const [x2, y2] = g[i];
    if (y2 === y1) return [x1, x2];
  }
}

function Ship(X, Y, hSpeed, vSpeed, fuel, angle, power, nCmd = 0) {
  this.X = X;
  this.Y = Y;
  this.hSpeed = hSpeed;
  this.vSpeed = vSpeed;
  this.fuel = fuel;
  this.angle = angle;
  this.power = power;
  this.cmds = [...new Array(nCmd)].map(() => [random(-15, 16), random(-1, 2)]);
  this.coords = [[INITIAL_SHIP_X, INITIAL_SHIP_Y]];
  this.print = () => console.log(JSON.parse(JSON.stringify(this)));
  this.updateParameters = function (cmd) {
    const GRAVITY = -3.711;
    let [rotation, thrust] = cmd;
    this.angle = clamp(this.angle + rotation, -90, 90);
    /* this commented code block toggles "sticky" angle
      this.angle === rotation
        ? this.angle
        : clamp(this.angle + rotation, -90, 90);
    */
    //todo implement if fuel < thrust * 10 power = 0
    this.power = clamp(this.power + thrust, 0, 4);
    /* this commented code block toggles "sticky" power
      this.power === thrust 
        ? this.power 
        : clamp(this.power + thrust, 0, 4);
    */
    this.X +=
      this.hSpeed + 0.5 * (Math.sin(deg_to_rad(this.angle)) * this.power);
    this.Y +=
      this.vSpeed +
      0.5 * (Math.cos(deg_to_rad(this.angle)) * this.power + GRAVITY);
    this.hSpeed += Math.sin(deg_to_rad(this.angle)) * this.power;
    this.vSpeed += Math.cos(deg_to_rad(this.angle)) * this.power + GRAVITY;
    this.fuel -= this.power * 10;
    this.coords.push([this.X, this.Y]);
  };
}

function getSurfaceY(shipX) {
  //y = mX + b
  for (let i = 1; i < geography.length; i++) {
    let [x1, y1] = geography[i - 1];
    let [x2, y2] = geography[i];
    if (x1 <= shipX && x2 >= shipX) {
      let m = (y2 - y1) / (x2 - x1);
      let b = y1 - m * x1;
      return m * shipX + b;
    }
  }
  console.error("Ship out of bounds");
}

drawLine(geography, "geoline");
const ship = new Ship(2500, 2700, 0, 0, 5501, 0, 0);
while (ship.Y >= getSurfaceY(ship.X)) {
  ship.print();
  console.log(getSurfaceY(ship.X));
  ship.updateParameters([15, 1]);
}
drawLine(ship.coords, "vesselLine");
