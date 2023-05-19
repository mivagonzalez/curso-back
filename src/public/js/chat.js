const socket = io();

let user;
const chatbox = document.getElementById("chatbox");

Swal.fire({
  title: "BIENVENIDO, por favor Identificate",
  input: "text",
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("authenticated", user);
});

chatbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatbox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatbox.value });
      chatbox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  if (!user) return;
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((msg) => {
    messages += `${msg.user} dice: ${msg.message}<br/>`;
  });
  log.innerHTML = messages;
});

socket.on("newUserConnected", (user, messages) => {
  if (!user) return;
  Swal.fire({
    title: `el ${user} ha iniciado sesion`,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    icon: "success",
  }); 
});

socket.on("loadMessages", async messages => {
    let log = document.getElementById("messageLogs");
    let messagesStr = "";
    messages.forEach((msg) => {
      messagesStr += `${msg.user} dice: ${msg.message}<br/>`;
    });
    log.innerHTML = messagesStr;
});