
/*************************************************** */
// FUNCTION TO JOIN A ROOM
/*************************************************** */
function joinRoom(roomName){
    //SEND THIS ROOM NAME TO THE SERVER, SO THE SERVER CAN JOIN IT
    nsSocket.emit('joinRoom', roomName, (numMembers)=>{
        //UPDATE ROOM MEMBER TOTAL NOW THAT WE'VE JOINED
        console.log(roomName);
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers}  <span class="glyphicon glyphicon-user"></span>`;
    });

    //WHEN THE HISTORY IS PUSHED, LOAD IT
    nsSocket.on('historyLoad',(history)=>{
        //UPDATE THE DOM WITH ALL CHAT HISTORY
        const messagesUL = document.querySelector('#messages');
        messagesUL.innerHTML = "";
        history.forEach((msg)=>{
            const newMsg = buildHTMLMessage(msg);
            messagesUL.innerHTML += newMsg;
        });
        //WANT NEWEST MESSAGES AT BOTTOM TO BE SCROLLED TO
        messagesUL.scrollTo(0,messagesUL.scrollHeight);


    });
    //UPDATE NUMBER OF MEMBERS IN THE ROOM
    nsSocket.on('updateMembers',(numMembers)=>{
        //WHEN SOMEONE JOINS/LEAVES A ROOM, UPDATE NUMBER COUNT
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers}  <span class="glyphicon glyphicon-user"></span>`;
        //WHEN SOMEONE JOINS A ROOM, UPDATE ROOM NAME
        document.querySelector('.curr-room-text').innerHTML = `${roomName}`;

    });

    
    /*************************************************** */
    // ALLOW FOR SEARCHING OF MESSAGES
    /*************************************************** */
    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input',(e)=>{
        //console.log(e.target.value);
        let messagesTxt = Array.from(document.getElementsByClassName('message-text'));
        let messageUsers = Array.from(document.getElementsByClassName('user-message'));
        let messageIMGs = Array.from(document.getElementsByClassName('user-image'));
        //NOW CHECK IF MATCHES MESSAGE CONTENTS
        messagesTxt.forEach((msg,i)=>{
            if(msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1){
                //THE MESSAGE DOESNT CONTAIN THE USER SEARCH TERMS
                msg.style.display = "none";
                messageUsers[i].style.display = "none";
                messageIMGs[i].style.display = "none";
            }
            else{
                msg.style.display = "block";
                messageUsers[i].style.display = "block";
                messageIMGs[i].style.display = "block";
            }
        });
    });

};