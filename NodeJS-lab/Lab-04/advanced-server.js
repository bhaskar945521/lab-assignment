const http = require('http');
const url = require('url');

const students = [
  { id: 1, name: "Pragya", course: "BCA", marks: 92 },
  { id: 2, name: "AMIT", course: "IT", marks: 76 },
  { id: 3, name: "Bhaskar", course: "BCA", marks: 85 },
  { id: 4, name: "Rishabh", course: "IT", marks: 64 },
  { id: 5, name: "Yadev", course: "BCA", marks: 58 },
  { id: 6, name: "Sudhanshu", course: "IT", marks: 81 },
  { id: 7, name: "Ayush", course: "BCA", marks: 71 },
  { id: 8, name: "Saroj", course: "IT", marks: 47 },
  { id: 9, name: "Sayon", course: "BCA", marks: 66 },
  { id: 10, name: "Gauri", course: "IT", marks: 89 },
  { id: 11, name: "Kanak", course: "BCA", marks: 53 },
  { id: 12, name: "Shreya", course: "IT", marks: 73 }
];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Only GET requests are allowed
  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.end(JSON.stringify({
      error: "Only GET requests are allowed"
    }));
  }

  // Bonus route: /students/course/BCA
  const courseMatch = pathName.match(/^\/students\/course\/([^/]+)$/);

  // Check valid routes
  if (pathName !== '/students' && !courseMatch) {
    res.statusCode = 404;
    return res.end(JSON.stringify({
      error: "Route not found"
    }));
  }

  // Validate minMarks
  if (query.minMarks !== undefined) {
    const minMarks = Number(query.minMarks);

    if (query.minMarks.trim() === '' || Number.isNaN(minMarks)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({
        error: "minMarks must be a number"
      }));
    }
  }

  // Validate sort
  if (query.sort !== undefined) {
    if (query.sort !== 'name' && query.sort !== 'marks') {
      res.statusCode = 400;
      return res.end(JSON.stringify({
        error: "sort must be name or marks"
      }));
    }
  }

  // Validate order
  if (query.order !== undefined) {
    if (query.order !== 'asc' && query.order !== 'desc') {
      res.statusCode = 400;
      return res.end(JSON.stringify({
        error: "order must be asc or desc"
      }));
    }
  }

  // Start with all students
  let result = [...students];

  // Course filter
  if (courseMatch) {
    const routeCourse = decodeURIComponent(courseMatch[1]);

    result = result.filter(student =>
      student.course.toLowerCase() === routeCourse.toLowerCase()
    );
  } else if (query.course) {
    result = result.filter(student =>
      student.course.toLowerCase() === query.course.toLowerCase()
    );
  }

  // Minimum marks filter
  if (query.minMarks !== undefined) {
    const minMarks = Number(query.minMarks);

    result = result.filter(student =>
      student.marks >= minMarks
    );
  }

  // Partial and case-insensitive name search
  if (query.search) {
    const searchText = query.search.toLowerCase();

    result = result.filter(student =>
      student.name.toLowerCase().includes(searchText)
    );
  }

  // Sorting
  if (query.sort) {
    const order = query.order || 'asc';

    result.sort((a, b) => {
      let comparison;

      if (query.sort === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a.marks - b.marks;
      }

      return order === 'desc' ? -comparison : comparison;
    });
  }

  // Send final result
  res.statusCode = 200;
  res.end(JSON.stringify(result, null, 2));
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});