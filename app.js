const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { 
  STATUS_OK, 
  STATUS_CREATED, 
  STATUS_NO_CONTENT, 
  STATUS_BAD_REQUEST, 
  STATUS_NOT_FOUND, 
  STATUS_INTERNAL_SERVER_ERROR 
} = require('../utils/constants');
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to simulate user authentication
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // paste the _id of the test user created in the previous steps
  };
  next();
});

// Connect your routes
app.use(routes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wtwr_db')
  .then(() => {
    console.log('Connected to DB!');
    app.listen(PORT, () => {
      console.log(`App listening at port ${PORT}`);
      console.log("This is working");
    });
  })
  .catch((e) => {
    console.error('DB Connection Error', e);
  });

