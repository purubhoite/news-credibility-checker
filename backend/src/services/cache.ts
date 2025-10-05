import Redis from 'ioredis';

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
}

class NoOpCache implements CacheService {
  async get<T>(_key: string): Promise<T | null> { return null; }
  async set<T>(_key: string, _value: T, _ttlSeconds: number): Promise<void> { /* noop */ }
}

class RedisCache implements CacheService {
  private client: Redis;
  constructor(url: string) {
    this.client = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1 });
  }
  async get<T>(key: string): Promise<T | null> {
    const val = await this.client.get(key);
    return val ? (JSON.parse(val) as T) : null;
  }
  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }
}

export function createCache(): CacheService {
  const url = process.env.REDIS_URL;
  if (!url) return new NoOpCache();
  return new RedisCache(url);
}

export const cache = createCache();


