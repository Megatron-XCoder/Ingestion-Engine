"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const analytics_service_1 = require("./src/analytics/analytics.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const analyticsService = app.get(analytics_service_1.AnalyticsService);
    const vehicleId = 'vehicle-001';
    console.log(`Verifying analytics for ${vehicleId}...`);
    try {
        const result = await analyticsService.getPerformance(vehicleId);
        console.log('Analytics Result:', JSON.stringify(result, null, 2));
        if (result.totalEnergyConsumedAc > 0 && result.totalEnergyDeliveredDc > 0) {
            console.log('SUCCESS: Analytics returned valid non-zero data.');
        }
        else {
            console.error('FAILURE: Analytics returned zero or missing data.');
        }
    }
    catch (error) {
        console.error('Error verifying analytics:', error);
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=verify.js.map