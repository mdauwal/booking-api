import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { UpdateBookingDto } from './dto/update-booking.dto'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Booking } from './entities/booking.entity'

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking for a property' })
  @ApiCreatedResponse({ type: Booking })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel (delete) a booking by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.bookingsService.delete(id)
    return { statusCode: 204 }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a booking (e.g., dates or userName)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Booking })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, dto)
  }
}
