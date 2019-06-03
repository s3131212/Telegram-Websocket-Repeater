const TelegramBot = require('node-telegram-bot-api');
const WebSocket = require('ws');
const findRemoveSync = require('find-remove');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const baseDirectory = __dirname + '/files';

/* Telegram Bot Setting */
const token = ""; // Your bot token here
const bot = new TelegramBot(token, {polling: true});

function isJson(item) {
    item = typeof item !== "string" ? JSON.stringify(item) : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}

/* HTTP Server for serving static file */
const server = http.createServer(function (request, response) {
    try {
        var requestUrl = url.parse(request.url);
        var fsPath = baseDirectory + path.normalize(requestUrl.pathname.substring('/files'.length));

        var fileStream = fs.createReadStream(fsPath);
        fileStream.pipe(response);
        fileStream.on('open', function() {
             response.writeHead(200);
        });

        fileStream.on('error',function(e) {
             response.writeHead(404);
             response.end();
        })
   } catch(e) {
        response.writeHead(500);
        response.end();
   }
}).listen(8080); 

/* Websocket Server */
const wss = new WebSocket.Server({ server });
wss.broadcast = function broadcast(channel, message) {
    wss.clients.forEach(function each (client) {
        if(client.readyState == WebSocket.OPEN && client.channel == channel){
            client.send(message);
        }
    })
}
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        if(!isJson(message)) return;
        
        let data = JSON.parse(message);
        ws.channel = data.channel;
    });
});

/* Telegram Bot */
bot.on('text', function(msg){
    msg.mode = "newText";
	wss.broadcast(msg.chat.id, JSON.stringify(msg));
});
bot.on('photo', function(msg){
    msg.mode = "newPhoto";
    let photoStream = bot.downloadFile(msg.photo[msg.photo.length - 1].file_id, path.join(__dirname, "files")).then(function(value){
        msg.photoURL = value.substring(__dirname.length);
        wss.broadcast(msg.chat.id, JSON.stringify(msg));
    });
});
bot.on('sticker', function(msg){
    msg.mode = "newSticker";
	wss.broadcast(msg.chat.id, JSON.stringify(msg));
});
bot.on('video', function(msg){
    msg.mode = "newVideo";
    wss.broadcast(msg.chat.id, JSON.stringify(msg));
});
bot.on('document', function(msg){
    msg.mode = "newDocument";
    wss.broadcast(msg.chat.id, JSON.stringify(msg));
});
bot.on('edited_message_text', function(msg){
    msg.mode = "updateText";
    wss.broadcast(msg.chat.id, JSON.stringify(msg));
});



setInterval(findRemoveSync.bind(this,path.join(__dirname, 'files'), {age: {seconds: 3600}}), 360000);