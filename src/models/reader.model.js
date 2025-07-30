import { model, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ref } from 'process';

const readerSchema = new Schema(
    {
        readerEmail: {
            type: String,
            required: true,
            unique: true,
        },

        readerPassword: {
            type: String,
            required: true,
            unique: true,
        },

        readerName: {
            type: String,
            required: true,
        },

        readerAvatar: {
            type: String,
            required: true,
            unique: true,
        },

        role: String,

        readerOtp: { type: Number, default: null },

        // verfied: { type: Boolean, default: false }

        favouriteBlog: [
            {
                type: Types.ObjectId,
                ref: 'blog',
                required: true,
            },
        ],

        likedBlog: [
            {
                type: Types.ObjectId,
                ref: 'blog',
                required: true,
            },
        ],

        dislikedBlog: [
            {
                type: Types.ObjectId,
                ref: 'blog',
                required: true,
            },
        ],
    },

    { timestamps: true }
);

readerSchema.pre('save', async function (next) {
    if (this.isModified('readerPassword'))
        this.readerPassword = await bcrypt.hash(this.readerPassword, 10);

    next();
});

export default model('Reader', readerSchema);
