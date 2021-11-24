import mongoose from 'mongoose';
const { Schema } = mongoose;

const eventSchema = new Schema({
  creatorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },

  numberOfPlayers: {
    type: Number,
    required: true,
  },

  players: {
    type: Array,
    default: [],
  },

  status: {
    type: String,
    default: 'ongoing',
  },

  comment: {
    type: String,
    required: false,
  },
});

const Event = mongoose.model('event', eventSchema);
export default Event;
