import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { MeterStatusLatest } from '../common/entities/meter-status-latest.entity';
import { VehicleStatusLatest } from '../common/entities/vehicle-status-latest.entity';
import { MeterTelemetryHistory } from '../common/entities/meter-telemetry-history.entity';
import { VehicleTelemetryHistory } from '../common/entities/vehicle-telemetry-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeterStatusLatest,
      VehicleStatusLatest,
      MeterTelemetryHistory,
      VehicleTelemetryHistory,
    ]),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
