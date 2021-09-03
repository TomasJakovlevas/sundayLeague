import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  profilePic: {
    type: String,
    required: false,
  },
});

const User = mongoose.model('user', userSchema);
export default User;
