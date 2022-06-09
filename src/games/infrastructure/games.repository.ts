import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Pagination } from "src/common/models/pagination.model";
import { GameFilter } from "../api/dto/game-filter";
import { GameSort } from "../api/dto/game-sort";
import { Game, GameDocument } from "../domain/entities/game.entity";

@Injectable()
export class GamesRepository {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
  ) {}

  async findGames(
    page: Pagination,
    filter?: Record<string, unknown>,
    sort?: GameSort,
  ) {
    return await this.gameModel
      .find(filter)
      .skip(page.skip)
      .limit(page.limit)
      .sort(sort);
  }
}
