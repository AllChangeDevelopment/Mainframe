import express from 'express'
import {MongoClient, ServerApiVersion} from 'mongodb'
import dotenv from 'dotenv'
dotenv.config({ path: './secrets.env' })
const uri = `mongodb+srv://portal:${process.env.pass}@cluster0.wo5l2jp.mongodb.net/?retryWrites=true&w=majority`;
import bot from './bot.js'
import {EventEmitter} from 'events'

const MessageLoop = new EventEmitter

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1, strict: true, deprecationErrors: true,
    },
})
client.connect()
let Db = client.db("websocket")
let db = Db.collection("messages")

const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
    let s = await db.find({}).toArray()
    res.send(s)
})

app.post('/commands', async (req, res) => {
    MessageLoop.emit("cmd", req.body)
    res.send(req.body)
})

app.post('/', async (req, res) => {
    await db.insertOne(req.body)
    MessageLoop.emit("msg", req.body)
    res.send(req.body)
})

app.listen(3000, () => {
    console.log('Express server initialized')
    bot(MessageLoop, Db.collection("waiting"), Db.collection("logs"), Db.collection("tasks"))
})
