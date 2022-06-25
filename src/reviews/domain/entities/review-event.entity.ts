import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class ReviewEvent {
  id?: string;

  @Prop({ unique: true })
  uuid?: string;

  constructor({ id, uuid }: { id?: string; uuid?: string }) {
    this.id = id;
    this.uuid = uuid;
  }
}

export type ReviewEventDocument = ReviewEvent & Document;

export const ReviewEventSchema = SchemaFactory.createForClass(ReviewEvent);
