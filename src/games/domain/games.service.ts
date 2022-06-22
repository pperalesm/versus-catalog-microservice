import { Injectable } from "@nestjs/common";
import { AuthUser } from "backend-common";
import { Sorting } from "backend-common";
import { GameOptions } from "../api/dto/game-options";
import { GameFilter } from "../api/dto/game-filter";
import { GamesRepository } from "../infrastructure/games.repository";
import { Game } from "./entities/game.entity";
import { CreateGameDto } from "../api/dto/create-game.dto";
import { Review } from "./vo/review.vo";

@Injectable()
export class GamesService {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async create(createGameDto: CreateGameDto) {
    return await this.gamesRepository.create(
      new Game({
        ...createGameDto,
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
        status,
        releaseDate,
        gameModes,
        genres,
        platforms,
        playerPerspectives,
        averagePayToWin,
        playedBy,
        pendingBy,
        ...rest
      } = gameOptions.filter;
      let titleFilter = {};
      let companiesFilter = {};
      let statusFilter = {};
      let releaseDateFilter = {};
      let gameModesFilter = {};
      let genresFilter = {};
      let platformsFilter = {};
      let playerPerspectivesFilter = {};
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
          $or: [
            {
              developer: {
                $in: companies,
              },
            },
            {
              publisher: {
                $in: companies,
              },
            },
          ],
        };
      }

      if (status) {
        statusFilter = {
          status: {
            $in: status,
          },
        };
      }

      if (releaseDate) {
        releaseDateFilter = {
          releaseDate: {
            $gte: releaseDate.min,
            $lte: releaseDate.max,
          },
        };
      }

      if (gameModes) {
        gameModesFilter = {
          gameModes: {
            $all: gameModes,
          },
        };
      }

      if (genres) {
        genresFilter = {
          genres: {
            $all: genres,
          },
        };
      }

      if (platforms) {
        platformsFilter = {
          platforms: {
            $in: platforms,
          },
        };
      }

      if (playerPerspectives) {
        playerPerspectivesFilter = {
          playerPerspectives: {
            $in: playerPerspectives,
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
        ...statusFilter,
        ...releaseDateFilter,
        ...gameModesFilter,
        ...genresFilter,
        ...platformsFilter,
        ...playerPerspectivesFilter,
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

  async findGameModes() {
    return await this.gamesRepository.findGameModes();
  }

  async findGenres() {
    return await this.gamesRepository.findGenres();
  }

  async findPlatforms() {
    return await this.gamesRepository.findPlatforms();
  }

  async findPlayerPerspectives() {
    return await this.gamesRepository.findPlayerPerspectives();
  }

  async findCompanies() {
    const [developers, publishers] = await Promise.all([
      this.gamesRepository.findDevelopers(),
      this.gamesRepository.findPublishers(),
    ]);

    return Array.from(new Set([...developers, ...publishers]));
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

  async reviewCreated(review: Review) {
    const ratingInc = {};
    const payToWinInc = {};

    if (review.rating) {
      ratingInc["ratingDistribution." + (review.rating - 1)] = 1;
    }

    if (review.payToWin) {
      payToWinInc["payToWinDistribution." + (review.payToWin - 1)] = 1;
    }

    await this.gamesRepository.updateOne(
      { title: review.game },
      { $inc: { popularity: 1, ...ratingInc, ...payToWinInc } },
    );
  }

  async reviewDeleted(review: Review) {
    const ratingDec = {};
    const payToWinDec = {};

    if (review.rating) {
      ratingDec["ratingDistribution." + (review.rating - 1)] = -1;
    }

    if (review.payToWin) {
      payToWinDec["payToWinDistribution." + (review.payToWin - 1)] = -1;
    }

    await this.gamesRepository.updateOne(
      { title: review.game },
      { $inc: { popularity: -1, ...ratingDec, ...payToWinDec } },
    );
  }

  async reviewUpdated(oldReview: Review, newReview: Review) {
    const ratingDec = {};
    const ratingInc = {};
    const payToWinDec = {};
    const payToWinInc = {};

    if (oldReview.rating) {
      ratingDec["ratingDistribution." + (oldReview.rating - 1)] = -1;
    }
    if (newReview.rating) {
      ratingInc["ratingDistribution." + (newReview.rating - 1)] = 1;
    }
    if (oldReview.payToWin) {
      payToWinDec["payToWinDistribution." + (oldReview.payToWin - 1)] = -1;
    }
    if (newReview.payToWin) {
      payToWinInc["payToWinDistribution." + (newReview.payToWin - 1)] = 1;
    }

    if (
      oldReview.rating != newReview.rating ||
      oldReview.payToWin != newReview.payToWin
    ) {
      await this.gamesRepository.updateOne(
        { title: oldReview.game },
        {
          $inc: { ...ratingDec, ...payToWinDec, ...ratingInc, ...payToWinInc },
        },
      );
    }
  }

  async createOrUpdate(createGameDto: CreateGameDto) {
    return await this.gamesRepository.createOrUpdate(
      { title: createGameDto.title },
      { ...createGameDto },
    );
  }
}
