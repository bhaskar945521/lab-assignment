
const http = require("http");

// Store details of 12 students
const students = [
    {
        id: "01",
        name: "Aditya Soni",
        age: 21,
        course: "BCA",
        semester: "VII",
        state: "MP",
        phone: "9876543210",
        hostel: "Padini first floor H 1"
    },
    {
        id: "02",
        name: "Ayush Ram Tripathi",
        age: 22,
        course: "BCA",
        semester: "VII",
        state: "UP",
        phone: "9876543211",
        hostel: "Padini first floor J 4"
    },
    {
        id: "03",
        name: "Bhaskar Mall",
        age: 22,
        course: "BCA",
        semester: "VII",
        state: "UP",
        phone: "9876543212",
        hostel: "Padini first floor H 8"
    },
    {
        id: "04",
        name: "Gauri Tyagi",
        age: 22,
        course: "BCA",
        semester: "VII",
        state: "UP",
        phone: "9876543213",
        hostel: "Nivedita"
    },
    {
        id: "05",
        name: "Kanak Sharma",
        age: 22,
        course: "BCA",
        semester: "VII",
        state: "UP",
        phone: "9876543214",
        hostel: "Nivedita"
    },
    {
        id: "06",
        name: "Pragya Gupta",
        age: 22,
        course: "BCA",
        semester: "VII",
        state: "UP",
        phone: "9876543215",
        hostel: "Nivedita"
    },
    {
        id: "07",
        name: "Nisha",
        age: 23,
        course: "BCA",
        semester: "VII",
        state: "Bihar",
        phone: "9876543216",
        hostel: "Nivedita"
    },
    {
        id: "08",
        name: "Shreya Kashyap",
        age: 22,
        course: "BCA",
        semester: "VII",
        state: "UK",
        phone: "9876543217",
        hostel: "Nivedita"
    },
    {
        id: "09",
        name: "Shreya Singh",
        age: 21,
        course: "BCA",
        semester: "VII",
        state: "UK",
        phone: "9866543412",
        hostel: "Nivedita"
    },
    {
        id: "10",
        name: "Mikki",
        age: 22,
        course: "BCA",
        semester: "VII",
        state: "UK",
        phone: "9876543456",
        hostel: "Nivedita"
    },
    {
        id: "11",
        name: "Rishabh Kahtiwada",
        age: 21,
        course: "BCA",
        semester: "VII",
        state: "Manipur",
        phone: "9876543220",
        hostel: "Padini hostel first floor H 8"
    },
    {
        id: "12",
        name: "Sayon",
        age: 22,
        course: "BCA",
        semester: "VII",
        state: "Delhi",
        phone: "9876543221",
        hostel: "Padini hostel first floor H 4"
    }
];


// Create the server
const server = http.createServer((req, res) => {

    // Show ID and Name on the home page
    if (req.url === "/") {

        res.writeHead(200, { "Content-Type": "text/plain" });

        let data = "STUDENT LIST\n\n";

        // Display ID and Name of all students
        students.forEach((student) => {
            data += `ID: ${student.id}    Name: ${student.name}\n`;
        });

        data += "\nUse /ID or /Name to view student details.";

        res.end(data);
    }

    // Search student by ID or Name
    else {

        // Remove "/" from the URL
        let search = req.url.substring(1);

        // Find student by ID or Name
        let student = students.find(
            (s) =>
                s.id === search ||
                s.name.toLowerCase().replaceAll(" ", "") === search.toLowerCase()
        );

        // If student is found
        if (student) {

            res.writeHead(200, { "Content-Type": "text/plain" });

            // Display complete student details
            res.end(`
STUDENT DETAILS

ID: ${student.id}
Name: ${student.name}
Age: ${student.age}
Course: ${student.course}
Semester: ${student.semester}
State: ${student.state}
Phone: ${student.phone}
Hostel Address: ${student.hostel}
            `);
        }

        // If student is not found
        else {

            res.writeHead(404, { "Content-Type": "text/plain" });

            res.end("Student Not Found");
        }
    }
});


// Set the port number
const PORT = 3000;

// Start the server
server.listen(PORT, () => {
    console.log(`Node.js server is running on http://localhost:${PORT}`);
});

