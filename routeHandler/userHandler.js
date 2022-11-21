const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();
const jwt = require('jsonwebtoken');

const userSchema = require('../schemas/userSchema');

const User = new mongoose.model('User', userSchema);
// console.log(process.env.JWT_SECRET);
/* 
signup
used async await function
*/
router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({
      message: 'SignUp was successfull!',
    });
  } catch {
    res.status(500).json({
      message: 'SignUp failled',
    });
  }
});

/* 
log in 
*/
router.post('/login', async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });

    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );

      if (isValidPassword) {
        /* 
                generate token
            */
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '1h',
          }
        );

        res.status(200).json({
          access_token: token,
          message: 'login  successful!',
        });
      } else {
        res.status(401).json({
          error: 'Authetication failed!',
        });
      }
    } else {
      res.status(401).json({
        error: 'Authetication failed!',
      });
    }
  } catch {
    res.status(401).json({
      error: 'Authetication failed!',
    });
  }
});

module.exports = router;
