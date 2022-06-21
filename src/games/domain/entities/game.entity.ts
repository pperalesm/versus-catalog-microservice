import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@ObjectType()
@Schema()
export class Game {
  id?: string;

  @Field()
  @Prop({ unique: true })
  title?: string;

  @Field()
  @Prop()
  description?: string;

  @Field()
  @Prop()
  developer?: string;

  @Field()
  @Prop()
  publisher?: string;

  @Field()
  @Prop()
  status?: string;

  @Field()
  @Prop()
  officialWebsite?: string;

  @Field()
  @Prop()
  releaseDate?: Date;

  @Field()
  @Prop()
  image?: string;

  @Field(() => [String])
  @Prop([String])
  gameModes?: string[];

  @Field(() => [String])
  @Prop([String])
  genres?: string[];

  @Field(() => [String])
  @Prop([String])
  platforms?: string[];

  @Field(() => [String])
  @Prop([String])
  playerPerspectives?: string[];

  @Prop([String])
  playedBy?: string[];

  @Prop([String])
  pendingBy?: string[];

  @Field(() => [Int])
  @Prop([Number])
  ratingDistribution?: number[];

  @Field(() => Float, { nullable: true })
  @Prop()
  averageRating?: number;

  @Field(() => [Int])
  @Prop([Number])
  payToWinDistribution?: number[];

  @Field(() => Float, { nullable: true })
  @Prop()
  averagePayToWin?: number;

  @Field(() => Int)
  @Prop()
  popularity?: number;

  constructor({
    id,
    title,
    description,
    developer,
    publisher,
    status,
    officialWebsite,
    releaseDate,
    image,
    gameModes,
    genres,
    platforms,
    playerPerspectives,
    playedBy,
    pendingBy,
    ratingDistribution,
    averageRating,
    payToWinDistribution,
    averagePayToWin,
    popularity,
  }: {
    id?: string;
    title?: string;
    description?: string;
    developer?: string;
    publisher?: string;
    status?: string;
    officialWebsite?: string;
    releaseDate?: Date;
    image?: string;
    gameModes?: string[];
    genres?: string[];
    platforms?: string[];
    playerPerspectives?: string[];
    playedBy?: string[];
    pendingBy?: string[];
    ratingDistribution?: number[];
    averageRating?: number;
    payToWinDistribution?: number[];
    averagePayToWin?: number;
    popularity?: number;
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.developer = developer;
    this.publisher = publisher;
    this.status = status;
    this.officialWebsite = officialWebsite;
    this.releaseDate = releaseDate;
    this.image = image;
    this.gameModes = gameModes;
    this.genres = genres;
    this.platforms = platforms;
    this.playerPerspectives = playerPerspectives;
    this.playedBy = playedBy;
    this.pendingBy = pendingBy;
    this.ratingDistribution = ratingDistribution;
    this.averageRating = averageRating;
    this.payToWinDistribution = payToWinDistribution;
    this.averagePayToWin = averagePayToWin;
    this.popularity = popularity;
  }
}

export type GameDocument = Game & Document;

export const GameSchema = SchemaFactory.createForClass(Game);
