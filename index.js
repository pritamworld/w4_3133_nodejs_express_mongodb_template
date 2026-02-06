const express = require('express');
const mongoose = require('mongoose');
const employeeRouter = require('./routes/EmployeeRoutes.js');
const SERVER_PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json()); // Make sure it comes back as json
app.use(express.urlencoded({ extended: true })); // Form data

//TODO - Replace you Connection String here
const DB_NAME = "db_comp3133_employee"
const DB_USER_NAME = 'sa'
const DB_PASSWORD = 'SY1vgY0fY47tKxQL' //Update your password
const CLUSTER_ID = '7wn4nmp'
const DB_CONNECTION = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@cluster0.${CLUSTER_ID}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

// const DB_CONNECTION = "mongodb+srv://sa:<Update your password>@cluster0.7wn4nmp.mongodb.net/db_comp3133_employee?appName=Cluster0"

async function connectToMongoDB(connectionString = DB_CONNECTION) {
  await mongoose.connect(connectionString);
}

app.use(employeeRouter);

app.listen(SERVER_PORT, () => { 
  console.log(`Server is running on port ${SERVER_PORT}...`) 
  try {
    connectToMongoDB(DB_CONNECTION);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
});
