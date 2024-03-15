import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // for active pipe from dto
  const configService = app.get(ConfigService);
  const port = configService.get("App.port");
  await app.listen(port, () => {
    console.log(`server runs on localhost:${port}`);
  });
}
bootstrap();
