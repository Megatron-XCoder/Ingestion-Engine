"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ingestion_controller_1 = require("./ingestion.controller");
const ingestion_service_1 = require("./ingestion.service");
const meter_status_latest_entity_1 = require("../common/entities/meter-status-latest.entity");
const vehicle_status_latest_entity_1 = require("../common/entities/vehicle-status-latest.entity");
const meter_telemetry_history_entity_1 = require("../common/entities/meter-telemetry-history.entity");
const vehicle_telemetry_history_entity_1 = require("../common/entities/vehicle-telemetry-history.entity");
let IngestionModule = class IngestionModule {
};
exports.IngestionModule = IngestionModule;
exports.IngestionModule = IngestionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                meter_status_latest_entity_1.MeterStatusLatest,
                vehicle_status_latest_entity_1.VehicleStatusLatest,
                meter_telemetry_history_entity_1.MeterTelemetryHistory,
                vehicle_telemetry_history_entity_1.VehicleTelemetryHistory,
            ]),
        ],
        controllers: [ingestion_controller_1.IngestionController],
        providers: [ingestion_service_1.IngestionService],
        exports: [ingestion_service_1.IngestionService],
    })
], IngestionModule);
//# sourceMappingURL=ingestion.module.js.map