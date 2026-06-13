# WhatsApp & Airtable Learning Flow Bot (TBS-Mindset-v1)

A Node.js and Express-based WhatsApp chatbot integrated with Airtable to deliver structured courses, check learner progress, manage quizzes, and record feedback. It leverages the Wati WhatsApp API for interactive customer communication and dynamic layouts.

---

## 🚀 Key Features

*   **Structured Content Delivery**: Automatically parses and pushes daily course material and interactive modules.
*   **Interactive UI elements**: Sends WhatsApp interactive buttons, list options, and session media.
*   **Airtable Integration**: Direct API fetch interface to fetch, update, and manage learner information, days completed, and feedback in real-time.
*   **Split-Message Flow**: Splits long modules with special placeholders (e.g., `#` or `Image`) and spaces messages dynamically.
*   **Robust Session Error Handling**: Safely parses callback payloads and network responses without crashing.

---

## 📂 Project Architecture

Here is how the core files interact with each other:

```
                      +-------------------+
                      |   Wati Webhook    |
                      +---------+---------+
                                | (POST /web)
                                v
                      +-------------------+
                      |     server.js     |
                      +----+---------+----+
                           |         |
          +----------------+         +-----------------+
          |                                            |
          v                                            v
+-------------------+                        +-------------------+
|      test.js      +----------------------->|     update.js     |
| (Flow Controller) |   (Airtable Helpers)   | (Direct Rest API) |
+----+---------+----+                        +---------+---------+
     |         |                                       |
     |         |                                       v
     |         |                             +-------------------+
     |         |                             |   Airtable REST   |
     |         |                             +-------------------+
     v         v
+----+----+  +-+-------+
| wati.js |  |image.js |
+----+----+  +----+----+
     |            |
     |            | (Media Fetch & Push)
     v            v
+----+------------+----+
|      Wati API        |
+----------------------+
```

### Module Breakdown:

*   **[server.js](file:///c:/Users/AA/Desktop/ekatra/TBS-Mindset-v1/server.js)**: Configures the Express server. Listens to Wati's incoming message webhook (`/web`), evaluates keywords like *Let's Begin*, *Start Day*, or *Next.*, and delegates actions.
*   **[test.js](file:///c:/Users/AA/Desktop/ekatra/TBS-Mindset-v1/test.js)**: Controls course flow. It evaluates if quiz answers are correct/incorrect, triggers multi-step content, delays split messages, and handles student progress updates.
*   **[update.js](file:///c:/Users/AA/Desktop/ekatra/TBS-Mindset-v1/update.js)**: Contains high-performance wrapper methods communicating directly with Airtable's REST endpoint via modern HTTP `fetch` calls.
*   **[wati.js](file:///c:/Users/AA/Desktop/ekatra/TBS-Mindset-v1/wati.js)**: Interface library to communicate with the Wati API for sending regular text, session media, dynamic interactive buttons, interactive lists, and custom templates.
*   **[image.js](file:///c:/Users/AA/Desktop/ekatra/TBS-Mindset-v1/image.js)**: Fetches media attachment URLs from Airtable course records and feeds raw binary streams to Wati's file upload API.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher recommended since it uses native `fetch`) and `npm` installed.

### 2. Clone and Install Dependencies
Navigate to the directory and install dependencies:
```bash
npm install
```

### 3. Environment Variables Setup
Copy the `.env.example` file to create your `.env` configuration:
```bash
copy .env.example .env
```

Open `.env` and populate the key configurations:
```ini
# Express Server Port
PORT=3000

# Wati WhatsApp API
URL=your-wati-subdomain.wati.io
API=Bearer YOUR_WATI_ACCESS_TOKEN

# Airtable Credentials
personal_access_token=pat...
baseId=app...
tableId=tblStudentTable
content_tableID=tblContentTable

# Legacy Airtable SDK Config (support for image.js)
apiKey=pat...
base=app...
```

---

## 🏎️ Running the Code

### Development Mode (with hot-reloading)
Runs the server using `nodemon`, restarting automatically on file changes:
```bash
npm start
```

### Production Mode
Runs the standard node process:
```bash
node server.js
```

---

## 🔧 Recently Fixed Issues

We have resolved a couple of stability and configuration issues in the codebase:

1.  **Unsafe Wati Response Parsing**: Fixed issues in `wati.js` where `JSON.parse(response.body)` was executed directly on unverified network responses. If a network issue occurred or Wati returned an empty body, the application would crash. This is now wrapped in stable try-catch blocks with local scoping (`const`/`let`) to avoid memory pollution.
2.  **Inconsistent dotenv Initialization**: Standardized `require('dotenv').config()` across `server.js`, `wati.js`, and `image.js` to search the standard root directory instead of hardcoded `./env` relative parameters, ensuring consistent environment variable resolution.
3.  **Duplicate Require Declaration**: Cleaned up double declarations of the `request` package import at the top of `wati.js`.
