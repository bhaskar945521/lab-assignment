const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const LOG_DIR = path.join(__dirname, "..", "logs");
const LOG_FILE = path.join(LOG_DIR, "server.log");

fs.mkdirSync(LOG_DIR, { recursive: true });

class Logger extends EventEmitter {}

const logger = new Logger();

logger.on("request", (method, requestUrl) => {
  const line =
    new Date().toISOString() +
    " " +
    method +
    " " +
    requestUrl;

  console.log(line);

  fs.appendFile(
    LOG_FILE,
    line + "\n",
    (err) => {
      if (err) {
        logger.emit("error", err);
      }
    }
  );
});

logger.on("error", (err) => {
  console.error("Logger error:", err.message);
});

module.exports = {
  logger,
  LOG_FILE
};
