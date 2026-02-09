import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const vehicleId = 'vehicle-001';
  const meterId = 'meter-001';
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  console.log('Running EXPLAIN ANALYZE on Meter History Query...');
  
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Force Index Scan to demonstrate it works even for small datasets (where Postgres usually prefers Seq Scan)
    await queryRunner.query('SET enable_seqscan = OFF');

    const plan = await queryRunner.query(`
      EXPLAIN ANALYZE 
      SELECT MAX("kwhConsumedAc") as max_ac, MIN("kwhConsumedAc") as min_ac 
      FROM meter_telemetry_history 
      WHERE "meterId" = $1 AND timestamp >= $2
    `, [meterId, twentyFourHoursAgo]);

    console.log(JSON.stringify(plan, null, 2));

    const planStr = JSON.stringify(plan);
    if (planStr.includes('Index Scan') || planStr.includes('Bitmap Heap Scan')) {
        console.log('SUCCESS: Index Scan detected.');
    } else {
        console.warn('WARNING: No Index Scan detected. Check query plan.');
    }

  } catch (err) {
    console.error(err);
  } finally {
    await queryRunner.release();
    await app.close();
  }
}

bootstrap();
