require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('./credentials.json');

const SHEET_ID = '1lgseUbeKdmu4jb-lG0TeDnYt6n5Bs2Ezv8nhHGVGzCc';

async function logToSheet(results) {
    const serviceAccountAuth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    let sheet = doc.sheetsByIndex[0];

    await sheet.setHeaderRow(['name', 'subject', 'message', 'status', 'date']);

    for (const r of results) {
        await sheet.addRow({
            name: r.name,
            subject: r.subject,
            message: r.message,
            status: r.status,
            date: new Date().toISOString(),
        });
    }

    console.log('Logged all results to Google Sheet!');
}

module.exports = { logToSheet };