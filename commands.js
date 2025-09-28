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
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

export const ADD_COMMAND = {
  name: 'add',
  description: 'print value and add 1',
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
  name: 'rickroll',
  description: 'whats going on',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
}

const ALL_COMMANDS = [TEST_COMMAND, CHALLENGE_COMMAND, ADD_COMMAND, EMOJI_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
