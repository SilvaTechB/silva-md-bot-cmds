import { MessageType } from '@whiskeysockets/baileys'
import { exec } from 'child_process'
import fetch from 'node-fetch'
import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'

const handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    // Path to package.json for bot info
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { rank } = global.db.data.users[m.sender]
    let { exp, limit, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'en'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let uptime = clockString(process.uptime() * 1000)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length

    // The WhatsApp Channel link
    const whatsappChannelUrl = 'https://whatsapp.com/channel/0029VaAkETLLY6d8qhLmZt2v'

    // Prepare the menu content
    let text = `
*Welcome to Silva MD Bot!*

Here’s a quick overview of the available features:

☆  Command 1: Help Menu  
☆  Command 2: Set Status  
☆  Command 3: Contacts Management  
☆  Command 4: Music Downloader  

You can check out our channel for more info.

---

Made with ♥ by SilvaTechB

Current Version: ${_package.version}
Uptime: ${uptime}
Total Users: ${totalreg}
Registered Users: ${rtotalreg}
`.trim()

    // Send the menu with a "View Channel" link
    conn.sendMessage(m.chat, {
      text,
      mentions: [m.sender],
    }, { quoted: m })

    // React to the command
    await conn.react(m.chat, '👍', m)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, 'There was an error displaying the menu. Please try again later.', m)
  }
}

handler.command = /^(menu4|help4)$/i
handler.exp = 3

// Function to format uptime
function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

export default handler
