"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageModulee = void 0;
const common_1 = require("@nestjs/common");
const image_controller_1 = require("./image.controller");
let ImageModulee = class ImageModulee {
};
exports.ImageModulee = ImageModulee;
exports.ImageModulee = ImageModulee = __decorate([
    (0, common_1.Module)({
        controllers: [image_controller_1.ImageControllerr],
    })
], ImageModulee);
//# sourceMappingURL=image.module.js.map