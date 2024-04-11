import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config({path: "./secrets.env"})
import {reqLogger} from './logger.js'

/**
 * Sends a request to the Discord API
 * @param {string} endpoint
 * @param {string} [method="GET"] method
 * @param {Object} [headers={}] headers
 * @param {Object} [body=null] body
 * @returns Object
 */
export default async function request(endpoint, method="GET", headers={}, body=null) {
    reqLogger.http(`Sending ${method} request to ${endpoint}`)
    let params = {
        method,
        headers: {
            ...headers,
            Authorization: `Bot ${process.env.TOKEN}`,
            'Content-Type': "application/json"
        },
    }

    if (body !== null) params.body = JSON.stringify(body)

    const req = await fetch(`https://discord.com/api/v10${endpoint}`, params)

    reqLogger.http(`Request to ${endpoint} returned ${req.status}`)

    if (!req.ok) {
        reqLogger.error(`Request to ${endpoint} failed with code ${req.status}`)
        const error = (await req.json())
        console.log(error)
        return {}
    }

    try {
        return await req.json()
    } catch(e) {
        reqLogger.warn("No JSON returned")
        return {}
    }

}
