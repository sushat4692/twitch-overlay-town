export const configs = {
    'port' : Number(process.env.PORT || 3000),
    'twitch_client_id' : process.env.TWITCH_CLIENT_ID || "",
    'twitch_client_secret' : process.env.TWITCH_CLIENT_SECRET || "",
    'twitch_pubsub_secret': process.env.TWITCH_PUBSUB_SECRET || "",
    'twitch_pubsub_host': process.env.TWITCH_PUBSUB_HOST || "localhost",
    'twitch_user_id': process.env.TWITCH_USER_ID || "",
    'redis_host': process.env.REDIS_HOST || "127.0.0.1",
    'redis_port': Number(process.env.REDIS_PORT || "6379"),
    'redis_username': process.env.REDIS_USERNAME || undefined,
    'redis_password': process.env.REDIS_PASSWORD || undefined,
}
