import { Repository } from 'typeorm';
import { MeterTelemetryHistory } from '../common/entities/meter-telemetry-history.entity';
import { VehicleTelemetryHistory } from '../common/entities/vehicle-telemetry-history.entity';
export declare class AnalyticsService {
    private meterHistoryRepository;
    private vehicleHistoryRepository;
    constructor(meterHistoryRepository: Repository<MeterTelemetryHistory>, vehicleHistoryRepository: Repository<VehicleTelemetryHistory>);
    getPerformance(vehicleId: string): Promise<{
        vehicleId: string;
        timestamp: string;
        period: string;
        totalEnergyConsumedAc: number;
        totalEnergyDeliveredDc: number;
        efficiencyRatio: number;
        averageBatteryTemp: number;
    }>;
}
