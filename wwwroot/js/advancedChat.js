var connectionAdvancedChat = new signalR.HubConnectionBuilder().withUrl("/hubs/advancedChat").withAutomaticReconnect([0, 1000, 5000, null]).build();

connectionAdvancedChat.on("ReceiveUserConnected", function (userId, userName) {
    addMessage(`${userName} is online`);
});

connectionAdvancedChat.on("ReceiveUserDisconnected", function (userId, userName) {
    addMessage(`${userName} is offline`);
});

connectionAdvancedChat.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    addMessage(`${userName} has created room ${roomName}`);
    fillRoomDropDown();
});

connectionAdvancedChat.on("ReceiveDeleteRoomMessage", function (deleted, selected, roomName, userId, userName) {
    addMessage(`${userName} has deleted room ${roomName}`);
    fillRoomDropDown();
});

connectionAdvancedChat.on("ReceivePublicMessage", function (roomId, message, userName, roomName) {
    addMessage(`[Public Message - ${roomName}] ${userName} says: ${message}`);
});

connectionAdvancedChat.on("ReceivePrivateMessage", function (senderId, senderName, receiverId, message, chatId, receiverName) {
    addMessage(`[Private Message to - ${receiverName}] ${senderName} says: ${message}`);
});


function sendPublicMessage() {
    let inputMsg = document.getElementById('txtPublicMessage');
    let ddlSelRoom = document.getElementById('ddlSelRoom');

    let roomId = ddlSelRoom.value;
    var roomName = ddlSelRoom.options[ddlSelRoom.selectedIndex].text;

    var message = inputMsg.value;

    connectionAdvancedChat.send("SendPublicMessage", Number(roomId), message, roomName);
    inputMsg.value = '';
}

function sendPrivateMessage() {
    let inputMsg = document.getElementById('txtPrivateMessage');
    let ddlSelUser = document.getElementById('ddlSelUser');

    let receiverId = ddlSelUser.value;
    var receiverName = ddlSelUser.options[ddlSelUser.selectedIndex].text;

    var message = inputMsg.value;

    connectionAdvancedChat.send("SendPrivateMessage", receiverId, message, receiverName);
    inputMsg.value = '';
}



function addNewRoom(maxRoom) {
    let createRoomName = document.getElementById('createRoomName');

    var roomName = createRoomName.value;

    if (roomName == null && roomName == '') {
        return;
    }

    /*POST*/
    $.ajax({
        url: '/ChatRooms/Post',
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: 0, name: roomName }),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {
            console.log(json);
            /*ADD ROOM COMPLETED SUCCESSFULLY*/
            connectionAdvancedChat.invoke("SendAddRoomMessage", maxRoom, json.id, json.name);

            createRoomName.value = '';
        },
        error: function (xhr) {
            JSON.stringify(xhr);
            console.log(xhr);
            alert(JSON.stringify(xhr));
        }
    })
}

function deleteRoom() {
    let ddlDelRoom = document.getElementById('ddlDelRoom');

    var roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text;

    let text = `Do you want to delete Chat Room ${roomName}?`
    if (confirm(text) == false) {
        return;
    }

    if (roomName == null && roomName == '') {
        return;
    }

    let roomId = ddlDelRoom.value;

    /*POST*/
    $.ajax({
        url: `/ChatRooms/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: 'application/json; charset=utf-8',
        async: true,
        processData: false,
        cache: false,
        success: function (json) {
            console.log(json);

            /*DELETE ROOM COMPLETED SUCCESSFULLY*/
            connectionAdvancedChat.invoke("SendDeleteRoomMessage", json.deleted, json.selected, roomName);
            fillRoomDropDown();
        },
        error: function (xhr) {
            JSON.stringify(xhr);
            console.log(xhr);
            alert(JSON.stringify(xhr));
        }
    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    fillRoomDropDown();
    fillUserDropDown();
})

function fillUserDropDown() {
    $.getJSON('/ChatRooms/ListChatUsers')
        .done(function (json) {
            var ddlSelUser = document.getElementById("ddlSelUser");

            ddlSelUser.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.userName;
                newOption.value = item.id;
                ddlSelUser.add(newOption);
            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
}

function fillRoomDropDown() {
    $.getJSON('/ChatRooms/ListChatRooms')
        .done(function (json) {
            var ddlDelRoom = document.getElementById("ddlDelRoom");
            var ddlSelRoom = document.getElementById("ddlSelRoom");

            ddlDelRoom.innerText = null;
            ddlSelRoom.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.name;
                newOption.value = item.id;
                ddlDelRoom.add(newOption);

                var newOption1 = document.createElement("option");

                newOption1.text = item.name;
                newOption1.value = item.id;
                ddlSelRoom.add(newOption1);
            });
        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
}

function addMessage(msg) {
    if (msg == null && msg == '') {
        return;
    }

    let ui = document.getElementById('messagesList');
    let li = document.createElement('li');
    li.innerHTML = msg;
    ui.appendChild(li);
}

connectionAdvancedChat.start().then(function () {
});

