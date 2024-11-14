export async function before(m) {
  const chat = global.db.data.chats[m.chat];
  if (!chat.autotype) return;

  // Set presence status to 'recording' to show that the bot is always recording
  const presenceStatus = 'recording';

  // Send the 'recording' presence update
  await this.sendPresenceUpdate(presenceStatus, m.chat);
}

export const disabled = false;
