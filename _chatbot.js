const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const fs = require('fs');

// Initialize the WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true } // Can be set to false for debugging
});

// OpenAI API Key and endpoint
const OPENAI_API_KEY = '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'; // Replace with your OpenAI API key
const OPENAI_API_URL = 'https://api.openai.com/v1/completions';

// List of available models, for example GPT-4 (you can switch to GPT-3 or other models if needed)
const MODEL = 'gpt-4';

// Signature for Silva MD Bot's response
const BOT_SIGNATURE = "\n\n*Responded by Silva MD Bot*";

// State to track whether the bot is responding to messages or not
let isAutoResponding = false; // Initially, the bot is not responding to messages

// Listen for messages
client.on('message', async (message) => {
    try {
        // Ignore messages from groups
        if (message.from.includes('@g.us')) {
            return; // Don't respond to group messages
        }

        // If the message is "chattbot on", start auto-responding
        if (message.body.toLowerCase() === 'chattbot on') {
            isAutoResponding = true;
            await message.reply("Silva MD Bot is now auto-responding to all messages!");
            return;
        }

        // If the message is "chattbot off", stop auto-responding
        if (message.body.toLowerCase() === 'chattbot off') {
            isAutoResponding = false;
            await message.reply("Silva MD Bot has stopped auto-responding.");
            return;
        }

        // If auto-responding is enabled, process the message
        if (isAutoResponding && message.body && message.body.trim()) {
            console.log(`Received message: ${message.body}`);

            // Send the message content to OpenAI for a response
            const response = await getChatGPTResponse(message.body);

            // Add signature to the response
            const finalResponse = response + BOT_SIGNATURE;

            // Send the response back to the user on WhatsApp
            await message.reply(finalResponse);
        }
    } catch (error) {
        console.error("Error handling message:", error);
    }
});

// Function to get a response from ChatGPT
async function getChatGPTResponse(userMessage) {
    try {
        const response = await axios.post(OPENAI_API_URL, {
            model: MODEL,
            prompt: userMessage,
            max_tokens: 150, // Limit the response length
            temperature: 0.7, // Control randomness (0 = deterministic, 1 = very random)
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        // Return the response text from OpenAI
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return "Sorry, I couldn't process your request. Please try again later.";
    }
}

// Start the WhatsApp client
client.initialize();

// Log when the bot is ready
client.on('ready', () => {
    console.log('Silva MD Bot is ready to respond to messages!');
});
