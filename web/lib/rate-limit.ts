import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();

export const rewriteRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2, "30 s"),
    analytics: true,
});