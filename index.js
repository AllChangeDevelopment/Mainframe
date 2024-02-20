import express from "express"
import Mongo from "./db.js"
import dotenv from "dotenv"

dotenv.config({ path: './secrets.env' })

import bot, {msg} from './bot.js'
import cmd from './cmd.js'

const client = new Mongo()

// client.connect()
// let Db = client.db("websocket")
// let db = Db.collection("messages")

const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
    // let s = await db.find({}).toArray()
    // res.send(s)
    res.send(await client.get("messages", {}))
})

app.post('/commands', async (req, res) => {
    await cmd(req.body)
    res.send(req.body)
})

app.post('/', async (req, res) => {
    // await db.insertOne(req.body)
    // console.log(req.body)
    msg(req.body)
    // res.send(req.body)
    await client.post("messages", req.body)
    res.send(req.body)
})

app.listen(9562, () => {
    console.log('Express server initialized')
    bot()
    cmd()
})
