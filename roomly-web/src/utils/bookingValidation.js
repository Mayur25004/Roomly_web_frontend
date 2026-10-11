import { combineLocalDateAndTime } from "./dateTime.js";

export const MIN_DURATION_MINUTES = 15;
export const MAX_DURATION_MINUTES = 4 * 60;

export function validateTimeWindow({ date, startTime, endTime }, now = new Date()) {
  if (!date || !startTime || !endTime) {
    return "Choose a date, start time, and end time.";
  }

  const start = combineLocalDateAndTime(date, startTime);
  const end = combineLocalDateAndTime(date, endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Choose a valid date and time.";
  }
  if (start <= now) {
    return "The booking must start in the future.";
  }
  if (end <= start) {
    return "The end time must be after the start time on the selected date.";
  }

  const durationMinutes = (end - start) / (60 * 1000);
  if (durationMinutes < MIN_DURATION_MINUTES) {
    return "Bookings must be at least 15 minutes long.";
  }
  if (durationMinutes > MAX_DURATION_MINUTES) {
    return "Bookings cannot be longer than 4 hours.";
  }
  return "";
}

export function validateBookingInput(booking, roomCapacity, now = new Date()) {
  if (!booking.title.trim()) {
    return "Enter a title for this meeting.";
  }
  if (booking.title.trim().length > 100) {
    return "The meeting title must be 100 characters or fewer.";
  }

  const attendeeCount = Number(booking.attendeeCount);
  if (!Number.isInteger(attendeeCount) || attendeeCount < 1) {
    return "Enter at least one attendee.";
  }
  if (attendeeCount > roomCapacity) {
    return `This room can hold up to ${roomCapacity} people.`;
  }

  return validateTimeWindow(
    {
      date: booking.meetingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
    },
    now,
  );
}
