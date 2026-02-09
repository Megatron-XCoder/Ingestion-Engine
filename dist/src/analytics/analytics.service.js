"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const meter_telemetry_history_entity_1 = require("../common/entities/meter-telemetry-history.entity");
const vehicle_telemetry_history_entity_1 = require("../common/entities/vehicle-telemetry-history.entity");
let AnalyticsService = class AnalyticsService {
    meterHistoryRepository;
    vehicleHistoryRepository;
    constructor(meterHistoryRepository, vehicleHistoryRepository) {
        this.meterHistoryRepository = meterHistoryRepository;
        this.vehicleHistoryRepository = vehicleHistoryRepository;
    }
    async getPerformance(vehicleId) {
        const meterId = vehicleId.replace('vehicle', 'meter');
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const vehicleStats = await this.vehicleHistoryRepository
            .createQueryBuilder('v')
            .select('MAX(v.kwhDeliveredDc)', 'maxDc')
            .addSelect('MIN(v.kwhDeliveredDc)', 'minDc')
            .addSelect('AVG(v.batteryTemp)', 'avgTemp')
            .where('v.vehicleId = :vehicleId', { vehicleId })
            .andWhere('v.timestamp >= :startTime', { startTime: twentyFourHoursAgo })
            .getRawOne();
        const meterStats = await this.meterHistoryRepository
            .createQueryBuilder('m')
            .select('MAX(m.kwhConsumedAc)', 'maxAc')
            .addSelect('MIN(m.kwhConsumedAc)', 'minAc')
            .where('m.meterId = :meterId', { meterId })
            .andWhere('m.timestamp >= :startTime', { startTime: twentyFourHoursAgo })
            .getRawOne();
        const totalDc = (vehicleStats.maxDc || 0) - (vehicleStats.minDc || 0);
        const totalAc = (meterStats.maxAc || 0) - (meterStats.minAc || 0);
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(meter_telemetry_history_entity_1.MeterTelemetryHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_telemetry_history_entity_1.VehicleTelemetryHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map