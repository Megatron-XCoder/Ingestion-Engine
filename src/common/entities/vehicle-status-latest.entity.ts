import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('vehicle_status_latest')
export class VehicleStatusLatest {
  @PrimaryColumn()
  vehicleId: string;

  @Column('float')
  soc: number;

  @Column('float')
  kwhDeliveredDc: number;

  @Column('float')
  batteryTemp: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @UpdateDateColumn()
  lastUpdated: Date;
}
