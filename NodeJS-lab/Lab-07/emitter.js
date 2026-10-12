// Lab 07 - Events & EventEmitter
// CS403NOD - Node.js
// Student: Bhaskar Mall | Scholar No: 23145005 | BCA VII Semester
// College: Dev Sanskriti Vishwavidyalaya (DSVV)

const EventEmitter = require("events");

console.log("=========================================");
console.log(" Node.js EventEmitter Architecture");
console.log("=========================================");
console.log("Student: Bhaskar Mall | Scholar No: 23145005\n");

class OrderTracker extends EventEmitter {
  placeOrder(orderId, item, customer) {
    console.log(`[Event Triggered] Order placed: #${orderId} (${item}) for ${customer}`);
    this.emit("orderPlaced", { orderId, item, customer, timestamp: new Date().toISOString() });
  }

  updateStatus(orderId, status) {
    this.emit("statusChanged", { orderId, status });
  }
}

const tracker = new OrderTracker();

// Listener 1: Order notification
tracker.on("orderPlaced", (data) => {
  console.log(` -> Listener 1 (SMS Service): Notification sent to ${data.customer} at ${data.timestamp}`);
});

// Listener 2: Kitchen inventory
tracker.on("orderPlaced", (data) => {
  console.log(` -> Listener 2 (Kitchen Queue): Preparing item "${data.item}" for order #${data.orderId}`);
});

// Listener 3: Status updater (using once)
tracker.once("statusChanged", (data) => {
  console.log(` -> Listener 3 (Single-fire tracker): Order #${data.orderId} status updated to: ${data.status}`);
});

// Trigger events
tracker.placeOrder(101, "Dell XPS Laptop", "Bhaskar Mall");
tracker.updateStatus(101, "Dispatched from DSVV Lab");

console.log("\nEventEmitter lifecycle completed successfully!");
