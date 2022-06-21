import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from "backend-common";
import { Game, GameSchema } from "./domain/entities/game.entity";
import { GamesResolver } from "./api/games.resolver";
import { GamesService } from "./domain/games.service";
import { GamesRepository } from "./infrastructure/games.repository";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Constants } from "src/constants";
import { ConfigModule } from "@nestjs/config";
import { KafkaConsumer } from "./infrastructure/kafka.consumer";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: "local.env",
      ignoreEnvFile: process.env.NODE_ENV && process.env.NODE_ENV != "local",
    }),
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
  controllers: [KafkaConsumer],
})
export class GamesModule {}
