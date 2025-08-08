"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../src/app.module");
const request = require("supertest");
const typeorm_1 = require("@nestjs/typeorm");
const property_entity_1 = require("../src/properties/entities/property.entity");
const booking_entity_1 = require("../src/bookings/entities/booking.entity");
describe('App E2E', () => {
    let app;
    let dataSource;
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [property_entity_1.Property, booking_entity_1.Booking],
                    synchronize: true
                }),
                app_module_1.AppModule
            ]
        }).compile();
        app = moduleRef.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
        dataSource = moduleRef.get((0, typeorm_1.getDataSourceToken)());
        const propRepo = dataSource.getRepository(property_entity_1.Property);
        await propRepo.save([
            {
                title: 'Beach House',
                description: 'Ocean view',
                pricePerNight: '200.00',
                availableFrom: new Date('2025-08-01T00:00:00Z'),
                availableTo: new Date('2025-08-31T00:00:00Z')
            },
            {
                title: 'City Apartment',
                description: 'Downtown',
                pricePerNight: '150.00',
                availableFrom: new Date('2025-08-05T00:00:00Z'),
                availableTo: new Date('2025-08-20T00:00:00Z')
            }
        ]);
    });
    afterAll(async () => {
        await app.close();
    });
    it('GET /api/properties (paginated)', async () => {
        const res = await request(app.getHttpServer()).get('/api/properties?page=1&limit=1').expect(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.meta.total).toBe(2);
    });
    it('GET /api/properties with availability filter', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/properties?start_date=2025-08-10T00:00:00.000Z&end_date=2025-08-12T00:00:00.000Z')
            .expect(200);
        expect(res.body.data.length).toBe(2);
    });
    it('POST /api/bookings creates a booking', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/bookings')
            .send({
            propertyId: 1,
            userName: 'Alice',
            startDate: '2025-08-10T00:00:00.000Z',
            endDate: '2025-08-12T00:00:00.000Z'
        })
            .expect(201);
        expect(res.body.id).toBeDefined();
    });
    it('GET /api/properties/:id/availability returns gaps', async () => {
        const res = await request(app.getHttpServer()).get('/api/properties/1/availability').expect(200);
        expect(res.body.propertyId).toBe(1);
        expect(Array.isArray(res.body.availability)).toBe(true);
    });
    it('POST /api/bookings prevents overlap', async () => {
        await request(app.getHttpServer())
            .post('/api/bookings')
            .send({
            propertyId: 1,
            userName: 'Bob',
            startDate: '2025-08-11T00:00:00.000Z',
            endDate: '2025-08-13T00:00:00.000Z'
        })
            .expect(409);
    });
    it('PUT /api/bookings/:id updates booking', async () => {
        const res = await request(app.getHttpServer())
            .put('/api/bookings/1')
            .send({
            startDate: '2025-08-15T00:00:00.000Z',
            endDate: '2025-08-17T00:00:00.000Z'
        })
            .expect(200);
        expect(res.body.startDate).toBe('2025-08-15T00:00:00.000Z');
    });
    it('DELETE /api/bookings/:id deletes booking', async () => {
        await request(app.getHttpServer()).delete('/api/bookings/1').expect(200);
    });
});
//# sourceMappingURL=app.e2e-spec.js.map