const express = require('express');
const app = express();
const port = 5000;
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(express.json());


const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('./secret-key.json');

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
    // const HEADER = ['ID', 'Avatar Name', 'Performance Score'];
    // await sheet.setHeaderRow(HEADER);

    const rows = await sheet.getRows();
    const header = sheet.headerValues;
    // console.log(header);

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
    // console.log(jsonString);

    if (rows.length) {
        // console.log('Data:');
        // rows.forEach(row => {
        //     console.log(row._rawData);
        // });
        return jsonString; // Return the rows
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

app.post('/addRow', async (req, res) => {
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
    const doc = new GoogleSpreadsheet("11u1WAtPnyHL05Q1ofu5YIIzCRJaS2a42i8jSC6Ib6C4", serviceAccountAuth);
    await doc.loadInfo();
    // console.log(doc.title);

    const sheet = doc.sheetsByIndex[0];
    await sheet.addRows(dataArray);
    res.status(201).json({ message: 'Post created successfully' });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});