const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-btn");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");

nameInput.value = localStorage.getItem("name") || "";

loadMessages();

sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", clearMessages);

messageInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {

    const name = nameInput.value;
    const text = messageInput.value;

    if (!name || !text) return;

    const id = Date.now();

    const time = new Date().toLocaleTimeString(
        "ja-JP",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

    localStorage.setItem("name", name);

    const message = {
        id,
        name,
        text,
        time
    };

    addMessageToScreen(message);

    const messages =
        JSON.parse(localStorage.getItem("messages"))
        || [];

    messages.push(message);

    localStorage.setItem(
        "messages",
        JSON.stringify(messages)
    );

    messageInput.value = "";
}

function addMessageToScreen(message) {

    const { id, name, text, time } = message;

    const myName = nameInput.value;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add(
        "message",
        name === myName ? "me" : "other"
    );

    const nameDiv = document.createElement("div");
    nameDiv.className = "message-name";
    nameDiv.textContent = name;

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "bubble";
    bubbleDiv.textContent = text;

    const timeDiv = document.createElement("div");
    timeDiv.className = "time";
    timeDiv.textContent = time;

    messageDiv.append(
        nameDiv,
        bubbleDiv,
        timeDiv
    );

    if (name === myName) {

        const deleteBtn =
            document.createElement("button");

        deleteBtn.textContent = "削除";

        deleteBtn.onclick =
            () => deleteMessage(id);

        messageDiv.appendChild(deleteBtn);
    }

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop =
        chatBox.scrollHeight;
}

function loadMessages() {

    const messages =
        JSON.parse(localStorage.getItem("messages"))
        || [];

    messages.forEach(addMessageToScreen);
}

function deleteMessage(id) {

    const messages =
        (JSON.parse(localStorage.getItem("messages"))
        || [])
        .filter(m => m.id !== id);

    localStorage.setItem(
        "messages",
        JSON.stringify(messages)
    );

    chatBox.innerHTML = "";

    loadMessages();
}

function clearMessages() {

    localStorage.removeItem("messages");

    chatBox.innerHTML = "";
}