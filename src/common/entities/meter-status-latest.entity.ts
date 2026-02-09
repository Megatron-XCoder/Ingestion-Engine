import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('meter_status_latest')
export class MeterStatusLatest {
  @PrimaryColumn()
  meterId: string;

  @Column('float')
  kwhConsumedAc: number;

  @Column('float')
  voltage: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @UpdateDateColumn()
  lastUpdated: Date;
}
