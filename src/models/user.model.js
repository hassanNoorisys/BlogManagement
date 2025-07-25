import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userModel = new Schema({

    email: {

        type: String,
        required: true,
        unique: true
    },

    password: {

        type: String,
        required: true,
        unique: true
    },

    bio: {

        name: String,
        profile: String,
        avatar: String
    },

    role: {

        type: String,
        enum: ['admin', 'author', 'reader'],
        default: 'reader'
    },

    otp: { type: Number, default: null }

}, { timestamps: true })

userModel.pre('save', async function (next) {

    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 10)

    next()
})

export default model('user', userModel)