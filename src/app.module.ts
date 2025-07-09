import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';

@Module({
  imports: [
    // Carga automática de variables de entorno (.env en local, process.env en Lambda)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // útil en desarrollo
    }),

    // Configuración de TypeORM usando variables del entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get('NODE_ENV') === 'development';
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<string>('DB_PORT', '5432')),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: isDev,
          logging: isDev,
        };
      },
    }),

    // Módulo de productos
    ProductosModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
