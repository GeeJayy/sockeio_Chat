/*************************************************** */
// SOCKET IO Chat Server
/*************************************************** */


/*************************************************** */
// IMPORTS
/*************************************************** */
const express = require('express');
const app = express();
const socketio = require('socket.io');

var namespaces = require('./data/namespaces.js');

/*************************************************** */
// EXPRESS MIDDLEWARE ROUTES
/*************************************************** */
//Use Express to Serve Static Items in the Public folder 
app.use(express.static(__dirname ));
app.use(express.static(__dirname + '/public'));

/*************************************************** */
// EXPRESS SERVER FOR HTTP TRAFFIC
/*************************************************** */
const port = 9000;
const expressServer = app.listen(port);

/*************************************************** */
// SOCKET SERVER LISTENTS TO HTTP SERVER
/*************************************************** */
var options = {
    path: '/socket.io',
    serveClient: true, //tells socketio node server, make this file available at this path**
};
const io = socketio(expressServer,options); // THE SOCKET SERVER (SERVER SIDE, not CLIENT)

/*************************************************** */
// MAIN NAMESPACE
/*************************************************** */
io.on('connection', (socket)=>{
    //console.log('Socket Handshake: ', socket.handshake.query)
    //Build an array to send back with the img and endpoint forEach NS
    let nsData = namespaces.map((ns)=>{
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    });
    //Send NS data back to the client. Need to use Socket, NOT io, because we want it
    //to go to just this client (socket.emit doesnt send to this socket); io sends it out to everyone in the NS
    socket.emit('nsList',nsData);
    
    console.log('****************************************');
    console.log(`******DEFAULT '/' NAMESPACE CREATED*****`);
    console.log('****************************************');
    console.log('**********NAMESPACES AVAILABLE**********')
    nsData.forEach((ns)=>{
        console.log(ns.endpoint);
    });
    console.log('****************************************\n');

});

//LOOP THRU NAMESPACES AND LISTEN FOR A CONNECTION
/*************************************************** */
// OTHER NAMESPACE SOCKETS
/*************************************************** */
namespaces.forEach((namespace)=>{
    //CONNECTION LISTENER FOR EACH NS
    io.of(namespace.endpoint).on('connection',(nsSocket)=>{
        const username = nsSocket.handshake.query.username;
        //NOW SEND OVER ROOM INFORMATION FOR THAT NAMESPACE
        nsSocket.emit('nsRoomLoad',namespace.rooms);
        //console.log('namespace rooms: ', namespace.rooms);
        // NOW JOIN ROOM AND RECEIVE EVENT
        nsSocket.on('joinRoom',(roomToJoin, numMembersCallback)=>{
            //BEFORE WE JOIN ROOM, LEAVE ALL OTHER ROOMS
            //FIRST ELEMENT (NOT 0) IS THE CURRENT ROOM 
            const currRoomTitle = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(currRoomTitle);
            //AFTER LEFT ROOM, UPDATE THAT ROOMS MEMBER COUNT
            updateUsersInRoom(namespace,currRoomTitle);
            //NOW JOIN THE NEW ROOM
            nsSocket.join(roomToJoin);
            //LOAD HISTORY
            const nsRoom = namespace.rooms.find((rm) => rm.rmTitle === roomToJoin); 
            nsSocket.emit('historyLoad',nsRoom.history);
            //SEND BACK NUM USERS IN THIS ROOM TO ALL SOCKETS IN THIS ROOM
            updateUsersInRoom(namespace,roomToJoin); 

        });

        //SERVER LISTENS FOR MESSAGES TO IT 
        nsSocket.on('newMessageToServer',(msg)=>{
            const timeStamp = new Date().toLocaleString(); //msg timestamp
            const fullMsg = {
                text: msg,
                time: timeStamp,
                userName: username,
                avatar: 'https://via.placeholder.com/30'
            };
            //SEND TO ALL SOCKETS IN THE ROOMS THIS SENDER SOCKET IS IN
            //THE USER WILL BE IN THE SECOND ROOM I THE OBJECT LIS
            //BC THE SOCKET ALWAYS JOINS ITS OWN ROOM ON CONNECTION
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            //FIND THE ROOM OBJECT FOR THIS ROOM:
            const nsRoom = namespace.rooms.find((rm) => rm.rmTitle === roomTitle);
            //PUSH MESSAGE TO ROOM HISTORY
            nsRoom.addMessage(fullMsg);
            //SEND MESSAGE TO ALL CLIENTS
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients',fullMsg);
        });

    });

});   

/*************************************************** */
// FUNCTION TO SEND NUMBER OF MEMBERS IN ANY ROOM
/*************************************************** */
function updateUsersInRoom(namespace,roomToJoin){
    io.of(namespace.endpoint).in(roomToJoin).clients((err,clients)=>{
        //console.log("Num Clients in Room: ",clients.length);
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers',clients.length);
    });
}