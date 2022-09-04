```bash
twitch token --client-id {client_id} -s "channel:read:redemptions chat:read chat:edit"
```

https://id.twitch.tv/oauth2/authorize?client_id={client_id}&redirect_uri=http://localhost/callback&response_type=token&scope=channel:read:redemptions%20chat:read%20chat:edit