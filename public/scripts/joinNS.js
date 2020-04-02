/*************************************************** */
// FUNCTION TO JOIN A NAMESPACE
/*************************************************** */
function joinNS(endpoint){
    //Check if socket is already set, 
    if(nsSocket){
        nsSocket.close();
        //Remove event listener before it's added again. otherwise many events stacked
        document.querySelector('#user-input').removeEventListener('submit',formSubmitCallBack);
    }
    //CONNECT TO NS ENDPOINT
    //OVERRIDE THE GLOBAL HERE TO A NEW NS
    nsSocket = io(`http://localhost:9000${endpoint}`); 

    //LOAD ROOMS FOR THIS NAMESPACE
    nsSocket.on('nsRoomLoad',(nsRooms)=>{
        //console.log("NS room info: ", nsRooms  );
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML="";
        nsRooms.forEach((room)=>{
            let glyph = room.privateRoom ? 'lock' : 'globe'; //Ternary expression for lock icon
            roomList.innerHTML+=`<li class = "room"> <span class="glyphicon glyphicon-${glyph}"></span>${room.rmTitle}</li>`
        });

        //ADD A CLICK LISTENER TO EACH ROOM
        let roomNodes = document.getElementsByClassName('room');
        //MAKE ARRAY FROM HTML LIST
        Array.from(roomNodes).forEach((elem)=>{
            //ADD EVENT LISTENER TO EACH ROOM ICON
            elem.addEventListener('click',(event)=>{
                // JOIN ROOM THAT IS SELECTED
                joinRoom(elem.innerText);
            });
        });

        //ADD USER TO A ROOM AUTOMATICALLY:
        const topRoom = document.querySelector('.room'); //Grabs first instance of room
        const topRoomName = topRoom.innerText;
        //AUTO JOIN FIRST ROOM IN LIST
        joinRoom(topRoomName);

    }); 

    //When we receive chat messages from the server, post to HTML
    nsSocket.on('messageToClients',(msg)=>{
        //console.log("Message to Clients: ",msg);
        const newMsg = buildHTMLMessage(msg);
        document.getElementById('messages').innerHTML += newMsg ;
    });

    //WHEN CHAT MESSAGE IS ADDED TO THE FORM AND SUBMITTED TO THE SERVER
    document.querySelector('.message-form').addEventListener('submit',formSubmitCallBack);

}

/*************************************************** */
// EVENT LISTENER CALLBACK FOR NS. 
// SO IT CAN ADDED/REMOVED AS NS ARE JOINED/REMOVED
/*************************************************** */
function formSubmitCallBack(event){
    //Prevent form submission on page Load
    event.preventDefault();
    //Now get the contents of the message submission:
    var newMessage = document.getElementById('user-message').value;
    //Now send this to the Socket Server 
    nsSocket.emit('newMessageToServer',{text: newMessage});
}

/*************************************************** */
// FUNCTION TO BUILD HTML OF SUBMITTED MESSAGES
/*************************************************** */
function buildHTMLMessage(msg){
    const newHTML = `
    <li>
        <div class="user-image">
            <img src=${msg.avatar} />
        </div>
        <div class="user-message">
            <div class="user-name-time">${msg.userName} <span>${msg.time}</span></div>
            <div class="message-text">${msg.text.text}</div>
        </div>
    </li>
    `
    return newHTML;
}

