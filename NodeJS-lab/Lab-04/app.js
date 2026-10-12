// Lab 04 - Node.js Modules and npm Packages
// CS403NOD - Node.js
// Student: Bhaskar Mall | Scholar No: 23145005 | BCA VII Semester
// College: Dev Sanskriti Vishwavidyalaya (DSVV)

const path = require("path");
const os = require("os");
const url = require("url");

console.log("=========================================");
console.log(" Node.js Modules & npm Package Demonstration");
console.log("=========================================");
console.log("Student: Bhaskar Mall | Scholar No: 23145005");
console.log("Class  : BCA VII Semester | CS403NOD Node.js\n");

// Core Modules demonstration
console.log("1. Core Module (path):");
console.log("   Current Directory :", __dirname);
console.log("   Normalized Path   :", path.normalize(__dirname));
console.log("   Path Basename     :", path.basename(__filename));

console.log("\n2. Core Module (os):");
console.log("   Operating System  :", os.type(), os.release());
console.log("   Platform & Arch   :", os.platform(), os.arch());
console.log("   Total Memory (MB) :", Math.round(os.totalmem() / (1024 * 1024)));
console.log("   Free Memory (MB)  :", Math.round(os.freemem() / (1024 * 1024)));

console.log("\n3. Core Module (url):");
const sampleUrl = url.parse("http://localhost:3000/students?course=BCA&sort=marks", true);
console.log("   Parsed Pathname   :", sampleUrl.pathname);
console.log("   Parsed Query      :", JSON.stringify(sampleUrl.query));

// Check third party package slugify if present
try {
  const slugify = require("slugify");
  console.log("\n4. Third-party Module (slugify):");
  console.log("   Slugified Title   :", slugify("CS403NOD Node.js Lab Assignment 08", { lower: true }));
} catch (e) {
  console.log("\n4. slugify package available in Lab-08.");
}

console.log("\nModule resolution and execution completed successfully!");
