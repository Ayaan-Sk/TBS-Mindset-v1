const WA = require('./twilio');
require('dotenv').config();

const args = process.argv.slice(2);
const targetPhone = args[0];

if (!targetPhone) {
    console.error("\n❌ Please provide a destination phone number (with country code, e.g. 918779171731).\n");
    console.log("Usage: node test-send.js <phone_number>");
    process.exit(1);
}

console.log(`\n🚀 Sending test WhatsApp message to: +${targetPhone}`);
console.log(`Using Twilio From number: ${process.env.TWILIO_WHATSAPP_FROM}\n`);

WA.sendText("Hello! This is a test message from your newly integrated Twilio WhatsApp bot. 🤖🚀", targetPhone)
    .then(result => {
        if (result.success) {
            console.log("\n✅ Success! Message sent successfully.");
            console.log(`Twilio Message SID: ${result.sid}\n`);
        } else {
            console.error("\n❌ Failed to send message.");
            console.error(`Error: ${result.error}\n`);
            console.log("Tip: If using Twilio Sandbox, make sure you have joined the sandbox first by texting the join keyword (e.g. 'join sandbox-keyword') to the Twilio WhatsApp number.");
        }
    })
    .catch(err => {
        console.error("\n❌ Exception occurred:", err);
    });
