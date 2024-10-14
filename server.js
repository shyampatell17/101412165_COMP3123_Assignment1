const express = require('express');
const mongoose = require('mongoose'); // Mongoose for MongoDB connection
const SERVER_PORT = process.env.SERVER_PORT || 300; // Server Hosting Port
const employeeRoutes = require('./routes/empRoutes.js');
const userRoutes = require('./routes/userRoutes.js')

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// MongoDB connection
const mongoURI = `mongodb+srv://shyam:shyam17@cluster0.le16v.mongodb.net/comp3123_assigment1?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);


app.listen(SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${SERVER_PORT}`);
});