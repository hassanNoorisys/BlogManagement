import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userModel = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
            unique: true,
        },

        name: {
            type: String,
            required: true,
            unique: true,
        },

        avatar: {
            type: String,
            required: true,
            unique: true,
        },

        otp: { type: Number, default: null },
        verfied: { type: Boolean, default: false }

    },

    { timestamps: true }
);

userModel.pre('save', async function (next) {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 10);

    next();
});

export default model('user', userModel);
