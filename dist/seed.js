"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const ingestion_service_1 = require("./src/ingestion/ingestion.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const ingestionService = app.get(ingestion_service_1.IngestionService);
    const meterId = 'meter-001';
    const vehicleId = 'vehicle-001';
    const now = new Date();
    console.log('Seeding data...');
    for (let i = 0; i < 1440; i++) {
        const time = new Date(now.getTime() - (1440 - i) * 60000);
        const kwhConsumedAc = 1000 + (i * 0.5);
        const kwhDeliveredDc = 1000 + (i * 0.45);
        const voltage = 230 + (Math.random() * 5 - 2.5);
        const soc = Math.min(100, 10 + (i * 0.05));
        const batteryTemp = 30 + (Math.random() * 5);
        const meterData = {
            meterId,
            kwhConsumedAc,
            voltage,
            timestamp: time.toISOString(),
        };
        const vehicleData = {
            vehicleId,
            soc,
            kwhDeliveredDc,
            batteryTemp,
            timestamp: time.toISOString(),
        };
        await ingestionService.processMeterReading(meterData);
        await ingestionService.processVehicleReading(vehicleData);
    }
    console.log('Seeding complete.');
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map