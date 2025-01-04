// DOM Elements
const log = document.getElementById('log');
const input = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const roomInput = document.getElementById('roomInput');
const joinButton = document.getElementById('joinButton');
const roomDisplay = document.getElementById('currentRoom');

// WebSocket connection
const ws = new WebSocket('ws://localhost:3000');

// Current room state
let currentRoom = null;

// WebSocket event handlers
ws.onopen = () => {
    logMessage('System', 'Connected to WebSocket server');
    enableInterface();
};

ws.onclose = () => {
    logMessage('System', 'Disconnected from server');
    disableInterface();
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('[RECEIVED]', message);

    switch (message.type) {
        case 'message':
            logMessage('Room', `${message.room}: ${message.content}`);
            break;
        case 'history':
            log.value = ''; // Clear log
            logMessage('System', `Joined room: ${message.room}`);
            message.content.forEach(msg => {
                logMessage('History', msg);
            });
            break;
    }
};

// UI Event Handlers
joinButton.onclick = () => {
    const roomName = roomInput.value.trim();
    if (roomName) {
        currentRoom = roomName;
        roomDisplay.textContent = `Current Room: ${roomName}`;

        // Send join message to server
        ws.send(JSON.stringify({
            type: 'join',
            room: roomName
        }));

        roomInput.value = '';
        enableChatInterface();
    }
};

sendButton.onclick = () => {
    sendMessage();
};

input.onkeypress = (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
};

// Utility functions
function sendMessage() {
    const message = input.value.trim();
    if (message && currentRoom) {
        ws.send(JSON.stringify({
            type: 'message',
            room: currentRoom,
            content: message
        }));
        logMessage('You', message);
        input.value = '';
    }
}

function logMessage(sender, message) {
    const timestamp = new Date().toLocaleTimeString();
    log.value += `[${timestamp}] ${sender}: ${message}\n`;
    log.scrollTop = log.scrollHeight;
}

function enableInterface() {
    roomInput.disabled = false;
    joinButton.disabled = false;
}

function enableChatInterface() {
    input.disabled = false;
    sendButton.disabled = false;
}

function disableInterface() {
    roomInput.disabled = true;
    joinButton.disabled = true;
    input.disabled = true;
    sendButton.disabled = true;
}