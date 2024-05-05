//Express Setup
const express = require('express');
const bodyParser = require('body-parser');

// Create an instance of Express
const app = express();

// Middleware to parse incoming data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define route to handle GET requests for serving the order form page
app.get('/order-form', (req, res) => {
    res.send('<h1>Order Form</h1><form action="/process-order" method="post"><label for="item">Item:</label><input type="text" id="item" name="item"><button type="submit">Submit Order</button></form>');
});

// Define route to handle POST requests for processing order form data
app.post('/process-order', (req, res) => {
    // Defined the item prices
    const itemPrices = {
        "Loaded Nachos": 8.70,
        "Dinner Rolls": 6.10,
        "Pizza": 10.60,
        "Stir-Fry": 12.90,
        "Cookies": 3.20,
        "Brownies": 3.60,
        "Water": 1.50,
        "Fountain Drink": 2.00,
    };

    // Initialize total and errorMessages
    let total = 0;
    let errorMessages = [];

    // Validate quantities and calculated the total
    for (const item in req.body) {
        if (req.body.hasOwnProperty(item) && item !== 'item') {
            const quantity = parseInt(req.body[item]);
            if (isNaN(quantity) || quantity < 0 || quantity > 5) {
                errorMessages.push('Invalid quantity for ${item}. Quantity must be a positive number between 0 and 5.');
            } else {
                total += quantity * itemPrices[item];
            }
        }
    }

    if (errorMessages.length > 0) {
        // Send error messages if any validation fails
        res.status(400).send({ errors: errorMessages });
    } else {
        // Send total amount if validation all the tests passes
        res.send({ total: total });
    }
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});