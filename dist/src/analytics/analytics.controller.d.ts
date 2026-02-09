import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
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
