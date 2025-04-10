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
exports.VetService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const nodemailer = __importStar(require("nodemailer"));
const common_3 = require("@nestjs/common");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let VetService = class VetService {
    constructor(vetModel) {
        this.vetModel = vetModel;
    }
    async findAll() {
        return this.vetModel.find().exec();
    }
    async findActiveVets() {
        return this.vetModel.find({ approveStatus: false }).exec();
    }
    async findnonActiveVets() {
        return this.vetModel.find({ approveStatus: true }).exec();
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_3.BadRequestException('Invalid ID format');
        }
        const vet = await this.vetModel.findById(id).exec();
        if (!vet) {
            throw new common_1.NotFoundException('Vet not found');
        }
        return vet;
    }
    async create(vetData, certificate, imageUrl) {
        const vet = new this.vetModel({
            ...vetData,
            certificate,
            imageUrl,
        });
        return vet.save();
    }
    async update(id, updateData) {
        const vet = await this.vetModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!vet) {
            throw new common_1.NotFoundException('Vet not found');
        }
        return vet;
    }
    async delete(id) {
        const vet = await this.vetModel.findById(id);
        if (!vet) {
            throw new common_1.NotFoundException('Vet not found');
        }
        await this.vetModel.deleteOne({ _id: id });
        return vet;
    }
    async approve(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_3.BadRequestException('Invalid ID format');
        }
        const vet = await this.vetModel.findByIdAndUpdate(id, { approveStatus: true }, { new: true });
        if (!vet) {
            throw new common_1.NotFoundException('Vet not found');
        }
        return vet;
    }
    async sendNotificationEmail(email, name, message) {
        console.log(nodemailer);
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
            subject: 'Confirmation EmailAs a vet',
            text: `Notification for event Booking,
  
      Name: ${name}
      Email: ${email}
      Detail:${message}
  
      Thank you,
      The Vet Derm-X Team`,
        };
        await transporter.sendMail(mailOptions);
    }
};
exports.VetService = VetService;
exports.VetService = VetService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Vet')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VetService);
//# sourceMappingURL=vets.service.js.map