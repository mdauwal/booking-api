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
exports.Booking = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../../properties/entities/property.entity");
const swagger_1 = require("@nestjs/swagger");
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], Booking.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Booking.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Booking.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => property_entity_1.Property }),
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.bookings, {
        nullable: false,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", property_entity_1.Property)
], Booking.prototype, "property", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)({ name: 'bookings' }),
    (0, typeorm_1.Index)(['property', 'startDate']),
    (0, typeorm_1.Index)(['property', 'endDate'])
], Booking);
//# sourceMappingURL=booking.entity.js.map