import Redis from "ioredis";
import { Logger } from "./logger";
import Env from "../config/env.config";

/**
 * CacheService class to handle caching operations using Redis.
 */
export class CacheManager {
    private client: Redis;

    constructor() {
        if (Env.NODE_ENV === "test") {
            this.client = {} as unknown as Redis;
        } else {
            this.client = new Redis({
                host: Env.REDIS_HOST,
                port: Env.REDIS_PORT,
                password: Env.REDIS_PASSWORD,
            });
        }
    }

    /**
     * Sets a value in the cache with a specified TTL (time-to-live).
     * @param {string} key - The key under which the value is stored.
     * @param {string} value - The value to be stored.
     * @param {number} ttl - Time-to-live in seconds.
     */
    public async set(key: string, value: string, ttl: number) {
        try {
            await this.client.set(key, value, "EX", ttl);
        } catch (error) {
            Logger.Error("Failed to set cache:", { error });
        }
    }

    /**
     * Gets a value from the cache by key.
     * @param {string} key - The key of the value to retrieve.
     * @returns {Promise<string | null>} - The value associated with the key, or null if not found.
     */
    public async get(key: string): Promise<string | null> {
        try {
            return await this.client.get(key);
        } catch (error) {
            Logger.Error("Failed to get cache:", { error });
            return null;
        }
    }

    /**
     * Deletes a value from the cache by key.
     * @param {string} key - The key of the value to delete.
     */
    public async delete(key: string) {
        try {
            await this.client.del(key);
        } catch (error) {
            Logger.Error("Failed to delete cache:", { error });
        }
    }

    /**
     * Clears all values from the cache.
     */
    public async clear() {
        try {
            await this.client.flushdb();
        } catch (error) {
            Logger.Error("Failed to clear cache:", { error });
        }
    }

    /**
     * Checks if a key exists in the cache.
     * @param {string} key - The key to check.
     * @returns {Promise<boolean>} - True if the key exists, false otherwise.
     */
    public async exists(key: string): Promise<boolean> {
        try {
            const result = await this.client.exists(key);
            return result === 1;
        } catch (error) {
            Logger.Error("Failed to check cache existence:", { error });
            return false;
        }
    }

    /**
     * Retrieves all keys from the cache.
     *
     * @returns {Promise<string[]>} A promise that resolves to an array of strings representing all keys in the cache.
     * @throws Will log an error and return an empty array if the operation fails.
     */
    public async getAllKeys(): Promise<string[]> {
        try {
            return await this.client.keys("*");
        } catch (error) {
            Logger.Error("Failed to get all keys from cache:", { error });
            return [];
        }
    }
}
