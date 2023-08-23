import WebSocket from 'ws'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config({ path: './secrets.env' })

const nv = process.env['nv']
const v = process.env['v']
const vf = process.env['vf']
const token = process.env['token']



const link = "wss://gateway.discord.gg/?v=10&encoding=json"

const ws = new WebSocket(link);

const request = async (endpoint, method, body) => {
  let req;
  if (body !== null) {
    req = await fetch("https://discord.com/api/v10"+endpoint, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bot "+token
      }
    })
  } else {
    req = await fetch("https://discord.com/api/v10"+endpoint, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bot "+token
      }
    })
  }
  try {let res = await req.json()
       console.log(res)
  return res} catch {}
}

export default function bot(loop,db) {
  ws.on('error', error => {
    console.log("Error")
    console.error(error)
  });
  
  ws.on('close', async (code, reason) => {
    console.log("Code "+code)
    console.log(reason.toString())
console.log(    await request(`/channels/873894045066346538/messages`,"POST",{"embeds": [
    {
      "type": "rich",
      "title": `ACV Fatal error`,
      "description": `ACV has errored and will restart when available`,
      "color": 0xff0000,
      "fields": [
        {
          "name": `Code`,
          "value": code
        },
        {
          "name": "Reason",
          "value": reason.toString()
        }
      ]
    }
  ],"content": "<@688294866287198208>"}))  
    process.exit()
  })
  
  ws.on('open', function open() {
  });
  
  let interval = 0
  let ident = false
  
  ws.on('message', async function message(data) {
    data = JSON.parse(data)
    if (process.env.log == "true") console.log(data)
    switch (data.op) {
      case 10:
        interval = data.d.heartbeat_interval
        ws.send(JSON.stringify({
          "op": 1,
          "d": null
        }))
        ident = false
        break;
      case 11:
        if (!ident) {
          console.log("Identify")
          ws.send(JSON.stringify({
            op: 2,
            d: {
              token: token,
              properties: {
                os: "linux",
                browser: "whatever this shit is",
                device: "whatever this shit is"
              },
              intents: 33282
            }
          }))
          ident = true
          request(`/channels/873894045066346538/messages`,"POST",{"embeds": [
            {
              "type": "rich",
              "title": `Gateway connection`,
              "description": `Bot connected to gateway`,
              "color": 0x0000ff
            }
          ]}, false)
        }
        setTimeout(() => {
          ws.send(JSON.stringify({
            "op": 1,
            "d": null
          }))
        },interval)
        ws.send(JSON.stringify({
          "op": 3,
          "d": {
            "since": 91879201,
            "activities": [{
              "name": "roblox accounts",
              "type": 3
            }],
            "status": "online",
            "afk": false
          }
        }))
        break;
      case 1:
        ws.send(JSON.stringify({
          "op": 1,
          "d": null
        }))
        break;
      case 0:
        if (data.t==='INTERACTION_CREATE') {
          let interaction = data.d
          if (interaction.data.name == "verify") {
            let code = Math.floor(100000 + Math.random() * 900000)
            db.insertOne({
              interaction: interaction,
              code: code
            })
            request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {type:4,data:{"embeds": [
    {
      "type": "rich",
      "title": `Verification process`,
      "description": `To verify click the link above and enter the code ${code}. This one-time code is valid for 15 minutes. Do not share this code with anyone except the game above. Please don't dismiss this message as the next steps will be shown here. If you dismiss it by accident, you can always restart the process by running /verify again.`,
      "color": 0xff0000,
      "fields": [
        {
          "name": `Status`,
          "value": `Awaiting code input (${code})`
        }
      ],
      "url": `https://www.roblox.com/games/14422617464/Communications-Server-Eligibility`
    }
  ],flags:64}}, false)
          }
        }
        if (data.t==="GUILD_MEMBER_ADD") {
          let user = data.d.user
console.log(await request(`/guilds/${data.d.guild_id}/members/${user.id}`,"PATCH",{roles:[nv]}))
        }
    }
  });

  loop.on('msg', async msg => {
    console.log("Code: "+msg.code)
    console.log("Polling: "+msg.polling)
    
    let person = await db.findOne({code:msg.code})
    console.log(person)
    if (!person) return
    if (msg.polling.includes("Discord")) { 
      request(`/webhooks/1138208598116282489/${person.interaction.token}/messages/@original`,"PATCH",{"embeds": [
    {
      "type": "rich",
      "title": `Verification process`,
      "description": `You have been verified. This message can be safely dismissed.`,
      "color": 0xff0000,
      "fields": [
        {
          "name": `Status`,
          "value": `Verification passed`
        }
      ]
    }
  ],flags:64}, false)  
let roles =       await request(`/guilds/${person.interaction.guild_id}/members/${person.interaction.member.user.id}`,"GET",null)
      roles = roles.roles
      roles[roles.indexOf(nv)] = v
      console.log(await request(`/guilds/${person.interaction.guild_id}/members/${person.interaction.member.user.id}`,"PATCH",{roles:roles}))
    }
    else {request(`/webhooks/1138208598116282489/${person.interaction.token}/messages/@original`,"PATCH",{"embeds": [
    {
      "type": "rich",
      "title": `Verification process`,
      "description": `We have been unable to verify your account, so you will need to contact All Change support for further information. This message can be safely dismissed.`,
      "color": 0xff0000,
      "fields": [
        {
          "name": `Status`,
          "value": `Contact AC support`
        }
      ]
    }
  ],flags:64}, false)
    let roles =       await request(`/guilds/${person.interaction.guild_id}/members/${person.interaction.member.user.id}`,"GET",null)
      roles = roles.roles
      roles[roles.indexOf(nv)] = vf
      console.log(await request(`/guilds/${person.interaction.guild_id}/members/${person.interaction.member.user.id}`,"PATCH",{roles:roles}))
         }

    db.deleteOne({code:msg.code})
    
  })

  
  loop.on('cmd', async cmd => {
    request("/applications/1138208598116282489/commands","POST",cmd)
  })

}
