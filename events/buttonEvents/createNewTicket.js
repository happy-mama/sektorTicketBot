module.exports = {

    name: "createNewTicket",
    type: "buttonEvent",

    run(data_, ctx, ticket, doc) {
        let helpTextNumber = Number(data_.cqd.split("_")[1])
        let text = data_.config.helpText[helpTextNumber]

        ctx.deleteMessage()

        ctx.reply(text, {
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "Создать заявку",
                        callback_data: `createNewTicketAccept_${ticket.id}_${helpTextNumber}`
                    }, {
                        text: "Я решил свою проблему",
                        callback_data: `createNewTicketDecline_${ticket.id}_`
                    }]
                ]
            }
        })
    }
}