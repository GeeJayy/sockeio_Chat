//Bring in connection to socket server
// The HTTP Server to Bind to port 9000
//const socket = io('http://localhost:9000');// Default Namespace '/'

//prompt for username
const userName = prompt('Enter a Username:');

const userData = {
    query: {
        username: userName
    }
};

const socket = io('http://localhost:9000',userData);// Default Namespace '/'
let nsSocket = ""; //INITIAL GLOBAL VAR
 
//LISTEN FOR NS LIST 
socket.on('nsList',(nsData)=>{
    //NOW UPDATE THE DOM WITH THIS DATA
    var nsDiv = document.querySelector('.namespaces');
    nsDiv.innerHTML = "";
    nsData.forEach((ns) => {
        nsDiv.innerHTML+=`<div class = "namespace" ns=${ns.endpoint} > <img src="${ns.img}"/></div>`
    });
    //NOW ADD A CLICK EVENT LISTENER FOR EACH NS ICON
    Array.from(document.getElementsByClassName('namespace')).forEach((elem)=>{
        elem.addEventListener('click',(event)=>{
            let nsEndpoint = elem.getAttribute('ns');
            //CLICK WILL JOIN THE CHOSEN NAMESPACE
            //AUTO JOIN THE WIKI NAMESPACE AS A DEFAULT
            joinNS(nsEndpoint);

        });
    });
    
    //AUTO JOIN THE bread NAMESPACE AS A DEFAULT
    joinNS('/bread');

}); 


    