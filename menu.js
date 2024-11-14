import db from '../lib/database.js';
import { promises } from 'fs';
import { join } from 'path';
import { xpRange } from '../lib/levelling.js';
import moment from 'moment-timezone';

// Define menu handler
let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
    try {
        // Check for required properties
        const user = global.db?.data?.users?.[m.sender];
        if (!user) {
            throw new Error("User data not found.");
        }

        // Fetch user data
        let { rank = 'Novice', exp = 0, limit = 0, level = 1, role = 'Member' } = user;
        let { min, xp, max } = xpRange(level, global.multiplier || 1);
        let name = await conn.getName(m.sender);
        let date = moment().format('MMMM Do YYYY');
        let time = moment().format('h:mm A');

        // Create the menu text
        const menuText = `
*Silva MD Bot - Menu*
*Your Personal WhatsApp Assistant*

👤 *Profile & Stats*
🏆 Level: ${level}
💥 XP: ${exp} / ${max}
🔥 Rank: ${rank}
💼 Role: ${role}
📅 Date: ${date}
⏰ Time: ${time}

📋 *Main Commands*
1. 🌐 *${_p}menu* - Show this menu
2. 💬 *${_p}help* - Get help with commands
3. ⚙️ *${_p}settings* - View or change bot settings
4. 🕹️ *${_p}games* - Play games with the bot

🎉 *Fun & Games*
- 🎲 *${_p}dice* - Roll a dice
- 🏁 *${_p}race* - Start a race with friends
- 🥳 *${_p}wyr [question]* - Would You Rather poll

📈 *Statistics*
- 📊 *${_p}stats* - Check your bot usage stats
- 📅 *${_p}uptime* - Check bot's uptime
- 🌍 *${_p}info* - Get information about the bot

🎶 *Media & Downloads*
- 🎵 *${_p}song [title]* - Download audio
- 📹 *${_p}video [title]* - Download video
- 🔄 *${_p}convert* - Convert media format (audio/video)

⚡ *Quick Tools*
- 🔍 *${_p}search [query]* - Search the web
- 🧠 *${_p}quote* - Get a motivational quote
- 🖼️ *${_p}meme* - Send a random meme
- 🌐 *${_p}wiki [topic]* - Get Wikipedia summary

🛠️ *Settings*
- 💡 *${_p}autolike on/off* - Toggle auto-like for statuses
- 🎭 *${_p}statusreact on/off* - Toggle automatic reactions
- 👥 *${_p}groupreact on/off* - Toggle reactions in groups
- 🔔 *${_p}notifications on/off* - Control bot notifications

📌 *Tips*
- Use *${_p}* before each command!
- Need help? Type *${_p}help [command]*.

*Made with ❤️ by SilvaTechB*
        `.trim();

        // Send the menu message
        await conn.sendMessage(m.chat, { text: menuText, mentions: [m.sender] }, { quoted: m });

        // React to the command
        await conn.sendMessage(m.chat, { react: { text: '😊', key: m.key } });
        
        // Log the WhatsApp channel for internal reference
        console.log("WhatsApp Channel: https://whatsapp.com/channel/0029VaAkETLLY6d8qhLmZt2v");
        
    } catch (e) {
        console.error("Error displaying the menu:", e);
        await conn.reply(m.chat, 'There was an error displaying the menu.', m);
    }
}

// Register command
handler.command = /^(menu|help)$/i;
handler.exp = 3;

export default handler;
