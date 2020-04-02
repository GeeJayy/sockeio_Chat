/************************************************/
//
//
/************************************************/



/************************************************/
// Namespace Class definition
// give and id, title, image, and which namespace from main '/'
/************************************************/
class Room{
    constructor(roomID, rmTitle, namespace, privateRoom = false){
        this.roomID = roomID;
        this.rmTitle = rmTitle;
        this.namespace = namespace;
        this.privateRoom = privateRoom;
        this.history = []; //maintains history of chat

    }

    //Class Method to add a Room to the Namespace:
    addMessage(msg){
        this.history.push(msg);
    }

    clearHistory(){
        this.history = [];
    }
    

}

module.exports = Room;