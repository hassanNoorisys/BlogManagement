import { Schema } from 'mongoose';

const userModel = new Schema(
    {},

    { timestamps: true }
);

const readerModel = userModel.discriminator('Reader', userModel)

export default readerModel
