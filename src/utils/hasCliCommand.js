import { ALL_AVAILABLE_CLI_COMMANDS } from "../constants/commands.js";

export const hasCliCommand = (line) => ALL_AVAILABLE_CLI_COMMANDS.some((cliCommand) => line.startsWith(cliCommand));