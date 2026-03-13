/**
 * ============================================================================
 * API CLIENT - HTTP Communication Layer
 * ============================================================================
 * 
 * This file handles ALL communication with your .NET backend API.
 * Think of it as the "translator" between your React frontend and C# backend.
 * 
 * KEY CONCEPTS:
 * 
 * 1. BASE URL - Where your API lives (configured in .env.local)
 *    - Development: https://localhost:5001/api
 *    - Production: https://your-api.azurewebsites.net/api
 * 
 * 2. AUTHENTICATION - JWT (JSON Web Tokens)
 *    - User logs in -> API returns access token + refresh token
 *    - Access token: Short-lived (15 mins), sent with every request
 *    - Refresh token: Long-lived (7 days), used to get new access tokens
 * 
 * 3. ERROR HANDLING - Consistent error format
 *    - API always returns { code, message, details?, traceId? }
 *    - We wrap this in ApiException class for easy handling
 * 
 * HOW DATA FLOWS:
 * 
 * Frontend Component
 *        ↓
 * useIncidents() hook (lib/hooks/use-incidents.ts)
 *        ↓
 * incidentService.getAll() (lib/api/services.ts)
 *        ↓
 * get("/incidents", params) (THIS FILE)
 *        ↓
 * fetch() with headers, auth token, etc.
 *        ↓
 * .NET API Controller
 *        ↓
 * JSON Response
 *        ↓
 * handleResponse() parses JSON
 *        ↓
 * Data returned to component
 * 
 * ============================================================================
 */

import type { ApiError } from "@/types/domain";

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Base URL for all API requests.
 * 
 * Set this in your .env.local file:
 * NEXT_PUBLIC_API_URL=https://localhost:5001/api
 * 
 * The NEXT_PUBLIC_ prefix makes it available in the browser.
 * Without this prefix, env vars are only available on the server.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001/api";

/**
 * LocalStorage keys for tokens.
 * 
 * We store tokens in localStorage so they persist across page refreshes.
 * SECURITY NOTE: In production, consider using httpOnly cookies instead.
 */
const TOKEN_KEY = "simp_access_token";
const REFRESH_TOKEN_KEY = "simp_refresh_token";


// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================
// These functions handle storing/retrieving JWT tokens from localStorage.
// They're used by the auth context and API client.
// ============================================================================

/**
 * Get the current access token.
 * 
 * WHY CHECK typeof window:
 * Next.js runs on both server and client. localStorage only exists in browser.
 * This check prevents "localStorage is not defined" errors during SSR.
 */
export function getAccessToken(): string | null {
  // Only run in browser (not during server-side rendering)
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store a new access token.
 * Called after login or token refresh.
 */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Get the refresh token.
 * Used to obtain a new access token when the current one expires.
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Store a new refresh token.
 * Called after login or token refresh.
 */
export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Clear all tokens (logout).
 * Called when user logs out or when tokens are invalid.
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}


// ============================================================================
// API EXCEPTION CLASS
// ============================================================================
// Custom error class that wraps API error responses.
// Makes it easy to handle errors consistently throughout the app.
// ============================================================================

/**
 * Custom exception for API errors.
 * 
 * USAGE:
 * try {
 *   await incidentService.create(data);
 * } catch (error) {
 *   if (error instanceof ApiException) {
 *     console.log(error.statusCode);  // 400
 *     console.log(error.code);        // "VALIDATION_ERROR"
 *     console.log(error.message);     // "Title is required"
 *     console.log(error.details);     // { title: ["Title is required"] }
 *   }
 * }
 */
export class ApiException extends Error {
  /** HTTP status code (e.g., 400, 401, 404, 500) */
  public readonly statusCode: number;
  
  /** Machine-readable error code from API */
  public readonly code: string;
  
  /** Validation errors by field (for 400 Bad Request) */
  public readonly details?: Record<string, string[]>;
  
  /** Trace ID for debugging (include in support tickets) */
  public readonly traceId?: string;

  constructor(statusCode: number, error: ApiError) {
    super(error.message);
    this.name = "ApiException";
    this.statusCode = statusCode;
    this.code = error.code;
    this.details = error.details;
    this.traceId = error.traceId;
  }
}


// ============================================================================
// REQUEST CONFIGURATION
// ============================================================================

/**
 * Extended fetch configuration with our custom options.
 */
interface RequestConfig extends RequestInit {
  /** Query parameters to add to the URL */
  params?: Record<string, string | number | boolean | string[] | undefined>;
  
  /** Skip adding the Authorization header (for public endpoints) */
  skipAuth?: boolean;
}

/**
 * Build the full URL with query parameters.
 * 
 * EXAMPLE:
 * buildUrl("/incidents", { status: ["Open", "InProgress"], page: 1 })
 * Returns: "https://api/incidents?status=Open&status=InProgress&page=1"
 * 
 * WHY ARRAYS ARE HANDLED SPECIALLY:
 * For filtering by multiple values (e.g., multiple statuses),
 * we repeat the parameter: ?status=Open&status=InProgress
 * Your .NET API should accept this format.
 */
function buildUrl(endpoint: string, params?: RequestConfig["params"]): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      // Skip undefined/null values
      if (value === undefined || value === null) return;
      
      if (Array.isArray(value)) {
        // Add each array item as a separate parameter
        value.forEach((v) => url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}


// ============================================================================
// CORE API FUNCTIONS
// ============================================================================

/**
 * Handle the API response.
 * 
 * WHAT IT DOES:
 * 1. Check if response is OK (2xx status)
 * 2. Parse JSON if content-type is application/json
 * 3. Throw ApiException for error responses
 * 
 * WHY SEPARATE FUNCTION:
 * Single place to handle all response parsing and error handling.
 * Makes the main apiRequest function cleaner.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // 204 No Content - return undefined
  // Common for DELETE requests or updates that return nothing
  if (response.status === 204) {
    return undefined as T;
  }

  // Check if response is JSON
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  // Handle error responses (4xx, 5xx)
  if (!response.ok) {
    if (isJson) {
      // Parse the error body
      const error = await response.json() as ApiError;
      throw new ApiException(response.status, error);
    }
    // Non-JSON error response
    throw new ApiException(response.status, {
      code: "UNKNOWN_ERROR",
      message: `Request failed with status ${response.status}`,
    });
  }

  // Parse successful JSON response
  if (isJson) {
    return response.json() as Promise<T>;
  }

  // Return text for non-JSON responses
  return response.text() as unknown as T;
}

/**
 * Main API request function.
 * 
 * WHAT IT DOES:
 * 1. Build the URL with query params
 * 2. Add headers (Content-Type, Authorization)
 * 3. Make the fetch request
 * 4. Handle 401 (token expired) - try to refresh
 * 5. Parse and return the response
 * 
 * TYPE PARAMETER <T>:
 * The type of data you expect back. TypeScript will enforce this.
 * Example: apiRequest<Incident>("/incidents/123") returns Promise<Incident>
 */
export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  // Destructure config - separate our custom options from fetch options
  const { params, skipAuth, ...init } = config;
  
  // Build the full URL with query parameters
  const url = buildUrl(endpoint, params);
  
  // Set up headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",  // We're sending JSON
    "Accept": "application/json",         // We want JSON back
    ...(init.headers || {}),              // Any custom headers
  };

  // Add Authorization header if we have a token
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  // Make the request
  const response = await fetch(url, {
    ...init,
    headers,
  });

  // Handle 401 Unauthorized - token might be expired
  if (response.status === 401 && !skipAuth) {
    // Try to refresh the token
    const refreshed = await refreshAccessToken();
    
    if (refreshed) {
      // Token refreshed - retry the original request
      const newToken = getAccessToken();
      (headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
      const retryResponse = await fetch(url, { ...init, headers });
      return handleResponse<T>(retryResponse);
    }
    
    // Refresh failed - user needs to log in again
    clearTokens();
    throw new ApiException(401, {
      code: "UNAUTHORIZED",
      message: "Session expired. Please log in again.",
    });
  }

  return handleResponse<T>(response);
}


// ============================================================================
// HTTP METHOD HELPERS
// ============================================================================
// Convenience functions for common HTTP methods.
// These make the service layer cleaner and more readable.
// ============================================================================

/**
 * GET request - retrieve data.
 * 
 * USAGE:
 * const incidents = await get<Incident[]>("/incidents", { status: "Open" });
 */
export async function get<T>(
  endpoint: string,
  params?: RequestConfig["params"],
  config?: Omit<RequestConfig, "params" | "method" | "body">
): Promise<T> {
  return apiRequest<T>(endpoint, { ...config, params, method: "GET" });
}

/**
 * POST request - create new data.
 * 
 * USAGE:
 * const newIncident = await post<Incident>("/incidents", { title: "..." });
 */
export async function post<T>(
  endpoint: string,
  data?: unknown,
  config?: Omit<RequestConfig, "method" | "body">
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...config,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request - replace entire resource.
 * 
 * USAGE:
 * await put("/incidents/123", { title: "...", description: "..." });
 */
export async function put<T>(
  endpoint: string,
  data?: unknown,
  config?: Omit<RequestConfig, "method" | "body">
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...config,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request - partial update.
 * 
 * USAGE:
 * await patch("/incidents/123", { status: "Resolved" });
 */
export async function patch<T>(
  endpoint: string,
  data?: unknown,
  config?: Omit<RequestConfig, "method" | "body">
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...config,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request - remove resource.
 * 
 * USAGE:
 * await del("/incidents/123");
 */
export async function del<T = void>(
  endpoint: string,
  config?: Omit<RequestConfig, "method" | "body">
): Promise<T> {
  return apiRequest<T>(endpoint, { ...config, method: "DELETE" });
}


// ============================================================================
// TOKEN REFRESH
// ============================================================================

/**
 * Attempt to refresh the access token using the refresh token.
 * 
 * HOW IT WORKS:
 * 1. Get refresh token from storage
 * 2. Send it to /auth/refresh endpoint
 * 3. If successful, store the new access token
 * 4. Return true/false indicating success
 * 
 * WHEN IT'S CALLED:
 * Automatically when a request returns 401 Unauthorized.
 * This provides seamless session extension.
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  
  // No refresh token - can't refresh
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    // Refresh failed - token is invalid or expired
    if (!response.ok) return false;

    // Parse new tokens
    const data = await response.json();
    
    // Store new access token
    setAccessToken(data.accessToken);
    
    // Some APIs return a new refresh token too
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
    
    return true;
  } catch {
    // Network error or other issue
    return false;
  }
}


// ============================================================================
// FILE UPLOAD
// ============================================================================

/**
 * Upload a file with progress tracking.
 * 
 * WHY XMLHttpRequest:
 * fetch() doesn't support upload progress. We need XHR for that.
 * 
 * USAGE:
 * const result = await uploadFile("/attachments", file, (progress) => {
 *   console.log(`Upload: ${progress}%`);
 * });
 * console.log(result.url); // URL of uploaded file
 * 
 * YOUR .NET ENDPOINT should accept multipart/form-data and return:
 * { id: "guid", url: "https://blob.azure...", fileName: "report.pdf" }
 */
export async function uploadFile(
  endpoint: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ id: string; url: string; fileName: string }> {
  const token = getAccessToken();
  
  return new Promise((resolve, reject) => {
    // Create XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();
    
    // Create FormData with the file
    const formData = new FormData();
    formData.append("file", file);

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Success - parse JSON response
        resolve(JSON.parse(xhr.responseText));
      } else {
        // Error - try to parse error response
        try {
          const error = JSON.parse(xhr.responseText) as ApiError;
          reject(new ApiException(xhr.status, error));
        } catch {
          reject(new ApiException(xhr.status, {
            code: "UPLOAD_FAILED",
            message: "File upload failed",
          }));
        }
      }
    });

    // Handle network errors
    xhr.addEventListener("error", () => {
      reject(new ApiException(0, {
        code: "NETWORK_ERROR",
        message: "Network error during upload",
      }));
    });

    // Send the request
    xhr.open("POST", `${API_BASE_URL}${endpoint}`);
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    // Note: Don't set Content-Type - browser sets it with boundary for multipart
    xhr.send(formData);
  });
}
