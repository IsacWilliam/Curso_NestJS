import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entity/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV === 'test' ? '.env.test' : '.env',
    }),
    ThrottlerModule.forRoot({
      ttl: 60, // Em 60 segundos
      limit: 100, // Permite 100 acessos
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'rudolph48@ethereal.email',
          pass: 'J6zS8GZcyN1fyQpmTx',
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: '"Isac" <rudolph48@ethereal.email>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
          tls: false,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserEntity],
      synchronize: process.env.ENV === 'development',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AppService],
})
export class AppModule {}
