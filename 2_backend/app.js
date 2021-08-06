import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

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
