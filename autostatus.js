const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_multi');
    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }), // Silent mode for less log noise
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (message) => {
        const { messages } = message;
        if (!messages || messages.length === 0) return;

        const msg = messages[0];
        if (msg.messageStubType === 20 && msg.key.fromMe) { // Assuming 20 is the status update stubType
            const jid = msg.key.remoteJid;

            await sock.sendMessage(jid, {
                react: {
                    text: '💚',
                    key: msg.key,
                },
            });

            console.log('Reacted to status update with a green heart emoji.');
        }
    });
}

start();
