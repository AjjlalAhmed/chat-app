const ws = new WebSocket("wss://chat-app-ajjlal.herokuapp.com/");
const messageContainer = document.querySelector("#messages");
const sendBtn = document.querySelector(".send-btn");
const messageInput = document.querySelector("#send-input");
const oldUserName = localStorage.getItem("userName");
const messageUl = document.createElement("ul");
messageContainer.append(messageUl);
let userName;
if (oldUserName) {
  userName = oldUserName;
} else {
  userName = prompt("What is your name");
  if (typeof userName != "object") {
    localStorage.setItem("userName", userName);
  }
}
ws.addEventListener("open", () => {
  ws.send(
    JSON.stringify({
      event: "adding_new_user",
      payload: { userName: userName },
    })
  );
});
ws.addEventListener("message", ({ data }) => {
  const parseData = JSON.parse(data);
  if (parseData.event == "sending_message") {
    let liInnerhtml = `<li class="user-message">
    <span class="user-message-info">${parseData.payload.name}  ${parseData.payload.date}</span>
    <span class="user-message-text">${parseData.payload.message}</span>
    </li>`;
    let li = document.createElement("li");
    li.innerHTML = liInnerhtml;
    messageUl.append(li);
  } else {
    const li = document.createElement("li");
    li.innerText = parseData.payload;
    li.classList.add("connected");
    messageUl.append(li);
  }
});
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let messageValue = messageInput.value;
  if (messageValue == "") {
    alert("Message is empty");
  } else {
    const date = new Date();
    ws.send(
      JSON.stringify({
        event: "sending_message",
        payload: {
          name: userName,
          message: messageValue,
          date: `${date.getHours()}.${date.getMinutes()}`,
        },
      })
    );
    let liInnerhtml = `<li class="your-message">
    <span class="your-message-info">you  ${date.getHours()}.${date.getMinutes()}</span>
    <span class="your-message-text">${messageValue}</span>
    </li>`;
    let li = document.createElement("li");
    li.innerHTML = liInnerhtml;
    messageUl.append(li);
    messageInput.value = "";
  }
});
