import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';
import { graphqlUploadExpress } from 'graphql-upload';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress());
  app.enableCors({
    origin: (requestOrigin, callback) => {
      if (
        !requestOrigin ||
        process.env.WHITELIST.split(' ').includes(requestOrigin)
      ) {
        callback(null, true);
      } else {
        callback(new HttpException('Cors Error', HttpStatus.BAD_REQUEST));
      }
    },
    credentials: true,
  });
  await app.listen(5000, () => {
    console.log('=================');
    console.log('🐶🐶🐶 graphql 백엔드 서버 오픈 🐶🐶🐶');
    console.log('=================');
  });
}
bootstrap();
