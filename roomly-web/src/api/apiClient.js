const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

export class ApiError extends Error {
  constructor(message, { status = null, requestId = null, responseBody = null, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "ApiError";
    this.status = status;
    this.requestId = requestId;
    this.responseBody = responseBody;
  }
}

function getRequestUrl(path) {
  const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
  const relativePath = path.replace(/^\/+/, "");
  return new URL(relativePath, baseUrl);
}

async function readResponseBody(response) {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  const contentType = response.headers.get("Content-Type") || "";
  if (!contentType.includes("json")) {
    return responseText;
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    throw new ApiError("The server returned invalid JSON.", {
      status: response.status,
      requestId: response.headers.get("X-Request-ID"),
      cause: error,
    });
  }
}

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new ApiError("VITE_API_BASE_URL is not configured.");
  }

  const headers = new Headers(options.headers);
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response;
  try {
    response = await fetch(getRequestUrl(path), { ...options, headers });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new ApiError("Could not connect to the API server.", { cause: error });
  }

  const requestId = response.headers.get("X-Request-ID");
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    const requestIdMessage = requestId ? ` Request ID: ${requestId}.` : "";
    throw new ApiError(
      `The API request failed with status ${response.status}.${requestIdMessage}`,
      { status: response.status, requestId, responseBody },
    );
  }

  return responseBody;
}
