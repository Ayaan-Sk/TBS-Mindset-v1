require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

const getAuthHeader = () => {
    return 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
};

const sendText = async (msg, senderID) => {
    if (!accountSid || !authToken) {
        console.error("Twilio credentials not configured in environment variables.");
        return { success: false, error: "Credentials missing" };
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const to = senderID.startsWith('whatsapp:') ? senderID : `whatsapp:${senderID}`;

    try {
        console.log(`[Twilio] Sending text to ${to}...`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                From: fromNumber,
                To: to,
                Body: msg
            })
        });

        const responseText = await response.text();
        if (!response.ok) {
            console.error(`[Twilio] sendText failed (HTTP ${response.status}):`, responseText);
            return { success: false, error: responseText };
        }

        const data = JSON.parse(responseText);
        console.log(`[Twilio] sendText successful. SID: ${data.sid}`);
        return { success: true, sid: data.sid };
    } catch (error) {
        console.error("[Twilio] sendText exception:", error);
        return { success: false, error: error.message };
    }
};

const sendInteractiveButtonsMessage = async (hTxt, bTxt, btnTxt, senderID) => {
    let formattedText = "";
    if (hTxt && hTxt.trim()) {
        formattedText += `*${hTxt.trim()}*\n`;
    }
    if (bTxt && bTxt.trim()) {
        formattedText += `${bTxt.trim()}\n`;
    }
    if (btnTxt && btnTxt.trim()) {
        formattedText += `\n👉 Reply with: *${btnTxt.trim()}*`;
    }
    return module.exports.sendText(formattedText, senderID);
};

const sendListInteractive = async (data, body, btnText, senderID) => {
    let formattedText = "";
    if (body && body.trim()) {
        formattedText += `${body.trim()}\n\n`;
    }
    formattedText += `👉 Please reply with one of the following options:`;
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item && item.title) {
                formattedText += `\n- *${item.title.trim()}*`;
            }
        });
    }
    return module.exports.sendText(formattedText, senderID);
};

const sendDynamicInteractiveMsg = async (data, body, senderID) => {
    let formattedText = "";
    if (body && body.trim()) {
        formattedText += `${body.trim()}\n\n`;
    }
    formattedText += `👉 Please reply with one of the following options:`;
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item && item.text) {
                formattedText += `\n- *${item.text.trim()}*`;
            }
        });
    }
    return module.exports.sendText(formattedText, senderID);
};

const sendMedia = async (mediaUrl, filename, senderID) => {
    if (!accountSid || !authToken) {
        console.error("Twilio credentials not configured in environment variables.");
        return { success: false, error: "Credentials missing" };
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const to = senderID.startsWith('whatsapp:') ? senderID : `whatsapp:${senderID}`;

    try {
        console.log(`[Twilio] Sending media to ${to} (URL: ${mediaUrl})...`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                From: fromNumber,
                To: to,
                MediaUrl: mediaUrl
            })
        });

        const responseText = await response.text();
        if (!response.ok) {
            console.error(`[Twilio] sendMedia failed (HTTP ${response.status}):`, responseText);
            return { success: false, error: responseText };
        }

        const data = JSON.parse(responseText);
        console.log(`[Twilio] sendMedia successful. SID: ${data.sid}`);
        return { success: true, sid: data.sid };
    } catch (error) {
        console.error("[Twilio] sendMedia exception:", error);
        return { success: false, error: error.message };
    }
};

const getMessages = async (senderID, at) => {
    // Stub implementation to maintain compatibility with the previous flow control
    return Promise.resolve({ text: "" });
};

const sendTemplateMessage = async (day, template_name, senderID) => {
    const msg = `Template broadcast: ${template_name} (Day ${day})`;
    return module.exports.sendText(msg, senderID);
};

module.exports = {
    sendText,
    sendInteractiveButtonsMessage,
    sendMedia,
    sendListInteractive,
    sendDynamicInteractiveMsg,
    getMessages,
    sendTemplateMessage
};
