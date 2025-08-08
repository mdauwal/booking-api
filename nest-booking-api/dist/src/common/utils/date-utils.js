"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeAvailabilityGaps = exports.clampDate = exports.overlaps = exports.isValidRange = void 0;
const isValidRange = (start, end) => {
    return start instanceof Date && end instanceof Date && !isNaN(start.getTime()) && !isNaN(end.getTime()) && start < end;
};
exports.isValidRange = isValidRange;
const overlaps = (a, b) => {
    return a.start < b.end && a.end > b.start;
};
exports.overlaps = overlaps;
const clampDate = (d, min, max) => {
    return new Date(Math.min(Math.max(d.getTime(), min.getTime()), max.getTime()));
};
exports.clampDate = clampDate;
const computeAvailabilityGaps = (availability, bookings) => {
    const result = [];
    if (!(0, exports.isValidRange)(availability.start, availability.end))
        return result;
    const sorted = [...bookings].sort((a, b) => a.start.getTime() - b.start.getTime());
    let cursor = availability.start;
    for (const b of sorted) {
        const bStart = (0, exports.clampDate)(b.start, availability.start, availability.end);
        const bEnd = (0, exports.clampDate)(b.end, availability.start, availability.end);
        if (!(0, exports.isValidRange)(bStart, bEnd)) {
            continue;
        }
        if (cursor < bStart) {
            result.push({ start: new Date(cursor), end: new Date(bStart) });
        }
        if (cursor < bEnd) {
            cursor = bEnd;
        }
    }
    if (cursor < availability.end) {
        result.push({ start: new Date(cursor), end: new Date(availability.end) });
    }
    return result;
};
exports.computeAvailabilityGaps = computeAvailabilityGaps;
//# sourceMappingURL=date-utils.js.map