import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new Schema(
    {
        adminEmail: {
            type: String,
            required: true,
            unique: true,
        },

        adminPassword: {
            type: String,
            required: true,
            unique: true,
        },

        adminName: {
            type: String,
            required: true,
            unique: true,
        },

        adminAvatar: {
            type: String,
            required: true,
            unique: true,
        },

        adminOtp: { type: Number, default: null },
        // verfied: { type: Boolean, default: false

        role: String,
    },
    { timestamps: true }
);

adminSchema.pre('save', async function (next) {
    if (this.isModified('adminPassword'))
        this.adminPassword = await bcrypt.hash(this.adminPassword, 10);

    next();
});

export default model('Admin', adminSchema);
