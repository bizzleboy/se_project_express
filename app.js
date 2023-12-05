const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const authMiddleware = require('./middlewares/auth');

const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors");

app.use(cors()); 

// Middleware to parse JSON bodies
app.use(express.json());



// Connect your routes
app.use(routes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wtwr_db')
  .then(() => {

    app.listen(PORT, () => {
 
    });
  })


