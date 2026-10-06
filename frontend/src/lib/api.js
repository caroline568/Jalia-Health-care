const BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
let csrfToken = null;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function parseResponse(response) {
  let data = null;
  try {
    data = await response.json();
  } catch {
    // Responses without JSON bodies are handled using their HTTP status.
  }
  if (data?.csrfToken) csrfToken = data.csrfToken;
  if (!response.ok) {
    throw new ApiError(data?.error || "The request could not be completed.", response.status);
  }
  return data;
}

async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  let response;
  try {
    response = await fetch(`${BASE}/auth/csrf`, {
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError("The account service is unavailable. Your on-device records remain available.", 0);
  }
  const data = await parseResponse(response);
  csrfToken = data.csrfToken;
  return csrfToken;
}

async function request(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET" && method !== "HEAD") {
    headers["X-CSRF-Token"] = await getCsrfToken();
  }

  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      credentials: "include",
      cache: "no-store",
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("The account service is unavailable. Your on-device records remain available.", 0);
  }
  return parseResponse(response);
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};
