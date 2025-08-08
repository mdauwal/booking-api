import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Property } from './entities/property.entity'
import { PropertiesService } from './properties.service'
import { PropertiesController } from './properties.controller'
import { Booking } from '../bookings/entities/booking.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Property, Booking])],
  providers: [PropertiesService],
  controllers: [PropertiesController],
  exports: [PropertiesService]
})
export class PropertiesModule {}
