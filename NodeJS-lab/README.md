# Node.js Lab Assignments

## Lab Assignment - 02

### Student Details

- **Name:** Bhaskar
- **Scholar Number:** 23145005
- **Course:** BCA
- **Semester:** VII

### Lab Information

- **Lab Number:** 02
- **Date:** 08-08-2026

### Project Description

This project demonstrates a basic HTTP server built using the Node.js
**http** module. The server handles multiple routes and returns
different responses for different URLs.

### Available Routes

| Route | Description |
|---|---|
| `/` | Displays a welcome message with student details. |
| `/about` | Displays a short introduction about the student. |
| `/college` | Displays the college name and current semester. |
| `/profile` | Returns student details in JSON format. |
| Any other route | Returns **404 - Page Not Found**. |

### Technologies Used

- Node.js
- JavaScript
- HTTP Module

---

# Lab Assignment - 03

## Student Details

- **Name:** Bhaskar Mall
- **Scholar Number:** 23145005
- **Course:** BCA
- **Semester:** VII

## Lab Information

- **Lab Number:** 03
- **Date:** 10-08-2026

## Project Description

This project is an updated version of the basic Node.js HTTP server.

In this version, details of 12 BCA students are stored in the server.
The home page displays the ID and Name of all students. Users can
search for complete student details using either the student ID or Name.

## Available Routes

| Route | Description |
|---|---|
| `/` | Displays the list of all 12 students with their ID and Name. |
| `/01` | Displays complete details of the student with ID 01. |
| `/03` | Displays complete details of the student with ID 03. |
| `/BhaskarMall` | Displays complete details of Bhaskar Mall. |
| `/Sayon` | Displays complete details of Sayon. |
| Any other route | Returns **404 - Student Not Found**. |

## Student Information

Each student contains the following details:

- ID
- Name
- Age
- Course
- Semester
- State
- Phone Number
- Hostel Address

## Search Options

### 1. Student List

The `/` route displays all 12 students with their ID and Name.

### Note

req.url.split("/") splits the URL into parts using /, making it easier to extract the ID or Name from the requested URL.

```text
http://localhost:3000/