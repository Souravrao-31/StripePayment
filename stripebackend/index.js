const express = require("express")
const cors    = require('cors')
const stripe  = require('stripe')('sk_test_51GpHCyBp6Sg6xugwTIwytrGD7udKVfylSjpUkLO1n7Mx1jjwqWgs4iA7WOs1aNWgWIKV90jUfjgySLEEHVry868k00lcaQ3CyZ')

const { v4: uuidv4 } = require('uuid');

const app     = express();


//middleware
app.use(express.json());
app.use(cors());

//routes
app.get('/', (req,res) => {
    res.send("Backend Is Working......")
})

app.post("/payment", (req,res) => {

    const {product, token} = req.body;
    console.log("PROJECT ", product);
    console.log("PRICE ", product.price);
    const idempontencykey = uuid();   //so we don't charge user again

   return stripe.customers.create({
       email: token.email,
       source: token.id
   }).then(customer => {
       stripe.charges.create(
        {
            amount: product.price  * 100,
            currency : 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping :{
                name : token.card.name,
                address: {
                    country : token.card.address_country
             }
        }
     }, {idempontencykey})

   }).then(result => res.status(200).json(result))
     .catch(err => console.log(err) )

});


//listeners
app.listen(8282, () => console.log("Listening at Port 8282"))