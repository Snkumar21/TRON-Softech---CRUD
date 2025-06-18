const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname)));

// Serve index.html on root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// MySQL Connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Snkumar30",
    database: "tron_softech_db"
});

con.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL DB");
});

// Insert route
app.post('/add-student', (req, res) => {
    const { urn, name, course, percentage } = req.body;

    const sql = "INSERT INTO student (urn, name, course, percentage) VALUES (?, ?, ?, ?)";
    con.query(sql, [urn, name, course, percentage], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true });
    });
});

// Fetch all student data
app.get('/students', (req, res) => {
    const sql = "SELECT * FROM student";
    con.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

// Delete a student by URN
app.delete('/delete-student/:urn', (req, res) => {
    const urn = req.params.urn;
    con.query("DELETE FROM student WHERE urn = ?", [urn], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true });
    });
});

// Update student
app.put('/update-student/:urn', (req, res) => {
    const urn = req.params.urn;
    const { name, course, percentage } = req.body;

    const sql = "UPDATE student SET name=?, course=?, percentage=? WHERE urn=?";
    con.query(sql, [name, course, percentage, urn], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});