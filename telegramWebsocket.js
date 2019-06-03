let TelegramWebSocket = function(option){
    if(!option.hasOwnProperty("url")){
        throw new Error("Missing Argument: url");
    }
    if(!option.hasOwnProperty("channel")){
        throw new Error("Missing Argument: channel");
    }

    let ws = new WebSocket(option.url);
    if(!ws){
        throw new Error("Fail to initialize Websocket");
    }
    ws.onopen = function (e) {
        console.log('Connection to server opened:' + ws.readyState); 
        ws.send(JSON.stringify({
            "channel": option.channel
        }))
    }

    ws.onmessage = function (event) {
        console.log("Message recieved: " + event.data);
        let data = JSON.parse(event.data);
        console.log(data["mode"]);
        if(option.hasOwnProperty(data["mode"]) && typeof option[data["mode"]] == "function"){
            option[data["mode"]](data);
        }
    }

    return ws;
}