const chatForm= document.getElementById("chat-form");
const chatMessages= document.querySelector(".chat-messages");
const socket= io();

// passing message to server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop= chatMessages.scrollHeight;
});

//message submit

chatForm.addEventListener("submit", e=>{
e.preventDefault();

const msg= e.target.elements.msg.value;


// emit message to server
socket.emit('chatMessage', msg);

e.target.elements.msg.value='';
e.target.elements.msg.focus();


});

// output message to DOM

function outputMessage(message){
    const div= document.createElement("div");
    div.classList.add("message");
    const d= new Date();
    let hour= d.getHours();
    let minutes= d.getMinutes();
    div.innerHTML=`<p class="meta">Brad <span>${hour+':'+minutes}</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}

//29:03