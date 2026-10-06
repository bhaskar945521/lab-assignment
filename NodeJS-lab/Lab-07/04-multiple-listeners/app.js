const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("login", () => {
  console.log("Listener 1: User logged in");
});

emitter.on("login", () => {
  console.log("Listener 2: Login activity recorded");
});

emitter.on("login", () => {
  console.log("Listener 3: Welcome email triggered");
});

emitter.emit("login");
