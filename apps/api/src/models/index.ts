import Redis, { RedisOptions } from "ioredis";
import { range } from "../lib/random";

export type ResidentType = {
  user_id: string;
  user_name: string;
  user_display_name: string;
  building_x?: number;
  building_y?: number;
  building_width?: number;
  building_height?: number;
  building_rank?: number;
};

export class RedisModel {
  private readonly redis: Redis;

  constructor(options?: RedisOptions) {
    this.redis = options ? new Redis(options) : new Redis();
  }

  async getAll() {
    const List = await this.redis
      .smembers("residents")
      .catch((e) => console.error(e));

    if (!List) {
      return [];
    }

    const pipeline = this.redis.pipeline();
    for (const user_id of List) {
      pipeline.hgetall(`resident:${user_id}`);
    }
    const response = await pipeline.exec().catch((e) => console.error(e));
    if (!response) {
      return [];
    }

    const Residents: ResidentType[] = [];
    response.map(([err, result], i) => {
      if (err) {
        return;
      }

      const user_id = List[i];
      Residents.push({
        ...{ user_id },
        ...(result as ResidentType),
      });
    });

    return Residents;
  }

  async upsertResident(resident: ResidentType) {
    await this.redis.sadd("residents", resident.user_id);
    await this.redis.hset(`resident:${resident.user_id}`, {
      user_name: resident.user_name,
      user_display_name: resident.user_display_name,
    });
  }

  async getRandomPosition(width: number, height: number) {
    const position = await (async () => {
      let x = 0;
      let y = 0;
      let checkers = [];

      do {
        checkers = [];

        x = range(0, 50 - width);
        y = range(0, 50 - height);

        for (let i = 0; i < width; i += 1) {
          for (let j = 0; j < height; j += 1) {
            checkers.push(`building:${x + i}:${y + j}`);
          }
        }

        console.log(checkers);
      } while (await this.redis.exists(checkers));

      return { x, y };
    })();

    const pipeline = this.redis.pipeline();
    for (let i = 0; i < width; i += 1) {
      for (let j = 0; j < height; j += 1) {
        pipeline.set(`building:${position.x + i}:${position.y + j}`, 1);
      }
    }
    await pipeline.exec();

    return position;
  }

  async upsertBuilding(resident: ResidentType) {
    const key = `resident:${resident.user_id}`;

    if (!(await this.redis.hexists(key, "building_x"))) {
      const position = await this.getRandomPosition(3, 3);

      const pipeline = this.redis.pipeline();
      pipeline.hsetnx(key, "building_x", position.x);
      pipeline.hsetnx(key, "building_y", position.y);
      pipeline.hsetnx(key, "building_width", 3);
      pipeline.hsetnx(key, "building_height", 3);
      pipeline.hsetnx(key, "building_rank", 0);
      await pipeline.exec().catch((e) => console.error(e));
    }

    const pipeline = this.redis.pipeline();
    pipeline.hincrby(key, "building_rank", 1);
    pipeline.hgetall(key);
    const response = await pipeline.exec().catch((e) => console.error(e));

    if (!response) {
      return false;
    }

    const [err, result] = response[1];
    if (err !== null) {
      console.error(err);
      return false;
    }

    return { ...resident, ...(result as ResidentType) };
  }
}
