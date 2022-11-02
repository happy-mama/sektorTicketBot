module.exports = {

    name: "createNewTicketDecline",
    type: "buttonEvent",

    run(data_, ctx, ticket, doc) {

        ticket.done = true
        
        ctx.deleteMessage()
    }
}