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
var IngestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const meter_status_latest_entity_1 = require("../common/entities/meter-status-latest.entity");
const vehicle_status_latest_entity_1 = require("../common/entities/vehicle-status-latest.entity");
const meter_telemetry_history_entity_1 = require("../common/entities/meter-telemetry-history.entity");
const vehicle_telemetry_history_entity_1 = require("../common/entities/vehicle-telemetry-history.entity");
let IngestionService = IngestionService_1 = class IngestionService {
    meterStatusRepository;
    vehicleStatusRepository;
    meterHistoryRepository;
    vehicleHistoryRepository;
    logger = new common_1.Logger(IngestionService_1.name);
    constructor(meterStatusRepository, vehicleStatusRepository, meterHistoryRepository, vehicleHistoryRepository) {
        this.meterStatusRepository = meterStatusRepository;
        this.vehicleStatusRepository = vehicleStatusRepository;
        this.meterHistoryRepository = meterHistoryRepository;
        this.vehicleHistoryRepository = vehicleHistoryRepository;
    }
    async processMeterReading(data) {
        const timestamp = new Date(data.timestamp);
        const historyRecord = this.meterHistoryRepository.create({
            meterId: data.meterId,
            kwhConsumedAc: data.kwhConsumedAc,
            voltage: data.voltage,
            timestamp: timestamp,
        });
        await this.meterHistoryRepository.save(historyRecord);
        await this.meterStatusRepository.save({
            meterId: data.meterId,
            kwhConsumedAc: data.kwhConsumedAc,
            voltage: data.voltage,
            timestamp: timestamp,
            lastUpdated: new Date(),
        });
        this.logger.log(`Processed meter reading for ${data.meterId}`);
    }
    async processVehicleReading(data) {
        const timestamp = new Date(data.timestamp);
        const historyRecord = this.vehicleHistoryRepository.create({
            vehicleId: data.vehicleId,
            soc: data.soc,
            kwhDeliveredDc: data.kwhDeliveredDc,
            batteryTemp: data.batteryTemp,
            timestamp: timestamp,
        });
        await this.vehicleHistoryRepository.save(historyRecord);
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
};
exports.IngestionService = IngestionService;
exports.IngestionService = IngestionService = IngestionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(meter_status_latest_entity_1.MeterStatusLatest)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_status_latest_entity_1.VehicleStatusLatest)),
    __param(2, (0, typeorm_1.InjectRepository)(meter_telemetry_history_entity_1.MeterTelemetryHistory)),
    __param(3, (0, typeorm_1.InjectRepository)(vehicle_telemetry_history_entity_1.VehicleTelemetryHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], IngestionService);
//# sourceMappingURL=ingestion.service.js.map