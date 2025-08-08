import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './database/typeorm.config'
import { PropertiesModule } from './properties/properties.module'
import { BookingsModule } from './bookings/bookings.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig()
    }),
    PropertiesModule,
    BookingsModule
  ]
})
export class AppModule {}
