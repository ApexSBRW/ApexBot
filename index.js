const {CommandoClient} = require('discord.js-commando')
const config = require('./config.json')
const path = require('path')
const Database = require('./Database')
const {discordUserToKey} = require('./util')
const guildId = config.guildId || '371678673142808587'
const bot = new CommandoClient({
    commandPrefix: config.prefix || 'a!',
    owner: config.ownerId || '196245583445491712',
    disableEveryone: true
});

(async () => {
    await Database.init(config)

    bot.registry
        .registerDefaultTypes()
        .registerDefaultGroups()
        .registerDefaultCommands()
        .registerGroup(['general', 'General'])
        .registerCommandsIn(path.join(__dirname, 'commands'));

    bot.on('ready', () => {
        console.log('Logged in!');
        bot.user.setActivity('Need for Speed: World', 'PLAYING');
    });

    bot.on('guildMemberAdd', async member => {
        if (member.guild.id == guildId) {
            const findTicket = await Database.connection.query('SELECT * FROM INVITE_TICKET it WHERE DISCORD_NAME=? AND USERID IS NOT NULL', 
                                      [discordUserToKey(member.user)]);
            if (findTicket.length > 0) {
                await Database.connection.query('UPDATE USER u SET u.isLocked = 0 WHERE u.ID = ?', 
                                      [findTicket[0].USERID]);
            }
        } else {
            console.log(member.guild.id)
        }
    })

    bot.on('guildMemberRemove', async member => {
        if (member.guild.id == guildId) {
            const findTicket = await Database.connection.query('SELECT * FROM INVITE_TICKET it WHERE DISCORD_NAME=? AND USERID IS NOT NULL', 
                                      [discordUserToKey(member.user)]);
            if (findTicket.length > 0) {
                await Database.connection.query('UPDATE USER u SET u.isLocked = 1 WHERE u.ID = ?', 
                                      [findTicket[0].USERID]);
            }
        } else {
            console.log(member.guild.id)
        }
    })

    bot.login(config.token)
})();