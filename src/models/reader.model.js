import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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
            unique: true,
        },

        readerAvatar: {
            type: String,
            required: true,
            unique: true,
        },

        role: String,

        readerOtp: { type: Number, default: null },
        // verfied: { type: Boolean, default: false }
    },


    { timestamps: true }
);

readerSchema.pre('save', async function (next) {
    if (this.isModified('readerPassword'))
        this.readerPassword = await bcrypt.hash(this.readerPassword, 10);

    next();
});

export default model('Reader', readerSchema)
