const express = require('express')
const key = require('./config/key')
const stripe = require('stripe')(key.stripeSecretKey);
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')

const app = express();

//Handlebars Middleware - for template
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//bodyParser Middleware - 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set static folder - for storing images
app.use(express.static(`${__dirname}/public`));


//Index Route
app.get('/',(req, res)=>{
res.render('index', {
    stripePublishableKey = key.stripePublishableKey
});
});


//success message routes

// app.get('/success',(req, res)=>{
//     res.render('success')
//     });

// Routes for Payment

app.post('/charge',(req,res)=>{
const amount=250

stripe.customers.create({
    email:req.body.stripeEmail,
    source:req.body.stripeToken
})
.then(customer=> stripe.charges.create({
    amount,
    description:'Web Development Book',
    currency:'USD',
    customer:customer.id
}))
.then(charge => res.render('success'));
})

const port = process.env.PORT || 5000;

app.listen(port,() =>{
    console.log('server started on port 5000')
})