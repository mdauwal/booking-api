import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BookingsService } from './bookings.service'
import { BookingsController } from './bookings.controller'
import { Booking } from './entities/booking.entity'
import { Property } from '../properties/entities/property.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Property])],
  providers: [BookingsService],
  controllers: [BookingsController]
})
export class BookingsModule {}
