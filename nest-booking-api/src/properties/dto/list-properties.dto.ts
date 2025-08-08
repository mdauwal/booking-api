import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import { PaginationDto } from '../../common/dto/pagination.dto'

export class ListPropertiesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter: desired start date (check-in)',
    type: String,
    format: 'date-time',
    example: '2025-08-15T00:00:00.000Z'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start_date?: Date

  @ApiPropertyOptional({
    description: 'Filter: desired end date (check-out)',
    type: String,
    format: 'date-time',
    example: '2025-08-20T00:00:00.000Z'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end_date?: Date
}
