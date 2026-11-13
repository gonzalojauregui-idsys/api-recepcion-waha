require('dotenv').config();

const express = require('express');
const { createServer } = require('node:http');
const configurarWebSocket = require('./websocket');
const registrarAvisos = require('./routes/avisos.routes');
const registrarWebhook = require('./routes/webhook.routes');

const app = express();
const port = process.env.PORT || 8080;
const server = createServer(app);
const wss = configurarWebSocket(server);

app.use(express.json({ limit: '16kb' }));

registrarAvisos(app);
registrarWebhook(app, wss);

server.listen(port, '0.0.0.0', () => {
    console.log(
        `Servidor corriendo en http://localhost:${port}`
    );
});