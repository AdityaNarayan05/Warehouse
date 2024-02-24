const express = require('express');
const app = express();
const port = 3002;
var  bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies


const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds =require('./secret-key.json');

const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

async function accessSpreadsheet() {
    const doc = new GoogleSpreadsheet("11u1WAtPnyHL05Q1ofu5YIIzCRJaS2a42i8jSC6Ib6C4", serviceAccountAuth);
    await doc.loadInfo();
    // console.log(doc.title);

    const sheet = doc.sheetsByIndex[0];
    const HEADER=['ID','Avatar Name','Performance Score'];
    await sheet.setHeaderRow(HEADER);

    let dataArray=[
        {'ID':1,'Avatar Name':'Test 1', 'Performance Score':'8'},
        {'ID':2,'Avatar Name':'Test 2', 'Performance Score':'9'},
        {'ID':3,'Avatar Name':'Test 3 ', 'Performance Score':'6'},
        {'ID':4,'Avatar Name':'Test 4', 'Performance Score':'5'},
        {'ID':5,'Avatar Name':'Test 5', 'Performance Score':'4'},
        {'ID':6,'Avatar Name':'Test 6 ', 'Performance Score':'3'},
        {'ID':7,'Avatar Name':'Test 7', 'Performance Score':'2'},
        {'ID':8,'Avatar Name':'Test 8', 'Performance Score':'1'}
    ]

    await sheet.addRows(dataArray);
    const rows = await sheet.getRows();

    if (rows.length) {
        console.log('Data:');
        rows.forEach(row => {
            console.log(row._rawData);
        });
        return JSON.parse(rows); // Return the rows
    } else {
        console.log('No data found.');
        return null;
    }
}

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
