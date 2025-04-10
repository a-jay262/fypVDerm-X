import { Model } from 'mongoose';
import { Vet } from './vet.entity';
export declare class VetService {
    private readonly vetModel;
    constructor(vetModel: Model<Vet>);
    findAll(): Promise<Vet[]>;
    findActiveVets(): Promise<Vet[]>;
    findnonActiveVets(): Promise<Vet[]>;
    findOne(id: string): Promise<Vet>;
    create(vetData: Partial<Vet>, certificate: string | null, imageUrl: string | null): Promise<Vet>;
    update(id: string, updateData: Partial<Vet>): Promise<Vet>;
    delete(id: string): Promise<Vet>;
    approve(id: string): Promise<Vet>;
    sendNotificationEmail(email: string, name: string, message: string): Promise<void>;
}
