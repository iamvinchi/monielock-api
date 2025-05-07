import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, HttpStatus, ValidationPipe,  } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: process.env.NODE_ENV === 'production' ? ['error'] : ['log', 'error', 'warn', 'debug', 'verbose']
  });

  app.use('/static', express.static(join(__dirname, '..', 'public')));
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true ,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return {
          statusCode: HttpStatus.OK,
          message: {message: result[0].message, status: false}
        }
      },
      stopAtFirstError: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix('/api/v1');
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
    .setTitle('Monielock API')
    .setDescription('Monielock API documentation')
    .setVersion('1.0')
    .setBasePath(process.env.BASE_PATH)
    .addBearerAuth()
    .build(),
    {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    },
  );
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { 
      persistAuthorization: true,
    },
    customSiteTitle: 'Monielock',
  });

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT', 3005), '0.0.0.0');
}
bootstrap();

