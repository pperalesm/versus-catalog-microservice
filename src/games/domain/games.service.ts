import { Injectable } from "@nestjs/common";
import { FindGamesDto } from "../api/dto/find-games.dto";
import { GamesRepository } from "../infrastructure/games.repository";

@Injectable()
export class GamesService {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async findGames(findGamesDto: FindGamesDto) {
    let filter: Record<string, unknown>;

    if (findGamesDto.filter) {
      filter = {
        title: `/${findGamesDto.filter.title}/`,
        company: findGamesDto.filter.company,
        yearReleased: findGamesDto.filter.yearReleased,
        tags: findGamesDto.filter.tags,
      };
    }

    return await this.gamesRepository.findGames(
      findGamesDto.page,
      filter,
      findGamesDto.sort,
    );
  }
}
