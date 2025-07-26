import { Schema, Types } from 'mongoose';

import userModel from './user.model';

const adminSchema = new Schema(

    {

        admin: {
            type: Types.ObjectId,
            required: true,
            ref: 'user'
        },

        role: 'admin'

    },
    { timestamps: true }
);

const adminModel = userModel.discriminator('Admin', adminSchema)

export default adminModel
