require('dotenv').config();

const express = require('express');

const app = express();
const axios = require('axios');
const port = process.env.PORT || 8080;

app.use(express.json({ limit: '16kb' }));

const { timingSafeEqual } = require('node:crypto');

function autenticarApp(req, res, next) {
    const esperada = process.env.RECEPCION_API_KEY;

    if (!esperada) {
        return res.status(500).json({
            error: 'Falta configurar la autenticación',
        });
    }

    const recibida = req.get('X-Api-Key') || '';

    const a = Buffer.from(recibida);
    const b = Buffer.from(esperada);

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return res.status(401).json({
            error: 'No autorizado',
        });
    }

    next();
}

app.post('/avisos',autenticarApp, async (req, res) => {
    const { numero, mensaje } = req.body ?? {};

    const telefono = typeof numero === 'string'
        ? numero.trim().replace(/^\+/, '').replace(/[\s()-]/g, '')
        : '';

    if (
        !/^[1-9]\d{7,14}$/.test(telefono) ||
        typeof mensaje !== 'string' ||
        !mensaje.trim()
    ) {
        return res.status(400).json({
            error: 'Enviá un número internacional y un mensaje válido',
        });
    }

    const baseUrl = process.env.WAHA_URL?.trim().replace(/\/+$/, '');
    const apiKey = process.env.WAHA_API_KEY;
    const session = process.env.WAHA_SESSION || 'recepcion-ids';

    if (!baseUrl || !apiKey) {
        return res.status(500).json({
            error: 'Falta configurar WAHA_URL o WAHA_API_KEY',
        });
    }

    const url = baseUrl.endsWith('/api/sendText')
        ? baseUrl
        : `${baseUrl}/api/sendText`;

    try {
        await axios.post(
            url,
            {
                session,
                chatId: `${telefono}@c.us`,
                text: mensaje.trim(),
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': apiKey,
                },
                timeout: 15000,
            }
        );

        return res.json({
            ok: true,
            mensaje: 'WAHA aceptó el envío',
        });
    } catch (error) {
        const timeout =
            error.code === 'ECONNABORTED' ||
            error.code === 'ETIMEDOUT';

        console.error('Error al llamar a WAHA', {
            codigo: error.code,
            status: error.response?.status,
        });

        return res.status(timeout ? 504 : 502).json({
            error: timeout
                ? 'No se pudo confirmar el envío a tiempo'
                : 'No se pudo enviar el mensaje mediante WAHA',
            statusWaha: error.response?.status,
        });
    }
});

app.listen(port, () => {
    console.log(
        `Servidor corriendo en http://localhost:${port}`
    );
});