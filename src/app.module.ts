import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Constants } from "./constants";
import { GamesModule } from "./games/games.module";

@Module({
  imports: [
    GamesModule,
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/${Constants.CATALOG_DB}?retryWrites=true&w=majority`,
    ),
  ],
})
export class AppModule {}
