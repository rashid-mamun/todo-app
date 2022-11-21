const express = require('express');
const connectWithDb = require('./Connection/connection');
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');
require('dotenv').config();

/* express app initialization */
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());

/* 
connection with DB
*/
connectWithDb();
/* 
application routes
*/

app.use('/todo', todoHandler);
app.use('/user', userHandler);
app.listen(port, () => {
  console.log('listening from port', port);
});
