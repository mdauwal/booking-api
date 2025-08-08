import { PropertiesService } from './properties.service';
import { ListPropertiesDto } from './dto/list-properties.dto';
import { Property } from './entities/property.entity';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    list(query: ListPropertiesDto): Promise<{
        data: Property[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    availability(id: number): Promise<{
        propertyId: number;
        availability: {
            start_date: string;
            end_date: string;
        }[];
    }>;
}
