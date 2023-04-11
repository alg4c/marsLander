import { geography } from "./geography.js";
import { intersect } from "./svg.js";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const deg_to_rad = (degrees) => degrees * (Math.PI / 180);

const GRAVITY = -3.711;

export const shipFactory = (cmdList) => {
  //declare initial parameters
  let position = { x: 2500, y: 2700 };
  let velocity = { x: 0, y: 0 };
  let angle = 0;
  let power = 0;
  let fuel = 5501;
  const coordinates = [];

  //loop through cmdList and update parameters at each step
  let i = 0;
  while (position.y > geography.getSurfaceElevation(position.x)) {
    coordinates.push([position.x, position.y]);
    //create variables to hold rotation and thrust command through destructuring
    const { rotation, thrust } = cmdList[i++] || cmdList.at(-1);
    //update angle. angle is additive such that each new command will be added to the old value within per turn limits of [-15, 15]
    angle = clamp(angle + rotation, -90, 90);
    //update power. power is additive such that each new command will be added to the old value within per turn limits of [-1, 1]
    //first check if the required fuel is available
    power = fuel < (power + thrust) * 10 ? 0 : clamp(power + thrust, 0, 4);
    //update fuel
    fuel -= power * 10;
    //declare variable to hold acceleration vectors
    const acceleration = {
      x: Math.sin(deg_to_rad(angle)) * power,
      y: Math.cos(deg_to_rad(angle)) * power + GRAVITY,
    };
    //update position
    position.x += velocity.x + 0.5 * acceleration.x;
    position.y += velocity.y + 0.5 * acceleration.y;
    //update velocity
    velocity.x += acceleration.x;
    velocity.y += acceleration.y;
  }
  //assign interpolation of final crash location to position
  //loop through geography coordinates until line segment of crash is found
  for (let i = 1; i < geography.coordinates.length; i++) {
    const [x1_1, y1_1] = geography.coordinates[i - 1];
    const [x2_1, y2_1] = geography.coordinates[i];
    if (x1_1 <= position.x && x2_1 >= position.x) {
      const [x1_2, y1_2] = coordinates.at(-1);
      const [x2_2, y2_2] = [position.x, position.y];
      position = intersect(x1_1, y1_1, x2_1, y2_1, x1_2, y1_2, x2_2, y2_2);
      //push final location to coordinates
      coordinates.push(Object.values(position));
    }
  }
  return { position, velocity, angle, fuel, coordinates };
};

/* this commented code block toggles "sticky" angle aka if angle is 1, it will remain at 1 instead of increasing to 90
      this.angle === rotation
        ? this.angle
        : clamp(this.angle + rotation, -90, 90);
    */

/* this commented code block toggles "sticky" power
      this.power === thrust 
        ? this.power 
        : clamp(this.power + thrust, 0, 4);
    */

/*

*/
