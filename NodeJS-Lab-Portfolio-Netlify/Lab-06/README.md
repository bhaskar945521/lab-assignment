# NodeJS Lab 06 - Working With The File System (fs) Module

## Lab Number
06

## Date
25 September 2026

## Semester
BCA VII

## Objective

This lab demonstrates how to use the Node.js fs module for reading,
writing, appending, deleting files, and storing notes using file storage.

## Files and Their Purpose

- sample.txt - Contains sample text used by the file-reading programs.
- read-async.js - Demonstrates asynchronous file reading using fs.readFile().
- read-sync.js - Demonstrates synchronous file reading using fs.readFileSync().
- write-file.js - Demonstrates writing and overwriting content in a file.
- append-file.js - Demonstrates appending new content to an existing file.
- delete-file.js - Demonstrates deleting a file using fs.unlink().
- async-await-version.js - Demonstrates file operations using fs.promises.
- add-note.js - Adds a command-line note to notes.txt.
- read-notes.js - Reads and displays notes stored in notes.txt.
- reflection-notes.txt - Contains answers to the reflection questions.

## Tasks Completed

### Task 1
Created the Lab-06 folder structure and sample.txt.

### Task 2
Read sample.txt asynchronously using fs.readFile().

### Task 3
Read sample.txt synchronously using fs.readFileSync().

### Task 4
Used fs.writeFile() to write content to a file.

### Task 5
Used fs.appendFile() to append content to a file.

### Task 6
Used fs.unlink() to delete output.txt.

### Task 7
Used fs.promises with async/await to create copy.txt.

### Task 8
Created a command-line Notes App using add-note.js and read-notes.js.

### Task 9
Added reflection notes.

## Screenshots

- read-comparison.png
- notes-app-output.png

## GitHub Submission

Use these commands from the NodeJS-Lab folder:

git add .
git commit -m "Lab 06 Submission - File System Module"
git push
