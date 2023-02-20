import mongoose from 'mongoose';

const ImageUpload = new mongoose.Schema(
  {
    filename: {
        type: String,
      // required: true,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('imageupload', ImageUpload);