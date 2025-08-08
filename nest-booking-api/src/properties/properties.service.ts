import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Property } from './entities/property.entity'
import { Booking } from '../bookings/entities/booking.entity'
import { ListPropertiesDto } from './dto/list-properties.dto'
import { computeAvailabilityGaps, DateRange } from '../common/utils/date-utils'

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property) private readonly propertyRepo: Repository<Property>,
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>
  ) {}

  async list(dto: ListPropertiesDto) {
    const page = dto.page ?? 1
    const limit = dto.limit ?? 10
    const skip = (page - 1) * limit

    const qb = this.propertyRepo.createQueryBuilder('p')

    // Filter by desired date window: ensure property availability window includes requested range
    if (dto.start_date && dto.end_date) {
      qb.andWhere('p.availableFrom <= :start', { start: dto.start_date })
      qb.andWhere('p.availableTo >= :end', { end: dto.end_date })

      // Exclude properties with overlapping bookings in the requested range
      // Overlap condition: (b.startDate < :end AND b.endDate > :start)
      qb.andWhere((subQb) => {
        const sub = subQb
          .subQuery()
          .select('1')
          .from(Booking, 'b')
          .where('b.propertyId = p.id')
          .andWhere('b.startDate < :end', { end: dto.end_date })
          .andWhere('b.endDate > :start', { start: dto.start_date })
          .getQuery()
        return 'NOT EXISTS ' + sub
      })
    }

    qb.orderBy('p.id', 'ASC').skip(skip).take(limit)

    const [items, total] = await qb.getManyAndCount()
    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async findOneOrFail(id: number): Promise<Property> {
    const property = await this.propertyRepo.findOne({ where: { id } })
    if (!property) {
      throw new NotFoundException('Property not found')
    }
    return property
  }

  async getAvailability(propertyId: number) {
    const property = await this.findOneOrFail(propertyId)
    const window: DateRange = { start: property.availableFrom, end: property.availableTo }

    // Fetch bookings that intersect the availability window, sorted by startDate
    const bookings = await this.bookingRepo.find({
      where: {
        property: { id: propertyId }
      },
      order: { startDate: 'ASC' }
    })

    const bookingRanges: DateRange[] = bookings.map((b) => ({ start: b.startDate, end: b.endDate }))
    const gaps = computeAvailabilityGaps(window, bookingRanges)

    return {
      propertyId,
      availability: gaps.map((g) => ({
        start_date: g.start.toISOString(),
        end_date: g.end.toISOString()
      }))
    }
  }
}
