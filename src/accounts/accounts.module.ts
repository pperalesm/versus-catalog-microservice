import { Module } from "@nestjs/common";
import { AccountsService } from "./domain/accounts.service";
import { AccountsResolver } from "./api/accounts.resolver";
import { AccountsRepository } from "./infrastructure/accounts.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Account, AccountSchema } from "./domain/entities/account.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MailerModule } from "@nestjs-modules/mailer";
import { join } from "path";
import { Constants } from "src/constants";
import { CommonModule } from "src/common/common.module";
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: "local.env",
      ignoreEnvFile: process.env.NODE_ENV && process.env.NODE_ENV != "local",
    }),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      context: ({ req, res }) => ({ req, res }),
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/${Constants.ACCOUNTS_DB}?authSource=admin`,
    ),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"Versus Information" <info@versus.gg>',
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    CommonModule,
  ],
  providers: [AccountsResolver, AccountsService, AccountsRepository],
})
export class AccountsModule {}
