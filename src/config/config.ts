import { registerAs } from "@nestjs/config";

export enum configKeys {
  App = "App",
  Db = "Db",
}

const AppConfig = registerAs(configKeys.App, () => ({
  port: 3001,
}));
const DbConfig = registerAs(configKeys.Db, () => ({
  port: 5432,
  host: "localhost",
  username: "postgres",
  password: "123",
  database: "auth-otp",
}));

export const configurations = [AppConfig, DbConfig];
