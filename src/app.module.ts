import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { BoardsModule } from './apis/board/boards.module';
import { YoutubeModule } from './apis/youtube/youtube.module';
import { UsersMoulde } from './apis/users/users.module';

@Module({
  imports: [
    BoardsModule,
    UsersMoulde,
    YoutubeModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
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
    // CacheModule.register<RedisClientOptions>({
    //   store: redisStore,
    //   url: process.env.REDIS_HOST,
    //   isGlobal: true,
    // }),
  ],
  controllers: [
    AppController, //
  ],
})
export class AppModule {}
