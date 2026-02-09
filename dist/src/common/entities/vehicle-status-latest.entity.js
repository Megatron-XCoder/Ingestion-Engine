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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleStatusLatest = void 0;
const typeorm_1 = require("typeorm");
let VehicleStatusLatest = class VehicleStatusLatest {
    vehicleId;
    soc;
    kwhDeliveredDc;
    batteryTemp;
    timestamp;
    lastUpdated;
};
exports.VehicleStatusLatest = VehicleStatusLatest;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], VehicleStatusLatest.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], VehicleStatusLatest.prototype, "soc", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], VehicleStatusLatest.prototype, "kwhDeliveredDc", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], VehicleStatusLatest.prototype, "batteryTemp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], VehicleStatusLatest.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], VehicleStatusLatest.prototype, "lastUpdated", void 0);
exports.VehicleStatusLatest = VehicleStatusLatest = __decorate([
    (0, typeorm_1.Entity)('vehicle_status_latest')
], VehicleStatusLatest);
//# sourceMappingURL=vehicle-status-latest.entity.js.map