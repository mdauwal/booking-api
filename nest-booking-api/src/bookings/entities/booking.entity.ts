import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Property } from '../../properties/entities/property.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity({ name: 'bookings' })
@Index(['property', 'startDate'])
@Index(['property', 'endDate'])
export class Booking {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number

  @ApiProperty()
  @Column({ type: 'varchar', length: 120 })
  userName!: string

  @ApiProperty({ type: String, format: 'date-time' })
  @Column({ type: 'timestamptz' })
  startDate!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  @Column({ type: 'timestamptz' })
  endDate!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @ApiProperty({ type: () => Property })
  @ManyToOne(() => Property, (property) => property.bookings, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  property!: Property
}
