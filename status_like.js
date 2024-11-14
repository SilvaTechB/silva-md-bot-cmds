// Import necessary modules
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')

// Load or set up authorization and credentials
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
  const socket = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: 'silent' }),
  })

  // Event listener for changes in status updates
  socket.ev.on('messages.upsert', async (msg) => {
    const message = msg.messages[0]
    if (!message.messageStubType) return

    // Check if the message is a status update (story)
    if (message.messageStubType === 'STATUS') {
      const statusID = message.key.id
      const senderID = message.key.remoteJid

      try {
        // Send a reaction (green heart emoji) to the status update
        await socket.sendMessage(senderID, {
          react: { text: '🥰', key: { id: statusID, remoteJid: senderID } },
        })
        console.log(`Reacted with 🥰 to status by ${senderID}`)
      } catch (error) {
        console.error('Failed to send reaction:', error)
      }
    }
  })

  // Handle disconnection and re-authentication
  socket.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        startBot() // Attempt to reconnect
      } else {
        console.log('Logged out.')
      }
    } else if (connection === 'open') {
      console.log('Bot is now connected.')
    }
  })

  socket.ev.on('creds.update', saveCreds)
}

// Start the bot
startBot()
