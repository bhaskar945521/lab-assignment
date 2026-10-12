// Lab 03 - Asynchronous JavaScript: Food Delivery Simulation
// CS403NOD - Node.js
// Student: Bhaskar Mall | Scholar No: 23145005 | BCA VII Semester
// College: Dev Sanskriti Vishwavidyalaya (DSVV)

console.log("=========================================");
console.log(" DSVV Canteen - Async Food Delivery Simulation");
console.log("=========================================");
console.log("Student Name   : Bhaskar Mall");
console.log("Scholar Number : 23145005");
console.log("Order Item     : Special Thali & Masala Chai");
console.log("Delivery To    : Panini Hostel, Room H-8\n");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runFoodDelivery() {
  console.log("[1/5] Order Placed: Kitchen has received your order.");
  await delay(150);

  console.log("[2/5] Preparing Food: Chef is cooking freshly at DSVV Canteen...");
  await delay(150);

  console.log("[3/5] Quality Check: Food packed cleanly with proper hygiene.");
  await delay(150);

  console.log("[4/5] Out for Delivery: Valet is heading to Panini Hostel...");
  await delay(150);

  console.log("[5/5] Delivered: Order handed over successfully to Bhaskar Mall!");
  console.log("\nStatus: All asynchronous operations completed via Promises & Async/Await.");
}

runFoodDelivery().catch((err) => {
  console.error("Order delivery failed:", err.message);
});
