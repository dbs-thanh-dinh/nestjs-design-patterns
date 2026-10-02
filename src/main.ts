import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  // eslint-disable-next-line no-console
  console.log(`App is running on: http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
