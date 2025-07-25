import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.connect.js";
dotenv.config({path: '.env.dev'})


const PORT = process.env.PORT
app.listen(PORT, () => {

    console.log(`Server is up at ${PORT}`)
    connectDB()
})