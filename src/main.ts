import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger';
import { ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect'; //Auth0
import { config as Auth0Config } from './config/autho.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Demo Nest')
    .setDescription(
      'Esta es una API construida con Nest empleada como demos para el modulo 4 de la especialidad Backend de la carrera Fullstack Developer de Henry',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.use(loggerGlobal);
  app.use(auth(Auth0Config));
  // app.useGlobalGuards(new AuthGuard());
  // app.useGlobalInterceptors(new DateAdderInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
