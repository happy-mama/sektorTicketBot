module.exports = {

    name: "acceptTicketAndWrite",
    type: "buttonEvent",

    run(data_, ctx, ticket, db) {
        ticket.method = `acceptTicketAndWrite_${ticket.id}`
        ticket.methodChatId = data_.chat.id
        ticket.writerId = data_.user.id

        ctx.reply("Напишите ответ одним сообщением")

        ctx.editMessageReplyMarkup({
            inline_keyboard: [[
                {
                    text: "Решено",
                    callback_data: "doneTicket_" + ticket.id
                }, {
                    text: "Решено и написать ответ",
                    callback_data: "doneTicketAndWrite_" + ticket.id
                }
            ]],
        })
    }
}