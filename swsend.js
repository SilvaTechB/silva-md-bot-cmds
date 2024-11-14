const handler = async (m, { conn }) => {
  // Check if the quoted message is from "status@broadcast"
  if (m.quoted?.chat !== "status@broadcast") throw "Please reply to a status message to download.";

  try {
    // Attempt to download the content of the quoted message
    let buffer = await m.quoted.download();
    
    if (!buffer) {
      throw "Failed to download the status. Please try again.";
    }

    // Determine the MIME type from the quoted message
    const mimeType = m.quoted.mtype || m.quoted.mime;
    
    // Send the downloaded file based on its MIME type
    if (/image/.test(mimeType)) {
      await conn.sendMessage(m.chat, { image: buffer, caption: m.quoted.text || "" }, { quoted: m });
    } else if (/video/.test(mimeType)) {
      await conn.sendMessage(m.chat, { video: buffer, caption: m.quoted.text || "" }, { quoted: m });
    } else if (/audio/.test(mimeType)) {
      await conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: m });
    } else {
      // If it's text or an unsupported media type, send as text
      await conn.sendMessage(m.chat, { text: m.quoted.text || "No text content available." }, { quoted: m });
    }
  } catch (e) {
    console.error("Error in status download handler:", e);
    await conn.reply(m.chat, "An error occurred while downloading the status. Please try again.", m);
  }
};

// Command settings
handler.help = ["downloadsw"];
handler.tags = ["tools"];
handler.command = /^((sw|status)(dl|download)|(dl|download)(sw|status))$/i;

export default handler;
