import * as readline from 'node:readline/promises';
import { EXIT_PROGRAM } from './constants/commands.js';
import { CLI_MAP } from './constants/map.js';
import { InvalidInputError } from './errors/cli.error.js';
import { CLIManager } from './services/cliManager.js';
import { servicesDispatcher } from './services/servicesDispatcher.js';
import { getCliArgs } from './utils/getCliArgs.js';
import { hasCliCommand } from './utils/hasCliCommand.js';


(async () => {
  try {
    const rl = readline.createInterface({ 
      input: process.stdin, 
      output: process.stdout 
    });

    CLIManager.startProgram(process.argv);

    const cliManager = CLIManager.getInstance();
    const services = servicesDispatcher(cliManager);

    rl.on('SIGINT', () => CLIManager.finishProgram(rl));
    rl.on('line', async (line) => {
      try {
        if (!hasCliCommand(line)) {
          throw new InvalidInputError();
        }
        
        const [cliCommand, ...args] = getCliArgs(line);

        if (cliCommand === EXIT_PROGRAM) {
          CLIManager.finishProgram(rl);
        } else {
          /**
           * NOTE: 
           * keys - available cli commands
           * value - service name 
           */
          for await (let [keys, value] of CLI_MAP) {
            if (keys.includes(cliCommand) && (value in services)) {
              await services[value][cliCommand](args);
              break;
            }
          }
        }
      } catch (err) {
        console.error(err?.message);
      }
    })
  } catch (err) {
    console.error(err?.message);
  }
})();