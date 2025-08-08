import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateBookingDto {
  @ApiPropertyOptional({ description: 'User name', example: 'John Smith' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  userName?: string

  @ApiPropertyOptional({ description: 'Start date (check-in)', type: String, format: 'date-time' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date

  @ApiPropertyOptional({ description: 'End date (check-out)', type: String, format: 'date-time' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date
}
