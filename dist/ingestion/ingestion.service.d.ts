import { Repository } from 'typeorm';
import { MeterStatusLatest } from '../common/entities/meter-status-latest.entity';
import { VehicleStatusLatest } from '../common/entities/vehicle-status-latest.entity';
import { MeterTelemetryHistory } from '../common/entities/meter-telemetry-history.entity';
import { VehicleTelemetryHistory } from '../common/entities/vehicle-telemetry-history.entity';
import { MeterReadingDto } from './dto/meter-reading.dto';
import { VehicleReadingDto } from './dto/vehicle-reading.dto';
export declare class IngestionService {
    private meterStatusRepository;
    private vehicleStatusRepository;
    private meterHistoryRepository;
    private vehicleHistoryRepository;
    private readonly logger;
    constructor(meterStatusRepository: Repository<MeterStatusLatest>, vehicleStatusRepository: Repository<VehicleStatusLatest>, meterHistoryRepository: Repository<MeterTelemetryHistory>, vehicleHistoryRepository: Repository<VehicleTelemetryHistory>);
    processMeterReading(data: MeterReadingDto): Promise<void>;
    processVehicleReading(data: VehicleReadingDto): Promise<void>;
}
