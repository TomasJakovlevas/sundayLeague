import mongoose from 'mongoose';
import User from './models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    let user = {
      username: 'garbanelius',
      email: 'tomas@one.lt',
      password: '123',
      profilePic: 'hi',
    };

    User.insertMany(user);

    console.log('Completed');
  });
