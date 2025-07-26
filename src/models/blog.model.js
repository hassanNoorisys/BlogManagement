import { Schema, model } from 'mongoose';

const blogSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },

    admin: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    images: [
      {
        type: { url: String, alt: String },
        required: true,
      }
    ],

    favouriteCount: Number,

    likeCount: Number,

    dislikeCount: Number,
  },
  { timestamps: true }
);

export default model('blog', blogSchema);
