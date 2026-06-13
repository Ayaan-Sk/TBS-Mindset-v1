var request = require('request');
require('dotenv').config();
<<<<<<< HEAD

var request = require('request');
=======
>>>>>>> 118c424 (new code)

const getMessages = async (senderID, at) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'GET',
            'url': `https://${process.env.URL}/api/v1/getMessages/${senderID}`,
            'headers': {
                'Authorization': process.env.API
            },
            formData: {
                'pageSize': '10',
                'pageNumber': '1'
            }
        };
        request(options, function (error, response) {
            if (error) { console.log(error); }
            else {
                at = Number(at)
                // console.log(typeof at)
                try {
                    // console.log("response.body ", response)
                    result = JSON.parse(response.body)
                    // console.log("result 1 ", result.messages.items[at]?.text)

                    // console.log("result", result.messages)
                    if (result != undefined) {

                        last_text = result.messages.items[at].text

                        resolve(result.messages.items[at]);
                    }
                }
                catch (error) {
                    console.log(error);
                    //reject(e);
                }
            }



        });
    })
}
const sendMedia = async (file, filename, senderID) => {
    var options = {
        'method': 'POST',
        'url': 'https://' + process.env.URL + '/api/v1/sendSessionFile/' + senderID,
        'headers': {
            'Authorization': process.env.API,

        },
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
        if (error) console.log(error)
        //console.log(response.body);
    });

}

const sendInteractiveButtonsMessage = async (hTxt, bTxt, btnTxt, senderID) => {
    var options = {
        'method': 'POST',
        'url': 'https://' + process.env.URL + '/api/v1/sendInteractiveButtonsMessage?whatsappNumber=' + senderID,
        'headers': {
            'Authorization': process.env.API,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "header": {
                "type": "Text",
                "text": hTxt
            },
            "body": bTxt,
            "buttons": [
                {
                    "text": btnTxt
                }
            ]
        })

    };
    request(options, function (error, response) {
        if (error) console.log(error);
        console.log(response.body);
    });
}

const sendText = async (msg, senderID) => {

    var options = {
        'method': 'POST',
        'url': 'https://' + process.env.URL + '/api/v1/sendSessionMessage/' + senderID,
        'headers': {
            'Authorization': process.env.API,

        },
        formData: {
            "messageText": msg,
        }
    };
    request(options, function (error, response) {
        if (error) {
            console.error("WATI sendText request error:", error);
            return;
        }
        if (!response || !response.body) {
            console.error("WATI sendText empty response");
            return;
        }
        try {
            const body = JSON.parse(response.body);
            const result = body.result;
            //console.log(typeof result)
        } catch (e) {
            console.error("WATI sendText parsing error:", e, "Body:", response.body);
        }
    });
}
const sendListInteractive = async (data, body, btnText, senderID) => {
    var options = {
        'method': 'POST',
        'url': 'https://' + process.env.URL + '/api/v1/sendInteractiveListMessage?whatsappNumber=' + senderID,
        'headers': {
            'Authorization': process.env.API,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "header": "",
            "body": body,
            "footer": "",
            "buttonText": btnText,
            "sections": [
                {
                    "title": "Options",
                    "rows": data
                }
            ]
        })

    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log("Result returned", response.body);

    });
}

/**
 * [
                {
                    "text": "Yes "
                },
                {
                    "text": "No "
                },
                {
                    "text": "No 2"
                }
            ]
 * @param {*} data 
 * @param {*} body 
 * @param {*} senderID 
 */
const sendDynamicInteractiveMsg = async (data, body, senderID) => {

    var options = {
        'method': 'POST',
        'url': 'https://' + process.env.URL + '/api/v1/sendInteractiveButtonsMessage?whatsappNumber=' + senderID,
        'headers': {
            'Authorization': process.env.API,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "body": body,
            "buttons": data
        })

    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });

}

async function sendTemplateMessage(day, template_name, senderID) {
    params = [{ 'name': "day", "value": day }]
    var options = {
        'method': 'POST',
        'url': 'https://' + process.env.URL + '/api/v1/sendTemplateMessage/' + senderID,
        'headers': {
            'Authorization': process.env.API,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "template_name": template_name,
            "broadcast_name": template_name,
            "parameters": JSON.stringify(params)
        })

    };
    request(options, function (error, response) {
        if (error) {
            console.error("WATI sendTemplateMessage request error:", error);
            return;
        }
        if (!response || !response.body) {
            console.error("WATI sendTemplateMessage empty response");
            return;
        }
        try {
            const body = JSON.parse(response.body);
            const result = body.result;
            if (result === false) {
                console.log("WATI error " + response.body);
            }
            console.log("Res " + result);
        } catch (e) {
            console.error("WATI sendTemplateMessage parsing error:", e, "Body:", response.body);
        }
    });
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

