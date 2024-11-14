const { Message, Command, BaseCommand } = require('../../Structures');

class ModsCommand extends BaseCommand {
    constructor() {
        super('mods', {
            description: "Displays the bot's moderators",
            exp: 20,
            cooldown: 5,
            dm: true,
            category: 'general',
            usage: 'mods',
            aliases: ['mod', 'owner', 'moderators'],
        });
    }

    async execute({ reply }) {
        if (!this.client.config.mods.length) return await reply('*[UNMODERATED]*');
        
        let text = `🤍 *${this.client.config.name} Moderators* 🖤\n`;
        for (let i = 0; i < this.client.config.mods.length; i++) {
            const contact = this.client.contact.getContact(this.client.config.mods[i]);
            text += `\n*#${i + 1}*\n🎐 *Username:* ${contact.username}\n🔗 *Contact: https://wa.me/+${this.client.config.mods[i].split('@')[0]}*`;
        }
        await reply(text);
    }
}

// Handler properties
const handler = {
    help: ['owner'],
    tags: ['owner'],
    command: /^(owner)$/,
    owner: false,
};

module.exports = ModsCommand;
