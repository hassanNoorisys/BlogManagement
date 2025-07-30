import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {

    try {

        const DB_URL = process.env.DB_URL;
        const connection = await mongoose.connect(DB_URL);

        if (connection) console.log('database connected');
    } catch (error) {
        console.log(error)
        logger.error('Something wron with database connection', { stack: error.stack })
    }
};

export default connectDB;
