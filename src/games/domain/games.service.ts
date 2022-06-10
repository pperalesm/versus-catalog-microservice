import { Injectable } from "@nestjs/common";
import { AuthUser } from "src/common/models/auth-user.model";
import { Sorting } from "src/common/models/sorting.model";
import { ArrayOptions } from "../api/dto/array-options.dto";
import { GameFilter } from "../api/dto/game-filter";
import { GameSort } from "../api/dto/game-sort";
import { GamesRepository } from "../infrastructure/games.repository";

@Injectable()
export class GamesService {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async findGames(arrayOptions: ArrayOptions) {
    let sort = new GameSort();
    let filter = {};
    let titleFilter = {};
    let tagsFilter = {};
    let playedUsernamesFilter = {};
    let pendingUsernamesFilter = {};
    let yearReleasedFilter = {};

    if (arrayOptions.filter) {
      const {
        title,
        tags,
        playedUsernames,
        pendingUsernames,
        yearReleased,
        ...rest
      } = arrayOptions.filter;

      if (title) {
        titleFilter = {
          title: {
            $regex: new RegExp(title, "i"),
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

      if (playedUsernames) {
        playedUsernamesFilter = {
          playedUsernames: {
            $all: playedUsernames,
          },
        };
      }

      if (pendingUsernames) {
        pendingUsernamesFilter = {
          pendingUsernames: {
            $all: pendingUsernames,
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

      filter = {
        ...rest,
        ...titleFilter,
        ...tagsFilter,
        ...playedUsernamesFilter,
        ...pendingUsernamesFilter,
        ...yearReleasedFilter,
      };
    }

    if (arrayOptions.sort) {
      sort = arrayOptions.sort;
    } else {
      sort.title = Sorting.Asc;
    }

    return await this.gamesRepository.findGames(
      arrayOptions.page,
      filter,
      sort,
    );
  }

  async findPlayedGames(authUser: AuthUser, arrayOptions: ArrayOptions) {
    if (!arrayOptions.filter) {
      arrayOptions.filter = new GameFilter();
    }

    arrayOptions.filter.playedUsernames = [authUser.username];

    return await this.findGames(arrayOptions);
  }

  async findPendingGames(authUser: AuthUser, arrayOptions: ArrayOptions) {
    if (!arrayOptions.filter) {
      arrayOptions.filter = new GameFilter();
    }

    arrayOptions.filter.pendingUsernames = [authUser.username];

    return await this.findGames(arrayOptions);
  }
}
