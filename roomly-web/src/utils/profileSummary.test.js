import test from "node:test";
import assert from "node:assert/strict";
import { getProfileBookingCounts, getUserInitials } from "./profileSummary.js";

test("profile counts all history and only active upcoming bookings", () => {
    const bookings = [
        { endTime: "2030-03-01T11:00:00Z", startTime: "2030-03-01T10:00:00Z", status: "active" },
        { endTime: "2030-03-03T11:00:00Z", startTime: "2030-03-03T10:00:00Z", status: "cancelled" },
        { endTime: "2030-02-01T11:00:00Z", startTime: "2030-02-01T10:00:00Z", status: "active" },
    ];

    assert.deepEqual(getProfileBookingCounts(bookings, new Date("2030-02-15T00:00:00Z")), {
        total: 3,
        upcoming: 1,
    });
});

test("avatar initials come from the user's name or email", () => {
    assert.equal(getUserInitials({ name: "Mayur Shah", email: "mayur@example.com" }), "MS");
    assert.equal(getUserInitials({ name: "  roomly  ", email: "roomly@example.com" }), "RO");
    assert.equal(getUserInitials({ email: "mayur@example.com" }), "M");
});
