module.exports = {

    name: "createNewTicketAccept",
    type: "buttonEvent",

    run(data_, ctx, ticket, doc) {

        ticket.method = `createTicketWrite_${data_.cqd.split("_")[1]}_${data_.cqd.split("_")[2]}`
        ticket.writerId = data_.user.id
        ticket.methodChatId = data_.chat.id

        ctx.deleteMessage()

        ctx.reply("Опишите проблему одним сообщением")
    }
}