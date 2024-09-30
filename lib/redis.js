import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config();

export const redis = new Redis("rediss://default:AWACAAIjcDFlNWU5OTcyZTVhMjI0MDhhYTI0YWQwMTY4NmE0ZjFmYnAxMA@famous-sturgeon-24578.upstash.io:6379");
await redis.del('hello', 'world');