import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterStatusLatest } from '../common/entities/meter-status-latest.entity';
import { VehicleStatusLatest } from '../common/entities/vehicle-status-latest.entity';
import { MeterTelemetryHistory } from '../common/entities/meter-telemetry-history.entity';
import { VehicleTelemetryHistory } from '../common/entities/vehicle-telemetry-history.entity';
import { MeterReadingDto } from './dto/meter-reading.dto';
import { VehicleReadingDto } from './dto/vehicle-reading.dto';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    @InjectRepository(MeterStatusLatest)
    private meterStatusRepository: Repository<MeterStatusLatest>,
    @InjectRepository(VehicleStatusLatest)
    private vehicleStatusRepository: Repository<VehicleStatusLatest>,
    @InjectRepository(MeterTelemetryHistory)
    private meterHistoryRepository: Repository<MeterTelemetryHistory>,
    @InjectRepository(VehicleTelemetryHistory)
    private vehicleHistoryRepository: Repository<VehicleTelemetryHistory>,
  ) {}

  async processMeterReading(data: MeterReadingDto) {
    const timestamp = new Date(data.timestamp);

    // 1. History Path (Cold Store) - Append Only
    const historyRecord = this.meterHistoryRepository.create({
      meterId: data.meterId,
      kwhConsumedAc: data.kwhConsumedAc,
      voltage: data.voltage,
      timestamp: timestamp,
    });
    // We don't await the history insert to block the response if we want higher throughput, 
    // but for reliability in this assignment, we will await. 
    // In a real high-scale system, this might go to a queue (Kafka/RabbitMQ).
    await this.meterHistoryRepository.save(historyRecord);

    // 2. Live Path (Hot Store) - Upsert
    // Upsert: Insert or Update if exists
    await this.meterStatusRepository.save({
      meterId: data.meterId,
      kwhConsumedAc: data.kwhConsumedAc,
      voltage: data.voltage,
      timestamp: timestamp,
      lastUpdated: new Date(), // Set current server time as last processed
    });

    this.logger.log(`Processed meter reading for ${data.meterId}`);
  }

  async processVehicleReading(data: VehicleReadingDto) {
    const timestamp = new Date(data.timestamp);

    // 1. History Path (Cold Store) - Append Only
    const historyRecord = this.vehicleHistoryRepository.create({
      vehicleId: data.vehicleId,
      soc: data.soc,
      kwhDeliveredDc: data.kwhDeliveredDc,
      batteryTemp: data.batteryTemp,
      timestamp: timestamp,
    });
    await this.vehicleHistoryRepository.save(historyRecord);

    // 2. Live Path (Hot Store) - Upsert
    await this.vehicleStatusRepository.save({
      vehicleId: data.vehicleId,
      soc: data.soc,
      kwhDeliveredDc: data.kwhDeliveredDc,
      batteryTemp: data.batteryTemp,
      timestamp: timestamp,
      lastUpdated: new Date(),
    });

    this.logger.log(`Processed vehicle reading for ${data.vehicleId}`);
  }
}
