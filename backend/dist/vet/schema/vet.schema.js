"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VetSchema = void 0;
const mongoose_1 = require("mongoose");
exports.VetSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    qualification: { type: String, required: true },
    certificate: { type: String, required: true },
    contact: { type: String, required: true },
    area: { type: String, required: true },
    imageUrl: { type: String, required: true },
    approveStatus: { type: Boolean, default: false },
});
//# sourceMappingURL=vet.schema.js.map