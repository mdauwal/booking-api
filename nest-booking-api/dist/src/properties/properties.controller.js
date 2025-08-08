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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesController = void 0;
const common_1 = require("@nestjs/common");
const properties_service_1 = require("./properties.service");
const list_properties_dto_1 = require("./dto/list-properties.dto");
const swagger_1 = require("@nestjs/swagger");
const property_entity_1 = require("./entities/property.entity");
let PropertiesController = class PropertiesController {
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
    }
    list(query) {
        return this.propertiesService.list(query);
    }
    async availability(id) {
        return this.propertiesService.getAvailability(id);
    }
};
exports.PropertiesController = PropertiesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all properties with optional pagination and availability filter' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({
        name: 'start_date',
        required: false,
        type: String,
        description: 'Desired start date (check-in), ISO string'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'end_date',
        required: false,
        type: String,
        description: 'Desired end date (check-out), ISO string'
    }),
    (0, swagger_1.ApiOkResponse)({ type: [property_entity_1.Property] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_properties_dto_1.ListPropertiesDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id/availability'),
    (0, swagger_1.ApiOperation)({ summary: "Get a property's availability date ranges (end is exclusive)" }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "availability", null);
exports.PropertiesController = PropertiesController = __decorate([
    (0, swagger_1.ApiTags)('properties'),
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService])
], PropertiesController);
//# sourceMappingURL=properties.controller.js.map