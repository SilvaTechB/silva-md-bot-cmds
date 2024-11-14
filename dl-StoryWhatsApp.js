const handler = async (m, { conn }) => {
  // Check if the quoted message is from "status@broadcast"
  if (m.quoted?.chat !== "status@broadcast") throw "Please reply to a status message to download.";

  try {
    // Attempt to download the content of the quoted message
    let buffer = await m.quoted.download();
    
    if (!buffer) {
      throw "Failed to download the status. Please try again.";
    }

    // Send the downloaded file with text from the quoted status
    await conn.sendFile(m.chat, buffer, "", m.quoted.text || "", m, false, {
      quoted: m
    });
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
