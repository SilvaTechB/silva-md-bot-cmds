const linkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  // Ignore if message is from the bot itself
  if (m.isBaileys && m.fromMe) return true;

  // Ignore if it's not a group
  if (!m.isGroup) return false;

  // Fetch chat and bot settings
  let chat = global.db.data.chats[m.chat];
  let bot = global.db.data.settings[this.user.jid] || {};

  // Check if the message contains a WhatsApp group link
  const isGroupLink = linkRegex.test(m.text);

  // Only proceed if antiLink is enabled and message contains a link from non-admin
  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      try {
        // Check if the link is for the current group
        const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
        if (m.text.includes(linkThisGroup)) return true; // Allow if it's the current group link
      } catch (error) {
        console.error("Error fetching group invite code:", error);
      }
    }

    // Send warning message and mention user
    await conn.reply(
      m.chat,
      `*≡ Link Detected*\n\nWe do not allow links from other groups. I'm sorry *@${m.sender.split('@')[0]}*, you will be kicked out of the group ${isBotAdmin ? '' : '\n\nI am not an admin, so I cannot expel you.'}`,
      null,
      { mentions: [m.sender] }
    );

    // Delete message and kick user if bot is admin
    if (isBotAdmin && chat.antiLink) {
      await conn.sendMessage(m.chat, { delete: m.key });
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    }
  }
  return true;
}
