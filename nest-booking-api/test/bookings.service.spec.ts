import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BookingsService } from '../src/bookings/bookings.service'
import { Booking } from '../src/bookings/entities/booking.entity'
import { Property } from '../src/properties/entities/property.entity'
import { ConfigModule } from '@nestjs/config'

describe('BookingsService (unit-ish with sqlite)', () => {
  let service: BookingsService

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Property, Booking],
          synchronize: true
        }),
        TypeOrmModule.forFeature([Property, Booking])
      ],
      providers: [BookingsService]
    }).compile()

    service = moduleRef.get(BookingsService)

    // Seed one property
    const propRepo = moduleRef.get('PropertyRepository')
    await propRepo.save({
      title: 'Cozy Cabin',
      description: 'A cozy cabin in the woods',
      pricePerNight: '120.00',
      availableFrom: new Date('2025-08-01T00:00:00Z'),
      availableTo: new Date('2025-08-31T00:00:00Z')
    })
  })

  it('creates a booking within availability', async () => {
    const booking = await service.create({
      propertyId: 1,
      userName: 'Alice',
      startDate: new Date('2025-08-10T00:00:00Z'),
      endDate: new Date('2025-08-12T00:00:00Z')
    })
    expect(booking.id).toBeDefined()
    expect(booking.userName).toBe('Alice')
  })

  it('prevents overlapping bookings', async () => {
    await expect(
      service.create({
        propertyId: 1,
        userName: 'Bob',
        startDate: new Date('2025-08-11T00:00:00Z'),
        endDate: new Date('2025-08-13T00:00:00Z')
      })
    ).rejects.toMatchObject({ status: 409 })
  })

  it('updates booking dates if non-overlapping', async () => {
    const updated = await service.update(1, {
      startDate: new Date('2025-08-15T00:00:00Z'),
      endDate: new Date('2025-08-17T00:00:00Z')
    })
    expect(updated.startDate.toISOString()).toBe('2025-08-15T00:00:00.000Z')
  })
})
