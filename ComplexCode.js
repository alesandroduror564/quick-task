/* 
   Filename: ComplexCode.js

   Description: This code demonstrates a complex JavaScript algorithm that solves the Traveling Salesman Problem (TSP) using a genetic algorithm approach. It generates a random set of cities, evolves a population of potential solutions, and finds the shortest route that visits all cities exactly once before returning to the starting city. The code handles crossover, mutation, and fitness evaluation to optimize the solution.

   Note: The code assumes you have the required classes and helper functions defined elsewhere in your project.

   References:
   - Genetic Algorithms for the Generalized Traveling Salesman Problem by Dorigo M., Gambardella L.M. (1997)
   - Genetic Algorithms for the Traveling Salesman Problem by John Burks (2015)
*/

// Constants
const POPULATION_SIZE = 100;
const MAX_GENERATIONS = 1000;
const MUTATION_RATE = 0.02;

// Generate random set of cities
const cities = generateCities(20);

// Initialize the population
let population = initializePopulation(POPULATION_SIZE, cities);

// Main genetic algorithm loop
let generationCount = 0;
let bestRoute = null;

while (generationCount < MAX_GENERATIONS) {
  calculateFitness(population);

  // Find the best solution in the population
  const currentBestRoute = population.getFittest();

  if (!bestRoute || currentBestRoute.getDistance() < bestRoute.getDistance()) {
    bestRoute = currentBestRoute;
  }

  // Generate the next generation
  const newPopulation = new Population();

  // Preserve the best solution
  newPopulation.addIndividual(bestRoute);

  while (newPopulation.getSize() < POPULATION_SIZE) {
    // Select parents
    const parent1 = tournamentSelection(population);
    const parent2 = tournamentSelection(population);

    // Perform crossover
    const child = crossover(parent1, parent2);

    // Apply mutation
    mutate(child, MUTATION_RATE);

    // Add child to the new population
    newPopulation.addIndividual(child);
  }

  // Replace the old population with the new one
  population = newPopulation;

  generationCount++;
}

console.log("Best route found:", bestRoute.getRoute());
console.log("Distance:", bestRoute.getDistance());

// Helper functions

function generateCities(numCities) {
  const cities = [];
  for (let i = 0; i < numCities; i++) {
    const city = new City(i, Math.random() * 100, Math.random() * 100);
    cities.push(city);
  }
  return cities;
}

function initializePopulation(populationSize, cities) {
  const population = new Population();
  for (let i = 0; i < populationSize; i++) {
    const route = new Route(cities);
    route.shuffle();
    population.addIndividual(route);
  }
  return population;
}

function calculateFitness(population) {
  for (let i = 0; i < population.getSize(); i++) {
    const route = population.getIndividual(i);
    route.calculateDistance();
    route.calculateFitness();
  }
}

function tournamentSelection(population) {
  const tournamentSize = Math.floor(population.getSize() / 10);
  const tournament = new Population();

  for (let i = 0; i < tournamentSize; i++) {
    const randomIndex = Math.floor(Math.random() * population.getSize());
    tournament.addIndividual(population.getIndividual(randomIndex));
  }

  return tournament.getFittest();
}

function crossover(parent1, parent2) {
  const child = new Route(parent1.getCities());

  const startPos = Math.floor(Math.random() * parent1.getRoute().length);
  const endPos = Math.floor(Math.random() * parent1.getRoute().length);

  for (let i = 0; i < child.getRoute().length; i++) {
    if (startPos < endPos && i > startPos && i < endPos) {
      child.setCity(i, parent1.getCity(i));
    } else if (startPos > endPos) {
      if (!(i < startPos && i > endPos)) {
        child.setCity(i, parent1.getCity(i));
      }
    }
  }

  for (let i = 0; i < parent2.getRoute().length; i++) {
    if (!child.containsCity(parent2.getCity(i))) {
      for (let j = 0; j < child.getRoute().length; j++) {
        if (child.getCity(j) === null) {
          child.setCity(j, parent2.getCity(i));
          break;
        }
      }
    }
  }

  return child;
}

function mutate(route, mutationRate) {
  for (let i = 0; i < route.getRoute().length; i++) {
    if (Math.random() < mutationRate) {
      const swapIndex = Math.floor(Math.random() * route.getRoute().length);
      route.swapCities(i, swapIndex);
    }
  }
}