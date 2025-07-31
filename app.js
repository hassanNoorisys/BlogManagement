import dotenv from 'dotenv'
dotenv.config({ path: '.env.dev' });
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(express.static('./src/public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// routes
import readerRoute from './src/routes/reader.routes.js';
import adminRoute from './src/routes/admin.route.js';
import blogRoute from './src/routes/blog.route.js';
import authorRoute from './src/routes/author.route.js';
import userRoute from './src/routes/user.route.js';

app.use('/api/reader', readerRoute);
app.use('/api/author', authorRoute);
app.use('/api/admin', adminRoute);
app.use('/api/blog', blogRoute);
app.use('/api/user', userRoute);

// error handler
import errorHandler from './src/middleware/errorHandler.js';

app.use(errorHandler);

export default app;
