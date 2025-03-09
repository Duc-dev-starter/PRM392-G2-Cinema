import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './config/swagger.config';
import { exec } from 'child_process';
import { CustomExceptionFilter } from './exceptions';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomExceptionFilter());
  SwaggerConfig.setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors();

  setTimeout(() => {
    const url = `http://localhost:${process.env.API_PORT}/api/docs`;
    exec(`start ${url}`); // Windows
  }, 2000);



  await app.listen(process.env.API_PORT || 5000);
}
bootstrap();
