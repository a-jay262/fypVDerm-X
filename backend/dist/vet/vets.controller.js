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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VetController = void 0;
const common_1 = require("@nestjs/common");
const vets_service_1 = require("./vets.service");
const platform_express_1 = require("@nestjs/platform-express");
const sharp_1 = __importDefault(require("sharp"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
let VetController = class VetController {
    constructor(vetService) {
        this.vetService = vetService;
    }
    async getActiveVets() {
        return this.vetService.findActiveVets();
    }
    async getnonctiveVets() {
        return this.vetService.findnonActiveVets();
    }
    async getAll() {
        return this.vetService.findAll();
    }
    async create(vetData, files) {
        const certificateFile = files.certificate?.[0];
        const imageFile = files.imageUrl?.[0];
        let compressedCertificateUrl = null;
        let compressedImageUrl = null;
        const uploadsDirectory = path_1.default.resolve(__dirname, '../../uploads');
        try {
            console.log('Uploads Directory:', uploadsDirectory);
            await fs.promises.mkdir(uploadsDirectory, { recursive: true });
            if (certificateFile && certificateFile.buffer) {
                const certificateFileName = `${(0, uuid_1.v4)()}-${certificateFile.originalname}`;
                const certificateFilePath = path_1.default.join(uploadsDirectory, certificateFileName);
                await fs.promises.writeFile(certificateFilePath, certificateFile.buffer);
                const certificateOutputPath = path_1.default.join(uploadsDirectory, `compressed-${certificateFileName}`);
                await (0, sharp_1.default)(certificateFilePath)
                    .resize(300)
                    .jpeg({ quality: 80 })
                    .toFile(certificateOutputPath);
                compressedCertificateUrl = `/uploads/compressed-${certificateFileName}`;
                console.log('Certificate file saved but not deleted:', certificateFilePath);
            }
            else {
                console.error('Certificate file is missing or has no buffer.');
            }
            if (imageFile && imageFile.buffer) {
                const imageFileName = `${(0, uuid_1.v4)()}-${imageFile.originalname}`;
                const imageFilePath = path_1.default.join(uploadsDirectory, imageFileName);
                await fs.promises.writeFile(imageFilePath, imageFile.buffer);
                const imageOutputPath = path_1.default.join(uploadsDirectory, `compressed-${imageFileName}`);
                await (0, sharp_1.default)(imageFilePath)
                    .resize(300)
                    .jpeg({ quality: 80 })
                    .toFile(imageOutputPath);
                compressedImageUrl = `/uploads/compressed-${imageFileName}`;
                console.log('Image file saved but not deleted:', imageFilePath);
            }
            else {
                console.error('Image file is missing or has no buffer.');
            }
            return this.vetService.create(vetData, compressedCertificateUrl, compressedImageUrl);
        }
        catch (error) {
            console.error('Error processing the images:', error);
            if (certificateFile) {
                const certificateFilePath = path_1.default.join(uploadsDirectory, `${(0, uuid_1.v4)()}-${certificateFile.originalname}`);
                if (fs.existsSync(certificateFilePath)) {
                    console.log('Skipping deletion of certificate file:', certificateFilePath);
                }
            }
            if (imageFile) {
                const imageFilePath = path_1.default.join(uploadsDirectory, `${(0, uuid_1.v4)()}-${imageFile.originalname}`);
                if (fs.existsSync(imageFilePath)) {
                    console.log('Skipping deletion of image file:', imageFilePath);
                }
            }
            throw new Error('Error processing the images.');
        }
    }
    async update(id, updateData) {
        return this.vetService.update(id, updateData);
    }
    async approveVet(id) {
        return this.vetService.approve(id);
    }
    async delete(id) {
        return this.vetService.delete(id);
    }
    async getAllVets() {
        return this.vetService.findAll();
    }
    async sendNotification(email, name, message) {
        try {
            await this.vetService.sendNotificationEmail(email, name, message);
            return {
                success: true,
                message: 'Notification email sent successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to send notification email',
                error: error.message,
            };
        }
    }
};
exports.VetController = VetController;
__decorate([
    (0, common_1.Get)('nonactive'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VetController.prototype, "getActiveVets", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VetController.prototype, "getnonctiveVets", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VetController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)('createvets'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'certificate', maxCount: 1 },
        { name: 'imageUrl', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VetController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VetController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VetController.prototype, "approveVet", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VetController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('getvets'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VetController.prototype, "getAllVets", null);
__decorate([
    (0, common_1.Post)('send-notification'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('name')),
    __param(2, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], VetController.prototype, "sendNotification", null);
exports.VetController = VetController = __decorate([
    (0, common_1.Controller)('vets'),
    __metadata("design:paramtypes", [vets_service_1.VetService])
], VetController);
//# sourceMappingURL=vets.controller.js.map