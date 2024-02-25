// Importing necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Loading service account credentials
const creds = require('./secret-key.json');

// Configuring Express app
const app = express();
const port = 5000;

// Middleware for parsing JSON-encoded bodies
app.use(bodyParser.json());
app.use(express.json());

// Creating JWT instance for Google Sheets API authentication
const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

// Function to access Google Spreadsheet data
async function accessSpreadsheet() {
    try {
        const doc = new GoogleSpreadsheet(creds.Sheet_ID, serviceAccountAuth);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        const header = sheet.headerValues;

        const jsonData = [
            {
                rowNumber: 1,
                rowData: header
            },
            ...rows.map(row => ({
                rowNumber: row._rowNumber,
                rowData: row._rawData
            }))
        ];

        const jsonString = JSON.stringify(jsonData, null, 2);

        if (rows.length) {
            return jsonString; // Return the rows
        } else {
            console.log('No data found.');
            return null;
        }
    } catch (error) {
        console.error('Error accessing spreadsheet:', error.message);
        throw error;
    }
}

// Endpoint to get data from the spreadsheet
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

// Endpoint to add a new row to the spreadsheet
app.post('/addRow', async (req, res) => {
    try {
        const { avatarName, performanceScore } = req.body;

        console.log('Received data:', { avatarName, performanceScore });
        const rows = await accessSpreadsheet();
        const lastItem = JSON.parse(rows).slice(-1)[0];
        const header = JSON.parse(rows)[0];
        const headerValues = header.rowData;
        const lastValue = lastItem.rowData[0];
        const nextValue = parseInt(lastValue) + 1;

        let dataArray = [
            {
                [headerValues[0]]: nextValue,
                [headerValues[1]]: avatarName,
                [headerValues[2]]: performanceScore,
            },
        ];

        const doc = new GoogleSpreadsheet(creds.Sheet_ID, serviceAccountAuth);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        await sheet.addRows(dataArray);

        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Error adding row to spreadsheet:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});