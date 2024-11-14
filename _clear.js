import db from '../lib/database.js';

// Define the clear group messages handler
let handler = async (m, { conn, usedPrefix: _p }) => {
    try {
        // Notify that the bot is clearing all group messages from the user's side
        await conn.reply(m.chat, 'Clearing all group messages from your side...', m);

        // Fetch the chat ID to ensure it's a group chat
        const chatId = m.chat;
        const isGroup = m.isGroup;

        if (!isGroup) {
            await conn.reply(m.chat, 'This command can only be used in group chats.', m);
            return;
        }

        // Clear all messages in the group chat from the user's side
        await conn.modifyChat(chatId, 'delete');
        await conn.clearChat(chatId, { clear: true });

        // Notify that all group messages have been cleared from the user's side
        await conn.reply(m.chat, 'All group messages have been cleared from your side.', m);

    } catch (e) {
        console.error("Error clearing group messages:", e);
        await conn.reply(m.chat, 'There was an error clearing the group messages.', m);
    }
};

// Register command
handler.command = /^(clear|erase)$/i;
handler.exp = 0;

export default handler;
