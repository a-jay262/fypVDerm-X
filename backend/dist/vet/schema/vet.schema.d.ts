import { Schema, Document } from 'mongoose';
export declare const VetSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    name: string;
    email: string;
    qualification: string;
    certificate: string;
    contact: string;
    area: string;
    imageUrl: string;
    approveStatus: boolean;
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    email: string;
    qualification: string;
    certificate: string;
    contact: string;
    area: string;
    imageUrl: string;
    approveStatus: boolean;
}>> & import("mongoose").FlatRecord<{
    name: string;
    email: string;
    qualification: string;
    certificate: string;
    contact: string;
    area: string;
    imageUrl: string;
    approveStatus: boolean;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export interface Vet extends Document {
    id: string;
    name: string;
    email: string;
    qualification: string;
    certificate: Buffer;
    contact: string;
    area: string;
    imageUrl?: string;
    approveStatus: boolean;
}
