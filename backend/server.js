require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')

const app = express()
connectDB()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileupload({
    useTempFiles: true
}))

//Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/catRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/postRouter'))



const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log('Server is running on port', PORT)
})