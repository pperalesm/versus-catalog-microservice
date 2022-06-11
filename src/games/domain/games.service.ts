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

  async find(arrayOptions: ArrayOptions) {
    let sort = new GameSort();
    let filter = {};
    let titleFilter = {};
    let tagsFilter = {};
    let playedUsernamesFilter = {};
    let pendingUsernamesFilter = {};
    let yearReleasedFilter = {};
    let companiesFilter = {};

    if (arrayOptions.filter) {
      const {
        title,
        companies,
        yearReleased,
        tags,
        playedUsernames,
        pendingUsernames,
        ...rest
      } = arrayOptions.filter;

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

      filter = {
        ...titleFilter,
        ...companiesFilter,
        ...yearReleasedFilter,
        ...tagsFilter,
        ...playedUsernamesFilter,
        ...pendingUsernamesFilter,
        ...rest,
      };
    }

    if (arrayOptions.sort) {
      sort = arrayOptions.sort;
    } else {
      sort.title = Sorting.Asc;
    }

    return await this.gamesRepository.find(arrayOptions.page, filter, sort);
  }

  async findPlayed(authUser: AuthUser, arrayOptions: ArrayOptions) {
    if (!arrayOptions.filter) {
      arrayOptions.filter = new GameFilter();
    }

    arrayOptions.filter.playedUsernames = [authUser.username];

    return await this.find(arrayOptions);
  }

  async findPending(authUser: AuthUser, arrayOptions: ArrayOptions) {
    if (!arrayOptions.filter) {
      arrayOptions.filter = new GameFilter();
    }

    arrayOptions.filter.pendingUsernames = [authUser.username];

    return await this.find(arrayOptions);
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
}
