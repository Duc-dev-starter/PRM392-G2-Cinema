import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
    static setupSwagger(app: INestApplication): void {
        const config = new DocumentBuilder()
            .setTitle('Cinema')
            .setDescription('API documentation for the movie ticket booking system')
            .setVersion('1.0')
            .addBearerAuth() // Add Bearer Token support
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document);
    }
}