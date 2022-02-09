const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth-routes');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);

app.use((error, req, res, next) => {
  res.status(error.code || 500);

  res.json({
    message: error.message || 'Unknown error occurred',
  });
});

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hd1og.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );
    app.listen(process.env.PORT);

    console.log('Connection to the DB is successful');
  } catch (err) {
    console.log(err);
  }
}

start();
