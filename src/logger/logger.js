
export class CLILogger {
  static currentDir(dir) {
    console.log(`You are currently in ${dir}`);
  }
  static printTable(data) {
    console.table(data);
  }
}

export class CLIManagerLogger extends CLILogger {
  static start(userName) {
    console.log(`Welcome to the File Manager, ${userName}!`); 
  }

  static finish(userName) {
    console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
  } 
}

export class NavigationManagerCLILogger extends CLILogger {
  static printTable(data) {
    console.table(data);
  }
}

export class FileManagerCLILogger extends CLILogger {}
export class OSManagerCLILogger extends CLILogger {}
export class HashManagerCLILogger extends CLILogger {}
export class ZipManagerCLILogger extends CLILogger {}