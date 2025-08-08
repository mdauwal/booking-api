export type DateRange = {
    start: Date;
    end: Date;
};
export declare const isValidRange: (start: Date, end: Date) => boolean;
export declare const overlaps: (a: DateRange, b: DateRange) => boolean;
export declare const clampDate: (d: Date, min: Date, max: Date) => Date;
export declare const computeAvailabilityGaps: (availability: DateRange, bookings: DateRange[]) => DateRange[];
