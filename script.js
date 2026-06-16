import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBVCzIC5aH8VBxczuPL__uq_jAEZh2vPmQ",
    authDomain: "riku-chat-fddc4.firebaseapp.com",
    databaseURL: "https://riku-chat-fddc4-default-rtdb.firebaseio.com",
    projectId: "riku-chat-fddc4",
    storageBucket: "riku-chat-fddc4.firebasestorage.app",
    messagingSenderId: "967155088337",
    appId: "1:967155088337:web:80f7ed7c3eb042a946bef0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const messagesRef = ref(db,"messages");
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-btn");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");

nameInput.value = localStorage.getItem("name") || "";

//loadMessages();

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

    push(messagesRef, message);

    messageInput.value = "";
}

function addMessageToScreen(message) {

    const { 
        id, 
        name, 
        text, 
        time,
        firebaseKey
    } = message;

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
            () => deleteMessage(firebaseKey);

        messageDiv.appendChild(deleteBtn);
    }

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop =
        chatBox.scrollHeight;
}

onValue(messagesRef, (snapshot) => {

    chatBox.innerHTML = "";

    const data = snapshot.val();

    if (!data) return;

    Object.entries(data).forEach(([key, message]) => {

        message.firebaseKey = key;

        addMessageToScreen(message);

    });

});

function deleteMessage(firebaseKey) {

    remove(
        ref(
            db,
            "messages/" + firebaseKey
        )
    );

}

function clearMessages() {

    localStorage.removeItem("messages");

    chatBox.innerHTML = "";
}