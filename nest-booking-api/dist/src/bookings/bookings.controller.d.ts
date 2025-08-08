import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: CreateBookingDto): Promise<Booking>;
    remove(id: number): Promise<{
        statusCode: number;
    }>;
    update(id: number, dto: UpdateBookingDto): Promise<Booking>;
}
