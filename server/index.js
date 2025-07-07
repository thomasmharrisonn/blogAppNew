// server/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000; // Choose a port different from React's default (3000)
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'easy_key_for_now';

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the Node.js backend!' });
});

app.listen(port, '127.0.0.1', () => {
    console.log(`Server listening on port ${port}`);
});

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'hs-thomas',      
  host: 'localhost',           
  database: 'bloggapp',          
  password: 'Mcfcok01!',       
  port: 5432,                    
});

// register
app.post('/api/register', async (req, res) => {
    // get data and hash password
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!username || !password){
        res.status(400).json({ error: 'Username and password both required'});
        return;
    }
    // check user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0){
        res.status(400).json({ error: 'User already exists'});
        return;
    }
    try{
        // insert user
        const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully!'});
    }
    catch (error){
        res.status(400).json({ error: 'Error registering the user'});
    }
});

// login
app.post('/api/login', async (req, res) => {
    // get data and hash password
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!username || !password){
        res.status(400).json({ error: 'Username and password both required'});
        return;
    }
    // check user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length == 0){
        res.status(400).json({ error: 'No User Exists'});
        return;
    }

    // log the user in
    const user = existingUser.rows[0];
    const isPasswordValid = await bcrypt.compare(assword, user.password);
    if (!isPasswordValid){
        res.status(400).json({ error: 'Invalid Password'});
        return;
    }


    // if correct need to log user in - create jwt token
    const jwtPayload = {
        userId: user.id,
        username: user.username
    };

    const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'User logged in successfully!', token});


});