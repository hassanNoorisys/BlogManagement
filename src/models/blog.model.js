import { Schema, model, Types } from 'mongoose';

const blogSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Author',
        },

        admin: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
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
            },
        ],

        favouriteCount: Number,

        likeCount: Number,

        dislikeCount: Number,

        likedBy: [{ type: Types.ObjectId, ref: 'reader' }],

        disLikedBy: [{ type: Types.ObjectId, ref: 'reader' }],

        favouritedBy: [{ type: Types.ObjectId, ref: 'reader' }],

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default model('blog', blogSchema);
