var connectionChat = new signalR.HubConnectionBuilder().withUrl("/hubs/chat").build();

document.getElementById("sendMessage").disabled = true;

connectionChat.on("MessageReceived", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user} - ${message}`;


    document.getElementById("notificationCounter").innerHTML = "<span>(" + counter + "</span>";
    for (let i = message.length - 1; i >= 0; i--) {
        var li = document.createElement("li");
        li.textContent = "Notification - " + message[i];
        document.getElementById("messageList").appendChild(li);
    }
});

//document.getElementById("sendButton").disabled = true;

document.getElementById("sendMessage").addEventListener("click", function (event) {
    var sender = document.getElementById("senderEmail").value;
    var message = document.getElementById("chatMessage").value;
    var receiver = document.getElementById("receiverEmail").value;

    if (receiver.length > 0) {
        connectionChat.invoke("SendMessageToReceiver", sender, receiver, message)
            .then(function () {
            }).catch(function (err) {
                return console.error(err.toString());
            });
    } else {
        connectionChat.send("SendMessageToAll", sender, message).then(function () {
        }).catch(function (err) {
            return console.error(err.toString());
        });
    }
    event.preventDefault();
});

connectionChat.start().then(function () {
    document.getElementById("sendMessage").disabled = false;
    //connectionChat.send("LoadMessages");
    //document.getElementById("sendButton").disabled = false;
});

