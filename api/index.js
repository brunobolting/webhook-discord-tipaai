import * as dotenv from 'dotenv'
dotenv.config()

import express from "express"
import bodyParser from "body-parser"
import Http from '../app/http.js'
import Helper from '../app/helper.js'
const TIPAAI_WEBHOOK_TOKEN = process.env.TIPAAI_WEBHOOK_TOKEN
const TIPAAI_TITLE_TEXT = process.env.TIPAAI_TITLE_TEXT
const TIPAAI_EMBED_COLOR = process.env.TIPAAI_EMBED_COLOR
const URL_WEBHOOK_DISCORD = process.env.URL_WEBHOOK_DISCORD
const DATETIME = new Date(new Date()-3600*1000*3);

var app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get("/", function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`<pre>
  ------------
< 🐮 >
  ------------
          \\   ^__^
           \\  (oo)\\_______
              (__)\\       )\\/\\
                  ||----w |
                  ||     ||
</pre>`)
})

app.post("/webhook/tipaai", async function (req, res) {
    if (req.header('X-Tipa-Webhook-Secret-Token') !== TIPAAI_WEBHOOK_TOKEN) {
        return res.status(401).send()
    }

    let payload = req.body.payload

    if (payload.tip === undefined) {
        return res.send()
    }

    const donation = {
        name: payload.tip.name,
        amount: 'R$ ' + payload.tip.amount,
        message: payload.tip.message,
        date: payload.tip.payed_at.replace(/\s/g, '')
    }

    let message = 'Sem mensagem'
    if (donation.message !== '') {
        message = `Mensagem: \`\`\`${donation.message}\`\`\``
    }

    const title = TIPAAI_TITLE_TEXT
        .replace('%NAME%', donation.name)
        .replace('%AMOUNT%', donation.amount)

    await Http.post(URL_WEBHOOK_DISCORD, {
        embeds: [{
            color: Helper.hexToDecimal(TIPAAI_EMBED_COLOR || '#0096FF'),
            title: title,
            description: `${message}`,
            timestamp: donation.date,
        }]
    }).catch((response) => {
        const error = {
            "provider": "discord",
            "error": response.message,
            "code": response.response.status,
        }
        console.log(DATETIME.toISOString(), error)

        return res.status(response.response.status).send(error)
    })

    return res.send()
});

export default app;
