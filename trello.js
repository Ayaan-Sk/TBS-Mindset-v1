var request = require('request');
require('dotenv').config();

const sendText = async (msg, cardId) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': `https://api.trello.com/1/cards/${cardId}/actions/comments?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`,
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": msg
            })
        };

        request(options, function (error, response) {
            if (error) {
                console.error("Trello sendText error:", error);
                reject(error);
            } else {
                try {
                    const body = JSON.parse(response.body);
                    if (response.statusCode >= 200 && response.statusCode < 300) {
                        resolve(body);
                    } else {
                        console.error("Trello API error response:", body);
                        reject(new Error(`Trello API error: ${response.statusCode}`));
                    }
                } catch (e) {
                    console.error("Trello parsing error:", e, "Body:", response.body);
                    resolve(response.body); // Resolve anyway to match Wati silent fallback
                }
            }
        });
    });
}

const sendInteractiveButtonsMessage = async (hTxt, bTxt, btnTxt, cardId) => {
    let formattedText = "";
    if (hTxt && hTxt.trim()) {
        formattedText += `**${hTxt.trim()}**\n`;
    }
    if (bTxt && bTxt.trim()) {
        formattedText += `${bTxt.trim()}\n`;
    }
    if (btnTxt && btnTxt.trim()) {
        formattedText += `\n👉 Reply with: **${btnTxt.trim()}**`;
    }
    return sendText(formattedText, cardId);
}

const sendListInteractive = async (data, body, btnText, cardId) => {
    let formattedText = "";
    if (body && body.trim()) {
        formattedText += `${body.trim()}\n\n`;
    }
    formattedText += `👉 Please reply with one of the following options:`;
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item && item.title) {
                formattedText += `\n- **${item.title.trim()}**`;
            }
        });
    }
    return sendText(formattedText, cardId);
}

const sendDynamicInteractiveMsg = async (data, body, cardId) => {
    let formattedText = "";
    if (body && body.trim()) {
        formattedText += `${body.trim()}\n\n`;
    }
    formattedText += `👉 Please reply with one of the following options:`;
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item && item.text) {
                formattedText += `\n- **${item.text.trim()}**`;
            }
        });
    }
    return sendText(formattedText, cardId);
}

const sendMedia = async (file, filename, cardId) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': `https://api.trello.com/1/cards/${cardId}/attachments?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`,
            formData: {
                'file': {
                    'value': file,
                    'options': {
                        'filename': filename,
                        'contentType': null
                    }
                }
            }
        };

        request(options, function (error, response) {
            if (error) {
                console.error("Trello sendMedia error:", error);
                reject(error);
            } else {
                console.log("Trello sendMedia successfully uploaded attachment:", filename);
                resolve(response.body);
            }
        });
    });
}

// Stub implementation for compatibility
const getMessages = async (senderID, at) => {
    return Promise.resolve({ text: "" });
}

// Stub implementation for compatibility
const sendTemplateMessage = async (day, template_name, senderID) => {
    const msg = `Template broadcast: ${template_name} (Day ${day})`;
    return sendText(msg, senderID);
}

module.exports = {
    sendText,
    sendInteractiveButtonsMessage,
    sendMedia,
    sendListInteractive,
    sendDynamicInteractiveMsg,
    getMessages,
    sendTemplateMessage
}
