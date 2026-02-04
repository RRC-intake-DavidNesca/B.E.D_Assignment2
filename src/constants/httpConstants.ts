/**
 * HTTP status codes used throughout the application.
 */
export const HTTP_STATUS = {
    // Success responses
    OK: 200,
    CREATED: 201,

    // Client error responses
    BAD_REQUEST: 400,
    NOT_FOUND: 404,

    // Server error responses
    INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Allowed HTTP status code values from HTTP_STATUS.
 */
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
