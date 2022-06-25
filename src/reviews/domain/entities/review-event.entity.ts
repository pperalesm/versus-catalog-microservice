import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class ReviewEvent {
  id?: string;

  @Prop({ unique: true })
  timestamp?: string;

  constructor({ id, timestamp }: { id?: string; timestamp?: string }) {
    this.id = id;
    this.timestamp = timestamp;
  }
}

export type ReviewEventDocument = ReviewEvent & Document;

export const ReviewEventSchema = SchemaFactory.createForClass(ReviewEvent);
