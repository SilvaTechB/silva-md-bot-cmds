const axios = require('axios');
const { MessageType, Mimetype } = require('@whiskeysockets/baileys');

async function sendMusicDownloadOptions(chatId, songName, client) {
    try {
        // Search YouTube for the song
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(songName)}`;
        const ytLink = await getYoutubeLink(youtubeSearchUrl); // Implement getYoutubeLink

        if (!ytLink) {
            return await client.sendMessage(chatId, "Couldn't find the song. Please try another name.", MessageType.text);
        }

        // Prepare buttons for format selection
        const buttons = [
            { buttonId: `download_video:${ytLink}`, buttonText: { displayText: "Video" }, type: 1 },
            { buttonId: `download_audio:${ytLink}`, buttonText: { displayText: "Audio" }, type: 1 }
        ];

        const buttonMessage = {
            contentText: `Choose the format for *${songName}*:`,
            footerText: 'Silva MD Bot',
            buttons: buttons,
            headerType: 1
        };

        await client.sendMessage(chatId, buttonMessage, MessageType.buttonsMessage);

    } catch (error) {
        console.error(error);
        await client.sendMessage(chatId, "Error occurred. Please try again.", MessageType.text);
    }
}

// Handle button responses for downloading the audio or video
const handleButtonResponse = async (buttonData, client) => {
    const chatId = buttonData.chatId;
    const buttonId = buttonData.buttonId;
    const [, action, ytLink] = buttonId.split(':'); // e.g., download_audio:<ytLink>

    try {
        const format = action === 'download_video' ? 'video' : 'audio';
        const downloadUrl = `https://ytdl.giftedtech.my.id/api?url=${ytLink}&format=${format}`;
        
        // Fetch the media file
        const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
        const mimetype = format === 'video' ? Mimetype.mp4 : Mimetype.mp4Audio;

        await client.sendMessage(chatId, response.data, MessageType.document, {
            mimetype,
            filename: `${format === 'video' ? 'video' : 'audio'}.${format === 'video' ? 'mp4' : 'mp3'}`
        });

    } catch (error) {
        console.error(error);
        await client.sendMessage(chatId, "Failed to download. Please try again.", MessageType.text);
    }
};

// Listen for messages and button clicks
const listenForCommandsAndButtons = (client) => {
    client.on('chat-update', async (chat) => {
        if (!chat.hasNewMessage) return;
        const message = chat.messages.all()[0];
        const messageType = message.message?.conversation || '';

        // Check if the command !silva is used
        if (messageType.startsWith('!silva')) {
            const songName = messageType.slice(7).trim(); // Extract song name after !silva command
            if (songName) {
                await sendMusicDownloadOptions(message.key.remoteJid, songName, client);
            } else {
                await client.sendMessage(message.key.remoteJid, "Please enter a song name after the command.", MessageType.text);
            }
        }
    });

    // Listen for button clicks
    client.on('button-clicked', async (buttonData) => {
        await handleButtonResponse(buttonData, client);
    });
};

module.exports = { sendMusicDownloadOptions, listenForCommandsAndButtons };
