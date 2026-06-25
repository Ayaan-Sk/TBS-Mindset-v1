const db = require('./db');
const test = require('./test');
require('dotenv').config();

const args = process.argv.slice(2);
const targetPhone = args[0];

if (!targetPhone) {
    console.error("\n❌ Please provide your destination phone number (with country code, e.g. 918779171731).\n");
    console.log("Usage: node test-flow.js <phone_number>");
    process.exit(1);
}

async function run() {
    console.log(`\n🚀 Initializing chatbot flow for: +${targetPhone}`);
    
    try {
        // 1. Check if student exists, if so reset their progress, if not create them.
        const [existing] = await db.query('SELECT * FROM students WHERE phone = ?', [targetPhone]);
        if (existing.length === 0) {
            await db.query(
                `INSERT INTO students (phone, name, course, next_day, day_completed, next_module, module_completed) 
                 VALUES (?, ?, ?, 1, 0, 1, 0)`,
                [targetPhone, 'Learner', 'Mindset']
            );
            console.log(`✅ Registered new student +${targetPhone} in database.`);
        } else {
            await db.query(
                `UPDATE students 
                 SET next_day = 1, day_completed = 0, next_module = 1, module_completed = 0, 
                     last_msg = NULL, question_responses = NULL, responses = NULL, 
                     interactive_responses = NULL, feedback = NULL 
                 WHERE phone = ?`,
                [targetPhone]
            );
            console.log(`✅ Reset progress for student +${targetPhone} in database.`);
        }

        // 2. Trigger sendModuleContent to start the Day 1 flow (sends the first message)
        console.log(`\n📤 Triggering "Start Day" message to +${targetPhone}...`);
        await test.sendModuleContent(targetPhone);
        console.log("\n✅ Done! The initial course message has been sent to your WhatsApp.");
        console.log("Tip: Reply with 'Next.' on WhatsApp when prompted to progress to the next module.\n");
    } catch (e) {
        console.error("\n❌ Error running flow setup:", e);
    }
    process.exit(0);
}

run();
