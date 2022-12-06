MARS LANDER

A project based exploration of genetic algorithims.

Objective - Safely Land Mars Rover on a level section of Mars' surface.

Index.html file handles the html for the visual markup tool. Main.js runs the physics simulation for the visual markup tool. GeneticAlgorithm.js runs the genetic algorithim logic for the recombination of ship commands to succussfully generate a string of commands able to land the ship.

Notes
TODO 11/29/2022 - Variable acceleration flight path of my app is slightly off of coding game's app. Test 1 yielded a delta of 16 x-dimension units. look into this discrepancy.

SOLVED - The acceleration is actually not off. The flight path of the Lander is correct until it crashed. In the simulation, the numbers are calculated at the end of the full turn, which yields a negative altitude (inside mars.) This is not correct. I have to edit the simulation to report the final numbers when the lander contacts Mars' surface.

12/6/2022 - I have discovered two ways to solve the problem. Mode 1 is the genetic algorithm. Mode 2 is physics based, using a combination of PID, dead reckoning, kinematic equations, and trigonometry. I would like to try the genetic algorithm way because it looks much cooler. If I am unable to figure out the genetic algorithm, I will use the physics based approach.
