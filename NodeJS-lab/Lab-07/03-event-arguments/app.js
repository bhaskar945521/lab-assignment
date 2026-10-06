const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("userCreated", (user) => {
  console.log("New user created:");
  console.log(user);
});

emitter.emit("userCreated", {
  id: 1,
  name: "Bhaskar",
  email: "Bhaskar@example.com"
});
