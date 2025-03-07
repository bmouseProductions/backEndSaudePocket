/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*',  // Permite qualquer domínio acessar seu backend (mude para um domínio específico para maior segurança)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Métodos permitidos
    allowedHeaders: 'Content-Type, Accept',  // Cabeçalhos permitidos
  });

  await app.listen(3000);  // Ou qualquer outra porta que você esteja utilizando
}
bootstrap();
