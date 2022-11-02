module.exports = {

    name: "acceptTicket",
    type: "buttonEvent",

    run(data_, ctx, ticket, doc) {
        let row = doc.findTicketRow(ticket.id)

        doc.rows[row].acceptAuthor = data_.firstName
        doc.rows[row].acceptTime = data_.date
        doc.rows[row].status = "IN PROCESS"

        doc.rows[row].save()

        ctx.reply("@" + data_.nick + " принял заявку!", { reply_to_message_id: ticket.messageId })
        ctx.sendMessage("Заявка принята, ожидайте!\n" +
            "Автор: @" + data_.nick + "\n" +
            "Ожидайте!", {
            reply_to_message_id: ticket.ticketId,
            chat_id: ticket.chatId
        })
        ctx.editMessageReplyMarkup({
            inline_keyboard: [[{
                text: "Решено",
                callback_data: "doneTicket_" + ticket.id
            }, {
                text: "Решено и написать ответ",
                callback_data: "doneTicketAndWrite_" + ticket.id
            }]]
        })
    }
}