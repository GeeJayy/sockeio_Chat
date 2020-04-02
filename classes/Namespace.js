/************************************************/
//
//
/************************************************/



/************************************************/
// Namespace Class definition
// give and id, title, image, and which namespace from main '/'
/************************************************/
class Namespace{
    constructor(id, nsTitle, img ,endpoint){
        this.id = id;
        this.nsTitle = nsTitle;
        this.img = img;
        this.endpoint = endpoint;
        this.rooms = [];

    }

    //Class Method to add a Room to the Namespace:
    addRoom(roomObj){
        this.rooms.push(roomObj);
    }


}

module.exports = Namespace;