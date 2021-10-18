import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

import User from './models/userModel.js';
import Event from './models/eventModel.js';

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
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.get('/', (req, res) => res.send('API is running...'));

// POST: create event
app.post('/user/event/', (req, res) => {
  const event = req.body;

  const newEvent = new Event(event);

  newEvent.save().then((result) => {
    res.json(result);
  });
});

// GET: all events based on creatorID
app.get('/user/events/:id', async (req, res) => {
  const userID = req.params.id;

  await Event.find({ creatorID: userID }).then((response) => {
    res.json(response);
  });
});

// GET: all events
app.get('/events/', async (req, res) => {
  await Event.find({}).then((response) => {
    res.json(response);
  });
});

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

// GET single user by id
app.get('/user/:id', async (req, res) => {
  await User.find({ _id: req.params.id }).then((response) => {
    res.json(response[0]);
  });
});

// PUT add player to event based on eventID and player/userID
app.put('/user/event/', async (req, res) => {
  const eventID = req.body.event;
  const userID = req.body.user;

  const eventPlayers = await Event.findById(eventID)
    .then((response) => {
      return response._doc.players;
    })
    .catch((err) => console.log('evento error'));

  const playerDetails = await User.findById(userID);

  // adding new Player to Event
  let playerExist = false;

  eventPlayers.forEach((item) => {
    if (item.playerID === userID) {
      playerExist = true;
    }
  });

  if (playerExist) {
    const newPlayers = eventPlayers.filter((player) => {
      return player.playerID !== userID;
    });

    Event.findByIdAndUpdate(
      { _id: eventID },
      { players: newPlayers },
      (err, response) => {
        if (err) console.log('err');
        if (response) {
          res.json({ status: 'removed' });
        }
      }
    );
  } else {
    eventPlayers.push({ playerID: userID, username: playerDetails.username });

    Event.findByIdAndUpdate(
      { _id: eventID },
      { players: eventPlayers },
      (err, response) => {
        if (err) console.log('err');
        if (response) {
          res.json({ status: 'joined' });
        }
      }
    );
  }
});

// PUT change game status
app.put('/user/event/status/', async (req, res) => {
  const eventID = req.body.event;
  const status = req.body.status;

  await Event.findByIdAndUpdate({ _id: eventID }, { status: status })
    .then((response) => {
      res.json({ message: 'success', newStatus: status });
    })
    .catch((err) => {
      res.json(err);
    });
});

// DELETE event
app.delete('/user/event/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ status: 'success' });
    }
  });
});
