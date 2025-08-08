import { Property } from '../../properties/entities/property.entity';
export declare class Booking {
    id: number;
    userName: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    property: Property;
}
