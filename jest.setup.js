import dotenv from 'dotenv'
dotenv.config({path: '.env.dev'})
import mongoose from "mongoose"

beforeAll(async () => {

    const DB_URL = process.env.DB_URL

    const connection = await mongoose.connect(DB_URL)

    if (connection) console.log('test DB connected')
})

afterAll(async () => {

    await mongoose.connection.close()
})