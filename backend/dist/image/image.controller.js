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
exports.ImageControllerr = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer = __importStar(require("multer"));
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
let ImageControllerr = class ImageControllerr {
    async predict(file) {
        try {
            console.log("Received file:", file);
            if (!file) {
                console.error("No file uploaded.");
                return { error: 'No file uploaded.' };
            }
            const filePath = path.join(__dirname, '..', '..', 'uploads', file.originalname);
            console.log("File path:", filePath);
            const imageData = fs.readFileSync(filePath);
            console.log("Image data read successfully");
            const tempFilePath = path.join(os.tmpdir(), 'temp_image.jpg');
            fs.writeFileSync(tempFilePath, imageData);
            console.log("Temporary file created at:", tempFilePath);
            const pythonScript = path.resolve(__dirname, process.env.NODE_ENV === 'production' ? '../scripts/predict.py' : '../../src/scripts/predict.py');
            console.log('Resolved Python script path:', pythonScript);
            if (!fs.existsSync(pythonScript)) {
                console.error(`Python script not found at path: ${pythonScript}`);
                throw new Error(`Python script not found at path: ${pythonScript}`);
            }
            const command = `python ${pythonScript} "${tempFilePath}"`;
            const prediction = await new Promise((resolve, reject) => {
                (0, child_process_1.exec)(command, { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } }, (error, stdout, stderr) => {
                    if (error) {
                        console.error("Python script execution error:", stderr || error.message);
                        reject(`Error: ${stderr || error.message}`);
                    }
                    console.log("Prediction result:", stdout);
                    resolve(stdout);
                });
            });
            fs.unlinkSync(tempFilePath);
            console.log("Temporary file removed");
            const predictionData = JSON.parse(prediction);
            return { prediction: predictionData };
        }
        catch (error) {
            console.error("Error during image processing:", error);
            return { error: error.message || 'An error occurred while processing the image.' };
        }
    }
};
exports.ImageControllerr = ImageControllerr;
__decorate([
    (0, common_1.Post)('predicts'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: multer.diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                callback(null, file.originalname);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImageControllerr.prototype, "predict", null);
exports.ImageControllerr = ImageControllerr = __decorate([
    (0, common_1.Controller)('images')
], ImageControllerr);
//# sourceMappingURL=image.controller.js.map