module.exports = {

    name: "createTicketWrite",
    type: "messageEvent",

    run(data_, ctx, ticket, doc) {
        doc.sheet.addRow({
            ticketId: ticket.id,
            author: data_.firstName,
            text: data_.messageText,
            time: data_.date,
            status: "OPEN"
        })

        let categoty = Number(ticket.method.split("_")[2])
        let categoryList = ["🎮 [ИГРЫ]", "🖥 [ПК]", "🌐 [ИНТЕРНЕТ]", "📍 [ПРОЧЕЕ]"]

        ticket.ticketId = data_.message.message_id
        ticket.method = ""
        ticket.methodChatId = ""

        let toAdminText = categoryList[categoty] + "\n" +
            "Заявка от: @" + data_.nick + "\n" +
            "Текст заявки:\n\n" +
            data_.messageText + "\n\n"

        ctx.reply(`Ваша заявка отправлена!`)

        ctx.sendMessage(toAdminText, {
            chat_id: data_.config.chat,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "Принять",
                        callback_data: "acceptTicket_" + ticket.id
                    }, {
                        text: "Принять и написать ответ",
                        callback_data: "acceptTicketAndWrite_" + ticket.id
                    }], [{
                        text: "Решено",
                        callback_data: "doneTicket_" + ticket.id
                    }, {
                        text: "Решено и написать ответ",
                        callback_data: "doneTicketAndWrite_" + ticket.id
                    }]
                ]
            }
        }).then(data => {
            ticket.messageId = data.message_id

            if (data_.photo) {
                ctx.sendPhoto(data_.photo.file_id, {
                    chat_id: data_.config.chat, 
                })
            }
            if (data_.document) {
                ctx.sendDocument(data_.document.file_id, {
                    chat_id: data_.config.chat
                })
            }
        })

        
    }
}