// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('./secret-key.json');

// Set up Express app
const app = express();
const port = 3002;

// Middleware for parsing JSON-encoded bodies
app.use(bodyParser.json());

// Create JWT for Google Sheets API authentication
const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Async function to access Google Spreadsheet
async function accessSpreadsheet() {
    try {
        // Load Google Spreadsheet
        const doc = new GoogleSpreadsheet("11u1WAtPnyHL05Q1ofu5YIIzCRJaS2a42i8jSC6Ib6C4",serviceAccountAuth);
        await doc.loadInfo();

        // Access the first sheet
        const sheet = doc.sheetsByIndex[0];

        // Define header row
        const HEADER = ['ID', 'Avatar Name', 'Performance Score'];
        await sheet.setHeaderRow(HEADER);

        // Sample data array
        let dataArray = [
            { 'ID': 1, 'Avatar Name': 'Test 1', 'Performance Score': '8' },
            { 'ID': 2, 'Avatar Name': 'Test 2', 'Performance Score': '9' },
            { 'ID': 3, 'Avatar Name': 'Test 3 ', 'Performance Score': '6' },
            { 'ID': 4, 'Avatar Name': 'Test 4', 'Performance Score': '5' },
            { 'ID': 5, 'Avatar Name': 'Test 5', 'Performance Score': '4' },
            { 'ID': 6, 'Avatar Name': 'Test 6 ', 'Performance Score': '3' },
            { 'ID': 7, 'Avatar Name': 'Test 7', 'Performance Score': '2' },
            { 'ID': 8, 'Avatar Name': 'Test 8', 'Performance Score': '1' }
        ];

        // Add data to the sheet
        await sheet.addRows(dataArray);

        // Retrieve rows from the sheet
        const rows = await sheet.getRows();

        // Format rows into JSON
        const jsonData = rows.map(row => ({
            rowNumber: row._rowNumber,
            rowData: row._rawData
        }));

        const jsonString = JSON.stringify(jsonData, null, 2);
        console.log(jsonString);

        if (rows.length) {
            console.log('Data:');
            rows.forEach(row => {
                console.log(row._rawData);
            });
            return jsonString; // Return the rows
        } else {
            console.log('No data found.');
            return null;
        }
    } catch (error) {
        console.error('Error accessing spreadsheet:', error.message);
        throw error; // Re-throw the error for handling in the calling function
    }
}

// Define endpoint to access the Google Spreadsheet data
app.get("/sheet", async (req, res) => {
    try {
        const rows = await accessSpreadsheet();
        if (rows) {
            res.status(200).send(rows); // Send the rows in the response
        } else {
            res.status(404).json({ error: 'No data found' });
        }
    } catch (error) {
        console.error('Error accessing spreadsheet:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});