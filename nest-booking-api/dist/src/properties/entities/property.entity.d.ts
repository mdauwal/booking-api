import { Booking } from '../../bookings/entities/booking.entity';
export declare class Property {
    id: number;
    title: string;
    description: string;
    pricePerNight: string;
    availableFrom: Date;
    availableTo: Date;
    bookings: Booking[];
}
