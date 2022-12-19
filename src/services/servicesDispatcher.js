import { 
  FILES_MANAGER, 
  HASH_MANAGER, 
  NAVIGATION_MANAGER, 
  OS_MANAGER, 
  ZIP_MANAGER
} from "../constants/entities.js";
import { FileManager } from "./fileManager.js";
import { NavigationManager } from "./navigationManager.js";
import { OSManager } from "./osManager.js";
import { HashManager } from "./hashManager.js";
import { ZipManager } from "./zipManager.js";

export const servicesDispatcher = (cliManager) => ({
  [NAVIGATION_MANAGER]: new NavigationManager(cliManager),
  [FILES_MANAGER]: new FileManager(cliManager),
  [OS_MANAGER]: new OSManager(cliManager),
  [HASH_MANAGER]: new HashManager(cliManager),
  [ZIP_MANAGER]: new ZipManager(cliManager),
});