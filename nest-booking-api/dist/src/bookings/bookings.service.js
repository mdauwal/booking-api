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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const property_entity_1 = require("../properties/entities/property.entity");
const date_utils_1 = require("../common/utils/date-utils");
let BookingsService = class BookingsService {
    constructor(bookingRepo, propertyRepo) {
        this.bookingRepo = bookingRepo;
        this.propertyRepo = propertyRepo;
    }
    async create(dto) {
        const property = await this.propertyRepo.findOne({ where: { id: dto.propertyId } });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        const start = dto.startDate;
        const end = dto.endDate;
        this.validateRangeBasics(start, end);
        this.ensureWithinAvailability(property, start, end);
        return await this.bookingRepo.manager.transaction(async (em) => {
            const overlapCount = await em
                .getRepository(booking_entity_1.Booking)
                .createQueryBuilder('b')
                .setLock('pessimistic_read')
                .where('b.propertyId = :pid', { pid: property.id })
                .andWhere('b.startDate < :end', { end })
                .andWhere('b.endDate > :start', { start })
                .getCount();
            if (overlapCount > 0) {
                throw new common_1.ConflictException('Booking dates overlap with an existing booking');
            }
            const booking = em.getRepository(booking_entity_1.Booking).create({
                property,
                userName: dto.userName,
                startDate: start,
                endDate: end
            });
            return em.getRepository(booking_entity_1.Booking).save(booking);
        });
    }
    async delete(id) {
        const res = await this.bookingRepo.delete(id);
        if (res.affected === 0)
            throw new common_1.NotFoundException('Booking not found');
    }
    async update(id, dto) {
        const booking = await this.bookingRepo.findOne({
            where: { id },
            relations: ['property']
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const newUserName = dto.userName ?? booking.userName;
        const newStart = dto.startDate ?? booking.startDate;
        const newEnd = dto.endDate ?? booking.endDate;
        this.validateRangeBasics(newStart, newEnd);
        this.ensureWithinAvailability(booking.property, newStart, newEnd);
        return await this.bookingRepo.manager.transaction(async (em) => {
            const overlapCount = await em
                .getRepository(booking_entity_1.Booking)
                .createQueryBuilder('b')
                .setLock('pessimistic_read')
                .where('b.propertyId = :pid', { pid: booking.property.id })
                .andWhere('b.id <> :id', { id })
                .andWhere('b.startDate < :end', { end: newEnd })
                .andWhere('b.endDate > :start', { start: newStart })
                .getCount();
            if (overlapCount > 0) {
                throw new common_1.ConflictException('Updated dates overlap with an existing booking');
            }
            booking.userName = newUserName;
            booking.startDate = newStart;
            booking.endDate = newEnd;
            return em.getRepository(booking_entity_1.Booking).save(booking);
        });
    }
    validateRangeBasics(start, end) {
        if (!(0, date_utils_1.isValidRange)(start, end)) {
            throw new common_1.BadRequestException('Invalid date range: startDate must be before endDate');
        }
    }
    ensureWithinAvailability(property, start, end) {
        if (start < property.availableFrom || end > property.availableTo) {
            throw new common_1.BadRequestException('Dates must be within property availability window');
        }
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map