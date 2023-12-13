// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());

const PORT = 3000;


// Create a SQLite database connection
const db = new sqlite3.Database('./db_data/video_db.sqlite3');

// Check SQLite connection
db.serialize( async() => {
  db.run(`CREATE TABLE IF NOT EXISTS videos (id INT AUTO_INCREMENT PRIMARY KEY,filename TEXT,originalname TEXT,size INT,title TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,email TEXT,password TEXT)`);


  
  const hashedPassword = await bcrypt.hash("Pa$$w0rd!", 10);
  const email = "jenax@mailinator.com";
  
  const existingUser = await getUserByUsername(email);
  console.log(existingUser);

  if (!existingUser) {
    db.run('INSERT INTO users (id, email, password) VALUES (?, ?, ?)', [1, email, hashedPassword], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to register user' });
      }
      // res.status(201).json({ message: 'User registered successfully' });
    });
  }
 
  console.log('Connected to SQLite database');
});


// Helper function to get a user by username
const getUserByUsername = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

// Middleware for handling JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  },
});

const upload = multer({ storage: storage });

// RESTful API for file upload
app.post("/api/upload", upload.single("file"), async (req, res) => {
  const { filename, originalname, size } = req.file;
  // const { title, description } = req.body;

  // Example SQLite query to insert data into your_table
  db.run('INSERT INTO videos (filename, originalname, size) VALUES ( ?, ?, ?)', [filename, originalname, size], function (err) {
    if (err) throw err;

    console.log(`Inserted row with ID: ${this.lastID}`);
    res.json({
      message: "File uploaded successfully",
      fileId: this.lastID,
    });

  });
});


// RESTful API to get a list of saved files
app.post("/api/files", async (req, res) => {
  // Retrieve files from MySQL database
  try{

    // Connect to MySQL
    db.all('SELECT filename, originalname, size FROM videos order by id desc', (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });

  }catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body.payload;

  // Retrieve user from the database
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
    if (!user) {
      console.log(req.body)
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password from the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.json({ message: 'Login successful',  user});
    } else {
      res.status(401).json({ error: 'Invalid username or password', user });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
