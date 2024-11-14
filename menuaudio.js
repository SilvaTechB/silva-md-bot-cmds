let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Sound URL and Additional Information
    const name = m.pushName || conn.getName(m.sender);
    const audioUrl = 'https://cdn.jsdelivr.net/gh/SilvaTechB/silva-md-bot@main/media/Alive.mp3';
    const imgUrl = 'https://files.catbox.moe/8324jm.jpg';

    // Check if "alive" is anywhere in the message
    if (m.text.toLowerCase().includes('menu')) {
        // Contact message setup
        const contactMessage = {
            key: {
                fromMe: false,
                participant: `${m.sender.split('@')[0]}@s.whatsapp.net`,
                ...(m.chat ? { remoteJid: '254700143167@s.whatsapp.net' } : {}),
            },
            message: {
                contactMessage: {
                    displayName: `${name}`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${name},;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                },
            },
        };

        // Document (audio) message setup
        const docMessage = {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: true,
            waveform: [100, 0, 100, 0, 100, 0, 100],
            fileName: 'Alive',
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: '𝐒𝐈𝐋𝐕𝐀 𝐌𝐃 𝐁𝐎𝐓 Alive',
                    body: 'SILVA MD BOT OCTOBER 2024',
                    thumbnailUrl: imgUrl,
                    sourceUrl: 'https://whatsapp.com/channel/0029VaAkETLLY6d8qhLmZt2v',
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        };

        // Send the audio message
        await conn.sendMessage(m.chat, docMessage, { quoted: contactMessage });
    }
};

handler.help = ['silva'];
handler.tags = ['main'];
handler.command = /^(silva)$/i;

export default handler;
