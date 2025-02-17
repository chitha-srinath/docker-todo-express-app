const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const Redis = require("ioredis");

const app = express();
const PORT = process.env.PORT;
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Middleware
app.use(cors());
app.use(express.json());


// Create a Redis client and connect to the container
const redis = new Redis({
  host: process.env.REDIS_HOST, // Container name in the Docker network
  port: 6379, // Default Redis port
});


// Test the Redis connection
redis
  .ping()
  .then((result) => console.log("Redis connected:", result))
  .catch((err) => console.error("Redis connection error:", err));

// MongoDB Connection
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
}

connectDB();

// Routes
// GET all todos
app.get("/todos", async (req, res) => {
  try {
    const db = client.db(dbName);
    const todos = await db.collection("todos").find().toArray();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new todo
app.post("/todos", async (req, res) => {
  try {
    const db = client.db(dbName);
    const todo = {
      title: req.body.title,
      completed: false,
      createdAt: new Date(),
    };
    await db.collection("todos").insertOne(todo);
    res.status(201).json({ result: "inserted sucessfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update todo
app.put("/todos/:id", async (req, res) => {
  try {
    const db = client.db(dbName);
    const result = await db
      .collection("todos")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const db = client.db(dbName);
    const result = await db
      .collection("todos")
      .deleteOne({ _id: ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
