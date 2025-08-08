import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { PropertiesService } from './properties.service'
import { ListPropertiesDto } from './dto/list-properties.dto'
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Property } from './entities/property.entity'

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'List all properties with optional pagination and availability filter' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'start_date',
    required: false,
    type: String,
    description: 'Desired start date (check-in), ISO string'
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    type: String,
    description: 'Desired end date (check-out), ISO string'
  })
  @ApiOkResponse({ type: [Property] })
  list(@Query() query: ListPropertiesDto) {
    return this.propertiesService.list(query)
  }

  @Get(':id/availability')
  @ApiOperation({ summary: "Get a property's availability date ranges (end is exclusive)" })
  @ApiParam({ name: 'id', type: Number })
  async availability(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.getAvailability(id)
  }
}
