const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Using mysql2 for database connection

const app = express();
app.use(cors());
app.use(express.json());

// Database connection configuration
const connection = mysql.createConnection({
    host: 'ec2-3-219-93-177.compute-1.amazonaws.com',
    user: 'video',
    password: 'video4Ever!',
    database: 'nchs_video'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// GET endpoint to retrieve results for a specific branch
app.get('/result/:id', (req, res) => {
    const branchId = req.params.id;
    let sql = `
        SELECT DISTINCT 
            movie.Title, 
            movie.Price, 
            dir.DirectorFirst, 
            dir.DirectorLast, 
            inv.OnHand,
            studio.StudioName
        FROM Director AS dir
        INNER JOIN Directed AS direct ON dir.DirectorNum = direct.DirectorNum
        INNER JOIN Movie AS movie ON movie.MovieCode = direct.MovieCode
        INNER JOIN Inventory AS inv ON inv.MovieCode = movie.MovieCode
        INNER JOIN Branch AS branch ON branch.BranchNum = inv.BranchNum
        LEFT JOIN Studio AS studio ON movie.StudioCode = studio.StudioCode
        WHERE branch.BranchNum = ?
        ORDER BY movie.Title ASC
    `;
    connection.query(sql, [branchId], (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).json({ error: "Database query error", details: error.message });
        } else {
            res.json(results);
        }
    });
});

// Root endpoint for testing
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Video4Ever API!" });
});

// Server running on port 8000
app.listen(8000, () => {
    console.log('Server is running on port 8000.');
});