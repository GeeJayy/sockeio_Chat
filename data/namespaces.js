// Bring in the room class
const Namespace =  require('../classes/Namespace.js');
const Room =  require('../classes/Room.js');

// Set up the namespaces
let namespaces = [];
let breadNS = new Namespace(0,'Bread','https://image.flaticon.com/icons/svg/2478/2478579.svg','/bread');
let climbNS = new Namespace(1,'Climbing','https://image.flaticon.com/icons/svg/284/284449.svg','/climbing');
let gamingNs = new Namespace(2,'Gaming','https://image.flaticon.com/icons/svg/771/771298.svg','/gaming');



// Make the main room and add it to rooms. it will ALWAYS be 0
breadNS.addRoom(new Room(0,'Recipes','Bread'));
breadNS.addRoom(new Room(1,'Grains','Bread',));
breadNS.addRoom(new Room(2,'Sourdough Starters','Bread'));

climbNS.addRoom(new Room(0,'Alpine','Climbing'));
climbNS.addRoom(new Room(1,'Trad','Climbing'));
climbNS.addRoom(new Room(2,'Sport','Climbing'));
climbNS.addRoom(new Room(3,'Bouldering','Climbing'));
climbNS.addRoom(new Room(4,'Training','Climbing',true));

gamingNs.addRoom(new Room(0,'FPS','Gaming'));
gamingNs.addRoom(new Room(1,'RTS','Gaming'));
gamingNs.addRoom(new Room(2,'RPG','Gaming'));
gamingNs.addRoom(new Room(3,'Builds','Gaming',true));

namespaces.push(breadNS,climbNS,gamingNs);


module.exports = namespaces;


//BREAD Icons made by <a href="https://www.flaticon.com/authors/payungkead" title="Payungkead">Payungkead</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
//COMPUTER Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
//MOUNTAIN <div>Icons made by <a href="https://www.flaticon.com/authors/popcorns-arts" title="Icon Pond">Icon Pond</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>