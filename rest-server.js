//reference: https://www.php.net/manual/en/soapclient.construct.php, https://roytuts.com/how-to-create-and-consume-soap-web-service-using-soapserver-and-soapclient-in-php/,
// https://www.geeksforgeeks.org/how-to-perform-soap-requests-with-node-js/, https://stackoverflow.com/questions/49802327/soap-server-using-node-js,
// https://stackoverflow.com/questions/33062026/soap-server-with-express-js


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const soap = require('soap');
const fs = require('fs');
const http = require('http');

app.use(bodyParser.json());
const soapClientOptions = {
    forceSoap12Headers: true,
};

// In-memory storage for part number, price, and delivery date
const partData = new Map();


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

// Start the REST server
app.listen(8000, () => {
    console.log('REST server listening on port 8000');
});