const axios = require('axios');

// Function to get part information using REST API
async function getPartInformationREST(partNumber) {
    try {
        const response = await axios.get(`http://localhost:8000/part/${partNumber}`);
        return response.data;
    } catch (error) {
        console.error(error.response.data);
        throw new Error('Failed to retrieve part information from the REST server.');
    }
}

// Function to get part information using SOAP API
const soap = require('soap');

async function getPartInformationSOAP(partNumber) {
    const soapClientOptions = {
        endpoint: 'http://localhost:8001/soap',
        timeout: 5000,
    };
    try {
        const soapClient = await soap.createClientAsync('http://localhost:8001/soap?wsdl', soapClientOptions);
        const response = await soapClient.GetPartPriceAsync({ partNumber });
        const { price, deliveryDate } = response[0];
        return { partNumber, price, deliveryDate };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve part information from the SOAP server.');
    }
}


async function main() {
    const partNumber = 'PART-2';

    try {
        // Get part information using REST API
        const restData = await getPartInformationREST(partNumber);
        console.log('Part Information (REST):', restData);

        // Get part information using SOAP API
        const soapData = await getPartInformationSOAP(partNumber);
        console.log('Part Information (SOAP):', soapData);

    } catch (error) {
        console.error(error.message);
    }
}

main();
