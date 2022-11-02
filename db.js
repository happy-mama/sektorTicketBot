class DB {
    constructor(config) {
        this.cache = new Map()
        this.config = config
    }

    createTicket(opts) {
        let ticket = {
            id: opts.id,
            chatId: Number(opts.chatId),
            ticketId: "",
            writerId: "",
            messageId: "",
            method: "",
            methodChatId: ""
        }

        console.log("created ticket id:" + ticket.id)

        this.cache.set(ticket.id, ticket)
        return ticket
    }

    getTicket(ticketId, data_) {
        let ticket = null

        if (ticketId) {
            ticket = this.cache.get(ticketId)
        } else {
            this.cache.forEach(ticket_ => {

                if (ticket_.done) {
                    this.cache.delete(ticket_.id)
                }

                if (!ticket) {
                    if (ticket_.method && ticket_.writerId == data_.user.id) {
                        ticket = ticket_
                    }
                }
            })
        }

        // console.log("^^^^^^^^^^^^^^^^^^^^")
        // console.log("all tickets::: ", this.cache)
        // console.log("====================")

        return ticket
    }
}

module.exports = DB