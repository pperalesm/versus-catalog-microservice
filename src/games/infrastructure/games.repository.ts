import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, SortOrder } from "mongoose";
import { Pagination } from "backend-common";
import { Game, GameDocument } from "../domain/entities/game.entity";

@Injectable()
export class GamesRepository {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
  ) {}

  async find(
    page: Pagination,
    filter?: Record<string, unknown>,
    sort?: { [key: string]: SortOrder },
  ): Promise<Game[]> {
    return await this.gameModel
      .find(filter)
      .skip(page.skip)
      .limit(page.limit)
      .sort(sort);
  }

  async findTags(): Promise<string[]> {
    return await this.gameModel.distinct("tags");
  }

  async findCompanies(): Promise<string[]> {
    return await this.gameModel.distinct("company");
  }

  async findOne(filter: Record<string, unknown>): Promise<Game> {
    const game = await this.gameModel.findOne(filter);

    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }

  async updateOne(
    filter: Record<string, unknown>,
    updateInfo: Record<string, unknown>,
  ): Promise<Game> {
    const game = await this.gameModel.findOneAndUpdate(filter, updateInfo, {
      new: true,
    });

    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }
}
