import { clamp, degToRad, intersect } from "./utilities.js";

const GRAVITY = -3.711;

class Ship {
  constructor(x, y, vx, vy, angle, power, fuel) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ax = 0;
    this.ay = 0;
    this.angle = angle;
    this.power = power;
    this.fuel = fuel;
    this.log = [{ x, y }];
  }
  get position() {
    return { x: this.x, y: this.y };
  }
  updateParameters(command) {
    const { rotation, thrust } = command;
    this.angle = clamp(this.angle + rotation, -90, 90);
    this.power =
      this.fuel < (this.power + thrust) * 10
        ? 0
        : clamp(this.power + thrust, 0, 4);
    this.fuel -= this.power * 10;
    this.ax = Math.sin(degToRad(this.angle)) * this.power;
    this.ay = Math.cos(degToRad(this.angle)) * this.power + GRAVITY;
    this.x += this.vx + 0.5 * this.ax;
    this.y += this.vy + 0.5 * this.ay;
    this.vx += this.ax;
    this.vy += this.ay;
    this.log.push(this.position);
  }
  reportCrashLocation(topography) {
    for (let i = 0; i < topography.length; i += 2) {
      const { x: x1_1, y: y1_1 } = topography[i];
      const { x: x2_1, y: y2_1 } = topography[i + 1];
      if (this.x >= x1_1 && this.x <= x2_1) {
        const { x: x1_2, y: y1_2 } = this.previousPosition;
        const { x: x2_2, y: y2_2 } = this.position;
        return intersect(x1_1, y1_1, x2_1, y2_1, x1_2, y1_2, x2_2, y2_2);
      }
    }
  }
}

export default Ship;
