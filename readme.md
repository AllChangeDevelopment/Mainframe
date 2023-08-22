# All Change Verifier
[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/te9i.svg)](https://uptime.betterstack.com/?utm_source=status_badge)
Repository for the **official** verification bot for the All Change Community, which verifies the user's age.

## How it works
1. User calls `/verify` in the All Change discord server.
2. Bot replies with a 6 digit code.
3. User enters code into our Roblox verification game.
4. Bot responds with whether you pass the verification process using Roblox's PolicyService, which checks if your account is able to view Discord social links on the platform.
5. If passed, users recieve the `Age Verified` role, and if failed, users recieve the `Age Verification Failure` role and are prompted to contact All Change support.

## Where's discord.js?
As a personal rule I **never** use `discord.js`, as I really dislike the way the library works now. Instead, as you might notice, I connect directly to Discord Gateway and send HTTP requests onto the API instead of going through a wrapper like `discord.js`. This also allows me to get full control over the bot and how it works on the platform.

## Credits
This bot is made by `the.developer` (`develop331`).
