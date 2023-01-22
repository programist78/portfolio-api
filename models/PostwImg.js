import mongoose from 'mongoose';

const PostwImg = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: true,
    },
    text: {
      type: String,
    },
    images: {},
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('postwimg', PostwImg);