//reference: https://www.php.net/manual/en/soapclient.construct.php, https://roytuts.com/how-to-create-and-consume-soap-web-service-using-soapserver-and-soapclient-in-php/,
// https://www.geeksforgeeks.org/how-to-perform-soap-requests-with-node-js/, https://stackoverflow.com/questions/49802327/soap-server-using-node-js,
// https://stackoverflow.com/questions/33062026/soap-server-with-express-js

const express = require('express');
const app = express();
const soap = require('soap');

const partData = new Map();


// SOAP server that takes a part number and returns a price and a delivery date 
const service = {
    PartService: {
        PartPort: {
            GetPartPrice: function (args) {
                const partNumber = args.partNumber;
                // Generate a random price and delivery date
                const price = (Math.random() * 100).toFixed(2);
                const deliveryDate = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();

                return { price: price.toFixed(2), deliveryDate };
            }, InsertPart: function (args) {
                const partNumber = args.partNumber;
                const price = args.price;
                const deliveryDate = args.deliveryDate;

                // Store the new part information in your data storage
                // For example, you can use an array, object, or database to store the data.
                // For demonstration purposes, I'll use a simple object here:
                partData.set(partNumber, { price, deliveryDate });


                return { success: true, message: 'Part information added successfully' };
            }
        }
    }
};


const wsdlPath = 'myservice.wsdl';
// Create SOAP server
soap.listen(app, '/soap', service, wsdlPath);

// Start the server
app.listen(8001, function () {
    console.log('SOAP server listening on port 8001');
});
