process.on("uncaughtException", (e) => {
    console.log("uncoughtException:", e)
});

process.on("unhandledRejection", (e) => {
    console.log("uncoughtException:", e)
});

const config = require("./config.json");
const googleConfig = require("./gdocs.json")
const { Telegraf } = require('telegraf');

const DB = require("./db.js")
const EventHandler = require("./eventHandler.js");
const gDocs = require("./docs.js");

const db = new DB();
let bot = null
const eventHandler = new EventHandler();
const doc = new gDocs(config.docs, googleConfig)

eventHandler.load().then(async () => {
    await doc.init()
    await doc.getSheet()
    bot = new Telegraf(config.token);
    await bot.launch();
    loadEvents()
    console.log("\nLOADED")
}).catch(e => { console.log(e) })

function createData(ctx, method) {
    let user = (method == "message")
        ? ctx.update.message.from
        : ctx.update.callback_query.from
    let nick = user.username ? user.username : (user.first_name + " " + (user.last_name ? user.last_name : ""))
    let firstName = user.first_name ? user.first_name : "отсутствует"
    let message = (method == "message")
        ? ctx.update.message
        : ctx.update.callback_query.message
    let photo = (method == "message")
        ? (message.photo ? message.photo[0] : null)
        : null
    let document = (method == "message")
        ? (message.document ? message.document : null)
        : null
    let messageText = (method == "message")
        ? (message.text ? message.text : (message.caption ? message.caption : "отстуствует"))
        : "отстуствует"
    let chat = (method == "message")
        ? message.chat
        : message.chat
    let args = message.text
        ? message.text.split(" ") : ""
    let commandName = args ? args.shift() : ""
    let cqd = (method == "message")
        ? ""
        : ctx.update.callback_query.data
    return {
        user: user,
        nick: nick,
        firstName: firstName,
        message: message,
        photo: photo,
        document: document,
        messageText: messageText,
        chat: chat,
        args: args,
        commandName: commandName,
        cqd: cqd,
        config: config,
        telegram: bot.telegram,
        date: new Date().toLocaleDateString("ru-ru", { year: "numeric", month: "2-digit", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })
    }
}

async function updateRows() {
    doc.rows = await doc.sheet.getRows()
}

async function getTicket(ticketId, data_) {
    await updateRows()

    let ticket = db.getTicket(ticketId, data_)

    if (!ticket && data_.cqd.startsWith("createNewTicket")) {
        ticket = db.createTicket({
            id: data_.user.id + "/" + data_.message.message_id,
            chatId: Number(data_.chat.id),
        })
    }

    // 
    if (!ticket) {
        db.get
    }
    // 

    // console.log("^^^^^^^^^^^^^^^^^^^^")
    // console.log("now ticket::: ", ticket)
    // console.log("====================")

    return ticket
}

async function loadEvents() {
    bot.on("message", async ctx => {
        let data_ = createData(ctx, "message")

        if (eventHandler.commands.get(data_.commandName)) {
            return eventHandler.commands.get(data_.commandName).run(data_, ctx)
        }

        let ticket = await getTicket(null, data_)

        if (!ticket) {
            return
        }

        if (ticket.method && ticket.methodChatId == data_.chat.id) {
            eventHandler.messageEvent(data_, ctx, ticket, doc).then(data => {
                if (data == 200) {
                    return
                }
            }).catch(e => {
                console.log(e);
            })
        }
    })

    bot.on("callback_query", async ctx => {
        let data_ = createData(ctx, "button")

        let ticket = await getTicket(data_.cqd.split("_")[1], data_)

        eventHandler.buttonEvent(data_, ctx, ticket, doc).then(data => {
            if (data == 200) {
                return
            }
        }).catch(e => {
            console.log(e);
        })
    });
}

process.once('SIGINT', () => {
    bot.stop('SIGINT')
});
process.once('SIGTERM', () => {
    bot.stop('SIGTERM')
});