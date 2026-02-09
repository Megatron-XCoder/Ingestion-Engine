import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { MeterTelemetryHistory } from '../common/entities/meter-telemetry-history.entity';
import { VehicleTelemetryHistory } from '../common/entities/vehicle-telemetry-history.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(MeterTelemetryHistory)
    private meterHistoryRepository: Repository<MeterTelemetryHistory>,
    @InjectRepository(VehicleTelemetryHistory)
    private vehicleHistoryRepository: Repository<VehicleTelemetryHistory>,
  ) {}

  async getPerformance(vehicleId: string) {
    // Assumption: map vehicleId to meterId (1:1 for this assignment, or query relationship)
    // For this assignment, we assume meterId is related. Let's assume meterId = 'meter-' + vehicleId.split('-')[1]
    // Or simpler: The requirements don't strictly specify the mapping logic, but imply correlation. 
    // "Core ingestion layer that handles these streams, correlates them"
    // In a real system, we'd have a VehicleMeterMapping table. 
    // HERE: I will derive meterId from vehicleId for simplicity: vehicle-001 -> meter-001
    const meterId = vehicleId.replace('vehicle', 'meter');

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Optimized Queries: "The analytical query must not perform a full table scan"
    // We use the index on (vehicleId, timestamp) and (meterId, timestamp)

    // 1. Get Vehicle Stats (DC Delivered, Avg Temp)
    // DC Delivered is cumulative. So typically usage = MAX - MIN. 
    // However, if the session resets, it might be complex. 
    // Let's assume the stream reports "Total Lifetime Data" or "Session Data". 
    // If "kwhDeliveredDc" is cumulative lifetime counter:
    
    const vehicleStats = await this.vehicleHistoryRepository
      .createQueryBuilder('v')
      .select('MAX(v.kwhDeliveredDc)', 'maxDc')
      .addSelect('MIN(v.kwhDeliveredDc)', 'minDc')
      .addSelect('AVG(v.batteryTemp)', 'avgTemp')
      .where('v.vehicleId = :vehicleId', { vehicleId })
      .andWhere('v.timestamp >= :startTime', { startTime: twentyFourHoursAgo })
      .getRawOne();

    // 2. Get Meter Stats (AC Consumed)
    const meterStats = await this.meterHistoryRepository
      .createQueryBuilder('m')
      .select('MAX(m.kwhConsumedAc)', 'maxAc')
      .addSelect('MIN(m.kwhConsumedAc)', 'minAc')
      .where('m.meterId = :meterId', { meterId })
      .andWhere('m.timestamp >= :startTime', { startTime: twentyFourHoursAgo })
      .getRawOne();

    const totalDc = (vehicleStats.maxDc || 0) - (vehicleStats.minDc || 0);
    const totalAc = (meterStats.maxAc || 0) - (meterStats.minAc || 0);
    
    // Avoid division by zero
    const efficiency = totalAc > 0 ? totalDc / totalAc : 0;

    return {
      vehicleId,
      timestamp: now.toISOString(),
      period: '24h',
      totalEnergyConsumedAc: parseFloat(totalAc.toFixed(2)),
      totalEnergyDeliveredDc: parseFloat(totalDc.toFixed(2)),
      efficiencyRatio: parseFloat(efficiency.toFixed(4)),
      averageBatteryTemp: parseFloat((vehicleStats.avgTemp || 0).toFixed(2)),
    };
  }
}
