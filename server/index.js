// server/index.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000; // Choose a port different from React's default (3000)
const jwt = require("jsonwebtoken");
const JWT_SECRET = "easy_key_for_now";

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the Node.js backend!" });
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Server listening on port ${port}`);
});

const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: "hs-thomas",
  host: "localhost",
  database: "bloggapp",
  password: "Mcfcok01!",
  port: 5432,
});

// authenticate jwt
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ error: "Not Authorized - Log in to the correct account" });
    }
    req.user = user;
    next();
  });
}

// register
app.post("/api/register", async (req, res) => {
  // get data and hash password
  const username = req.body.username;
  const password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!username || !password) {
    res.status(400).json({ error: "Username and password both required" });
    return;
  }
  // check user already exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (existingUser.rows.length > 0) {
    res.status(400).json({ error: "User already exists" });
    return;
  }
  try {
    // insert user
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, hashedPassword]
    );

    const userResult = await pool.query(
      "SELECT id, username FROM users WHERE username = $1",
      [username]
    );
    const newUser = userResult.rows[0];
    console.log(newUser);
    // create JWT token for the new user
    const jwtPayload = {
      userId: newUser.id,
      username: newUser.username,
    };
    const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered and logged in!" , token, user: newUser });
  } catch (error) {
    res.status(400).json({ error: "Error registering the user" });
  }
});

// login
app.post("/api/login", async (req, res) => {
  console.log("1");
  // get data and hash password
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);

  console.log("2");

  if (!username || !password) {
    res.status(400).json({ error: "Username and password both required" });
    return;
  }
  console.log("3");
  // check user exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (existingUser.rows.length == 0) {
    res.status(400).json({ error: "No User Exists" });
    return;
  }
  console.log("4");

  // log the user in
  const user = existingUser.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({ error: "Invalid Password" });
    return;
  }

  console.log("5");

  // if correct need to log user in - create jwt token
  const jwtPayload = {
    userId: user.id,
    username: user.username,
  };

  console.log("6");

  const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({ message: "User logged in successfully!", token });

  return;
});

// create new post
app.post('/api/post', authenticateToken, async (req, res) => {
    console.log("here");

    const postTitle = req.body.posttitle;
    const content = req.body.content;

    // get uesr id

    // add post to db
    if (!postTitle || !content) {
        res.status(400).json({ error: 'Post title and content are required' });
        return;
    }

    try{
       const result = await pool.query(
        'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
        [req.user.userId, postTitle, content]
        );
        res.status(201).json({ message: 'Post created successfully!', post: result.rows[0] });
        return;
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Error creating post' });
        return;
    }

});

app.get("/api/posts", async (req, res) => {
  try {
    const allPosts = await pool.query(`
      SELECT posts.id, posts.title, posts.content, posts.created_at, users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
  `);;
    res.status(200).json({ posts: allPosts.rows });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Error retrieving posts" });
  }
});

app.delete('/api/post/delete/:id', authenticateToken, async (req, res) => {
  const postId = req.params.id;

  try {
    // check if post exists
    const post = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // check if user is the owner of the post
    if (post.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }

    // delete the post
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Cannot Delete Post' });
  }
});

app.patch('/api/post/edit/:id', authenticateToken, async (req, res) => {
  const postId = req.params.id;

  try {
    // check if post exists
    const post = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // check if user is the owner of the post
    if (post.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'You are not authorized to edit this post' });
    }

    // edit the post
    const { posttitle, content } = req.body;
    if (!posttitle || !content) {
      return res.status(400).json({ error: 'Post title and content are required' });
    }
    await pool.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3',
      [posttitle, content, postId]
    );
    res.status(200).json({ message: 'Post edited successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Cannot Edit Post' });
  }
});
