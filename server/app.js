require('dotenv').config()
const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/',routes)

let ports = process.env.PORT || 3000

app.listen(ports, console.log("I'm listeniiiing"))