import { Module } from "@nestjs/common";
import { CustomConfigModule } from "./modules/config/configs.module";
import { TypeOrmDbConfig } from "./config/typeorm.config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync({ // forRoot is for pass options inline but when u use config u should use forRootAsync
      useClass: TypeOrmDbConfig,
      inject: [TypeOrmDbConfig],
    }),
  ],
  controllers: [],
  providers: [TypeOrmDbConfig],
})
export class AppModule {}
