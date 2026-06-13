<<<<<<< HEAD
const request = require('request-promise');
const WA = require('./wati');
const us = require('./update');
const Airtable = require('airtable');
require('dotenv').config();

const base = new Airtable({ apiKey: process.env.PERSONAL_ACCESS_TOKEN }).base(process.env.BASE_ID);

=======
const WA = require('./twilio');
const us = require('./update');
const db = require('./db');
require('dotenv').config();
>>>>>>> 118c424 (new code)

async function sendMediaFile(cDay, cModule, number) {
    try {
        const course_tn = await us.findTable(number);
        const [rows] = await db.query(
            `SELECT file_url, file_name 
             FROM course_content 
             WHERE course_name = ? AND day_number = ? AND module_number = ?`,
            [course_tn, cDay, cModule]
        );

        if (rows && rows.length > 0) {
            const { file_url, file_name } = rows[0];
            if (file_url) {
                console.log(`[DB Media] Forwarding media to +${number}: ${file_name}`);
                await WA.sendMedia(file_url, file_name, number);
            }
        } else {
            console.log("No media in this module");
        }
    } catch (error) {
        console.error("Error in sendMediaFile:", error);
    }
}

async function sendMediaFile_v2(index, cDay, cModule, number) {
    // For the unified MySQL schema, files are stored as a direct URL link (single file),
    // so the index parameter behaves as a direct send.
    return sendMediaFile(cDay, cModule, number);
}

module.exports = { sendMediaFile, sendMediaFile_v2 };
