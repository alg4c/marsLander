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
  fitness() {
    //fitness ratio is a number between 0 and 1, 1 being most fit.
    let match = 0;

    for (let i = 0; i < this.cmd.length; i += 1) {
      if (this.cmd[i] === this.cmd[i]) {
        match += 1;
      }
    }

    return match / this.nCmd.length;
  }
  crossover(partner) {
    const { length } = this.nCmd;
    const child = new Member(this.nCmd);
    const midpoint = random(0, length);

    for (let i = 0; i < length; i += 1) {
      if (i > midpoint) {
        child.keys[i] = this.keys[i];
      } else {
        child.keys[i] = partner.keys[i];
      }
    }

    return child;
  }
  mutate(mutationRate) {
    for (let i = 0; i < this.keys.length; i += 1) {
      // If below predefined mutation rate,
      // generate a new random letter on this position.
      if (Math.random() < mutationRate) {
        this.keys[i] = generateLetter();
      }
    }
  }
}

class Population {
  constructor(size, nCmd, mutationRate = 0) {
    size = size || 1;
    this.members = [];
    this.mutationRate = mutationRate;

    for (let i = 0; i < size; i += 1) {
      this.members.push(new Member(nCmd));
    }
  }
  _selectMembersForMating() {
    const matingPool = [];

    this.members.forEach((m) => {
      // The fitter it is, the more often it will be present in the mating pool
      // i.e. increasing the chances of selection
      // If fitness == 0, add just one member
      const f = Math.floor(m.fitness() * 100) || 1;

      for (let i = 0; i < f; i += 1) {
        matingPool.push(m);
      }
    });

    return matingPool;
  }
  _reproduce(matingPool) {
    for (let i = 0; i < this.members.length; i += 1) {
      // Pick 2 random members/parents from the mating pool
      const parentA = matingPool[random(0, matingPool.length)];
      const parentB = matingPool[random(0, matingPool.length)];

      // Perform crossover
      const child = parentA.crossover(parentB);

      // Perform mutation
      child.mutate(this.mutationRate);

      this.members[i] = child;
    }
  }
  evolve(generations) {
    for (let i = 0; i < generations; i += 1) {
      const pool = this._selectMembersForMating();
      this._reproduce(pool);
    }
  }
}

//function to run the GA
function generate(populationSize, nCmd, mutationRate, generations) {
  // Create a population and evolve for N generations
  const population = new Population(populationSize, nCmd, mutationRate);
  population.evolve(generations);

  // Get the typed words from all members, and find if someone was able to type the nCmd
  const membersKeys = population.members.map((m) => m.keys.join(""));
  const perfectCandidatesNum = membersKeys.filter((w) => w === nCmd);

  // Print the results
  console.log(membersKeys);
  console.log(
    `${
      perfectCandidatesNum ? perfectCandidatesNum.length : 0
    } member(s) typed "${nCmd}"`
  );
}

//generate(100, "hit", 0.03, 5);
console.log(new Member(50).cmd);
