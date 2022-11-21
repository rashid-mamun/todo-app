const express = require('express');
const mongoose = require('mongoose');

/* 
database connection with mongoose 
*/

const connectWithDb = () => {
  mongoose
    .connect('mongodb://localhost/todos', {
      useNewUrlParser: true,
    })
    .then(() => console.log('connection successful'))
    .catch((err) => console.log(err));
};

module.exports = connectWithDb;
