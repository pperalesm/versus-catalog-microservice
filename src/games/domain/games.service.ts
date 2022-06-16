import { Injectable } from "@nestjs/common";
import { AuthUser } from "backend-common";
import { Sorting } from "backend-common";
import { GameOptions } from "../api/dto/game-options";
import { GameFilter } from "../api/dto/game-filter";
import { GamesRepository } from "../infrastructure/games.repository";
import { Game } from "./entities/game.entity";
import { RatingDistribution } from "./value-objects/rating-distribution.vo";
import { CreateGameDto } from "../api/dto/create-game.dto";

@Injectable()
export class GamesService {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async create(createGameDto: CreateGameDto) {
    return await this.gamesRepository.create(
      new Game({
        ...createGameDto,
        playedBy: [],
        pendingBy: [],
        ratingDistribution: new RatingDistribution(0, 0, 0, 0, 0),
        popularity: 0,
      }),
    );
  }

  async deleteOne(title: string) {
    return await this.gamesRepository.deleteOne({ title: title });
  }

  async find(gameOptions: GameOptions) {
    let sort = {};
    let filter = {};

    if (gameOptions.filter) {
      const {
        title,
        companies,
        yearReleased,
        tags,
        averagePayToWin,
        playedBy,
        pendingBy,
        ...rest
      } = gameOptions.filter;
      let titleFilter = {};
      let companiesFilter = {};
      let yearReleasedFilter = {};
      let tagsFilter = {};
      let averagePayToWinFilter = {};
      let playedByFilter = {};
      let pendingByFilter = {};

      if (title) {
        titleFilter = {
          title: {
            $regex: new RegExp(title, "i"),
          },
        };
      }

      if (companies) {
        companiesFilter = {
          company: {
            $in: companies,
          },
        };
      }

      if (yearReleased) {
        yearReleasedFilter = {
          yearReleased: {
            $gte: yearReleased.min,
            $lte: yearReleased.max,
          },
        };
      }

      if (tags) {
        tagsFilter = {
          tags: {
            $all: tags,
          },
        };
      }

      if (averagePayToWin) {
        averagePayToWinFilter = {
          averagePayToWin: {
            $gte: averagePayToWin.min,
            $lte: averagePayToWin.max,
          },
        };
      }

      if (playedBy) {
        playedByFilter = {
          playedBy: {
            $all: playedBy,
          },
        };
      }

      if (pendingBy) {
        pendingByFilter = {
          pendingBy: {
            $all: pendingBy,
          },
        };
      }

      filter = {
        ...titleFilter,
        ...companiesFilter,
        ...yearReleasedFilter,
        ...tagsFilter,
        ...averagePayToWinFilter,
        ...playedByFilter,
        ...pendingByFilter,
        ...rest,
      };
    }

    if (gameOptions.sort) {
      sort = { ...gameOptions.sort };
    } else {
      sort = { title: Sorting.Asc };
    }

    return await this.gamesRepository.find(gameOptions.page, filter, sort);
  }

  async findPlayed(authUser: AuthUser, gameOptions: GameOptions) {
    if (!gameOptions.filter) {
      gameOptions.filter = new GameFilter();
    }

    gameOptions.filter.playedBy = [authUser.username];

    return await this.find(gameOptions);
  }

  async findPending(authUser: AuthUser, gameOptions: GameOptions) {
    if (!gameOptions.filter) {
      gameOptions.filter = new GameFilter();
    }

    gameOptions.filter.pendingBy = [authUser.username];

    return await this.find(gameOptions);
  }

  async findTags() {
    return await this.gamesRepository.findTags();
  }

  async findCompanies() {
    return await this.gamesRepository.findCompanies();
  }

  async findOne(title: string) {
    return await this.gamesRepository.findOne({ title: title });
  }

  async updateToPlayed(authUser: AuthUser, title: string) {
    return await this.gamesRepository.updateOne(
      { title: title },
      { $addToSet: { playedBy: authUser.username } },
    );
  }

  async updateToPending(authUser: AuthUser, title: string) {
    return await this.gamesRepository.updateOne(
      { title: title },
      { $addToSet: { pendingBy: authUser.username } },
    );
  }

  async removeFromPlayed(authUser: AuthUser, title: string) {
    return await this.gamesRepository.updateOne(
      { title: title },
      { $pull: { playedBy: authUser.username } },
    );
  }

  async removeFromPending(authUser: AuthUser, title: string) {
    return await this.gamesRepository.updateOne(
      { title: title },
      { $pull: { pendingBy: authUser.username } },
    );
  }

  async moveToPlayed(authUser: AuthUser, title: string) {
    return await this.gamesRepository.updateOne(
      { title: title },
      {
        $addToSet: { playedBy: authUser.username },
        $pull: { pendingBy: authUser.username },
      },
    );
  }
}
