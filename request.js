import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config({path: "./secrets.env"})
import {reqLogger} from './logger.js'

export default async function request(endpoint, method="GET", headers={}, body=null) {
    reqLogger.http(`Sending ${method} request to ${endpoint}`)
    const req = await fetch(`https://discord.com/api/v10${endpoint}`, {
        method: method,
        headers: {
            ...headers,
            Authorization: `Bot ${process.env.TOKEN}`,
            'Content-Type': "application/json"
        },
        body: JSON.stringify(body)
    })

    reqLogger.http(`Request to ${endpoint} returned ${req.status}`)

    if (!req.ok) {
        reqLogger.error(`Request to ${endpoint} failed with code ${req.status}`)
        // const error = (await req.json())
        return
    }

    try {
        return await req.json()
    } catch(e) {
        reqLogger.warn("No JSON returned")
    }
}
