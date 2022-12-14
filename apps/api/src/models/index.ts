import Redis, { ChainableCommander, RedisOptions } from "ioredis";
import { configs } from "../lib/config";
import { range } from "../lib/random";
import { BlockXLength, BlockYLength } from "../const/Town";

export type ResidentType = {
  user_id: number | string;
  user_name: string;
  user_display_name: string;
  building_x?: number;
  building_y?: number;
  building_width?: number;
  building_height?: number;
  building_rank?: number;
};

class RedisModel {
  private readonly redis: Redis;

  constructor(options?: RedisOptions) {
    this.redis = options ? new Redis(options) : new Redis();
  }

  private convertValue(
    resident: Record<string, string> | ResidentType
  ): ResidentType {
    const result: ResidentType = {
      user_id: Number(resident.user_id),
      user_name: resident.user_name,
      user_display_name: resident.user_display_name,
    };

    if (resident.building_x) {
      result.building_x = Number(resident.building_x);
      result.building_y = Number(resident.building_y);
      result.building_width = Number(resident.building_width);
      result.building_height = Number(resident.building_height);
      result.building_rank = Number(resident.building_rank);
    }

    return result;
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
      Residents.push(
        this.convertValue({
          ...{ user_id },
          ...(result as ResidentType),
        })
      );
    });

    return Residents;
  }

  async resetPosition() {
    const keis = await this.redis.keys("building:*");

    // ?????????????????????????????????
    const delPipeline = this.redis.pipeline();
    keis.map((key) => {
      delPipeline.del(key);
    });
    await delPipeline.exec();

    // ???????????????
    const createPipeline = this.redis.pipeline();
    const residents = await this.getAll();
    for (const resident of residents) {
      if (
        !resident.building_x ||
        !resident.building_y ||
        !resident.building_width ||
        !resident.building_height
      ) {
        continue;
      }

      this.fillTargetPosition(
        createPipeline,
        resident.building_x,
        resident.building_y,
        resident.building_width,
        resident.building_height
      );
    }
    await createPipeline.exec();
  }

  async destroy() {
    await this.redis.flushdb();
  }

  async fixSize() {
    const keis = await this.redis.keys("resident:*");

    const pipeline = this.redis.pipeline();
    for (const key of keis) {
      const resident = this.convertValue(
        (await this.redis.hgetall(key)) as any
      );

      if (!resident.building_rank) {
        continue;
      }

      resident.building_width = 2;
      resident.building_height = 2;
      if (resident.building_rank >= 5) {
        resident.building_width = 3;
        resident.building_height = 3;
      }

      pipeline.hset(key, "building_width", resident.building_width);
      pipeline.hset(key, "building_height", resident.building_height);
    }
    await pipeline.exec().catch((e) => console.error(e));
  }

  async shuffle() {
    {
      const keis = await this.redis.keys("building:*");

      // Delete building positions
      const pipeline = this.redis.pipeline();
      keis.map((key) => pipeline.del(key));
      await pipeline.exec();
    }

    {
      const keis = await this.redis.keys("resident:*");

      for (const key of keis) {
        const resident = this.convertValue(
          (await this.redis.hgetall(key)) as any
        );
        const position = await this.getNeighborRandomPosition(
          resident.building_width || 3,
          resident.building_height || 3
        );

        if (!position) {
          continue;
        }

        const pipeline = this.redis.pipeline();
        pipeline.hset(key, "building_x", position.x);
        pipeline.hset(key, "building_y", position.y);
        await pipeline.exec().catch((e) => console.error(e));
      }
    }
  }

  async upsertResident(resident: ResidentType) {
    await this.redis.sadd("residents", resident.user_id);
    await this.redis.hset(`resident:${resident.user_id}`, {
      user_name: resident.user_name,
      user_display_name: resident.user_display_name,
    });
  }

  private fillTargetPosition(
    pipeline: ChainableCommander,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    for (let i = 0; i < width; i += 1) {
      for (let j = 0; j < height; j += 1) {
        pipeline.set(`building:${x + i}:${y + j}`, 1);
      }
    }
  }

  private async getRandomPosition(width: number, height: number) {
    const position = await (async () => {
      let x = 0;
      let y = 0;
      let checkers = [];

      do {
        checkers = [];

        x = range(0, BlockXLength - width);
        y = range(0, BlockYLength - height);

        for (let i = 0; i < width; i += 1) {
          for (let j = 0; j < height; j += 1) {
            checkers.push(`building:${x + i}:${y + j}`);
          }
        }
      } while (await this.redis.exists(checkers));

      return { x, y };
    })();

    const pipeline = this.redis.pipeline();
    this.fillTargetPosition(pipeline, position.x, position.y, width, height);
    await pipeline.exec();

    return position;
  }

  private checkPositionBlank(
    positions: { x: number; y: number }[],
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    for (let i = 0; i < width; i += 1) {
      for (let j = 0; j < height; j += 1) {
        if (
          positions.some(
            (position) => position.x === x + i && position.y === y + j
          )
        ) {
          return false;
        }
      }
    }
    return true;
  }

  private async getNeighborPosition(width: number, height: number) {
    const position = await (async () => {
      const keis = await this.redis.keys("building:*");

      // ????????????????????????????????????????????????
      if (!keis.length) {
        return {
          x: Math.round(BlockXLength / 2 - width / 2),
          y: Math.round(BlockYLength / 2 - height / 2),
        };
      }

      const residents = await this.getAll();
      const targets: { x: number; y: number }[] = [];
      const positions = keis.map((key) => {
        const [_, x, y] = key.split(":");
        return { x: Number(x), y: Number(y) };
      });

      residents.map((resident) => {
        if (
          resident.building_x === undefined ||
          resident.building_y === undefined
        ) {
          return;
        }
        const x = resident.building_x;
        const y = resident.building_y;

        for (const i of [-width, width]) {
          const j = 0;

          if (
            x + i >= 0 &&
            x + i <= BlockXLength - width &&
            y + j >= 0 &&
            y + j <= BlockYLength - height &&
            !targets.some(
              (position) => position.x === x + i && position.y === y + j
            ) &&
            this.checkPositionBlank(positions, x + i, y + j, width, height)
          ) {
            targets.push({
              x: x + i,
              y: y + j,
            });
          }
        }

        for (const j of [-height, height]) {
          const i = 0;

          if (
            x + i >= 0 &&
            x + i <= BlockXLength - width &&
            y + j >= 0 &&
            y + j <= BlockYLength - height &&
            !targets.some(
              (position) => position.x === x + i && position.y === y + j
            ) &&
            this.checkPositionBlank(positions, x + i, y + j, width, height)
          ) {
            targets.push({
              x: x + i,
              y: y + j,
            });
          }
        }
      });

      if (!targets.length) {
        return false;
      }

      const index = range(0, targets.length - 1);
      return targets[index];
    })();

    if (!position) {
      return false;
    }

    const pipeline = this.redis.pipeline();
    this.fillTargetPosition(pipeline, position.x, position.y, width, height);
    await pipeline.exec();

    return position;
  }

  private async getNeighborRandomPosition(width: number, height: number) {
    const position = await (async () => {
      const keis = await this.redis.keys("building:*");

      // ????????????????????????????????????????????????
      if (!keis.length) {
        return {
          x: Math.round(BlockXLength / 2 - width / 2),
          y: Math.round(BlockYLength / 2 - height / 2),
        };
      }

      const targets: { x: number; y: number }[] = [];
      const positions = keis.map((key) => {
        const [_, x, y] = key.split(":");
        return { x: Number(x), y: Number(y) };
      });

      positions.map(({ x, y }) => {
        for (const i of [-width, 1]) {
          for (let j = -height + 1; j < 1; j += 1) {
            if (
              x + i >= 0 &&
              x + i <= BlockXLength - width &&
              y + j >= 0 &&
              y + j <= BlockYLength - height &&
              !targets.some(
                (position) => position.x === x + i && position.y === y + j
              ) &&
              this.checkPositionBlank(positions, x + i, y + j, width, height)
            ) {
              targets.push({
                x: x + i,
                y: y + j,
              });
            }
          }
        }

        for (let i = -width + 1; i < 1; i += 1) {
          for (const j of [-height, 1]) {
            if (
              x + i >= 0 &&
              x + i <= BlockXLength - width &&
              y + j >= 0 &&
              y + j <= BlockYLength - height &&
              !targets.some(
                (position) => position.x === x + i && position.y === y + j
              ) &&
              this.checkPositionBlank(positions, x + i, y + j, width, height)
            ) {
              targets.push({
                x: x + i,
                y: y + j,
              });
            }
          }
        }
      });

      if (!targets.length) {
        return false;
      }

      const index = range(0, targets.length - 1);
      return targets[index];
    })();

    if (!position) {
      return false;
    }

    const pipeline = this.redis.pipeline();
    this.fillTargetPosition(pipeline, position.x, position.y, width, height);
    await pipeline.exec();

    return position;
  }

  async upsertBuilding(resident: ResidentType) {
    const key = `resident:${resident.user_id}`;

    if (!(await this.redis.hexists(key, "building_x"))) {
      const position = await this.getNeighborRandomPosition(2, 2);
      if (!position) {
        return false;
      }

      const pipeline = this.redis.pipeline();
      pipeline.hsetnx(key, "building_x", position.x);
      pipeline.hsetnx(key, "building_y", position.y);
      pipeline.hsetnx(key, "building_width", 2);
      pipeline.hsetnx(key, "building_height", 2);
      pipeline.hsetnx(key, "building_rank", 0);
      await pipeline.exec().catch((e) => console.error(e));
    }

    const current = this.convertValue(await this.redis.hgetall(key));
    const response = await (async () => {
      if (
        current.building_x === undefined ||
        current.building_y === undefined ||
        current.building_rank === undefined ||
        current.building_width === undefined ||
        current.building_height === undefined
      ) {
        return false;
      }
      current.building_rank += 1;

      let changeSize = false;
      const prevWidth = current.building_width;
      const prevHeight = current.building_height;

      // Change building width/height depends on rank
      if (current.building_rank >= 5) {
        current.building_width = 3;
        current.building_height = 3;
        changeSize = true;
      }

      // If change the size, need to move
      if (changeSize) {
        // Check new size
        const exists = await (async () => {
          if (
            current.building_x === undefined ||
            current.building_y === undefined ||
            current.building_width === undefined ||
            current.building_height === undefined
          ) {
            return false;
          }

          const keis: string[] = [];
          for (let i = 0; i < current.building_width - prevWidth; i += 1) {
            for (let j = 0; j < current.building_height - prevHeight; j += 1) {
              keis.push(
                `building:${current.building_x + prevWidth + i}:${
                  current.building_y + prevHeight + i
                }`
              );
            }
          }

          return await this.redis.exists(keis);
        })();

        if (exists === false) {
          return false;
        }

        if (exists > 0) {
          // Remove current positions' flag
          const removePipeline = this.redis.pipeline();
          for (let i = 0; i < prevWidth; i += 1) {
            for (let j = 0; j < prevHeight; j += 1) {
              removePipeline.del(
                `building:${current.building_x + i}:${current.building_y + j}`
              );
            }
          }
          await removePipeline.exec();

          // Get new position
          const position = await this.getNeighborRandomPosition(
            current.building_width,
            current.building_height
          );
          if (!position) {
            return false;
          }

          current.building_x = position.x;
          current.building_y = position.y;
        } else {
          const pipeline = this.redis.pipeline();
          this.fillTargetPosition(
            pipeline,
            current.building_x,
            current.building_y,
            current.building_width,
            current.building_height
          );
          await pipeline.exec();
        }

        const pipeline = this.redis.pipeline();
        pipeline.hset(key, "building_rank", current.building_rank);
        pipeline.hset(key, "building_x", current.building_x);
        pipeline.hset(key, "building_y", current.building_y);
        pipeline.hset(key, "building_width", current.building_width);
        pipeline.hset(key, "building_height", current.building_height);
        pipeline.hgetall(key);
        const response = await pipeline.exec().catch((e) => console.error(e));

        if (!response) {
          return false;
        }

        return response[5];
      } else {
        const pipeline = this.redis.pipeline();
        pipeline.hset(key, "building_rank", current.building_rank);
        pipeline.hgetall(key);
        const response = await pipeline.exec().catch((e) => console.error(e));

        if (!response) {
          return false;
        }

        return response[1];
      }
    })();

    if (!response) {
      return false;
    }

    const [err, result] = response;
    if (err !== null) {
      console.error(err);
      return false;
    }

    return this.convertValue({ ...resident, ...(result as ResidentType) });
  }
}

export const model = new RedisModel({
  host: configs.redis_host,
  port: configs.redis_port,
  username: configs.redis_username,
  password: configs.redis_password,
});
