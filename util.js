const Discord = require('discord.js')


module.exports = {
    /**
     * @param {Discord.User} user 
     * @returns {string}
     */
    discordUserToKey(user) {
        return `${user.id}`;
    }
}