# sektorTicketBot
Telegram ticket bot. To start, create this files:

## config.json => 
```json
{
    "token": "",
    "docs": "",
    "chat": "",
    "helpText": [
        "",
        "",
        "",
        ""
    ]
}
```

__token__ => *telegram bot token*

__docs__  => *google spreadsheet url id*

__chat__  => *group chat that will get tickets*

__helpText__ => *text that will show when you want to create a ticket*

## gdocs.json =>

json file from [google api](https://console.cloud.google.com/apis) page, just rename it. ([guide](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication))
