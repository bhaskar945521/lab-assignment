// Lab 02 - Student Directory API & HTTP Server
// CS403NOD - Node.js
// Student: Bhaskar Mall | Scholar No: 23145005 | BCA VII Semester
// College: Dev Sanskriti Vishwavidyalaya (DSVV)

const http = require("http");
const url = require("url");

const students = [
  { id: "01", name: "Aditya Soni", age: 21, course: "BCA", semester: "VII", state: "MP" },
  { id: "02", name: "Ayush Ram Tripathi", age: 22, course: "BCA", semester: "VII", state: "UP" },
  { id: "03", name: "Bhaskar Mall", age: 22, course: "BCA", semester: "VII", state: "UP" },
  { id: "04", name: "Gauri Tyagi", age: 22, course: "BCA", semester: "VII", state: "UP" },
  { id: "05", name: "Kanak Sharma", age: 22, course: "BCA", semester: "VII", state: "UP" },
  { id: "06", name: "Pragya Gupta", age: 22, course: "BCA", semester: "VII", state: "UP" },
  { id: "07", name: "Nisha", age: 23, course: "BCA", semester: "VII", state: "Delhi" },
  { id: "08", name: "Rishabh Khatiwada", age: 22, course: "BCA", semester: "VII", state: "Nepal" },
  { id: "09", name: "Sayon Dey", age: 21, course: "BCA", semester: "VII", state: "WB" },
  { id: "10", name: "Sudhanshu Bhatt", age: 22, course: "BCA", semester: "VII", state: "UK" },
  { id: "11", name: "Amit Kumar", age: 22, course: "IT", semester: "VII", state: "Bihar" },
  { id: "12", name: "Shreya Verma", age: 21, course: "IT", semester: "VII", state: "UP" }
];

function handler(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === "/" || pathname === "") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(
      "Welcome! This server is created by Bhaskar Mall\n" +
      "Name - Bhaskar Mall\n" +
      "Scholar Number - 23145005\n" +
      "Course - BCA (VII Semester)\n\n" +
      "Available routes:\n" +
      "  /about\n" +
      "  /college\n" +
      "  /profile\n" +
      "  /students\n" +
      "  /students?course=BCA"
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
      college: "Dev Sanskriti Vishwavidyalaya"
    };
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(profile, null, 2));
  } else if (pathname === "/students") {
    let result = students;
    if (query.course) {
      result = result.filter(s => s.course.toLowerCase() === query.course.toLowerCase());
    }
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      total: result.length,
      filter: query.course || "all",
      students: result
    }, null, 2));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Page Not Found");
  }
}

// Line 1: export it
module.exports = handler;

// Line 2: start only when run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  http.createServer(handler).listen(PORT, "0.0.0.0", () => {
    console.log(`Lab 02 Server running on http://localhost:${PORT}`);
  });
}