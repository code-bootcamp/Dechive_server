import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';
import { graphqlUploadExpress } from 'graphql-upload';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress());
  app.enableCors({
    origin: process.env.WHITELIST.split(', '),
    credentials: true,
  });
  await app.listen(5000, () => {
    console.log('=================');
    console.log(process.env.WHITELIST.split(', '));
    console.log(process.env.WHITELIST);
    console.log('🐶🐶🐶 graphql 백엔드 서버 오픈 🐶🐶🐶');
    console.log('=================');
  });
}
bootstrap();
