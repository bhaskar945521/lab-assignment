const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "Lab-07");

// ============================================================
// Helper Functions
// ============================================================

function createDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function createFile(file, content = "") {
  const filePath = path.join(ROOT, file);

  createDir(path.dirname(filePath));

  if (fs.existsSync(filePath)) {
    console.log(`⚠️  Already exists: ${file}`);
    return;
  }

  fs.writeFileSync(filePath, content.trimStart(), "utf8");
  console.log(`✅ Created: ${file}`);
}

// ============================================================
// Lab-07 Root
// ============================================================

createDir(ROOT);

// ============================================================
// 01 - EventEmitter Basics
// ============================================================

createFile(
  "01-event-emitter/app.js",
  `
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("message", (message) => {
  console.log("Message received:", message);
});

emitter.emit("message", "Hello from EventEmitter!");
`
);

createFile(
  "01-event-emitter/README.md",
  `
# Lab-07 - EventEmitter

## Task
Create and use a custom EventEmitter.

## Run

\`\`\`bash
node app.js
\`\`\`
`
);

// ============================================================
// 02 - Custom Events
// ============================================================

createFile(
  "02-custom-events/app.js",
  `
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
`
);

createFile(
  "02-custom-events/README.md",
  `
# Custom Events

This example demonstrates how to create custom events using Node.js EventEmitter.
`
);

// ============================================================
// 03 - Event Arguments
// ============================================================

createFile(
  "03-event-arguments/app.js",
  `
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("userCreated", (user) => {
  console.log("New user created:");
  console.log(user);
});

emitter.emit("userCreated", {
  id: 1,
  name: "John",
  email: "john@example.com"
});
`
);

createFile(
  "03-event-arguments/README.md",
  `
# Event Arguments

This example demonstrates passing data along with an EventEmitter event.
`
);

// ============================================================
// 04 - Multiple Listeners
// ============================================================

createFile(
  "04-multiple-listeners/app.js",
  `
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
`
);

createFile(
  "04-multiple-listeners/README.md",
  `
# Multiple Event Listeners

Multiple listeners can listen for the same event.
`
);

// ============================================================
// 05 - Once Event
// ============================================================

createFile(
  "05-once-event/app.js",
  `
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.once("welcome", () => {
  console.log("Welcome event executed only once.");
});

emitter.emit("welcome");
emitter.emit("welcome");
`
);

createFile(
  "05-once-event/README.md",
  `
# Once Event

The \`once()\` method executes a listener only one time.
`
);

// ============================================================
// 06 - Remove Listener
// ============================================================

createFile(
  "06-remove-listener/app.js",
  `
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
`
);

createFile(
  "06-remove-listener/README.md",
  `
# Remove Event Listener

This example demonstrates how to remove an EventEmitter listener.
`
);

// ============================================================
// 07 - Practical EventEmitter Example
// ============================================================

createFile(
  "07-practical-example/app.js",
  `
const EventEmitter = require("events");

class OrderSystem extends EventEmitter {
  createOrder(order) {
    console.log("Creating order...");

    this.emit("orderCreated", order);
  }
}

const orderSystem = new OrderSystem();

orderSystem.on("orderCreated", (order) => {
  console.log("Order created successfully.");
  console.log("Order ID:", order.id);
  console.log("Product:", order.product);
  console.log("Quantity:", order.quantity);
});

orderSystem.createOrder({
  id: 101,
  product: "Laptop",
  quantity: 1
});
`
);

createFile(
  "07-practical-example/README.md",
  `
# Practical EventEmitter Example

A simple order system implemented using Node.js EventEmitter.
`
);

// ============================================================
// Lab-07 Main README
// ============================================================

createFile(
  "README.md",
  `
# Lab-07 - Node.js EventEmitter

This lab demonstrates the use of Node.js EventEmitter.

## Folders

1. 01-event-emitter
2. 02-custom-events
3. 03-event-arguments
4. 04-multiple-listeners
5. 05-once-event
6. 06-remove-listener
7. 07-practical-example

## Running

Open a terminal inside any lab folder and run:

\`\`\`bash
node app.js
\`\`\`
`
);

// ============================================================
// package.json
// ============================================================

createFile(
  "package.json",
  `
{
  "name": "lab-07-event-emitter",
  "version": "1.0.0",
  "description": "Node.js Lab 07 - EventEmitter",
  "main": "01-event-emitter/app.js",
  "scripts": {
    "lab01": "node 01-event-emitter/app.js",
    "lab02": "node 02-custom-events/app.js",
    "lab03": "node 03-event-arguments/app.js",
    "lab04": "node 04-multiple-listeners/app.js",
    "lab05": "node 05-once-event/app.js",
    "lab06": "node 06-remove-listener/app.js",
    "lab07": "node 07-practical-example/app.js"
  }
}
`
);

// ============================================================
// Final Message
// ============================================================

console.log(`
============================================================
🎉 LAB-07 SETUP COMPLETE
============================================================

📁 Created:
   ${ROOT}

▶ Run individual labs:

   npm run lab01
   npm run lab02
   npm run lab03
   npm run lab04
   npm run lab05
   npm run lab06
   npm run lab07

Or directly:

   node 01-event-emitter/app.js

============================================================
`);