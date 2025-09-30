import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'Test',
  description: 'Test if Rizzbot works',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const FISH_COMMAND = {
  name: 'Fish',
  description: 'Gambling',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
}

export const ADD_COMMAND = {
  name: 'Add',
  description: 'Print value and add 1',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [{
    name: 'value',
    description: 'value to add',
    type: 4,
    min_value: 1,
  }]
}

export const EMOJI_COMMAND = {
  name: 'Rickroll',
  description: 'guess the functionality',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
}

const ALL_COMMANDS = [TEST_COMMAND, ADD_COMMAND, EMOJI_COMMAND, FISH_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
