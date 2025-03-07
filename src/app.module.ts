import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Disponível em toda a aplicação
      envFilePath: '.env', // garante que está buscando no lugar certo
    }),
    MailModule,
  ],
})
export class AppModule {}
