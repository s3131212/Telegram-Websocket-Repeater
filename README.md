# Telegram Websocket Repeater
A simple program that creates a websocket server and redirect all Telegram messages.  
The code is initially designed for [SITCON 2019 IRC](https://github.com/sitcon-tw/SITCON2019-HTML-TOOLS).

## Usage
### Server
Put your [Telegram bot ID](https://telegram.me/BotFather) at `index.js` line 11.  

And execute:
```
npm install
node index.js
```

### Client
Include `telegramWebsocket.js` in your HTML  
```
<script src="telegramWebsocket.js"></script>
```

And initialize Telegram Websocket Repeater  
```
let ws = new TelegramWebSocket({
    "url": "ws://" + SERVER,
    "channel": "-123456789", // Group ID 
    "newText": function(data){ // New Text Message
        newMessage(data.text, data.message_id, data.from.first_name + " " + data.from.last_name, data.date);
    },
    "newPhoto": function(data){ // New Photo
        newPhoto(data.text, data.message_id, data.photoURL, data.from.first_name + " " + data.from.last_name, data.date);
    },
    "newSticker": function(data){ // New Sticker
        newMessage(data.sticker.emoji, data.message_id, data.from.first_name + " " + data.from.last_name, data.date);
    },
    "newVideo": function(data){ // New Video
        newMessage("[video]", data.message_id, data.from.first_name + " " + data.from.last_name, data.date);
    },
    "newDocument": function(data){ // New File
        newMessage("[document]" + data.file_name, data.message_id, data.from.first_name + " " + data.from.last_name, data.date);
    },
    "updateText": function(data){ // Update Text Message
        console.log("updateText", data);
        updateMessage(data);
    }
});
```

See [test.html](test.html) for more example code.  
There are some examples of message structures in [message_example.md](message_example.md), but the document is not finished yet and ill-written. :( 

## License
MIT