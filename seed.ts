import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { IngestionService } from './src/ingestion/ingestion.service';
import { MeterReadingDto } from './src/ingestion/dto/meter-reading.dto';
import { VehicleReadingDto } from './src/ingestion/dto/vehicle-reading.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ingestionService = app.get(IngestionService);

  const meterId = 'meter-001';
  const vehicleId = 'vehicle-001';
  const now = new Date();

  console.log('Seeding data...');

  // Generate 24 hours of data (1 point per minute = 1440 points)
  for (let i = 0; i < 1440; i++) {
    const time = new Date(now.getTime() - (1440 - i) * 60000); // 60s intervals
    
    // Simulate some logic:
    // AC starts at 1000, increases by 0.5 kWh per minute (charging)
    // DC starts at 1000, increases by 0.45 kWh per minute (90% eff approx)
    const kwhConsumedAc = 1000 + (i * 0.5); 
    const kwhDeliveredDc = 1000 + (i * 0.45);
    const voltage = 230 + (Math.random() * 5 - 2.5); // 227.5 - 232.5
    const soc = Math.min(100, 10 + (i * 0.05)); // Charging from 10% to 100%
    const batteryTemp = 30 + (Math.random() * 5);

    const meterData: MeterReadingDto = {
        meterId,
        kwhConsumedAc,
        voltage,
        timestamp: time.toISOString(),
    };

    const vehicleData: VehicleReadingDto = {
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
