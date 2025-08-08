import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import * as request from 'supertest'
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Property } from '../src/properties/entities/property.entity'
import { Booking } from '../src/bookings/entities/booking.entity'

describe('App E2E', () => {
  let app: INestApplication
  let dataSource: DataSource

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Property, Booking],
          synchronize: true
        }),
        AppModule
      ]
    }).compile()

    app = moduleRef.createNestApplication()
    app.setGlobalPrefix('api')
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    dataSource = moduleRef.get<DataSource>(getDataSourceToken())
    const propRepo = dataSource.getRepository(Property)
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
    ])
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /api/properties (paginated)', async () => {
    const res = await request(app.getHttpServer()).get('/api/properties?page=1&limit=1').expect(200)
    expect(res.body.data.length).toBe(1)
    expect(res.body.meta.total).toBe(2)
  })

  it('GET /api/properties with availability filter', async () => {
    const res = await request(app.getHttpServer())
      .get(
        '/api/properties?start_date=2025-08-10T00:00:00.000Z&end_date=2025-08-12T00:00:00.000Z'
      )
      .expect(200)
    expect(res.body.data.length).toBe(2)
  })

  it('POST /api/bookings creates a booking', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/bookings')
      .send({
        propertyId: 1,
        userName: 'Alice',
        startDate: '2025-08-10T00:00:00.000Z',
        endDate: '2025-08-12T00:00:00.000Z'
      })
      .expect(201)
    expect(res.body.id).toBeDefined()
  })

  it('GET /api/properties/:id/availability returns gaps', async () => {
    const res = await request(app.getHttpServer()).get('/api/properties/1/availability').expect(200)
    expect(res.body.propertyId).toBe(1)
    expect(Array.isArray(res.body.availability)).toBe(true)
  })

  it('POST /api/bookings prevents overlap', async () => {
    await request(app.getHttpServer())
      .post('/api/bookings')
      .send({
        propertyId: 1,
        userName: 'Bob',
        startDate: '2025-08-11T00:00:00.000Z',
        endDate: '2025-08-13T00:00:00.000Z'
      })
      .expect(409)
  })

  it('PUT /api/bookings/:id updates booking', async () => {
    const res = await request(app.getHttpServer())
      .put('/api/bookings/1')
      .send({
        startDate: '2025-08-15T00:00:00.000Z',
        endDate: '2025-08-17T00:00:00.000Z'
      })
      .expect(200)
    expect(res.body.startDate).toBe('2025-08-15T00:00:00.000Z')
  })

  it('DELETE /api/bookings/:id deletes booking', async () => {
    await request(app.getHttpServer()).delete('/api/bookings/1').expect(200)
  })
})
