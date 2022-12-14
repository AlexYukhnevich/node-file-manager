export const NAVIGATION_CLI_COMMANDS = ['up', 'cd', 'ls'];
export const FILES_CLI_COMMANDS = ['cat', 'add', 'rn', 'cp', 'mv', 'rm'];
export const OS_CLI_COMMANDS = ['os'];
export const HASH_CLI_COMMANDS = ['hash'];
export const ZIP_CLI_COMMANDS = ['compress', 'decompress'];
export const EXIT_PROGRAM = '.exit';

export const ALL_AVAILABLE_CLI_COMMANDS = [
  '.exit',
  ...NAVIGATION_CLI_COMMANDS,
  ...FILES_CLI_COMMANDS,
  ...OS_CLI_COMMANDS,
  ...HASH_CLI_COMMANDS,
  ...ZIP_CLI_COMMANDS,
];