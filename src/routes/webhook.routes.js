module.exports = (app, wss) => {
    app.post('/webhook', async (req, res) => {
        const { event, payload } = req.body ?? {};

        if (event !== 'message' || payload?.fromMe) {
            return res.status(400).json({
                ok: false,
                error: 'Falta el texto en payload.body',
            })
        }

        const mensaje = payload?.body;

        if (typeof mensaje !== 'string' || !mensaje.trim()) {
            return res.status(401).json({
                ok: false,
                error: 'Falta el texto en payload.body',
            });
        }


        // Este es el evento que espera tu app Android
        const eventoPopup = JSON.stringify({
            evento: 'mostrar_popup',
            titulo: 'Mensaje recibido',
            mensaje: mensaje,
        });

        for (const socket of wss.clients) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(eventoPopup);
            }
        }

        return res.json({ ok: true });

    });
};
