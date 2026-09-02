# Node.js Lab - 05

## Title
Simulating a Food Delivery Tracker

## Student Details

- **Name:** Rishabh Khatiwada
- **Scholar Number:** 23145018
- **Course:** BCA VII Semester
- **Subject:** CS403NOD - Node.js
- **Lab:** 05
- **Date:** 27 August 2026

---

## Objective

The objective of this lab is to understand asynchronous programming
in Node.js using a food delivery tracking example.

The lab covers:

- Callbacks
- Promises
- Promise Chaining
- Async/Await
- Promise.all()
- Event Loop

---

## Files

### 1. callback-version.js

Demonstrates the food delivery process using callbacks.

Flow:

Place Order → Track Order → Confirm Delivery

---

### 2. promise-version.js

Demonstrates asynchronous operations using Promises with:

- `resolve()`
- `reject()`
- `.then()`
- `.catch()`

Both successful and failed outcomes were tested.

---

### 3. chaining-version.js

Demonstrates Promise Chaining for sequential operations.

Flow:

Order Placed → Preparing Food → Out For Delivery → Delivered

A single `.catch()` is used to handle errors.

---

### 4. async-await-version.js

Demonstrates the same asynchronous workflow using:

- `async`
- `await`
- `try/catch`

This makes the asynchronous code easier to read.

---

### 5. concurrent-orders.js

Demonstrates concurrent execution using `Promise.all()`.

Three orders are processed:

- Pizza
- Burger
- Coffee

The total execution time was approximately **2008 ms**.

---

## Execution

Run the files using Node.js:

```bash
node callback-version.js
node promise-version.js
node chaining-version.js
node async-await-version.js
node concurrent-orders.js