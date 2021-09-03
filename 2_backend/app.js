import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

import User from './models/userModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Connecting to DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((response) => {
    console.log(`Connected to MongoDB`.blue.underline.bold);
    // Starting server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`.yellow.underline.bold);
    });
  });

// Routes

// GET: all events
app.get('/', (req, res) => res.send('API is running...'));

// GET: single event based on id

// POST: register new user
app.post('/users/signup', (req, res) => {
  const user = req.body;

  User.find().then((result) => {
    const userExist = result.some((userDB) => {
      return userDB.email === user.email;
    });

    if (userExist) {
      res.json({
        status: 'failed',
        message: 'User with this email already exist',
      });
    } else {
      const newUser = new User(user);

      newUser.save().then((result) => {
        let { _id } = result;
        res.json({
          status: 'success',
          message: 'Registration completed successfully',
          userId: _id,
        });
      });
    }
  });
});

// POST: log in user
app.post('/users/login', (req, res) => {
  let user = req.body;

  User.find().then((result) => {
    let userFound = result.find((userDB) => {
      // console.log(userDB.email, user.email, userDB.password, user.password);

      return userDB.email === user.email && userDB.password === user.password;
    });

    if (userFound) {
      let { _id } = userFound;

      res.json({
        status: 'success',
        userId: _id,
      });
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'Email or Password is incorrect',
      });
    }
  });
});
