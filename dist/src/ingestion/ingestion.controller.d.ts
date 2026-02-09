import { IngestionService } from './ingestion.service';
import { MeterReadingDto } from './dto/meter-reading.dto';
import { VehicleReadingDto } from './dto/vehicle-reading.dto';
export declare class IngestionController {
    private readonly ingestionService;
    constructor(ingestionService: IngestionService);
    ingestMeter(dto: MeterReadingDto): Promise<{
        status: string;
    }>;
    ingestVehicle(dto: VehicleReadingDto): Promise<{
        status: string;
    }>;
}
