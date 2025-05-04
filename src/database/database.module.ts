import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Setup default connection in the application
 * @param config {ConfigService}
 */
const defaultConnection = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST'),
  port: config.get('DB_PORT'),
  username: config.get('POSTGRES_USER'),
  password: config.get('POSTGRES_PASSWORD'),
  database: config.get('POSTGRES_DB'),
  synchronize: true,
  autoLoadEntities: true,
  logging: config.get('TYPEORM_LOGGING') == 'true',
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return defaultConnection(config);
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
