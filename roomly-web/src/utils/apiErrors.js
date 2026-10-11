function getResponseMessage(responseBody) {
  if (!responseBody || typeof responseBody !== "object") {
    return "";
  }

  if (typeof responseBody.message === "string") {
    return responseBody.message;
  }
  if (typeof responseBody.error === "string") {
    return responseBody.error;
  }
  return "";
}

function getStatusMessage(status) {
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

export function getApiErrorMessage(status, responseBody, requestId) {
  const message = getResponseMessage(responseBody) || getStatusMessage(status);
  return requestId ? `${message} Request ID: ${requestId}.` : message;
}
