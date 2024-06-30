import App from "./app";
import Logger from "./logger";
require("dotenv").config();

const main = (): void => {
  // Run the Server
  Logger.info("App :: Starting...");

  const app = new App();

  app._init();
};

/**
 * Booting MainApp
 */
main();
