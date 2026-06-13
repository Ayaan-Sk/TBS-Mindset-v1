const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
    console.log("🚀 Starting database initialization & seeding...");

    try {
        // 0. Ensure the database itself exists by connecting without specifying DB name first
        const tempConn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });
        const dbName = process.env.DB_NAME || 'chatbot_db';
        await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database '${dbName}' verified/created.`);
        await tempConn.end();

        // Now safe to load the main connection pool since the database is guaranteed to exist
        const db = require('./db');

        // 1. Read and execute schema.sql to create tables
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon, filter out empty queries
        const queries = schemaSql
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log(`Executing ${queries.length} table creation queries...`);
        for (const query of queries) {
            await db.query(query);
        }
        console.log("✅ Tables verified/created successfully.");

        // 2. Seed a test student (using the user's verified phone number)
        const testPhone = '918007574169';
        const [existingStudent] = await db.query('SELECT * FROM students WHERE phone = ?', [testPhone]);
        
        if (existingStudent.length === 0) {
            await db.query(
                `INSERT INTO students (phone, name, course, next_day, day_completed, next_module, module_completed) 
                 VALUES (?, ?, ?, 1, 0, 1, 0)`,
                [testPhone, 'Learner', 'Mindset']
            );
            console.log(`✅ Test student +${testPhone} registered in database.`);
        } else {
            console.log(`ℹ️ Test student +${testPhone} already exists. Skipping.`);
        }

        // 3. Seed Course Content for 'Mindset' Course
        const courseName = 'Mindset';
        const contentSeeds = [
            // Day 1 Modules
            {
                course_name: courseName,
                day_number: 1,
                module_number: 1,
                module_text: "Welcome to Day 1 of the Mindset Course! 🧠\n\nToday, we are going to explore the difference between a Fixed Mindset and a Growth Mindset.",
                list_title: null,
                list_options: null,
                ibody: null,
                ibuttons: null,
                question: null,
                correct_answer: null,
                file_url: null,
                file_name: null
            },
            {
                course_name: courseName,
                day_number: 1,
                module_number: 2,
                module_text: "Check out this growth mindset image!",
                list_title: null,
                list_options: null,
                ibody: null,
                ibuttons: null,
                question: null,
                correct_answer: null,
                file_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
                file_name: "mindset.jpg"
            },
            {
                course_name: courseName,
                day_number: 1,
                module_number: 3,
                ibody: "Do you believe intelligence can be developed over time?",
                ibuttons: "Yes, absolutely!\nNo, it is fixed.",
                module_text: null,
                list_title: null,
                list_options: null,
                question: null,
                correct_answer: null,
                file_url: null,
                file_name: null
            },
            {
                course_name: courseName,
                day_number: 1,
                module_number: 4,
                list_title: "How do you usually respond to difficult challenges?",
                list_options: "I embrace them and learn\nI get discouraged and avoid them",
                module_text: null,
                ibody: null,
                ibuttons: null,
                question: null,
                correct_answer: "I embrace them and learn",
                file_url: null,
                file_name: null
            },
            {
                course_name: courseName,
                day_number: 1,
                module_number: 5,
                question: "In your own words: What does 'growth' mean to you?\n\nShare your thoughts!",
                module_text: null,
                list_title: null,
                list_options: null,
                ibody: null,
                ibuttons: null,
                correct_answer: null,
                file_url: null,
                file_name: null
            },
            // Day 2 Modules
            {
                course_name: courseName,
                day_number: 2,
                module_number: 1,
                module_text: "Welcome to Day 2! 🚀 Today we discuss dealing with failures and criticisms as opportunities to learn.",
                list_title: null,
                list_options: null,
                ibody: null,
                ibuttons: null,
                question: null,
                correct_answer: null,
                file_url: null,
                file_name: null
            }
        ];

        console.log("Seeding course content for 'Mindset'...");
        for (const item of contentSeeds) {
            await db.query(
                `INSERT INTO course_content 
                 (course_name, day_number, module_number, module_text, list_title, list_options, ibody, ibuttons, question, correct_answer, file_url, file_name)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                 module_text=VALUES(module_text), list_title=VALUES(list_title), list_options=VALUES(list_options), 
                 ibody=VALUES(ibody), ibuttons=VALUES(ibuttons), question=VALUES(question), correct_answer=VALUES(correct_answer),
                 file_url=VALUES(file_url), file_name=VALUES(file_name)`,
                [
                    item.course_name, item.day_number, item.module_number, item.module_text,
                    item.list_title, item.list_options, item.ibody, item.ibuttons,
                    item.question, item.correct_answer, item.file_url, item.file_name
                ]
            );
        }
        console.log("✅ Mindset course seeded successfully.");
        console.log("\n✨ Database seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed with error:", error);
        process.exit(1);
    }
}

seed();
