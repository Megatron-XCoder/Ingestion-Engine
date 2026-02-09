import { IsString, IsNotEmpty, IsNumber, IsDateString, Min, Max } from 'class-validator';

export class VehicleReadingDto {
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  soc: number;

  @IsNumber()
  kwhDeliveredDc: number;

  @IsNumber()
  batteryTemp: number;

  @IsDateString()
  timestamp: string;
}
