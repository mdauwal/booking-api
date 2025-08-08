"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const booking_entity_1 = require("../bookings/entities/booking.entity");
const property_entity_1 = require("../properties/entities/property.entity");
const typeOrmConfig = () => {
    const isTest = process.env.NODE_ENV === 'test';
    if (isTest) {
        return {
            type: 'sqlite',
            database: ':memory:',
            entities: [property_entity_1.Property, booking_entity_1.Booking],
            synchronize: true,
            logging: false
        };
    }
    return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'booking_db',
        entities: [property_entity_1.Property, booking_entity_1.Booking],
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        logging: process.env.DB_LOGGING === 'true'
    };
};
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map