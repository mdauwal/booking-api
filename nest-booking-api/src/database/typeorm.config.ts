import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Booking } from '../bookings/entities/booking.entity'
import { Property } from '../properties/entities/property.entity'

export const typeOrmConfig = (): TypeOrmModuleOptions => {
  const isTest = process.env.NODE_ENV === 'test'
  if (isTest) {
    // Use SQLite in-memory DB for tests
    return {
      type: 'sqlite',
      database: ':memory:',
      entities: [Property, Booking],
      synchronize: true,
      logging: false
    }
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'booking_db',
    entities: [Property, Booking],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true'
  }
}
