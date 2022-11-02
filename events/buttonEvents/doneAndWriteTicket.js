module.exports = {

    name: "doneTicketAndWrite",
    type: "buttonEvent",

    run(data_, ctx, ticket, doc) {
        ticket.method = `doneTicketAndWrite_${ticket.id}`
        ticket.methodChatId = data_.chat.id
        ticket.writerId = data_.user.id

        ctx.editMessageReplyMarkup({
            inline_keyboard: [[]],
        })

        ctx.reply("Напишите ответ одним сообщением")
    }
}