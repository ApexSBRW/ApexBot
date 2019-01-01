const Discord = require('discord.js');
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Database = require('../../Database')
const {discordUserToKey} = require('../../util')

module.exports = class GetTicketCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'ticket',
			group: 'general',
			memberName: 'ticket',
			description: 'Retrieves a registration ticket for the user.'
		});
	}

    /**
     * @param {Discord.Message} msg 
     * @param {*} args 
     */
	async run(msg, args) {
        /** @type {mysql.RowDataPacket[]} */
        const results = await Database.connection.query('SELECT * FROM INVITE_TICKET it WHERE DISCORD_NAME=?', 
                                  [discordUserToKey(msg.author)]);
        /** @type {Object} */
        let ticket = {};
        if (results.length == 0) {
            await msg.reply('Creating ticket...')
            try {
                let ticketCode = require('crypto').randomBytes(8).toString('hex').toUpperCase();
                let inserted = await Database.connection.query(
                    'INSERT INTO INVITE_TICKET (DISCORD_NAME, TICKET, USERID) VALUES (?, ?, NULL)', 
                    [
                        discordUserToKey(msg.author), 
                        ticketCode
                    ]);
                ticket = {TICKET: ticketCode}
            } catch (err) {
                console.error(err)
            }

            // console.log(await Database.connection.query('INSERT INTO INVITE_TICKET (DISCORD_NAME, TICKET, USERID) VALUES (?, ?, NULL)', 
            // [discordUserToKey(msg.author), require('crypto').randomBytes(8).toString('hex').toUpperCase()]));
        } else {
            ticket = results[0]
        }

        msg.author.sendMessage(`Your ticket for Apex is **${ticket.TICKET}**. Leaving the Discord server will result in your account being suspended!`).then(() => {
            msg.reply('Check your DMs.')
        }).catch(err => {
            msg.reply('I could not send you a DM.')
        })
    }
};