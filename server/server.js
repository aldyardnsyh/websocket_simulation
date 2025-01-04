const WebSocket = require('ws');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Store for messages and rooms
let messageStore = {};
let rooms = new Set();
let clientsInRooms = new Map(); // Track clients in rooms

// Middleware for static files
app.use(express.static(path.join(__dirname, '../client')));

// WebSocket Server Setup
const wss = new WebSocket.Server({ noServer: true });

// Utility function to broadcast to room
function broadcastToRoom(roomName, message, sender) {
    console.log(`[BROADCAST] Room: ${roomName}, Message: ${message}`);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.room === roomName && client !== sender) {
            client.send(JSON.stringify({
                type: 'message',
                room: roomName,
                content: message
            }));
        }
    });
}

// Handle WebSocket connections
wss.on('connection', (ws, request) => {
    console.log('[CONNECTION] New client connected');

    // Initialize client state
    ws.room = null;

    // Handle incoming messages
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        console.log('[RECEIVED]', {
            type: message.type,
            room: message.room,
            payload: message.content
        });

        switch (message.type) {
            case 'join':
                // Handle room joining
                const roomName = message.room;

                // Leave current room if in one
                if (ws.room) {
                    const currentClients = clientsInRooms.get(ws.room) || new Set();
                    currentClients.delete(ws);
                    clientsInRooms.set(ws.room, currentClients);
                    console.log(`[LEAVE] Client left room: ${ws.room}`);
                }

                // Join new room
                ws.room = roomName;
                rooms.add(roomName);
                if (!clientsInRooms.has(roomName)) {
                    clientsInRooms.set(roomName, new Set());
                }
                clientsInRooms.get(roomName).add(ws);

                // Initialize room message store if needed
                if (!messageStore[roomName]) {
                    messageStore[roomName] = [];
                }

                console.log(`[JOIN] Client joined room: ${roomName}`);
                console.log(`[ROOM STATUS] Clients in ${roomName}: ${clientsInRooms.get(roomName).size}`);

                // Send room history
                ws.send(JSON.stringify({
                    type: 'history',
                    room: roomName,
                    content: messageStore[roomName]
                }));
                break;

            case 'message':
                // Handle chat messages
                if (ws.room) {
                    messageStore[ws.room].push(message.content);
                    broadcastToRoom(ws.room, message.content, ws);
                    console.log(`[MESSAGE] Room: ${ws.room}, Content: ${message.content}`);
                }
                break;
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('[DISCONNECT] Client disconnected');
        if (ws.room) {
            const roomClients = clientsInRooms.get(ws.room);
            if (roomClients) {
                roomClients.delete(ws);
                console.log(`[ROOM UPDATE] Clients remaining in ${ws.room}: ${roomClients.size}`);
            }
        }
    });
});

// Integrate WebSocket with HTTP server
const server = app.listen(PORT, () => {
    console.log(`[SERVER] Running at http://localhost:${PORT}`);
    console.log('[WEBSOCKET] Server initialized');
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});