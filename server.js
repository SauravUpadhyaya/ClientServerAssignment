// Referennce: https://www.sqlitetutorial.net/sqlite-create-table/

const express = require('express');              // framework for Node.js, which is used to create server and handle HTTP requests.
const bodyParser = require('body-parser');       // middleware module for Express that parses incoming request bodies in JSON foramt
const sqlite3 = require('sqlite3').verbose();    // A Node.js package that provides an interface to interact with SQLite database.
const soap = require('soap');
const app = express();                           //creating an instance of the Express application and assigning it to the variable 'app' object, which represents the web server. 
app.use(bodyParser.json());                      // configuring the Express application to use the 'body-parser' middleware with json() method.

// Connect to the SQLite database
const db = new sqlite3.Database('./cars.db');

// Creating the 'cars' table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vin VARCHAR(17),
    plateNumber TEXT,
    state TEXT,
    make TEXT,
    model TEXT,
    year INTEGER,
    ownersName TEXT,
    ownersAddress TEXT,
    DLNumber TEXT,
    problemDescription TEXT,
    timeInShop TEXT,
    workerNames TEXT
)`);

// Endpoint: POST /cars
// Adding a new car to the shop
app.post('/cars', (req, res) => {
    const newCar = req.body;

    // Insert the new car into the 'cars' table
    db.run('INSERT INTO cars (vin, plateNumber, state, make, model, year, ownersName, ownersAddress, DLNumber, problemDescription, timeInShop, workerNames) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [newCar.vin, newCar.plateNumber, newCar.state, newCar.make, newCar.model, newCar.year, newCar.ownersName, newCar.ownersAddress, newCar.DLNumber, newCar.problemDescription, newCar.timeInShop, newCar.workerNames], function (err) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                newCar.id = this.lastID;
                console.log('New car added:', newCar);
                res.status(201).json(newCar);
            }
        });
});

// Endpoint: PUT /cars/:id
// Updating a car in the shop
app.put('/cars/:id', (req, res) => {
    const carId = req.params.id;
    const updatedCar = req.body;

    // Update the car with the given ID in the 'cars' table
    db.run('UPDATE cars SET vin = ? , plateNumber = ?, state = ?, make = ?, model = ?, year = ?, ownersName = ?, ownersAddress = ?, DLNumber = ?, problemDescription = ?, timeInShop = ?, workerNames = ? WHERE id = ?',
        [updatedCar.vin, updatedCar.plateNumber, updatedCar.state, updatedCar.make, updatedCar.model, updatedCar.year, updatedCar.ownersName, updatedCar.ownersAddress, updatedCar.DLNumber, updatedCar.problemDescription, updatedCar.timeInShop, updatedCar.workerNames, carId], function (err) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else if (this.changes === 0) {
                res.sendStatus(404);
            } else {
                console.log('Car updated:', updatedCar);
                res.status(200).json(updatedCar);
            }
        });
});

// Endpoint: GET /cars/:id
// Fetching a car 
app.get('/cars/:id', (req, res) => {
    const carId = req.params.id;

    // Retrieve the car with the given ID from the 'cars' table
    db.get('SELECT vin, plateNumber, state, make, model, year, ownersName, ownersAddress, DLNumber,  problemDescription, timeInShop, workerNames FROM cars WHERE id = ?', [carId], (err, row) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else if (row) {
            console.log('Car retrieved:', row);
            res.json(row);
        } else {
            res.sendStatus(404);
        }
    });
});

// Endpoint: GET /cars
// Retreiving all cars 
app.get('/cars', (req, res) => {
    // Retrieve all cars from the 'cars' table
    db.all('SELECT vin, plateNumber, state, make, model, year, ownersName, ownersAddress, DLNumber, problemDescription, timeInShop, workerNames FROM cars', (err, rows) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            console.log('All cars retrieved:', rows);
            res.json(rows);
        }
    });
});

// Endpoint: DELETE /cars/:id
// Deleting a car from cars db
app.delete('/cars/:id', (req, res) => {
    const carId = req.params.id;

    // Delete the car with the given ID from the 'cars' table
    db.run('DELETE FROM cars WHERE id = ?', [carId], function (err) {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else if (this.changes === 0) {
            res.sendStatus(404);
        } else {
            console.log('Car deleted:', { id: carId });
            res.json({ id: carId });
        }
    });
});

const port = 3000; // server listens incoming requests on the port (3000) 
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
