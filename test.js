<<<<<<< HEAD
const Airtable = require('airtable');
require('dotenv').config();
const base = new Airtable({ apiKey: process.env.PERSONAL_ACCESS_TOKEN }).base(process.env.BASE_ID);
const WA = require('./wati');
const us = require('./update');
const sendContent = require('./image');
// const outro = require('./outroflow');
const { info } = require('pdfkit');

const TABLE_ID = process.env.CONTENT_TABLE_ID;
const BASE_ID = process.env.BASE_ID;
const API_KEY = process.env.PERSONAL_ACCESS_TOKEN;
let student_table = process.env.TABLE_ID;


//Update Day completed field and next day field in Test's table for the given phone number 
//Called on Finish day keyword

=======
require('dotenv').config();
const db = require('./db');
const WA = require('./twilio');
const us = require('./update');
const sendContent = require('./image');

// Update Day completed field and next day field in students table for the given phone number 
// Called on Finish day keyword
>>>>>>> 118c424 (new code)
async function markDayComplete(number) {
    try {
<<<<<<< HEAD
        const url = `https://api.airtable.com/v0/${BASE_ID}/${student_table}`;

        const params = new URLSearchParams({
            filterByFormula: `({Phone} = "${number}")`,
            view: 'Grid view'
        });

        const response = await fetch(`${url}?${params}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.records || data.records.length === 0) {
=======
        const [records] = await db.query('SELECT * FROM students WHERE phone = ?', [number]);
        if (records.length === 0) {
>>>>>>> 118c424 (new code)
            console.log("No records found for the given number");
            return;
        }

        const record = records[0];
        const id = record.id;
        const name = record.name;
        const comp_day = Number(record.next_day);
        const nextDay = comp_day + 1;

        const total_days = await us.totalDays(number);

        if (comp_day <= total_days) {
            console.log("Entered markDayComplete");
<<<<<<< HEAD

            const updateFields = {
                "Next Day": nextDay,
                "Day Completed": comp_day,
                "Next Module": 1,
                "Module Completed": 0
            };

            const updateResponse = await fetch(`${url}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fields: updateFields })
            });

            if (!updateResponse.ok) {
                throw new Error(`HTTP error! status: ${updateResponse.status}`);
            }
=======
            await db.query(
                `UPDATE students 
                 SET next_day = ?, day_completed = ?, next_module = 1, module_completed = 0 
                 WHERE id = ?`,
                [nextDay, comp_day, id]
            );
>>>>>>> 118c424 (new code)

            console.log("Complete Day " + comp_day);
            if (nextDay == total_days + 1) {
                console.log("Executing Outro for ", name, nextDay);
            }
        }
    } catch (error) {
        console.error('Error in markDayComplete:', error);
    }
}

// Find current day content and complete day trigger
async function findDay(currentDay, number) {
    try {
<<<<<<< HEAD
        const course_tn = await us.findTable(number);
        console.log(`Table name of ${number} is ${course_tn}`);

        const url = `https://api.airtable.com/v0/${BASE_ID}/${course_tn}`;

        const params = new URLSearchParams({
            filterByFormula: `({Day} = ${currentDay})`,
            view: 'Grid view'
        });

        const response = await fetch(`${url}?${params}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.records || data.records.length === 0) {
            console.log("No records found for the given day");
            return;
        }

        const record = data.records[0];
        const day = record.fields.Day;
=======
>>>>>>> 118c424 (new code)
        const id = await us.getID(number);
        const total_days = await us.totalDays(number);

        console.log("Entered findDay module for Day:", currentDay);

        if (currentDay == total_days) {
            const hTxt = `Congratulations on completing Day ${currentDay}!`;
            const bTxt = `_powered by ekatra.one_`;

            await us.updateField(id, "Last_Msg", hTxt);
            WA.sendText(`${hTxt} \n${bTxt}`, number);
            await markDayComplete(number);

            setTimeout(() => {
                WA.sendText(`Would you like another learner to join you? Invite your friends to take the course! \n\nhttps://bit.ly/TBS-Referral`, number);
            }, 5000);
        } else {
            let next_day = currentDay + 1;
            const hTxt = `Congratulations on completing Day ${currentDay}!`;
            const bTxt = `You will receive Day ${next_day} modules tomorrow. \n\n_powered by ekatra.one_`;

            await us.updateField(id, "Last_Msg", hTxt);
            WA.sendText(`${hTxt} \n${bTxt}`, number);
            await markDayComplete(number);

            setTimeout(() => {
                WA.sendText(`Would you like another learner to join you? Invite your friends to take the course! \n\nhttps://bit.ly/TBS-Referral`, number);
            }, 5000);
        }
    } catch (error) {
        console.error('Error in findDay:', error);
    }
}

async function sendList(currentDay, module_No, number) {
    try {
        const id = await us.getID(number);
        const [title, options] = await us.findTitle(currentDay, module_No, number);

<<<<<<< HEAD
        const url = `https://api.airtable.com/v0/${BASE_ID}/${course_tn}`;

        const params = new URLSearchParams({
            filterByFormula: `({Day} = ${currentDay})`,
            view: 'Grid view'
        });

        const response = await fetch(`${url}?${params}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
=======
        if (title) {
            console.log("Executing List");
            const d = options.map(row => ({ title: row }));
            await us.updateField(id, "Last_Msg", title);
            WA.sendListInteractive(d, title, "Options", number);
>>>>>>> 118c424 (new code)
        }
    } catch (error) {
        console.error('Error in sendList:', error);
    }
}

async function sendIMsg(currentDay, module_No, number) {
<<<<<<< HEAD
    var course_tn = await us.findTable(number);

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${course_tn}?filterByFormula=({Day} = ${currentDay})&view=Grid view`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
=======
    try {
        const res = await us.findInteractive(currentDay, module_No, number);
        if (Array.isArray(res)) {
            const [body, buttons] = res;
            console.log("Executing Interactive ");
            const data = buttons.map(option => ({ text: option }));
            setTimeout(() => {
                WA.sendDynamicInteractiveMsg(data, body, number);
            }, 35000);
>>>>>>> 118c424 (new code)
        }
    } catch (error) {
        console.error('Error in sendIMsg:', error);
    }
<<<<<<< HEAD

    const data = await response.json();
    const records = data.records;

    // Process only the first record since we expect one record per day
    // Note: The query filters by Day, which should return exactly one record
    if (records.length > 1) {
        console.log(`Warning: Expected 1 record for Day ${currentDay}, found ${records.length}. Processing first only.`);
    }
    if (records.length > 0) {
        const record = records[0];
        console.log(module_No);
        let module_body = record.fields[`Module ${module_No} iBody`];
        let module_buttons = record.fields[`Module ${module_No} iButtons`];

        console.log("Executing Interactive ");
        let options = module_buttons.split("\n").filter(n => n);

        let buttonData = options.map(option => ({ text: option }));

        setTimeout(() => {
            WA.sendDynamicInteractiveMsg(buttonData, module_body, number);
        }, 35000);
    }
}

async function sendQues(currentDay, module_No, number) {
    var course_tn = await us.findTable(number);
    let id;
    try {
        id = await us.getID(number);
    } catch (e) {
        console.log(e);
    }

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${course_tn}?filterByFormula=({Day} = ${currentDay})&view=Grid view`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
=======
}

async function sendQues(currentDay, module_No, number) {
    try {
        const id = await us.getID(number);
        const module_ques = await us.findQuestion(currentDay, module_No, number);

        if (module_ques && module_ques !== "No matching question found") {
            console.log("Executing Question ");
            await us.updateField(id, "Last_Msg", `Q: ${module_ques}`);

            setTimeout(() => {
                WA.sendText(module_ques, number);
            }, 2000);

            setTimeout(() => {
                WA.sendText("⬇⁣", number);
            }, 3000);
>>>>>>> 118c424 (new code)
        }
    } catch (error) {
        console.error('Error in sendQues:', error);
    }
<<<<<<< HEAD

    const data = await response.json();
    const records = data.records;

    // Process first record instead of forEach with async (which doesn't await properly)
    if (records.length > 0) {
        const record = records[0];
        let module_ques = record.fields[`Module ${module_No} Question`];

        console.log("Executing Question ");
        console.log("4. Update as last message ");

        await us.updateField(id, "Last_Msg", `Q: ${module_ques}`);

        setTimeout(() => {
            WA.sendText(module_ques, number);
        }, 2000);

        setTimeout(() => {
            WA.sendText("⬇⁣", number);
        }, 3000);
    }
=======
>>>>>>> 118c424 (new code)
}

async function store_responses(number, value) {
    try {
        const [records] = await db.query('SELECT * FROM students WHERE phone = ?', [number]);
        if (records.length === 0) return;
        const record = records[0];
        const id = record.id;
        const currentModule = record.next_module;
        const currentDay = record.next_day;
        const last_msg = record.last_msg;

<<<<<<< HEAD
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${student_table}?filterByFormula=({Phone} = "${number}")&view=Grid view`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    });

    if (!response.ok) {
        console.error("Error fetching records:", response.statusText);
        return;
    }

    const data = await response.json();
    const records = data.records;

    // Use for...of instead of forEach with async to properly await
    for (const record of records) {
        let id = record.id;
        let currentModule = record.fields["Next Module"];
        let currentDay = record.fields["Next Day"];
        
        let last_msg;
        try {
            last_msg = await us.findLastMsg(number);
        } catch (e) {
            console.log("last msg error " + e);
        }
        
        // Fetch these values once and reuse them throughout the function
        let list;
        try {
            list = await us.findTitle(currentDay, currentModule, number);
        } catch (e) {
            console.error(e);
        }
        let title = list && list.length > 0 ? list[0] : undefined;
        
        let correct_ans;
        try {
            correct_ans = await us.findAns(currentDay, currentModule, number);
        } catch (e) {
            console.log("Error in findAns ", e);
        }
        
        let existingValues;
        try {
            existingValues = await us.findField("Question Responses", number);
        } catch (e) {
            console.error(e);
        }
        
        if (correct_ans == null) {
            console.log("currentDay ", currentDay);
            console.log("existingValues 1 ", existingValues, title);
            
            let newValues;
            if (existingValues == 0) {
                console.log("existingValues 2 ");
                existingValues = "";
                newValues = `Q: ${title} \nA: ${value}`;
            } else {
                console.log("existingValues 3 ");
                newValues = `${existingValues} \n\nQ: ${title} \nA: ${value}`;
            }
            if (existingValues.toString().includes(title)) {
=======
        const [title, options] = await us.findTitle(currentDay, currentModule, number);
        const correct_ans = await us.findAns(currentDay, currentModule, number);

        if (correct_ans == null) {
            let existingValues = record.question_responses || "";
            let newValues = existingValues 
                ? `${existingValues} \n\nQ: ${title} \nA: ${value}`
                : `Q: ${title} \nA: ${value}`;

            if (existingValues.includes(title)) {
>>>>>>> 118c424 (new code)
                console.log("2.1 List Feedback already recorded");
                await findContent(currentDay, currentModule, number);
            } else {
                await us.updateField(id, "Question Responses", newValues);
                console.log("2.2 List New Feedback recorded");
                await findContent(currentDay, currentModule, number);
<<<<<<< HEAD
                console.log("1. Updating");
=======
>>>>>>> 118c424 (new code)
                await us.updateField(id, "Last_Msg", title);
            }
        } else {
<<<<<<< HEAD
            // Reuse already fetched correct_ans and existingValues instead of fetching again
            console.log("Correct ans ", correct_ans);

            let options = list && list.length > 0 ? list.filter((v, i) => i !== 0) : [];

            const isCorrect = correct_ans === value;
            const isSecondAttempt = last_msg == "Incorrect";
=======
            const isCorrect = correct_ans === value;
            const isSecondAttempt = last_msg === "Incorrect";
>>>>>>> 118c424 (new code)

            if (isCorrect || isSecondAttempt) {
                let congratsMessages = [
                    "Congratulations! You got it right. 🥳",
                    "That's the correct answer.Yay! 🎉",
                    "Awesome! Your answer is correct. 🎊",
                    "Hey, good job! That's the right answer Woohoo! 🤩",
                    "Well done! The answer you have chosen is correct. 🎖️"
                ];

                if (isCorrect && !isSecondAttempt) {
                    WA.sendText(congratsMessages[Math.floor(Math.random() * congratsMessages.length)], number);
                } else if (isSecondAttempt) {
                    if (isCorrect) {
                        WA.sendText(congratsMessages[Math.floor(Math.random() * congratsMessages.length)], number);
                    } else {
                        WA.sendText(`The correct answer is *${correct_ans}*`, number);
                    }
                }

                let existingValues = record.question_responses || "";
                if (existingValues.includes(title)) {
                    console.log("2.1 List Feedback already recorded");
                    await findContent(currentDay, currentModule, number);
                } else {
                    const newValues = existingValues 
                        ? `${existingValues}\n\nQ: ${title}\nA: ${value}`
                        : `Q: ${title}\nA: ${value}`;
                    await us.updateField(id, "Question Responses", newValues);
                    console.log("2.2 List New Feedback recorded");
                    await findContent(currentDay, currentModule, number);
                    await us.updateField(id, "Last_Msg", title);
                }
            } else {
                WA.sendText("You've entered the wrong answer. Let's try one more time. \n\nSelect the correct option from the list again.", number);
                await us.updateField(id, "Last_Msg", "Incorrect");
            }
        }
<<<<<<< HEAD
    }
}
async function store_intResponse(number, value) {
    let course_tn = await us.findTable(number);

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${student_table}?filterByFormula=({Phone} = "${number}")&view=Grid view`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    });

    if (!response.ok) {
        console.error("Error fetching records:", response.statusText);
        return;
=======
    } catch (error) {
        console.error('Error in store_responses:', error);
>>>>>>> 118c424 (new code)
    }
}

async function store_intResponse(number, value) {
    try {
        const [records] = await db.query('SELECT * FROM students WHERE phone = ?', [number]);
        if (records.length === 0) return;
        const record = records[0];
        const id = record.id;
        const currentModule = record.next_module;
        const currentDay = record.next_day;
        const existingValues = record.interactive_responses || "";

<<<<<<< HEAD
    // Use for...of instead of forEach with async
    for (const record of records) {
        let id = record.id;
        let module_complete = record.fields["Module Completed"];
        let currentModule = record.fields["Next Module"];
        let currentDay = record.fields["Next Day"];
        let last_msg = record.fields["Last_Msg"];

        let existingValues;
        try {
            existingValues = await us.findField("Interactive_Responses", number);
        } catch (e) {
            console.log("e2", e);
        }

        let list;
        try {
            list = await us.findInteractive(currentDay, currentModule, number);
        } catch (e) {
            console.error(e);
        }

        if (list != undefined) {
            let title = list[0];
            console.log(title);

            let options = list.filter((v, i) => i !== 0);

            console.log("Value ", value);
            console.log("Last Msg = ", existingValues);
            console.log();

            for (let i = 0; i < options[0].length; i++) {
                if (options[0][i] == value) {
                    let newValues;
                    if (existingValues == 0) {
                        existingValues = "";
                        newValues = title + "\n" + value;
                    } else {
                        newValues = existingValues + "\n\n" + title + value;
                    }

                    if (existingValues.includes(title)) {
                        console.log("Interactive Feedback already recorded");
                        await find_IntContent(currentDay, currentModule, number);
                    } else {
                        await us.updateField(id, "Interactive_Responses", newValues);
                        console.log("New Interactive Feedback recorded");
                        await find_IntContent(currentDay, currentModule, number);
                    }
                    break;
=======
        const res = await us.findInteractive(currentDay, currentModule, number);
        if (Array.isArray(res)) {
            const [title, options] = res;
            if (options.includes(value)) {
                let newValues = existingValues
                    ? `${existingValues}\n\n${title}\n${value}`
                    : `${title}\n${value}`;

                if (existingValues.includes(title)) {
                    console.log("Interactive Feedback already recorded");
                    await find_IntContent(currentDay, currentModule, number);
                } else {
                    await us.updateField(id, "Interactive_Responses", newValues);
                    console.log("New Interactive Feedback recorded");
                    await find_IntContent(currentDay, currentModule, number);
>>>>>>> 118c424 (new code)
                }
            }
        }
<<<<<<< HEAD
=======
    } catch (error) {
        console.error('Error in store_intResponse:', error);
>>>>>>> 118c424 (new code)
    }
}

async function store_quesResponse(number, value) {
<<<<<<< HEAD
    // var course_tn = await us.findTable(number)

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${student_table}?filterByFormula=({Phone} = ${number})&view=Grid view`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    });

    if (!response.ok) {
        console.error("Error fetching records:", response.statusText);
        return;
    }

    const data = await response.json();
    const records = data.records;

    // Use for...of instead of forEach with async
    for (const record of records) {
        let id = record.id;
        let currentModule = record.fields["Next Module"];
        let currentDay = record.fields["Next Day"];
        let last_msg = record.fields["Last_Msg"];

        if (currentModule !== undefined) {
            let ques;
            try {
                ques = await us.findQuestion(currentDay, currentModule, number);
            } catch (e) {
                console.error("Error in store_quesResponse ", e);
            }

=======
    try {
        const [records] = await db.query('SELECT * FROM students WHERE phone = ?', [number]);
        if (records.length === 0) return;
        const record = records[0];
        const id = record.id;
        const currentModule = record.next_module;
        const currentDay = record.next_day;
        let last_msg = record.last_msg;

        if (currentModule !== undefined) {
            let ques = await us.findQuestion(currentDay, currentModule, number);
>>>>>>> 118c424 (new code)
            if (typeof last_msg === 'string') {
                last_msg = last_msg.replace("Q: ", "");
            }

            if (last_msg === ques) {
                ques = ques.replace("\n\nShare your thoughts!", " ");
                let existingValues = record.responses || "";
                let newValues = existingValues
                    ? `${existingValues} \n\nQ: ${ques} \nA: ${value}`
                    : `Q: ${ques} \nA: ${value}`;

<<<<<<< HEAD
                let existingValues = await us.findQuesRecord(id);

                console.log("ques -  ", ques);

                let newValues;
                if (ques !== undefined) {
                    if (existingValues === undefined) {
                        console.log("existingValues", existingValues);
                        existingValues = "";
                        newValues = `Q: ${ques} \nA: ${value}`;
                    } else {
                        console.log("existingValues");
                        newValues = `${existingValues} \n\nQ: ${ques} \nA: ${value}`;
                    }

                    if (existingValues.includes(ques)) {
                        console.log("third_last", last_msg);
                        last_msg = last_msg.replace("\n\nShare your thoughts!", " ");

                        if (last_msg === ques) {
                            try {
                                console.log("1.1.2 Feedback already recorded");
                                await find_QContent(currentDay, currentModule, number).then().catch(e => console.log("Error 1.1.2 Feedback ", e));
                            } catch (e) {
                                console.log("Caught Error 1.1.2 Feedback ", e);
                            }
                        } else {
                            console.log("1.2 Feedback already recorded");
                            await find_QContent(currentDay, currentModule, number);
                        }
                    } else {
                        await us.updateField(id, "Responses", newValues);
                        console.log("3. New Feedback recorded");
                        await find_QContent(currentDay, currentModule, number);
                    }
=======
                if (existingValues.includes(ques)) {
                    console.log("1.2 Feedback already recorded");
                    await find_QContent(currentDay, currentModule, number);
                } else {
                    await us.updateField(id, "Responses", newValues);
                    console.log("3. New Feedback recorded");
                    await find_QContent(currentDay, currentModule, number);
>>>>>>> 118c424 (new code)
                }
            } else {
                console.log("No ques");
            }
        }
<<<<<<< HEAD
=======
    } catch (error) {
        console.error('Error in store_quesResponse:', error);
>>>>>>> 118c424 (new code)
    }
}

async function findContent(currentDay, module_No, number) {
    try {
        const id = await us.getID(number);
        const course_tn = await us.findTable(number);

<<<<<<< HEAD
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${course_tn}?filterByFormula=({Day} = ${currentDay})&view=Grid view`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    });

    if (!response.ok) {
        console.error("Error fetching records:", response.statusText);
        return;
    }

    const data = await response.json();
    const records = data.records;

    // Process first record only (we expect one record per day)
    if (records.length > 0) {
        const record = records[0];
=======
>>>>>>> 118c424 (new code)
        setTimeout(async () => {
            let hasNextModules = false;
            for (let i = module_No + 1; i <= 5; i++) {
                const [rows] = await db.query(
                    `SELECT module_text, list_title 
                     FROM course_content 
                     WHERE course_name = ? AND day_number = ? AND module_number = ?`,
                    [course_tn, currentDay, i]
                );
                if (rows && rows.length > 0 && (rows[0].module_text || rows[0].list_title)) {
                    hasNextModules = true;
                    break;
                }
            }

            if (!hasNextModules) {
                await markModuleComplete_v2(5, number);
            } else {
                const hTxt = `Let's move forward!`;
                const bTxt = `Click Next.`;
                const btnTxt = "Next.";
                await us.updateField(id, "Last_Msg", btnTxt);
                WA.sendInteractiveButtonsMessage(hTxt, bTxt, btnTxt, number);
            }
        }, 500);
    } catch (error) {
        console.error('Error in findContent:', error);
    }
}

async function find_IntContent(currentDay, module_No, number) {
    try {
        const id = await us.getID(number);
        const course_tn = await us.findTable(number);
        
        const [rows] = await db.query(
            `SELECT list_title FROM course_content 
             WHERE course_name = ? AND day_number = ? AND module_number = ?`,
            [course_tn, currentDay, module_No]
        );

        if (rows && rows.length > 0 && rows[0].list_title) {
            await sendList(currentDay, module_No, number);
        } else {
            setTimeout(async () => {
                let hasNextModules = false;
                for (let i = module_No + 1; i <= 6; i++) {
                    const [subRows] = await db.query(
                        `SELECT module_text, list_title FROM course_content 
                         WHERE course_name = ? AND day_number = ? AND module_number = ?`,
                        [course_tn, currentDay, i]
                    );
                    if (subRows && subRows.length > 0 && (subRows[0].module_text || subRows[0].list_title)) {
                        hasNextModules = true;
                        break;
                    }
                }

                if (!hasNextModules) {
                    await markModuleComplete_v2(5, number);
                } else {
                    const hTxt = `Let's move forward!`;
                    const bTxt = `Click Next.`;
                    const btnTxt = "Next.";
                    await us.updateField(id, "Last_Msg", btnTxt);
                    WA.sendInteractiveButtonsMessage(hTxt, bTxt, btnTxt, number);
                }
<<<<<<< HEAD
            }
        }, 500);
    }
}

async function find_IntContent(currentDay, module_No, number) {
    var course_tn = await us.findTable(number);

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${course_tn}?filterByFormula=({Day} = ${currentDay})&view=Grid view`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
=======
            }, 5000);
>>>>>>> 118c424 (new code)
        }
    } catch (error) {
        console.error('Error in find_IntContent:', error);
    }
<<<<<<< HEAD

    const data = await response.json();
    const records = data.records;

    // Process first record only (we expect one record per day)
    if (records.length > 0) {
        const record = records[0];
        let module_title = record.fields[`Module ${module_No} LTitle`];
        let id;
        try {
            id = await us.getID(number);
        } catch (e) {
            console.log(e);
        }

        console.log(module_title);

        if (module_title !== undefined) {
            console.log("List not empty in findContent");
            await sendList(currentDay, module_No, number);
        } else {
            setTimeout(async () => {
                for (let i = module_No + 1; i <= 6; i++) {
                    let module_text = record.fields[`Module ${i} Text`];
                    let module_list = record.fields[`Module ${i} LTitle`];
                    console.log("After ", i);
                    if (module_text === undefined && !module_list) {
                        console.log(module_text, module_list);
                        if (i >= 5) {
                            await markModuleComplete_v2(i, number).then().catch(error => console.log("v2 ", error));
                        }
                    } else {
                        const hTxt = `Let's move forward!`;
                        const bTxt = `Click Next.`;
                        const btnTxt = "Next.";
                        console.log("2. Delay of Finish Interactive Button - find_QContent");
                        us.updateField(id, "Last_Msg", btnTxt);
                        WA.sendInteractiveButtonsMessage(hTxt, bTxt, btnTxt, number);
                        break;
                    }
                }
            }, 500);
        }
    }
=======
>>>>>>> 118c424 (new code)
}

async function find_QContent(currentDay, module_No, number) {
    try {
        const id = await us.getID(number);
        const course_tn = await us.findTable(number);

<<<<<<< HEAD
        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${course_tn}/?filterByFormula=Day%3D${currentDay}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // console.log(response)

        if (!response.ok) {
            return 'Failed to fetch records from Airtable'
        }

        let data = await response.json();

        let records = data.records;
        for (let record of records) {
            console.log("Data 0 ", data)


            console.log("Data 1 ", record.fields)
            // var module_link = record.fields[`Module ${module_No} Link`]?.null;

            let nm = module_No + 1;
            let id = await us.getID(number).then().catch(e => console.log(e));

            console.log(module_No, currentDay);
            // let interactive_body = record.fields[`Module ${nm} iBody`];

            // Send module link if it exists
            // if (module_link != null) {
            //     console.log("Module link not empty");
            //     setTimeout(() => {
            //         data = module_link;
            //         WA.sendText(data, number);
            //     }, 2000);
            // }

            console.log("Before ", module_No);

            // Check for interactive body
            // if (interactive_body) {
            //     us.updateField(id, "Next Module", nm);
            //     us.updateField(id, "Module Completed", module_No);
            //     await sendIMsg(currentDay, nm, number);
            // } else {
            setTimeout(async () => {
                for (let i = module_No + 1; i <= 5; i++) {
                    console.log("After ", i);
                    

                    let module_text = record.fields[`Module ${i} Text`] // Optional chaining to handle null/undefined
                    
                    // console.log(`Module ${i} Text:`, module_text || "Not available");

                    let module_list = record.fields[`Module ${i} LTitle`] // Optional chaining to handle null/undefined
                    // console.log(`Module ${i} LTitle:`, module_list || "Not available")

                    if (module_text === undefined && !module_list) {
                        console.log(`Module ${i} Text is undefined and Module ${i} LTitle is falsy.`);

                        if (i >= 5) {
                            await markModuleComplete_v2(i, number).catch(error => console.log("v2 ", error));
                        }
                    } else {
                        // Assuming you want to send an interactive message when module_text or module_list is available
                        const hTxt = `Let's move forward!`;
                        const bTxt = `Click Next.`;
                        const btnTxt = "Next.";

                        setTimeout(() => {
                            console.log("1. Delay of Finish Interactive Button - find_QContent");
                            us.updateField(id, "Last_Msg", btnTxt);
                            WA.sendInteractiveButtonsMessage(hTxt, bTxt, btnTxt, number);
                        }, 5000);

                        break; // Exit the loop after sending the interactive message
                    }
=======
        setTimeout(async () => {
            let hasNextModules = false;
            for (let i = module_No + 1; i <= 5; i++) {
                const [rows] = await db.query(
                    `SELECT module_text, list_title FROM course_content 
                     WHERE course_name = ? AND day_number = ? AND module_number = ?`,
                    [course_tn, currentDay, i]
                );
                if (rows && rows.length > 0 && (rows[0].module_text || rows[0].list_title)) {
                    hasNextModules = true;
                    break;
>>>>>>> 118c424 (new code)
                }
            }

            if (!hasNextModules) {
                await markModuleComplete_v2(5, number);
            } else {
                const hTxt = `Let's move forward!`;
                const bTxt = `Click Next.`;
                const btnTxt = "Next.";
                await us.updateField(id, "Last_Msg", btnTxt);
                WA.sendInteractiveButtonsMessage(hTxt, bTxt, btnTxt, number);
            }
        }, 3000);
    } catch (error) {
        console.error('Error in find_QContent:', error);
    }
}

async function findModule(currentDay, module_No, number) {
    try {
        const id = await us.getID(number);
        const course_tn = await us.findTable(number);

<<<<<<< HEAD
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${course_tn}?filterByFormula=Day%3D${currentDay}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
=======
        console.log("Executing FindModule for Day:", currentDay, "Module:", module_No);

        const [rows] = await db.query(
            `SELECT * FROM course_content 
             WHERE course_name = ? AND day_number = ? AND module_number = ?`,
            [course_tn, currentDay, module_No]
        );

        if (rows.length === 0) {
            await markModuleComplete(number);
            return;
>>>>>>> 118c424 (new code)
        }

        const record = rows[0];
        const module_text = record.module_text;
        const module_title = record.list_title;
        const module_link = record.file_url;
        const interactive_body = record.ibody;
        const module_ques = record.question;
        const module_split = module_text ? module_text.split('#') : [];

        if (!module_text && !!module_ques) {
            console.log("Ques not empty - Module Text Empty");
            setTimeout(() => {
                sendContent.sendMediaFile(currentDay, module_No, number).catch(e => console.log("Error" + e));
            }, 100);
            await sendQues(currentDay, module_No, number);
        }
        else if (!!interactive_body && !!module_text) {
            let index = 0;
            await sendSplitMessages(module_split, index, currentDay, module_No, number);
            if (!!module_link) {
                setTimeout(() => {
                    WA.sendText(module_link, number);
                }, 2000);
            }
            await us.updateField(id, "Last_Msg", module_text);
            await sendIMsg(currentDay, module_No, number);
        }
        else if (!!module_title && !module_text) {
            await sendList(currentDay, module_No, number);
        }
        else if (!!interactive_body && !module_text) {
            await sendContent.sendMediaFile(currentDay, module_No, number).catch(e => console.log("Error" + e));
            await sendIMsg(currentDay, module_No, number);
        }
        else if (!!module_text && !module_title) {
            if (!!interactive_body) {
                setTimeout(() => {
                    sendContent.sendMediaFile(currentDay, module_No, number).catch(e => console.log("Error" + e));
                }, 10000);
                await sendIMsg(currentDay, module_No, number);
            }
            else if (!!module_link) {
                let index = 0;
                await sendSplitMessages(module_split, index, currentDay, module_No, number);
                await us.updateField(id, "Last_Msg", module_text);

                if (!!module_ques) {
                    setTimeout(async () => {
                        await sendQues(currentDay, module_No, number);
                    }, 5000);
                } else {
                    setTimeout(() => {
                        WA.sendText(module_link, number);
                    }, 2500);

                    // Check for next module availability
                    setTimeout(async () => {
                        let hasNextModules = false;
                        for (let i = module_No + 1; i <= 5; i++) {
                            const [subRows] = await db.query(
                                `SELECT module_text, list_title FROM course_content 
                                 WHERE course_name = ? AND day_number = ? AND module_number = ?`,
                                [course_tn, currentDay, i]
                            );
                            if (subRows && subRows.length > 0 && (subRows[0].module_text || subRows[0].list_title)) {
                                hasNextModules = true;
                                break;
                            }
                        }

                        if (!hasNextModules) {
                            await markModuleComplete_v2(5, number);
                        } else {
                            const hTxt = "To Learn More!";
                            const bTxt = "Click Next.";
                            const btnTxt = "Next.";
                            WA.sendInteractiveButtonsMessage(hTxt, bTxt, btnTxt, number);
                        }
                    }, 2500);
                }
            }
            else {
                let index = 0;
                await sendSplitMessages(module_split, index, currentDay, module_No, number);
                await us.updateField(id, "Last_Msg", module_text);

                if (!!module_ques) {
                    setTimeout(async () => {
                        await sendQues(currentDay, module_No, number);
                    }, 5000);
                } else {
                    let next_m = module_No + 1;
                    const [nextRows] = await db.query(
                        `SELECT question, module_text FROM course_content 
                         WHERE course_name = ? AND day_number = ? AND module_number = ?`,
                        [course_tn, currentDay, next_m]
                    );

                    if (nextRows && nextRows.length > 0 && nextRows[0].question && !nextRows[0].module_text) {
                        await us.updateField(id, "Next Module", next_m);
                        await us.updateField(id, "Module Completed", module_No);
                        setTimeout(async () => {
                            await sendQues(currentDay, next_m, number);
                        }, 4000);
                    } else {
                        setTimeout(async () => {
                            let hasNextModules = false;
                            for (let i = module_No + 1; i <= 5; i++) {
                                const [subRows] = await db.query(
                                    `SELECT module_text, list_title FROM course_content 
                                     WHERE course_name = ? AND day_number = ? AND module_number = ?`,
                                    [course_tn, currentDay, i]
                                );
                                if (subRows && subRows.length > 0 && (subRows[0].module_text || subRows[0].list_title)) {
                                    hasNextModules = true;
                                    break;
                                }
                            }

                            if (!hasNextModules) {
                                await markModuleComplete_v2(5, number);
                            } else {
                                const hTxt = "To Learn More!";
                                const bTxt = "Click Next.";
                                const btnTxt = "Next.";
                                setTimeout(() => {
                                    WA.sendInteractiveButtonsMessage(hTxt, bTxt, btnTxt, number);
                                }, 6000);
                            }
                        }, 15000);
                    }
                }
            }
        }
        else if (!!module_text && !!module_title) {
            await us.updateField(id, "Last_Msg", module_text);
            let index = 0;
            await sendSplitMessages(module_split, index, currentDay, module_No, number);
            setTimeout(async () => {
                await sendList(currentDay, module_No, number);
            }, 2000);
        }
        else {
            await markModuleComplete(number);
        }
    } catch (error) {
        console.error("Error in findModule:", error);
    }
}

async function sendSplitMessages(module_split, index, day, module_No, number) {
    const awaitTimeout = delay => new Promise(resolve => setTimeout(resolve, delay));
    const len = module_split.length;

    for (let i = index; i < len; i++) {
        const item = module_split[i].trim();
        if (item === "Image" || item === "image") {
            console.log("Executing Media");
            await sendContent.sendMediaFile(day, module_No, number).catch(e => console.log(e));
        } else if (item.length > 0) {
            console.log("Executing Text segment");
            await WA.sendText(item, number);
        }
        await awaitTimeout(3000);
    }
}

async function sendModuleContent(number) {
    console.log("Entered sendModuleContent");
<<<<<<< HEAD

    // const records_Student = await baseId('Test').select({
    //     filterByFormula: "({Phone} =" + number + ")",
    //     view: "Grid view",
    // }).all();

    // records_Student.forEach(async function (record) {


    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${student_table}?filterByFormula=Phone%3D${number}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
=======
    try {
        const [records] = await db.query('SELECT * FROM students WHERE phone = ?', [number]);
        if (records.length === 0) {
            console.log("No student records found for the given number");
            return;
>>>>>>> 118c424 (new code)
        }

        const record = records[0];
        const id = record.id;
        const cDay = record.next_day;
        const next_module = record.next_module;
        const completed_module = record.module_completed;

        if (next_module !== undefined) {
            if (cDay === 5) {
                console.log("Executing outro for day 5");
            } else if (next_module === 0) {
                console.log("Next module is 0, finding day content");
                await findDay(cDay, number);
            } else {
                if (completed_module === 0 && next_module === 1) {
                    console.log(`Starting Day ${cDay} of ${number}`);
                    await sendStartDayTopic(next_module, cDay, number);
                } else {
                    console.log(`Finding module ${next_module} for day ${cDay}`);
                    await findModule(cDay, next_module, number);
                }
            }
        }
    } catch (error) {
        console.error('Error in sendModuleContent:', error);
    }
}

async function sendStartDayTopic(next_module, cDay, number) {
    try {
        const course_tn = await us.findTable(number);
        const id = await us.getID(number);

        const [rows] = await db.query(
            `SELECT list_title FROM course_content 
             WHERE course_name = ? AND day_number = ? AND module_number = 1`,
            [course_tn, cDay]
        );

        let day_topic = rows.length > 0 ? rows[0].list_title : undefined;

<<<<<<< HEAD
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${course_tn}?filterByFormula=Day%3D${cDay}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        return 'Failed to fetch records from Airtable'
    }

    let data = await response.json();
    let records = data.records;

    // console.log(records)
    // Process each record
    for (let record of records) {
        let day_topic = record.fields["Day Topic"];
        // console.log("Day Topic:", day_topic);
        let id =await us.getID(number)


        if (day_topic !== undefined) {
            // let day_topic_split = day_topic.split("--");
            // let hTxt = day_topic_split[0].trim();
            // let bTxt = day_topic_split[1].trim();

            // console.log("Header Text:", hTxt);
            // console.log("Body Text:", bTxt);

            await WA.sendInteractiveButtonsMessage(" ", day_topic, "Let's Begin", number)
                .then(async () => {
                    console.log("Message sent successfully");
                    console.log("ID ",id)
                    await us.updateField(id, "Last_Msg", day_topic);
                })
                .catch(e => {
                    console.log("Error sending interactive message:", e);
                });
=======
        if (day_topic !== undefined && day_topic !== null) {
            await WA.sendInteractiveButtonsMessage(" ", day_topic, "Let's Begin", number);
            console.log("Day Topic interactive sent successfully");
            await us.updateField(id, "Last_Msg", day_topic);
>>>>>>> 118c424 (new code)
        } else {
            console.log("Day topic is undefined. Proceeding to find module.");
            await findModule(cDay, next_module, number);
        }
    } catch (error) {
        console.error('Error in sendStartDayTopic:', error);
    }
}

async function markModuleComplete(number) {
<<<<<<< HEAD
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${student_table}?filterByFormula=Phone%3D${number}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        return 'Failed to fetch records from Airtable'
    }

    let data = await response.json();
    let records = data.records;

    // console.log(records)
    // Process each record
    for (let record of records) {
        var id = record.id;
        var current_module = Number(record.fields["Next Module"]);
        var cDay = Number(record.fields["Next Day"]);
        var next_module = current_module + 1;
=======
    try {
        const [records] = await db.query('SELECT * FROM students WHERE phone = ?', [number]);
        if (records.length === 0) return;
        const record = records[0];
        const id = record.id;
        const current_module = Number(record.next_module);
        const cDay = Number(record.next_day);
        const next_module = current_module + 1;
>>>>>>> 118c424 (new code)

        console.log("Entered markModuleComplete: Next Module - ", next_module, " Current Module - ", current_module);

        if (next_module >= 6) {
            console.log("Module series completed. Updating fields.");
            await us.updateField(id, "Module Completed", current_module);
            await us.updateField(id, "Next Module", 0);
            await findDay(cDay, number);
        } else {
            console.log("Module in progress. Updating fields and finding next module.");
            await us.updateField(id, "Module Completed", current_module);
            await us.updateField(id, "Next Module", next_module);
            await findModule(cDay, next_module, number);
        }
    } catch (error) {
        console.error('Error in markModuleComplete:', error);
    }
}

async function markModuleComplete_v2(c_m, number) {
<<<<<<< HEAD
    // const records_Student = await baseId('Test').select({
    //     filterByFormula: "({Phone} =" + number + ")",
    //     view: "Grid view",
    // }).all();

        // records_Student.forEach(async function (record) {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${student_table}?filterByFormula=Phone%3D${number}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok) {
            return 'Failed to fetch records from Airtable'
    }

    let data = await response.json();
    let records = data.records;

    // console.log(records)
    // Process each record
    for (let record of records) {   
        var id = record.id;
        var current_module = c_m;
        var cDay = Number(record.fields["Next Day"]);
        var next_module = current_module + 1;
=======
    try {
        const [records] = await db.query('SELECT * FROM students WHERE phone = ?', [number]);
        if (records.length === 0) return;
        const record = records[0];
        const id = record.id;
        const current_module = c_m;
        const cDay = Number(record.next_day);
        const next_module = current_module + 1;
>>>>>>> 118c424 (new code)

        console.log("Entered markModuleComplete v2: Next Module - ", next_module, " Current Module - ", current_module);

        if (next_module >= 7) {
            console.log("Module series completed. Updating fields.");
            await us.updateField(id, "Module Completed", current_module);
            await us.updateField(id, "Next Module", 0);
            await findDay(cDay, number);
        } else {
            console.log("Module in progress. Updating fields and finding next module.");
            await us.updateField(id, "Next Module", next_module);
            await us.updateField(id, "Module Completed", current_module);
            await findModule(cDay, next_module, number);
        }
    } catch (error) {
        console.error('Error in markModuleComplete_v2:', error);
    }
}

module.exports = {
    markDayComplete,
    sendModuleContent,
    markModuleComplete,
    store_responses,
    store_intResponse,
    store_quesResponse,
    sendList,
    findModule
};