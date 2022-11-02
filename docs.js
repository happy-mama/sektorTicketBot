const { GoogleSpreadsheet } = require("google-spreadsheet")

class gDocs {
    constructor(url, googleConfig) {
        this.doc = new GoogleSpreadsheet(url);
        this.googleConfig = googleConfig
        this.now = {
            sheetIndex: null
        }
        this.setup = {
            sheetRows: ["ticketId", "author", "acceptAuthor", "doneAuthor", "text", "acceptText", "doneText", "time", "acceptTime", "doneTime", "status"],
            translate: {ticketId: "", author: "автор звявки", acceptAuthor: "кто принял", doneAuthor: "кто закрыл", text: "текст заявки", acceptText: "текст принятия заявки", doneText: "текст закрытия заявки", time: "время создания заявки", acceptTime: "время принятия заявки", doneTime: "время закрытия заявки", status: "статус"}
        }
        this.sheet
    }

    async init() {
        await this.doc.useServiceAccountAuth({
            client_email: this.googleConfig.client_email,
            private_key: this.googleConfig.private_key
        })

        await this.doc.loadInfo()

        this.now.sheetIndex = 0
    }

    async getSheet() {
        let sheet
        sheet = this.doc.sheetsByIndex[this.now.sheetIndex]

        if (!sheet) {
            sheet = await this.createSheet()
        }

        let rows = await sheet.getRows().catch(e => {
            return console.log("ERROR:EMPTY_GOOGLE_DOCS_HEADER")
        })

        this.rows = rows
        this.sheet = sheet
        return
    }

    async createSheet() {
        let sheet = await this.doc.addSheet({
            headerValues: this.setup.sheetRows,
            title: new Date().toLocaleDateString("ru-ru", {month: "long", year: "numeric"})
        })
        await sheet.addRow(this.setup.translate)
        return sheet
    }

    findTicketRow(ticketId) {
        let temp

        this.rows.forEach((value, index) => {
            let row = value._rawData

            if (row[0] == ticketId) {
                temp = index
                return index
            }
        })

        if (!temp) {
            console.log("doc.findTicketRow ERROR:::", temp)
            temp = this.rows.length
        }

        return temp
    }
}

module.exports = gDocs