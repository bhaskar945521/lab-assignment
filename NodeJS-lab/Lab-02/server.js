const http = require("http");

const server = http.createServer((req, res) => {

    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Welcome! this server is created by Bhaskar \nName - Bhaskar\nScholar Number - 23145005\nCourse - BCA");
    }

    else if (req.url === "/about") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("About \n\nHello! I am Bhaskar.");
    }

    else if (req.url === "/college") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("College \n\nCollege Name - Dev Sanskriti Vishwavidhlya \nSemester - BCA VII");
    }
    else if (req.url === "/profile") {

    const profile = {
        name: "Bhaskar",
        scholarNumber: "23145005",
        course: "BCA",
        semester: "VII",
        college: "Dev Sanskriti Vishwavidhyalaya"
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(profile));
}

    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Page Not Found");
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Node.js server is running on http://localhost:${PORT}`);
});