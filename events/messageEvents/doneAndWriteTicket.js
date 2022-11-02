module.exports = {

    name: "doneTicketAndWrite",
    type: "messageEvent",

    run(data_, ctx, ticket, doc) {
        ticket.method = ""
        ticket.methodChatId = ""
        ticket.writerId = ""
        ticket.done = true

        let row = doc.findTicketRow(ticket.id)

        doc.rows[row].doneAuthor = data_.firstName
        doc.rows[row].doneTime = data_.date
        doc.rows[row].doneText = data_.messageText
        doc.rows[row].status = "CLOSED"

        doc.rows[row].save()

        ctx.reply(
            `@${data_.nick} закрыл заявку!\n` +
            "Ответ заявки:\n" + data_.messageText,
            { reply_to_message_id: ticket.messageId }
        )

        ctx.sendMessage(
            "Ваша заявка закрыта\n" +
            `Автор: @${data_.nick}\n` +
            "Текст заявки:\n" + data_.messageText, {
                reply_to_message_id: ticket.ticketId,
                chat_id: ticket.chatId
            }
        ).then(data => {
            if (data_.photo) {
                ctx.sendPhoto(data_.photo.file_id, {
                    reply_to_message_id: ticket.ticketId,
                })
            }
            if (data_.document) {
                ctx.sendDocument(data_.document.file_id, {
                    chat_id: ticket.chatId,
                    reply_to_message_id: ticket.ticketId,
                })
            }
        })
    }
}