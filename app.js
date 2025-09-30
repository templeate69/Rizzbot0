import * as fs from 'fs';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { ADD_COMMAND, EMOJI_COMMAND } from './commands.js';
import { DiscordRequest, doSomething,randomInRange,putInBrackets } from './utils.js';
import { fish_id,fish } from './json_stuff/fish.json' assert { type: "json" };

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = {};

import { dataFilePath } from './json_stuff/classified.json' assert { type: "json" };
import userValues from '/home/azureuser/data/values.json' assert { type: "json" };
import { assert } from 'console';

function saveUserValues() {
  const data = JSON.stringify(userValues, null, 2);
  fs.writeFile(dataFilePath, data, (error) => {
    console.error(error);
  });
}

function getRandomFish() {
  var currentFishId = fish_id[Math.floor(Math.random() * fish_id.length)];
  return(fish[currentFishId]);
}

function getFishPrice(fish) {
  var price = randomInRange(fish.weight.min, fish.weight.max);
  return(price * fish.price);
}

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  if (!req.body) {
    return res.status(400).json({ error: 'invalid request, no body' });
  }
  // Interaction id, type and data
  const { id, type, data, context, member, user } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: `I am <rizzbot:1413875865930170418>izzbot also ` + doSomething()
            }
          ]
        },
      });
    }

    if (name === 'fish') {
      var currentFish = getRandomFish();
      var fishPrice = getFishPrice(currentFish);
      var fishMessage = "You caught a " + currentFish.name + putInBrackets(currentFish.rarity) + ", sold for $" + fishPrice + ".";
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: fishMessage
            }
          ]
        },
      });
    }

    //add command
    if (name === ADD_COMMAND.name) {
      const userId = context === 0 ? member?.user?.id : user?.id;
      if (!userId) {
        console.error('Command ADD: no user id found in request', JSON.stringify(context), JSON.stringify(member), JSON.stringify(user));
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [{
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: "User is not identified",
            }],
          },
        });
      }

      if (!(userId in userValues)) {
        userValues[userId] = 0;
      }
      const userValue = userValues[userId];
      
      const maybeValueToAdd = data?.options?.at?.(0).value;
      const valueToAdd = Number.isInteger(maybeValueToAdd) ? maybeValueToAdd : 1;

      userValues[userId] += valueToAdd;
      saveUserValues();

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [{
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: valueToAdd + " was added to " + userValue
          }],
        },
      });
    }
    if (name === EMOJI_COMMAND.name) {
      return res.send({
         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: "Error: Higher rizz required"
            }
          ]
        },
      })
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
