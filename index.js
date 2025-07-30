import app from './app.js';
import connectDB from './src/config/db.connect.js';


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is up at ${PORT}`);
    connectDB();
});
