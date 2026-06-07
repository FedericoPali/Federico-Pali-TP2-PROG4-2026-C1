import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Permiso para que cualquiera pueda hacer peticiones
  app.enableCors({ origin: '*' });

  await app.listen(process.env.PORT ?? 3000);

  console.log("¿La clave secreta está cargada?:", process.env.PALABRA_SECRETA ? "SÍ" : "NO");
}
bootstrap().catch((error) =>
  console.error(error),

);
