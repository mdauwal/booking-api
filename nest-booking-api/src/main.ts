import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription('Simple Booking API for properties and bookings')
    .setVersion('1.0.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT ? Number(process.env.PORT) : 3000
  await app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`Booking API running on http://localhost:${port}/api`)
  // eslint-disable-next-line no-console
  console.log(`Swagger Docs available at http://localhost:${port}/api/docs`)
}
bootstrap()
