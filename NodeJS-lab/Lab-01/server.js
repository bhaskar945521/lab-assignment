// Lab 01 - Simple HTTP Server
// CS403NOD - Node.js
// Student: Bhaskar Mall | Scholar No: 23145005 | BCA VII Semester
// College: Dev Sanskriti Vishwavidyalaya (DSVV)

const http = require("http");
const url = require("url");

function handler(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === "/" || pathname === "") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(
      "Welcome! This server is created by Bhaskar Mall\n" +
      "Name - Bhaskar Mall\n" +
      "Scholar Number - 23145005\n" +
      "Course - BCA (VII Semester)\n" +
      "College - Dev Sanskriti Vishwavidyalaya (DSVV)\n" +
      "Lab 01 - Simple HTTP Server is running successfully."
    );
  } else if (pathname === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("About\n\nHello! I am Bhaskar Mall, BCA VII Semester student at DSVV.");
  } else if (pathname === "/college") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("College\n\nCollege Name - Dev Sanskriti Vishwavidyalaya (DSVV)\nSemester - BCA VII");
  } else if (pathname === "/profile") {
    const profile = {
      name: "Bhaskar Mall",
      scholarNumber: "23145005",
      course: "BCA",
      semester: "VII",
      college: "Dev Sanskriti Vishwavidyalaya (DSVV)",
      subject: "CS403NOD - Node.js"
    };
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(profile, null, 2));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Page Not Found");
  }
}

// Line 1: Export request handler for Lab-08 integration
module.exports = handler;

// Line 2: Start server only when run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  http.createServer(handler).listen(PORT, "0.0.0.0", () => {
    console.log(`Lab 01 Simple HTTP Server running at http://localhost:${PORT}`);
  });
}
