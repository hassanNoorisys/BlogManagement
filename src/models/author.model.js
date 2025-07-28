import { model, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

const authorSchema = new Schema(

    {
        authorEmail: {
            type: String,
            required: true,
            unique: true,
        },

        authorPassword: {
            type: String,
            required: true,
            unique: true,
        },

        authorName: {
            type: String,
            required: true,
            unique: true,
        },

        authorAvatar: {
            type: String,
            required: true,
            unique: true,
        },

        bio: {
            type: String,
        },

        role: String,
        
        authorOtp: { type: Number, default: null },
        // verfied: { type: Boolean, default: false
    },

    { timestamps: true }
);


authorSchema.pre('save', async function (next) {
    if (this.isModified('authorPassword'))
        this.authorPassword = await bcrypt.hash(this.authorPassword, 10);

    next();
});

export default model('Author', authorSchema); 
