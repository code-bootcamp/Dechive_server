import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { BoardsModule } from './apis/boards/boards.module';
import { YoutubeModule } from './apis/youtube/youtube.module';
import { UsersMoulde } from './apis/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './apis/auth/auth.module';
import { FollowingsModule } from './apis/followings/following.module';
import { FolloweesModule } from './apis/followees/followees.module';
import { FilesModule } from './apis/files/files.module';
import { CommentsModule } from './apis/comments/comment.module';
import { RepliesModule } from './apis/replies/reply.module';
import { ProductsModule } from './apis/products/products.module';

@Module({
  imports: [
    AuthModule,
    BoardsModule,
    CommentsModule,
    FilesModule,
    FolloweesModule,
    FollowingsModule,
    ProductsModule,
    RepliesModule,
    UsersMoulde,
    YoutubeModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        autoSchemaFile: 'src/commons/graphql/schema.gql',
        context: ({ req, res }) => ({ req, res }),
        cors: {
          origin: process.env.WHITELIST.split(', '),
          credentials: true,
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: process.env.REDIS_HOST,
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'Gmail',
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT),
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        },
      }),
    }),
  ],
  controllers: [
    AppController, //
  ],
})
export class AppModule {}
