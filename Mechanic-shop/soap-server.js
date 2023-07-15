const express = require('express');
const app = express();
const soap = require('soap');



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
