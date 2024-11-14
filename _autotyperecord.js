import { default: makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import delay from 'delay';  // To use delay for managing intervals

// Function to simulate typing or recording status
async function sendTypingStatus(socket, chatId, status = 'composing', duration = 5000) {
    const interval = 2000; // Duration for typing or recording status in milliseconds
    const endTime = Date.now() + duration;

    while (Date.now() < endTime) {
        await socket.sendPresenceUpdate(status, chatId); // 'composing' or 'recording'
        await delay(interval);
    }

    // Stop the typing/recording status once the duration ends
    await socket.sendPresenceUpdate('paused', chatId);
}

// Main handler to initialize the bot
const initializeBot = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const socket = makeWASocket({
        auth: state,
    });

    socket.ev.on('creds.update', saveCreds);

    // Event listener for incoming messages in groups or personal chats
    socket.ev.on('messages.upsert', async (msgUpdate) => {
        const message = msgUpdate.messages[0];
        const chatId = message.key.remoteJid;

        // Make sure it's not the bot itself sending the message
        if (!message.key.fromMe) {
            // Determine if it's a group or personal message
            const status = message.key.remoteJid.endsWith('@g.us') ? 'recording' : 'composing'; // 'recording' for groups, 'composing' for personal chats
            await sendTypingStatus(socket, chatId, status);
        }
    });

    console.log("Silva MD Bot is now active with auto-typing/recording status.");
};

initializeBot();
