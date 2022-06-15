import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ErrorsFilter } from "backend-common";
import { Transport } from "@nestjs/microservices";
import { Constants } from "./constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_URL],
      },
      consumer: {
        groupId: Constants.KAFKA_CONSUMER_GROUP_ID,
      },
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new ErrorsFilter());
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
