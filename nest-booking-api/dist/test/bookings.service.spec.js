"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const bookings_service_1 = require("../src/bookings/bookings.service");
const booking_entity_1 = require("../src/bookings/entities/booking.entity");
const property_entity_1 = require("../src/properties/entities/property.entity");
const config_1 = require("@nestjs/config");
describe('BookingsService (unit-ish with sqlite)', () => {
    let service;
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [property_entity_1.Property, booking_entity_1.Booking],
                    synchronize: true
                }),
                typeorm_1.TypeOrmModule.forFeature([property_entity_1.Property, booking_entity_1.Booking])
            ],
            providers: [bookings_service_1.BookingsService]
        }).compile();
        service = moduleRef.get(bookings_service_1.BookingsService);
        const propRepo = moduleRef.get('PropertyRepository');
        await propRepo.save({
            title: 'Cozy Cabin',
            description: 'A cozy cabin in the woods',
            pricePerNight: '120.00',
            availableFrom: new Date('2025-08-01T00:00:00Z'),
            availableTo: new Date('2025-08-31T00:00:00Z')
        });
    });
    it('creates a booking within availability', async () => {
        const booking = await service.create({
            propertyId: 1,
            userName: 'Alice',
            startDate: new Date('2025-08-10T00:00:00Z'),
            endDate: new Date('2025-08-12T00:00:00Z')
        });
        expect(booking.id).toBeDefined();
        expect(booking.userName).toBe('Alice');
    });
    it('prevents overlapping bookings', async () => {
        await expect(service.create({
            propertyId: 1,
            userName: 'Bob',
            startDate: new Date('2025-08-11T00:00:00Z'),
            endDate: new Date('2025-08-13T00:00:00Z')
        })).rejects.toMatchObject({ status: 409 });
    });
    it('updates booking dates if non-overlapping', async () => {
        const updated = await service.update(1, {
            startDate: new Date('2025-08-15T00:00:00Z'),
            endDate: new Date('2025-08-17T00:00:00Z')
        });
        expect(updated.startDate.toISOString()).toBe('2025-08-15T00:00:00.000Z');
    });
});
//# sourceMappingURL=bookings.service.spec.js.map