import { Redis } from "@upstash/redis";
import { Analytics, Ratelimit, RateLimit } from "@upstash/ratelimit";
import { RateLimitError } from "openai";

const redis = Redis.fromEnv();

export const rewriteRateLimit = new RateLimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
});