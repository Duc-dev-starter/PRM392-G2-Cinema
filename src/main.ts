import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import AppDataSource from './ormconfig';
import { SwaggerConfig } from './config/swagger.config';
import { exec } from 'child_process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerUrl = `http://localhost:${process.env.API_PORT}/api/docs`
  SwaggerConfig.setupSwagger(app);

  // try {
  //   await AppDataSource.initialize();
  //   console.log('Entities:', AppDataSource.entityMetadatas.map((e) => e.name));
  // } catch (error) {
  //   console.error('Error during Data Source initialization:', error);
  // }
  // In ra console URL của Swagger

  app.enableCors();

  setTimeout(() => {
    const url = `http://localhost:${process.env.API_PORT}/api/docs`;
    exec(`start ${url}`); // Windows
  }, 2000);



  await app.listen(process.env.API_PORT || 5000);
}
bootstrap();
