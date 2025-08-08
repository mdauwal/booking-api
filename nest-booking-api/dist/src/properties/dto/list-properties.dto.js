"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPropertiesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
class ListPropertiesDto extends pagination_dto_1.PaginationDto {
}
exports.ListPropertiesDto = ListPropertiesDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter: desired start date (check-in)',
        type: String,
        format: 'date-time',
        example: '2025-08-15T00:00:00.000Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], ListPropertiesDto.prototype, "start_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter: desired end date (check-out)',
        type: String,
        format: 'date-time',
        example: '2025-08-20T00:00:00.000Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], ListPropertiesDto.prototype, "end_date", void 0);
//# sourceMappingURL=list-properties.dto.js.map