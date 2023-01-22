import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    fullname: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    roles: 
      {type: String,
      required: true
    },
    avatarUrl: { type: String },
    token: { type: String }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', User);