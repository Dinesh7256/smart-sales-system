const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')


dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.listen(PORT, async()=>{
    console.log(`Server Started : ${PORT}`);
})



