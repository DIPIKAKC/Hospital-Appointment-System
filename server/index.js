const express = require("express");
const app = express();
const connectDb = require('./connectDb');
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./Route/auth");

//Database Connection
connectDb();

//Port Usage and handling
const PORT= process.env.PORT || 5001;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials: true
}));

//Default route for server
app.get('/', (req, res) => {
    res.send('Welcome to backend!');
  });

// API route
app.get('/api', (req, res) => {
    res.json({ message: 'API is working!' });
  });


//SYSTEM ROUTES
app.use("/auth", authRoutes);


//Starting the server
app.listen(PORT, (err) => {

    if (err) {
        console.error(`Failed to start server: ${err}`);
        process.exit(1); // Exit the process with an error code (1)
    }
    console.log(`Server running on http://localhost:${PORT}`);
  });