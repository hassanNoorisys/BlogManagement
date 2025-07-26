import { Schema, Types } from 'mongoose';
import userModel from './user.model';

const authorSchema = new Schema(

    {

        auhtor: {
            type: Types.ObjectId,
            required: true,
            ref: 'user'
        },

        bio: {
            type: String,
            required: true,
        },

        role: 'author'
    },
    { timestamps: true }
);

const authorModel = userModel.discriminator('Author', authorSchema);

export default authorModel 
