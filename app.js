const express = require('express');
const mongoose = require('mongoose');

const app = express();

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hd1og.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );
    console.log('Connection to the DB is successful');
  } catch (err) {
    console.log(err);
  }
}

start();
