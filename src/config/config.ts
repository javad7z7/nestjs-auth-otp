import { registerAs } from "@nestjs/config";

export enum configKeys {
  App = "App",
  Db = "Db",
  Jwt = "Jwt",
}

const AppConfig = registerAs(configKeys.App, () => ({
  port: 3001,
}));
const JwtConfig = registerAs(configKeys.Jwt, () => ({
  accessTokenSecret: "3d20bb0c6d4ba6eadb0ab206cf3cc6df",
  refreshTokenSecret: "6fc9a717fd3f185322b6b18603e976d0",
}));
const DbConfig = registerAs(configKeys.Db, () => ({
  port: 5432,
  host: "localhost",
  username: "postgres",
  password: "123",
  database: "auth-otp",
}));

export const configurations = [AppConfig, JwtConfig, DbConfig];
