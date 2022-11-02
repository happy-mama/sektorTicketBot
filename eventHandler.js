const fs = require("fs");

class EventHandler {
    constructor() {
        this.commands = new Map();
        this.messageEvents = new Map();
        this.buttonEvents = new Map();
    }

    load() {
        return new Promise((result, reject) => {
            fs.readdir("./events/", (err, eventsFolders) => {
                if (err) {
                    reject(err);
                }

                eventsFolders.forEach(eventFolder => {
                    fs.readdir("./events/" + eventFolder, (err, eventFiles) => {

                        if (err) {
                            reject(err)
                        }

                        eventFiles.forEach(eventFile => {
                            let event = require("./events/" + eventFolder + "/" + eventFile);

                            switch (event.type) {
                                case "command": {
                                    this.commands.set(event.name, event)
                                } break;

                                case "messageEvent": {
                                    this.messageEvents.set(event.name, event)
                                } break;

                                case "buttonEvent": {
                                    this.buttonEvents.set(event.name, event)
                                } break;

                                default: {
                                    console.log("Unsuported eventFile type:" + event.type)
                                    return
                                }
                            }

                            console.log(`loaded event:${event.type}:${event.name}`)
                        })
                    })
                });
                result()
            });
        })
    };

    messageEvent(data_, ctx, ticket, db) {
        return new Promise((result, reject) => {

            let event = this.messageEvents.get(ticket.method.split("_")[0])

            if (event) {
                event.run(data_, ctx, ticket, db)
                result(200)
            } else {
                reject("noEvent")
            }
        })
    }

    buttonEvent(data_, ctx, ticket, db) {
        return new Promise((result, reject) => {

            console.log(data_.cqd)

            let event = this.buttonEvents.get(data_.cqd.split("_")[0])

            if (event) {
                event.run(data_, ctx, ticket, db)
                result(200)
            } else {
                reject("noEvent")
            }
        })
    }
}

module.exports = EventHandler