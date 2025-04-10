import { VetService } from './vets.service';
import { Vet } from './vet.entity';
export declare class VetController {
    private readonly vetService;
    constructor(vetService: VetService);
    getActiveVets(): Promise<Vet[]>;
    getnonctiveVets(): Promise<Vet[]>;
    getAll(): Promise<Vet[]>;
    create(vetData: Partial<Vet>, files: {
        certificate?: Express.Multer.File[];
        imageUrl?: Express.Multer.File[];
    }): Promise<Vet>;
    update(id: string, updateData: Partial<Vet>): Promise<Vet>;
    approveVet(id: string): Promise<Vet>;
    delete(id: string): Promise<Vet>;
    getAllVets(): Promise<Vet[]>;
    sendNotification(email: string, name: string, message: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
}
