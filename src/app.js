const express = require('express')
const mongoose = require('mongoose')
const {config} = require('dotenv')
const bodyParser = require('body-parser')
config();

const bookRoutes = require('./routes/book.routes')

//Usamos exprres pra los middlewares
const app = express();
//para recibir el contenigo para post
app.use(bodyParser.json())


//conectar a bd
mongoose.connect(process.env.MONGO_URL,{dbName:process.env.MONGO_DB_NAME})
const db = mongoose.connection;

app.use('/books',bookRoutes)

const port = process.env.PORT || 300;


app.listen(port,()=>{
    console.log("servidor iniciado en el puerto " + port)
})