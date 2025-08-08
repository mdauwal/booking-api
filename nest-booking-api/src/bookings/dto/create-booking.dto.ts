import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator'

export class CreateBookingDto {
  @ApiProperty({ description: 'Property ID', example: 1 })
  @IsInt()
  @IsPositive()
  propertyId!: number

  @ApiProperty({ description: 'User name', example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  userName!: string

  @ApiProperty({ description: 'Start date (check-in)', type: String, format: 'date-time' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date

  @ApiProperty({ description: 'End date (check-out)', type: String, format: 'date-time' })
  @Type(() => Date)
  @IsDate()
  endDate!: Date
}
