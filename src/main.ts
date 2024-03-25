require('dotenv').config(); //BUNDAN DOLAYI OLMUYOR, BUNU SİLMEYECEKSİN
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Fudy Test Task Backend')
    .setDescription('Backend side of the Fudy Test Task')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' is the endpoint where Swagger UI will be served

  await app.listen(3000);
}
bootstrap();
