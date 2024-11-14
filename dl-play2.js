import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Check if URL is provided
    if (!args[0]) throw `✳️ Please provide a valid URL.\n\n 📌 Example: ${usedPrefix + command} <URL>`;
    
    // React to show processing
    m.react(rwait);

    try {
        // Fetch the music from the API
        let res = await fetch(`https://bk9.fun/download/alldownload?url=${args[0]}`);
        let data = await res.json();

        // Check if the API returned a valid response with a music file
        if (!data.result || !data.result.url) throw `❎ Failed to download. Please ensure the link is correct.`;

        // Information to send as caption (customize as per API response structure)
        let caption = `
🎵 *Music Download*
▢ *Title:* ${data.result.title || 'Unknown'}
▢ *Duration:* ${data.result.duration || 'Unknown'}
▢ *Artist:* ${data.result.artist || 'Unknown'}
`;

        // Send the downloaded music file
        conn.sendFile(m.chat, data.result.url, `${data.result.title || 'music'}.mp3`, caption, m, null, { mimetype: 'audio/mp3' });
        m.react(done);
        
    } catch (error) {
        // Error handling
        m.reply(`❎ An error occurred while processing your request.`);
    }
}

// Handler metadata
handler.help = ['music'];
handler.tags = ['dl'];
handler.command = ['music'];

export default handler;
