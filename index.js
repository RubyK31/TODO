const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin', 
    database: 'todo_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes
// Create a new to-do
app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    const query = 'INSERT INTO todos (title, description) VALUES (?, ?)';
    db.query(query, [title, description], (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId, title, description, status: 'pending' });
    });
});

// Get all to-dos
app.get('/todos', (req, res) => {
    const query = 'SELECT * FROM todos';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get a single to-do
app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM todos WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) return res.status(404).json({ error: 'To-Do not found' });
        res.json(results[0]);
    });
});

// Update a to-do
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const query = 'UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?';
    db.query(query, [title, description, status, id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) return res.status(404).json({ error: 'To-Do not found' });
        res.json({ message: 'To-Do updated successfully' });
    });
});

// Delete a to-do
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM todos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) return res.status(404).json({ error: 'To-Do not found' });
        res.json({ message: 'To-Do deleted successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
