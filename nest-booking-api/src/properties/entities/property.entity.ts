import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Booking } from '../../bookings/entities/booking.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity({ name: 'properties' })
export class Property {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  title!: string

  @ApiProperty()
  @Column({ type: 'text' })
  description!: string

  @ApiProperty({ example: 150 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerNight!: string

  @ApiProperty({ type: String, format: 'date-time' })
  @Column({ type: 'timestamptz' })
  availableFrom!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  @Column({ type: 'timestamptz' })
  availableTo!: Date

  @OneToMany(() => Booking, (booking) => booking.property, { cascade: ['remove'] })
  bookings!: Booking[]
}
