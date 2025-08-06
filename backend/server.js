import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connect } from './config/database.js';
import apiroutes from './routes/index.js';
// import passport, { use } from 'passport';
// import User from './models/user.js';

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// app.use(passport.initialize());

app.use('/api', apiroutes);

app.listen(PORT, async()=>{
    console.log(`Server Started : ${PORT}`);
    await connect();
    console.log('Database connection established');

    // const user = new User({
    //     businessName: 'shobha kirana store',
    //     email: 'shobhakiranastore@gmail.com',
    //     password: 'password123'
    // });

    // await user.save();
    // console.log('User created:', user);
})



