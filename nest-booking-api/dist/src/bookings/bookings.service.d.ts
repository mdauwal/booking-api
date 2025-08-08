import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Property } from '../properties/entities/property.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingsService {
    private readonly bookingRepo;
    private readonly propertyRepo;
    constructor(bookingRepo: Repository<Booking>, propertyRepo: Repository<Property>);
    create(dto: CreateBookingDto): Promise<Booking>;
    delete(id: number): Promise<void>;
    update(id: number, dto: UpdateBookingDto): Promise<Booking>;
    private validateRangeBasics;
    private ensureWithinAvailability;
}
