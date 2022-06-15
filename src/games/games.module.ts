import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { CommonModule } from "backend-common";
import { Game, GameSchema } from "./domain/entities/game.entity";
import { GamesResolver } from "./api/games.resolver";
import { GamesService } from "./domain/games.service";
import { GamesRepository } from "./infrastructure/games.repository";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Constants } from "src/constants";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    ClientsModule.register([
      {
        name: "KAFKA",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: Constants.KAFKA_CLIENT_ID,
            brokers: [process.env.KAFKA_URL],
          },
        },
      },
    ]),
    CommonModule,
  ],
  providers: [GamesResolver, GamesService, GamesRepository],
})
export class GamesModule {}
