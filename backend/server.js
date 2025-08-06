import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connect } from './config/database.js';
import apiroutes from './routes/index.js';
import passport from 'passport';
import { passportAuth } from './config/jwt-middleware.js';

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.use(passport.initialize());
passportAuth(passport);
app.use('/api', apiroutes);

app.listen(PORT, async()=>{
    console.log(`Server Started : ${PORT}`);
    await connect();
    console.log('Database connection established');
})



