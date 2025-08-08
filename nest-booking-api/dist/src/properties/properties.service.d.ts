import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { ListPropertiesDto } from './dto/list-properties.dto';
export declare class PropertiesService {
    private readonly propertyRepo;
    private readonly bookingRepo;
    constructor(propertyRepo: Repository<Property>, bookingRepo: Repository<Booking>);
    list(dto: ListPropertiesDto): Promise<{
        data: Property[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOneOrFail(id: number): Promise<Property>;
    getAvailability(propertyId: number): Promise<{
        propertyId: number;
        availability: {
            start_date: string;
            end_date: string;
        }[];
    }>;
}
