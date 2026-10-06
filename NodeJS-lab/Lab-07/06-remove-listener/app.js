const EventEmitter = require("events");

const emitter = new EventEmitter();

function listener() {
  console.log("Event listener executed");
}

emitter.on("test", listener);

emitter.emit("test");

emitter.removeListener("test", listener);

console.log("Listener removed.");

emitter.emit("test");
