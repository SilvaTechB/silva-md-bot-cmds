const { makeWASocket, useSingleFileAuthState, DisconnectReason, delay } = require('@whiskeysockets/baileys');
const fs = require('fs');

// Developer's phone number (formatted with @s.whatsapp.net)
const developerNumber = '254700143167@s.whatsapp.net';  // Replace with actual developer's number

// Initialize the authentication state
const { state, saveState } = useSingleFileAuthState('auth_info.json');

// Create a socket connection to WhatsApp
const sock = makeWASocket({
  auth: state,
  printQRInTerminal: true
});

// Event listener for when the connection is ready
sock.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect } = update;

  // If the connection is ready, notify the developer
  if (connection === 'open') {
    console.log('Silva MD Bot is connected successfully!');
    
    // Send a message to the developer
    await sock.sendMessage(developerNumber, { text: 'Silva MD Bot has been connected successfully!' });
  }

  // Handle disconnection (reconnect if needed)
  if (connection === 'close') {
    const reason = lastDisconnect?.error?.output?.statusCode;
    if (reason !== DisconnectReason.loggedOut) {
      console.log('Bot disconnected. Reconnecting...');
      await delay(1000);
      sock.connect();
    } else {
      console.log('Bot logged out.');
    }
  }
});

// Event listener for when a new contact is added
sock.ev.on('contacts.update', async (contacts) => {
  contacts.forEach(async (contact) => {
    if (contact.isNew) {
      console.log(`New user connected: ${contact.id}`);

      // Send a message to the developer when a new user connects
      await sock.sendMessage(developerNumber, { text: `A new user has connected: ${contact.id}. Silva MD Bot has been connected successfully.` });
    }
  });
});

// Save authentication state when it changes
sock.ev.on('auth-state.update', saveState);

// Initialize the socket connection
sock.connect();
