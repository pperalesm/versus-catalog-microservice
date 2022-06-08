import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { CommonModule } from "src/common/common.module";
import { Game, GameSchema } from "./domain/entities/game.entity";
import { GamesResolver } from "./api/games.resolver";
import { GamesService } from "./domain/games.service";
import { GamesRepository } from "./infrastructure/games.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: "local.env",
      ignoreEnvFile: process.env.NODE_ENV && process.env.NODE_ENV != "local",
    }),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/games/schema.gql"),
      context: ({ req, res }) => ({ req, res }),
    }),
    CommonModule,
  ],
  providers: [GamesResolver, GamesService, GamesRepository],
})
export class GamesModule {}
