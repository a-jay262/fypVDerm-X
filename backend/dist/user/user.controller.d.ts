import { UserService } from './user.service';
import { User } from './schema/user.schema';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signup(username: string, email: string, password: string): Promise<User>;
    signupvet(username: string, email: string, password: string): Promise<User>;
    resendOtp(email: string): Promise<{
        message: string;
    }>;
    verifyOtp(email: string, otp: string): Promise<User>;
    login(email: string, password: string): Promise<User>;
    verifyVet(id: string): Promise<{
        message: string;
        vet: User;
        error?: undefined;
    } | {
        message: string;
        error: any;
        vet?: undefined;
    }>;
}
