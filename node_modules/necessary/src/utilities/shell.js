"use strict";

import { whilst } from "../utilities/asynchronous";

import { DATA } from "../constants";
import { UTF8_ENCODING } from "../encodings";
import { DEFAULT_ENCODING, DEFAULT_ATTEMPTS, DEFAULT_INITIAL_ANSWER } from "../defaults";
import { UP_CHARACTER,
         ETX_CHARACTER,
         DOWN_CHARACTER,
         LEFT_CHARACTER,
         RIGHT_CHARACTER,
         CTRL_C_CHARACTER,
         NEW_LINE_CHARACTER,
         BACKSPACE_CHARACTER,
         CARRIAGE_RETURN_CHARACTER } from "../characters";

export function onETX(handler) {
  if (process.stdin.setRawMode) {
    const rawMode = true,
          encoding = UTF8_ENCODING;

    process.stdin.setRawMode(rawMode);

    process.stdin.setEncoding(encoding);

    process.stdin.addListener(DATA, listener);

    process.stdin.resume();

    return offExt;
  }

  function offExt() {
    process.stdin.removeListener(DATA, listener);
  }

  function listener(character) {
    if (character === ETX_CHARACTER) {
      handler();
    }
  }
}

export function prompt(options, callback) {
  let { answer = null } = options;

  if (answer !== null) {
    callback(answer);

    return;
  }

  const { attempts = DEFAULT_ATTEMPTS } = options,
        context = {
          answer,
          options,
          attempts
        };

  whilst(attempt, () => {
    const { answer } = context;
    
    callback(answer);
  }, context);
}

export default {
  onETX,
  prompt
}

function attempt(next, done, context) {
  let { attempts } = context;

  const terminate = (attempts-- === 0);
  
  if (terminate) {
    done();
    
    return;
  }

  const { options } = context,
        { hidden = false,
          encoding = DEFAULT_ENCODING,
          description,
          errorMessage,
          initialAnswer = DEFAULT_INITIAL_ANSWER,
          validationPattern = null,
          validationFunction = null } = options;

  input(initialAnswer, hidden, description, encoding, callback);

  function callback(answer) {
    const valid = validationFunction ?  ///
                    validationFunction(answer) :
                      validationPattern.test(answer);

    if (valid) {
      Object.assign(context, {
        answer
      });

      done();
    } else {
      console.log(errorMessage);

      Object.assign(context, {
        attempts
      });

      next();
    }
  }
}

function input(initialAnswer, hidden, description, encoding, callback) {
  let answer = initialAnswer; ///

  const rawMode = true;

  process.stdout.write(description);

  if (!hidden) {
    process.stdout.write(initialAnswer);
  }

  process.stdin.setRawMode(rawMode);

  process.stdin.setEncoding(encoding);

  process.stdin.addListener(DATA, listener);

  process.stdin.resume();

  function listener(data) {
    const character = data.toString(encoding);

    switch (character) {
      case NEW_LINE_CHARACTER:
      case CARRIAGE_RETURN_CHARACTER: {
        process.stdout.write(NEW_LINE_CHARACTER);

        process.stdin.removeListener(DATA, listener);

        process.stdin.pause();

        callback(answer);

        break;
      }

      case UP_CHARACTER:
      case DOWN_CHARACTER:
      case LEFT_CHARACTER:
      case RIGHT_CHARACTER: {
        ///

        break;
      }

      case BACKSPACE_CHARACTER: {
        const answerLength = answer.length,
          start = 0,
          end = answerLength - 1;

        answer = answer.slice(start, end);

        if (!hidden) {
          process.stdout.clearLine();

          process.stdout.cursorTo(0);

          process.stdout.write(description);

          process.stdout.write(answer);
        }

        break;
      }

      default:
        answer += character;

        if (!hidden) {
          process.stdout.write(character);
        }

        break;

      case ETX_CHARACTER:
        console.log(CTRL_C_CHARACTER);

        process.exit();
    }
  }
}