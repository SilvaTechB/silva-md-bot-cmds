// Import necessary libraries from Baileys
const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

// List of emojis to react with
const emojis = ["😂", "😅", "👍", "❤️", "😜", "🎉", "😆", "💯"];

// Function to get a random emoji
const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

// Function to start the bot
const startSilvaMDBot = () => {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    // Event listener for new messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            // Check if the message is from a channel and not sent by the bot itself
            if (msg.key.remoteJid.endsWith('@broadcast') && !msg.key.fromMe) {
                try {
                    // React with a random emoji to each channel message
                    const reaction = { key: msg.key, text: getRandomEmoji() };
                    await sock.sendMessage(msg.key.remoteJid, { react: reaction });
                } catch (err) {
                    console.error("Error reacting to channel message:", err);
                }
            }
        }
    });

    // Save authentication state on changes
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) startSilvaMDBot();
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp');
        }
    });

    sock.ev.on('creds.update', saveState);
};

// Start the bot
startSilvaMDBot();
