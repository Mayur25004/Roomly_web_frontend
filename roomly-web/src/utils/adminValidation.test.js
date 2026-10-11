import test from "node:test";
import assert from "node:assert/strict";
import {
  validateAmenityDetails,
  validateRoomDetails,
} from "./adminValidation.js";

const validRoom = {
  name: "Conference Room A",
  location: "Floor 1",
  capacity: "8",
};

test("accepts a room with a name, location, and whole-number capacity", () => {
  assert.equal(validateRoomDetails(validRoom), "");
});

test("rejects a room name or location containing only spaces", () => {
  assert.equal(validateRoomDetails({ ...validRoom, name: "   " }), "Enter a room name.");
  assert.equal(validateRoomDetails({ ...validRoom, location: "   " }), "Enter a room location.");
});

test("rejects a room capacity that is not a positive whole number", () => {
  assert.equal(
    validateRoomDetails({ ...validRoom, capacity: "2.5" }),
    "Capacity must be a whole number greater than zero.",
  );
});

test("rejects an amenity name containing only spaces", () => {
  assert.equal(validateAmenityDetails({ name: "   " }), "Enter an amenity name.");
});
