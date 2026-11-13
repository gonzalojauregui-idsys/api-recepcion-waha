const { WebSocketServer } = require('ws');

module.exports = (server) => {
    // Conexión persistente con Android
    const wss = new WebSocketServer({
        server,
        path: '/ws',
    });
    wss.on('connection', (socket) => {
        console.log('App conectada');

        socket.on('error', (error) => {
            console.error('Error WebSocket:', error.message);
        });

        socket.on('close', () => {
            console.log('App desconectada');
        });
    });

    return wss;
};
