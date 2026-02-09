import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AnalyticsService } from './src/analytics/analytics.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const analyticsService = app.get(AnalyticsService);

  const vehicleId = 'vehicle-001';
  console.log(`Verifying analytics for ${vehicleId}...`);

  try {
    const result = await analyticsService.getPerformance(vehicleId);
    console.log('Analytics Result:', JSON.stringify(result, null, 2));
    
    if (result.totalEnergyConsumedAc > 0 && result.totalEnergyDeliveredDc > 0) {
        console.log('SUCCESS: Analytics returned valid non-zero data.');
    } else {
        console.error('FAILURE: Analytics returned zero or missing data.');
    }

  } catch (error) {
    console.error('Error verifying analytics:', error);
  }

  await app.close();
}

bootstrap();
