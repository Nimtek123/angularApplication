// server.js
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// MySQL Connection
const connection = mysql.createConnection({
  host: 'your-mysql-host',
  user: 'your-mysql-username',
  password: 'your-mysql-password',
  database: 'your-mysql-database',
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to MySQL');
    
    // Create your table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        size INT NOT NULL
      )
    `;
    
    db.query(createTableQuery, (err) => {
      if (err) {
        throw err;
      }
      console.log('Table created or already exists');
    });
  });

// Middleware for handling JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  },
});

const upload = multer({ storage: storage });

// RESTful API for file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  const { filename, originalname, size } = req.file;
  const { title, description } = req.body;

  // Insert file details into MySQL database
  const query =
    'INSERT INTO files (filename, originalname, size, title, description) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [filename, originalname, size, title, description], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error inserting data into database' });
    }

    res.json({ message: 'File uploaded successfully', fileId: results.insertId });
  });
});

// RESTful API to get a list of saved files
app.get('/api/files', (req, res) => {
  // Retrieve files from MySQL database
  const query = 'SELECT id, originalname FROM files';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error fetching data from database' });
    }

    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
