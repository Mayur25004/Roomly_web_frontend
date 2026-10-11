function getResponseMessage(responseBody: unknown): string {
  if (!responseBody || typeof responseBody !== "object") {
    return "";
  }

  const body = responseBody as Record<string, unknown>;
  if (typeof body.message === "string") {
    return body.message;
  }
  if (typeof body.error === "string") {
    return body.error;
  }
  return "";
}

function getStatusMessage(status: number): string {
  if (status === 400 || status === 422) {
    return "Some details were rejected. Check the form and try again.";
  }
  if (status === 401) {
    return "Your session has expired. Sign in again to continue.";
  }
  if (status === 403) {
    return "You do not have permission to perform this action.";
  }
  if (status === 409) {
    return "This request conflicts with existing data. Refresh and try again.";
  }
  return `The API request failed with status ${status}.`;
}

export function getApiErrorMessage(
  status: number,
  responseBody: unknown,
  requestId: string | null,
): string {
  const message = getResponseMessage(responseBody) || getStatusMessage(status);
  return requestId ? `${message} Request ID: ${requestId}.` : message;
}
