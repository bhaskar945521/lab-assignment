const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.once("welcome", () => {
  console.log("Welcome event executed only once.");
});

emitter.emit("welcome");
emitter.emit("welcome");
