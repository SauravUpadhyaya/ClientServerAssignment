const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const soap = require('soap');
const fs = require('fs');
const http = require('http');
// Middleware to parse SOAP request bodies

app.use(bodyParser.json());
const soapClientOptions = {
    forceSoap12Headers: true,
};

// app.use(bodyParser.json());

// In-memory storage for part number, price, and delivery date
const partData = new Map();

// const soapServiceUrl = 'http://soap-server:8001/soap?wsdl';

// // Define a new endpoint
// // Adding a new endpoint to the REST server that uses a SOAP client that calls the Supplier SOAP Server with a part 
// // number and returns the price and delivery date to your client/postman/curl command. 
// app.get('/part/:partNumber', async function (req, res) {
//     const partNumber = req.params.partNumber;

//     // Create a SOAP client
//     soap.createClient(soapServiceUrl, function (err, client) {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         // Call the SOAP service
//         client.GetPartPrice({ partNumber }, function (err, result) {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ error: 'Internal Server Error' });
//             }

//             const price = result.price;
//             const deliveryDate = result.deliveryDate;

//             // Return the price and delivery date to the client
//             res.json({ price, deliveryDate });
//         });
//     });
// });







// REST server endpoint for retrieving part information
app.get('/part/:partNumber', async (req, res) => {
    const partNumber = req.params.partNumber;

    try {
        // Check if part data is already stored in memory
        if (partData.has(partNumber)) {
            const { price, deliveryDate } = partData.get(partNumber);
            res.json({ partNumber, price, deliveryDate });
        } else {
            // Retrieve part information from SOAP server
            const soapClient = await soap.createClientAsync('http://localhost:8001/soap?wsdl', soapClientOptions);
            const response = await soapClient.GetPartPriceAsync({ partNumber });
            const { price, deliveryDate } = response[0];

            // Store part data in memory
            partData.set(partNumber, { price, deliveryDate });

            res.json({ partNumber, price, deliveryDate });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve part information' });
    }
});

// REST server endpoint for inserting part information
app.post('/part', (req, res) => {
    const partNumber = req.body.partNumber;
    const price = req.body.price;
    const deliveryDate = req.body.deliveryDate;

    // Store part data in memory
    partData.set(partNumber, { price, deliveryDate });

    res.json({ success: true, message: 'Part information inserted successfully' });
});










// // REST server endpoint for retrieving all part information
// app.get('/parts', (req, res) => {
//     const parts = [];

//     // Iterate over the partData map and collect all part information
//     for (const [partNumber, { price, deliveryDate }] of partData.entries()) {
//         parts.push({ partNumber, price, deliveryDate });
//     }

//     res.json(parts);
// });

app.get('/parts', async (req, res) => {
    try {
        // Create a SOAP client to retrieve all part information
        const soapClient = await soap.createClientAsync('http://localhost:8001/soap?wsdl', soapClientOptions);
        const response = await soapClient.GetAllPartsAsync();
        const parts = response[0];

        // Return the retrieved part information
        res.json(parts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve part information' });
    }
});


// Start the REST server
app.listen(8000, () => {
    console.log('REST server listening on port 8000');
});