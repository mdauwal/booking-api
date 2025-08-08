import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Booking } from './entities/booking.entity'
import { Property } from '../properties/entities/property.entity'
import { CreateBookingDto } from './dto/create-booking.dto'
import { UpdateBookingDto } from './dto/update-booking.dto'
import { isValidRange } from '../common/utils/date-utils'

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Property) private readonly propertyRepo: Repository<Property>
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    const property = await this.propertyRepo.findOne({ where: { id: dto.propertyId } })
    if (!property) throw new NotFoundException('Property not found')

    const start = dto.startDate
    const end = dto.endDate

    this.validateRangeBasics(start, end)
    this.ensureWithinAvailability(property, start, end)

    return await this.bookingRepo.manager.transaction(async (em) => {
      // Check overlap in a transaction to reduce race conditions
      const overlapCount = await em
        .getRepository(Booking)
        .createQueryBuilder('b')
        .setLock('pessimistic_read')
        .where('b.propertyId = :pid', { pid: property.id })
        .andWhere('b.startDate < :end', { end })
        .andWhere('b.endDate > :start', { start })
        .getCount()

      if (overlapCount > 0) {
        throw new ConflictException('Booking dates overlap with an existing booking')
      }

      const booking = em.getRepository(Booking).create({
        property,
        userName: dto.userName,
        startDate: start,
        endDate: end
      })
      return em.getRepository(Booking).save(booking)
    })
  }

  async delete(id: number): Promise<void> {
    const res = await this.bookingRepo.delete(id)
    if (res.affected === 0) throw new NotFoundException('Booking not found')
  }

  async update(id: number, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['property']
    })
    if (!booking) throw new NotFoundException('Booking not found')

    const newUserName = dto.userName ?? booking.userName
    const newStart = dto.startDate ?? booking.startDate
    const newEnd = dto.endDate ?? booking.endDate

    this.validateRangeBasics(newStart, newEnd)
    this.ensureWithinAvailability(booking.property, newStart, newEnd)

    return await this.bookingRepo.manager.transaction(async (em) => {
      const overlapCount = await em
        .getRepository(Booking)
        .createQueryBuilder('b')
        .setLock('pessimistic_read')
        .where('b.propertyId = :pid', { pid: booking.property.id })
        .andWhere('b.id <> :id', { id })
        .andWhere('b.startDate < :end', { end: newEnd })
        .andWhere('b.endDate > :start', { start: newStart })
        .getCount()

      if (overlapCount > 0) {
        throw new ConflictException('Updated dates overlap with an existing booking')
      }

      booking.userName = newUserName
      booking.startDate = newStart
      booking.endDate = newEnd
      return em.getRepository(Booking).save(booking)
    })
  }

  private validateRangeBasics(start: Date, end: Date) {
    if (!isValidRange(start, end)) {
      throw new BadRequestException('Invalid date range: startDate must be before endDate')
    }
  }

  private ensureWithinAvailability(property: Property, start: Date, end: Date) {
    if (start < property.availableFrom || end > property.availableTo) {
      throw new BadRequestException('Dates must be within property availability window')
    }
  }
}
