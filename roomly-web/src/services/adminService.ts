import type { AmenityDetails, RoomDetails, UtilizationDateRange } from "../types/models.ts";
import { apiRequest } from "../api/apiClient.ts";
import {
  getMockAdminAmenities,
  getMockAdminRooms,
  getMockUtilizationReport,
  saveMockAmenity,
  saveMockRoom,
} from "./mockAdminService.ts";

const useMockServices =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SERVICES !== "false";

const apiSettings = {
  roomsPath: import.meta.env.VITE_ADMIN_ROOMS_PATH?.trim(),
  roomPathTemplate: import.meta.env.VITE_ADMIN_ROOM_PATH_TEMPLATE?.trim(),
  amenitiesPath: import.meta.env.VITE_ADMIN_AMENITIES_PATH?.trim(),
  amenityPathTemplate: import.meta.env.VITE_ADMIN_AMENITY_PATH_TEMPLATE?.trim(),
  utilizationPath: import.meta.env.VITE_ADMIN_UTILIZATION_PATH?.trim(),
};

function requireSetting(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} must be set after the admin API contract is agreed.`);
  }
  return value;
}

function requireList<T>(value: unknown, label: string): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`The ${label} API response must be a list.`);
  }
  return value as T[];
}

async function getRoomsFromApi() {
  const path = requireSetting("VITE_ADMIN_ROOMS_PATH", apiSettings.roomsPath);
  return requireList(await apiRequest(path), "admin rooms");
}

async function saveRoomWithApi(roomDetails: RoomDetails) {
  const roomsPath = requireSetting("VITE_ADMIN_ROOMS_PATH", apiSettings.roomsPath);
  if (!roomDetails.id) {
    return apiRequest(roomsPath, {
      method: "POST",
      body: JSON.stringify(roomDetails),
    });
  }

  const template = requireSetting(
    "VITE_ADMIN_ROOM_PATH_TEMPLATE",
    apiSettings.roomPathTemplate,
  );
  if (!template.includes("{roomId}")) {
    throw new Error("The admin room path must include {roomId}.");
  }
  const path = template.replace("{roomId}", encodeURIComponent(roomDetails.id));
  return apiRequest(path, {
    method: "PATCH",
    body: JSON.stringify(roomDetails),
  });
}

async function getAmenitiesFromApi() {
  const path = requireSetting(
    "VITE_ADMIN_AMENITIES_PATH",
    apiSettings.amenitiesPath,
  );
  return requireList(await apiRequest(path), "amenities");
}

async function saveAmenityWithApi(amenityDetails: AmenityDetails) {
  const amenitiesPath = requireSetting(
    "VITE_ADMIN_AMENITIES_PATH",
    apiSettings.amenitiesPath,
  );
  if (!amenityDetails.id) {
    return apiRequest(amenitiesPath, {
      method: "POST",
      body: JSON.stringify(amenityDetails),
    });
  }

  const template = requireSetting(
    "VITE_ADMIN_AMENITY_PATH_TEMPLATE",
    apiSettings.amenityPathTemplate,
  );
  if (!template.includes("{amenityId}")) {
    throw new Error("The admin amenity path must include {amenityId}.");
  }
  const path = template.replace(
    "{amenityId}",
    encodeURIComponent(amenityDetails.id),
  );
  return apiRequest(path, {
    method: "PATCH",
    body: JSON.stringify(amenityDetails),
  });
}

async function getUtilizationReportFromApi(dateRange: UtilizationDateRange) {
  const path = requireSetting(
    "VITE_ADMIN_UTILIZATION_PATH",
    apiSettings.utilizationPath,
  );
  const query = new URLSearchParams({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
  return requireList(
    await apiRequest(`${path}?${query.toString()}`),
    "utilization report",
  );
}

export const adminService = useMockServices
  ? {
      getRooms: getMockAdminRooms,
      saveRoom: saveMockRoom,
      getAmenities: getMockAdminAmenities,
      saveAmenity: saveMockAmenity,
      getUtilizationReport: getMockUtilizationReport,
    }
  : {
      getRooms: getRoomsFromApi,
      saveRoom: saveRoomWithApi,
      getAmenities: getAmenitiesFromApi,
      saveAmenity: saveAmenityWithApi,
      getUtilizationReport: getUtilizationReportFromApi,
    };
