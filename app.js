import express from 'express';
import morgan from 'morgan';
import errorHandler from './src/middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(express.static('./src/public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// routes
import userRoute from './src/routes/user.route.js';

app.use('/api/user', userRoute);

// error handler
app.use(errorHandler);

export default app;
