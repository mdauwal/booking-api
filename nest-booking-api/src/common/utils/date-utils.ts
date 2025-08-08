export type DateRange = { start: Date; end: Date }

// Hotel semantics: end is exclusive (check-out day).
export const isValidRange = (start: Date, end: Date): boolean => {
  return start instanceof Date && end instanceof Date && !isNaN(start.getTime()) && !isNaN(end.getTime()) && start < end
}

// Check if two [start, end) ranges overlap
export const overlaps = (a: DateRange, b: DateRange): boolean => {
  return a.start < b.end && a.end > b.start
}

// Clamp a date to be within [min, max]
export const clampDate = (d: Date, min: Date, max: Date): Date => {
  return new Date(Math.min(Math.max(d.getTime(), min.getTime()), max.getTime()))
}

// Given availability window and sorted, non-overlapping bookings, compute free windows
export const computeAvailabilityGaps = (availability: DateRange, bookings: DateRange[]): DateRange[] => {
  const result: DateRange[] = []
  if (!isValidRange(availability.start, availability.end)) return result

  // Sort by start date to be safe
  const sorted = [...bookings].sort((a, b) => a.start.getTime() - b.start.getTime())

  let cursor = availability.start

  for (const b of sorted) {
    // Ignore bookings outside the availability window
    const bStart = clampDate(b.start, availability.start, availability.end)
    const bEnd = clampDate(b.end, availability.start, availability.end)
    if (!isValidRange(bStart, bEnd)) {
      continue
    }
    if (cursor < bStart) {
      result.push({ start: new Date(cursor), end: new Date(bStart) })
    }
    if (cursor < bEnd) {
      cursor = bEnd
    }
  }

  if (cursor < availability.end) {
    result.push({ start: new Date(cursor), end: new Date(availability.end) })
  }

  return result
}
