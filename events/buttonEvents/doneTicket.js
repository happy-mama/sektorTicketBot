module.exports = {

    name: "doneTicket",
    type: "buttonEvent",

    run(data_, ctx, ticket, doc) {

        ticket.done = true

        let row = doc.findTicketRow(ticket.id)

        doc.rows[row].doneAuthor = data_.firstName
        doc.rows[row].doneTime = data_.date
        doc.rows[row].status = "CLOSED"

        doc.rows[row].save()

        ctx.editMessageReplyMarkup({
            inline_keyboard: [[]]
        })
        ctx.reply("@" + data_.nick + " закрыл заявку!", { reply_to_message_id: ticket.messageId })
        ctx.sendMessage("Ваша заявка решена!\n" +
            "Автор: @" + data_.nick + "\n" +
            "Заявка закрыта!", {
                reply_to_message_id: ticket.ticketId,
                chat_id: ticket.chatId
            }
        )
    }
}