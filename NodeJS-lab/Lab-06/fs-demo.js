// Lab 06 - File System (fs) Module Operations
// CS403NOD - Node.js
// Student: Bhaskar Mall | Scholar No: 23145005 | BCA VII Semester
// College: Dev Sanskriti Vishwavidyalaya (DSVV)

const fs = require("fs");
const path = require("path");

console.log("=========================================");
console.log(" Node.js File System (fs) Demonstration");
console.log("=========================================");
console.log("Student: Bhaskar Mall | Scholar No: 23145005\n");

const demoFile = path.join(__dirname, "demo-output.txt");

try {
  // 1. Write file
  fs.writeFileSync(demoFile, "Initial content written synchronously.\n", "utf8");
  console.log("[1] File created:", path.basename(demoFile));

  // 2. Append file
  fs.appendFileSync(demoFile, "Appended line: Learning fs module in Node.js.\n", "utf8");
  console.log("[2] Content appended successfully.");

  // 3. Read file
  const content = fs.readFileSync(demoFile, "utf8");
  console.log("[3] File Content Read:\n" + content.trim());

  // 4. File Stats
  const stats = fs.statSync(demoFile);
  console.log("[4] File Size:", stats.size, "bytes | Created:", stats.birthtime.toISOString());

  // Clean up
  fs.unlinkSync(demoFile);
  console.log("[5] Temporary test file cleaned up successfully.");
  console.log("\nAll File System operations executed without errors!");
} catch (err) {
  console.error("FS Error:", err.message);
}
