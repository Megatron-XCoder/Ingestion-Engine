import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { MeterReadingDto } from './dto/meter-reading.dto';
import { VehicleReadingDto } from './dto/vehicle-reading.dto';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('meter')
  @HttpCode(HttpStatus.ACCEPTED)
  async ingestMeter(@Body() dto: MeterReadingDto) {
    await this.ingestionService.processMeterReading(dto);
    return { status: 'accepted' };
  }

  @Post('vehicle')
  @HttpCode(HttpStatus.ACCEPTED)
  async ingestVehicle(@Body() dto: VehicleReadingDto) {
    await this.ingestionService.processVehicleReading(dto);
    return { status: 'accepted' };
  }
}
