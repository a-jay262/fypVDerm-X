import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    private sendOtpEmail;
    signupvet(username: string, email: string, password: string): Promise<User>;
    verifyVetById(id: string): Promise<User>;
    signup(username: string, email: string, password: string): Promise<User>;
    verifyOtp(email: string, otp: string): Promise<User>;
    resendOtp(email: string): Promise<{
        message: string;
    }>;
    login(email: string, password: string): Promise<User>;
}
