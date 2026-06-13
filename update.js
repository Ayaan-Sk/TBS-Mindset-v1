require('dotenv').config();
<<<<<<< HEAD

// Remove all lowercase env usage, use UPPERCASE only
let tableId = process.env.TABLE_ID;
let baseId = process.env.BASE_ID;
let apiKey = process.env.PERSONAL_ACCESS_TOKEN;

// In-memory cache with TTL for frequently accessed data
const cache = {
  userTables: new Map(), // phone -> { value, expiry }
  userIds: new Map(),    // phone -> { value, expiry }
  totalDays: new Map(),  // courseName -> { value, expiry }
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL

function getCached(cacheMap, key) {
  const entry = cacheMap.get(key);
  if (entry && Date.now() < entry.expiry) {
    return entry.value;
  }
  cacheMap.delete(key);
  return null;
}

function setCache(cacheMap, key, value) {
  cacheMap.set(key, { value, expiry: Date.now() + CACHE_TTL });
}

/**
 * Clears cached data for a specific user.
 * Call this when user data changes (e.g., user course enrollment changes).
 * @param {string} phone - The user's phone number to clear from cache
 */
function clearUserCache(phone) {
  cache.userTables.delete(phone);
  cache.userIds.delete(phone);
}
=======
const db = require('./db');
>>>>>>> 118c424 (new code)

async function updateField(id, field_name, updatedValue) {
    try {
        const fieldMap = {
            "Next Day": "next_day",
            "Day Completed": "day_completed",
            "Next Module": "next_module",
            "Module Completed": "module_completed",
            "Last_Msg": "last_msg",
            "Question Responses": "question_responses",
            "Responses": "responses",
            "Interactive_Responses": "interactive_responses",
            "Feedback": "feedback"
        };
        const dbField = fieldMap[field_name] || field_name;

        await db.query(`UPDATE students SET ${dbField} = ? WHERE id = ?`, [updatedValue, id]);
        console.log(`[DB] Record ${id} updated successfully: ${field_name} = ${updatedValue}`);
    } catch (error) {
        console.error('Error updating record in MySQL:', error);
    }
}

<<<<<<< HEAD
async function getID(phone) {
  try {
    if (!phone) return null;
    
    // Check cache first
    const cached = getCached(cache.userIds, phone);
    if (cached !== null) {
      return cached;
    }
    
    const fbf = encodeURIComponent(`{Phone} = '${phone}'`);
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${fbf}&maxRecords=1&fields=Phone`;
    const r = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    if (!r.ok) {
      const txt = await r.text();
      throw new Error(`Airtable getID HTTP ${r.status}: ${txt}`);
    }
    const data = await r.json();
    const id = data.records?.[0]?.id ?? null;
    
    // Cache the result
    if (id !== null) {
      setCache(cache.userIds, phone, id);
    }
    
    return id;
  } catch (e) {
    console.error('getID error:', e);
    throw e;
  }
=======
async function getID(number) {
    try {
        const [rows] = await db.query('SELECT id FROM students WHERE phone = ?', [number]);
        if (rows && rows.length > 0) {
            return rows[0].id;
        } else {
            console.log(`[DB] No matching student record found for phone: ${number}`);
            return null;
        }
    } catch (error) {
        console.error('Error in getID:', error);
        return null;
    }
>>>>>>> 118c424 (new code)
}

const totalDays = async (number) => {
<<<<<<< HEAD
  try {
    // Get the course table name first
    const course_tn = await findTable(number);
    
    // Handle case where findTable returns null/undefined
    if (!course_tn) {
      console.error('totalDays: Could not find course table for user', number);
      return undefined;
    }
    
    // Check cache using course name as key (all users in same course have same totalDays)
    const cached = getCached(cache.totalDays, course_tn);
    if (cached !== null) {
      return cached;
    }

    const url = `https://api.airtable.com/v0/${baseId}/${course_tn}?fields%5B%5D=Day`;
    console.log(url)

    const response = await fetch(`${url}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();

    const count = data.records.length;
    console.log(count);
    
    // Cache the result by course name
    setCache(cache.totalDays, course_tn, count);
    
    return count;

  } catch (error) {
    console.error('Error in totalDays:', error);
    // //throw error;
  }
};

const findTable = async (number) => {
  // Check cache first
  const cached = getCached(cache.userTables, number);
  if (cached !== null) {
    return cached;
  }

  const url = `https://api.airtable.com/v0/${baseId}/${tableId}`;

  const params = new URLSearchParams({
    filterByFormula: `({Phone} = "${number}")`,
    view: 'Grid view'
  });

  try {
    const response = await fetch(`${url}?${params}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      const course_tn = data.records[0].fields.Course;
      // Cache the result
      setCache(cache.userTables, number, course_tn);
      return course_tn;
    } else {
      // throw new Error('No matching record found');
    }
  } catch (error) {
    console.error('Error in findTable:', error);
    //throw error;
  }
=======
    try {
        const course_tn = await findTable(number);
        const [rows] = await db.query(
            'SELECT COUNT(DISTINCT day_number) as count FROM course_content WHERE course_name = ?',
            [course_tn]
        );
        return rows && rows.length > 0 ? rows[0].count : 0;
    } catch (error) {
        console.error('Error in totalDays:', error);
        return 0;
    }
};

const findTable = async (number) => {
    try {
        const [rows] = await db.query('SELECT course FROM students WHERE phone = ?', [number]);
        if (rows && rows.length > 0 && rows[0].course) {
            return rows[0].course;
        }
        return 'Mindset';
    } catch (error) {
        console.error('Error in findTable:', error);
        return 'Mindset';
    }
>>>>>>> 118c424 (new code)
};

const findRecord = async (id) => {
    try {
        const [rows] = await db.query('SELECT question_responses FROM students WHERE id = ?', [id]);
        if (rows && rows.length > 0) {
            return rows[0].question_responses !== null ? rows[0].question_responses : 0;
        }
        return 0;
    } catch (error) {
        console.error('Error in findRecord:', error);
        return 0;
    }
};

const findQuesRecord = async (id) => {
    try {
        const [rows] = await db.query('SELECT responses FROM students WHERE id = ?', [id]);
        if (rows && rows.length > 0) {
            return rows[0].responses !== null ? rows[0].responses : undefined;
        }
        return undefined;
    } catch (error) {
        console.error('Error in findQuesRecord:', error);
        return undefined;
    }
};

const findTitle = async (currentDay, module_no, number) => {
    try {
        const course_tn = await findTable(number);
        const [rows] = await db.query(
            `SELECT list_title, list_options 
             FROM course_content 
             WHERE course_name = ? AND day_number = ? AND module_number = ?`,
            [course_tn, currentDay, module_no]
        );
        if (rows && rows.length > 0 && rows[0].list_title !== null) {
            const title = rows[0].list_title;
            const options = rows[0].list_options || '';
            return [title, options.split('\n').filter(Boolean)];
        }
        return [0, 0];
    } catch (error) {
        console.error('Error in findTitle:', error);
        return [0, 0];
    }
};

const findInteractive = async (currentDay, module_no, number) => {
    try {
        const course_tn = await findTable(number);
        const [rows] = await db.query(
            `SELECT ibody, ibuttons 
             FROM course_content 
             WHERE course_name = ? AND day_number = ? AND module_number = ?`,
            [course_tn, currentDay, module_no]
        );
        if (rows && rows.length > 0 && rows[0].ibody !== null) {
            const body = rows[0].ibody;
            const buttons = rows[0].ibuttons || '';
            return [body, buttons.split('\n').filter(Boolean)];
        }
        return "No matching interactive content found";
    } catch (error) {
        console.error('Error in findInteractive:', error);
        return "No matching interactive content found";
    }
};

const findQuestion = async (currentDay, module_no, number) => {
    try {
        const course_tn = await findTable(number);
        const [rows] = await db.query(
            `SELECT question 
             FROM course_content 
             WHERE course_name = ? AND day_number = ? AND module_number = ?`,
            [course_tn, currentDay, module_no]
        );
        if (rows && rows.length > 0 && rows[0].question !== null) {
            return rows[0].question;
        }
        return "No matching question found";
    } catch (error) {
        console.error('Error in findQuestion:', error);
        return "No matching question found";
    }
};

const findLastMsg = async (number) => {
    try {
        const [rows] = await db.query('SELECT last_msg FROM students WHERE phone = ?', [number]);
        if (rows && rows.length > 0) {
            return rows[0].last_msg !== null ? rows[0].last_msg : undefined;
        }
        return undefined;
    } catch (error) {
        console.error('Error in findLastMsg:', error);
        return undefined;
    }
};

const find_ContentField = async (field, currentDay, current_module, number) => {
    try {
        const course_tn = await findTable(number);
        const fieldMap = {
            "Text": "module_text"
        };
        const dbField = fieldMap[field] || field;

        const [rows] = await db.query(
            `SELECT ${dbField} 
             FROM course_content 
             WHERE course_name = ? AND day_number = ? AND module_number = ?`,
            [course_tn, currentDay, current_module]
        );

        if (rows && rows.length > 0 && rows[0][dbField] !== null) {
            return rows[0][dbField].split('\n');
        }
        return 0;
    } catch (error) {
        console.error('Error in find_ContentField:', error);
        return 0;
    }
};

const findField = async (field, number) => {
    try {
        const fieldMap = {
            "Next Day": "next_day",
            "Day Completed": "day_completed",
            "Next Module": "next_module",
            "Module Completed": "module_completed",
            "Last_Msg": "last_msg",
            "Question Responses": "question_responses",
            "Responses": "responses",
            "Interactive_Responses": "interactive_responses",
            "Feedback": "feedback",
            "Course": "course"
        };
        const dbField = fieldMap[field] || field;
        const [rows] = await db.query(`SELECT ${dbField} FROM students WHERE phone = ?`, [number]);
        if (rows && rows.length > 0) {
            return rows[0][dbField] !== null ? rows[0][dbField] : 0;
        }
        return 0;
    } catch (error) {
        console.error('Error in findField:', error);
        return 0;
    }
};

const findAns = async (currentDay, module_no, number) => {
    try {
        const course_tn = await findTable(number);
        const [rows] = await db.query(
            `SELECT correct_answer 
             FROM course_content 
             WHERE course_name = ? AND day_number = ? AND module_number = ?`,
            [course_tn, currentDay, module_no]
        );
        if (rows && rows.length > 0 && rows[0].correct_answer !== null) {
            return rows[0].correct_answer;
        }
        return null;
    } catch (error) {
        console.error('Error in findAns:', error);
        return null;
    }
};

module.exports = {
<<<<<<< HEAD
  findTable,
  totalDays,
  updateField,
  findRecord,
  findTitle,
  findInteractive,
  findQuestion,
  findQuesRecord,
  getID,
  findLastMsg,
  findField,
  findAns,
  find_ContentField,
  clearUserCache
=======
    findTable,
    totalDays,
    updateField,
    findRecord,
    findTitle,
    findInteractive,
    findQuestion,
    findQuesRecord,
    getID,
    findLastMsg,
    findField,
    findAns,
    find_ContentField
>>>>>>> 118c424 (new code)
};
