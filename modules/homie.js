const datab = require('./database.js')
const { Telegraf } = require('telegraf')

class Homie {
    constructor() {
        this.db = new datab()
        this.bot = new Telegraf(process.env.API_TOKEN)
    }
    listenForMessages() {
        this.bot.on('text', (ctx) => {
            // ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.from.username}`)
            // console.log(ctx.from.first_name)

            // try passing in an empty wallet that way
            // if the user doesn't exist then it will create it
            let user = {
                "user": `${ctx.from.username}`,
                "wallet": 0
            }
            this.db.update(user, 1)
        })
    }
    getMyBalance() {
        this.bot.command('balance', (ctx) => {
            this.db.retreive(ctx.from.username).then((user) => {
                ctx.telegram.sendMessage(ctx.message.chat.id,
                    `Hi ${user.user} - you currently have ${user.wallet} egg coins`)
            })
        })
    }

    connect() { this.bot.launch() }
}

module.exports = Homie