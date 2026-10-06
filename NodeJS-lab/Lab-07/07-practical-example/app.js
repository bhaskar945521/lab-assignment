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
