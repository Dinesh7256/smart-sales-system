import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connect } from './config/database.js';
import apiroutes from './routes/index.js';
import passport from 'passport';
import { passportAuth } from './config/jwt-middleware.js';
import cors from 'cors';
// import productSchema from './models/product.js';
// import sendBasicMail from './service/email-service.js';  

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use(passport.initialize());
passportAuth(passport);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Smart Sales System API is running!', status: 'healthy' });
});

app.use('/api', apiroutes);

app.listen(PORT, async()=>{
    console.log(`Server Started : ${PORT}`);
    await connect(); // Connect to database when server starts

    // sendBasicMail('smartsales634@gmail.com', 'namrata99sb@gmail.com', 'This is testing email from your project', 'hello namrata I had implemented email service in our projectn');
//     var email = {
//     to: ['dineshkumar61175@gmail.com', '22cse598.dineshkumar@giet.edu'],
//     from: 'smartsales634@gmail.com',
//     subject: 'sending mail using sendgrid',
//     text: 'This is the testing mail using sendgrid',
//     html: '<b>smart-sales-service</b>'
// };

// sender.sendMail(email, function(err, res) {
//     if (err) {
//         console.log(err)
//     }
//     console.log(res);
// });

    await connect();
    console.log('Database connection established');
    // const product = new productSchema({
    //     productName: 'Sample Product',
    //     costPrice: 100,
    //     sellingPrice: 150,
    //     quantityInStock: 50,
    //     ownerId: '689c59801f58424fed98f3ab'
    // });

    // await product.save();
    // console.log('Sample product created')


})



