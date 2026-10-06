const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on("start", () => {
  console.log("Start event fired");
});

myEmitter.on("stop", () => {
  console.log("Stop event fired");
});

myEmitter.emit("start");
myEmitter.emit("stop");
