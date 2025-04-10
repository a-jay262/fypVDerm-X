"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schema/user.schema");
const bcrypt = __importStar(require("bcrypt"));
const nodemailer = __importStar(require("nodemailer"));
const crypto = __importStar(require("crypto"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async sendOtpEmail(email, otp) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: process.env.EMAIL_SUBJECT,
            text: `Hi, We received a request to sign in to V-DermX using this email address. If you want to proceed, use this confirmation code:
      
      ${otp}

      If you did not request this, please ignore this email.

      Thank you,
      The V-DermX Team`
        };
        await transporter.sendMail(mailOptions);
    }
    async signupvet(username, email, password) {
        const existingVet = await this.userModel.findOne({ email });
        if (existingVet) {
            throw new Error('Vet with this email already exists.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVet = new this.userModel({
            username,
            email,
            password: hashedPassword,
            otp: 12,
            otpExpires: null,
            verified: true,
        });
        await newVet.save();
        return newVet;
    }
    async verifyVetById(id) {
        const vet = await this.userModel.findById(id);
        if (!vet) {
            throw new Error('Vet not found');
        }
        vet.verified = true;
        await vet.save();
        return vet;
    }
    async signup(username, email, password) {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            if (existingUser.verified) {
                throw new common_1.BadRequestException('Email already exists');
            }
            if (existingUser.otpExpiresAt && new Date() > existingUser.otpExpiresAt) {
                const otp = crypto.randomInt(1000, 9999).toString();
                const otpExpiresAt = new Date();
                otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 1);
                existingUser.otp = otp;
                existingUser.otpExpiresAt = otpExpiresAt;
                await this.sendOtpEmail(email, otp);
                return existingUser.save();
            }
            throw new common_1.BadRequestException('Please verify your email to complete signup');
        }
        const existingUsername = await this.userModel.findOne({ username });
        if (existingUsername) {
            throw new common_1.BadRequestException('Username already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(1000, 9999).toString();
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 1);
        const user = new this.userModel({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpiresAt,
            verified: false,
        });
        await this.sendOtpEmail(email, otp);
        return user.save();
    }
    async verifyOtp(email, otp) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.verified) {
            throw new common_1.BadRequestException('User already verified');
        }
        if (user.otp !== otp || new Date() > user.otpExpiresAt) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        user.verified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();
        return user;
    }
    async resendOtp(email) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.verified) {
            throw new common_1.BadRequestException('User is already verified.Try Log In');
        }
        const otp = crypto.randomInt(1000, 9999).toString();
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 1);
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();
        await this.sendOtpEmail(email, otp);
        return { message: 'A new OTP has been sent to your email' };
    }
    async login(email, password) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map