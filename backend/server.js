const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const { connect } = require('./config/database.js');

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.listen(PORT, async()=>{
    console.log(`Server Started : ${PORT}`);
    await connect();
    console.log('Database connection established');
})



