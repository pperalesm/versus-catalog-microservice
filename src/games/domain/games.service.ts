import { Injectable } from "@nestjs/common";
import { AuthUser } from "backend-common";
import { Sorting } from "backend-common";
import { ArrayOptions } from "../api/dto/array-options.dto";
import { GameFilter } from "../api/dto/game-filter";
import { GamesRepository } from "../infrastructure/games.repository";

@Injectable()
export class GamesService {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async find(arrayOptions: ArrayOptions) {
    let sort = {};
    let filter = {};

    if (arrayOptions.filter) {
      const {
        title,
        companies,
        yearReleased,
        tags,
        playedBy,
        pendingBy,
        ...rest
      } = arrayOptions.filter;
      let titleFilter = {};
      let tagsFilter = {};
      let playedByFilter = {};
      let pendingByFilter = {};
      let yearReleasedFilter = {};
      let companiesFilter = {};

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
        ...playedByFilter,
        ...pendingByFilter,
        ...rest,
      };
    }

    if (arrayOptions.sort) {
      sort = { ...arrayOptions.sort };
    } else {
      sort = { title: Sorting.Asc };
    }

    return await this.gamesRepository.find(arrayOptions.page, filter, sort);
  }

  async findPlayed(authUser: AuthUser, arrayOptions: ArrayOptions) {
    if (!arrayOptions.filter) {
      arrayOptions.filter = new GameFilter();
    }

    arrayOptions.filter.playedBy = [authUser.username];

    return await this.find(arrayOptions);
  }

  async findPending(authUser: AuthUser, arrayOptions: ArrayOptions) {
    if (!arrayOptions.filter) {
      arrayOptions.filter = new GameFilter();
    }

    arrayOptions.filter.pendingBy = [authUser.username];

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
