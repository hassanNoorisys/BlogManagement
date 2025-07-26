import mongoose from 'mongoose';

const connectDB = async () => {
    const DB_URL = process.env.DB_URL;
    const connection = await mongoose.connect(DB_URL);

    if (connection) console.log('database connected');
};

export default connectDB;
