module.exports = {

    name: "/start",
    type: "command",

    run(data_, ctx, ticket, db) {

        ctx.reply(
            // "Бот на обновлении, если не работает то так и надо.\n\n" +
            "Здравствуйте, с какой проблемой столкнулись?\n", {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "ИГРЫ",
                        callback_data: `createNewTicket_0`
                    }, {
                        text: "ПК",
                        callback_data: `createNewTicket_1`
                    }, {
                        text: "ИНТЕРНЕТ",
                        callback_data: `createNewTicket_2`
                    }, {
                        text: "ПРОЧЕЕ",
                        callback_data: `createNewTicket_3`
                    }]
                ]
            }
        })
    }
}