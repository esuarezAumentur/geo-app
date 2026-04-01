const MESSAGES = {
  // Auth
  AUTH_TOKEN_REQUIRED: 'Authentication token required',
  AUTH_TOKEN_INVALID: 'Invalid or expired token',
  AUTH_REFRESH_TOKEN_INVALID: 'Invalid or expired refresh token',
  AUTH_INVALID_CREDENTIALS: 'Invalid credentials',
  AUTH_NOT_AUTHENTICATED: 'Not authenticated',
  AUTH_INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  AUTH_EMAIL_TAKEN: 'Email already registered',
  AUTH_REGISTER_SUCCESS: 'User registered successfully',

  // Users
  USER_NOT_FOUND: 'User not found',

  // Maps
  MAP_NOT_FOUND: 'Map not found',

  // POIs
  POI_NOT_FOUND: 'POI not found',

  // Tags
  TAG_NOT_FOUND: 'Tag not found',

  // Points of interest
  POINT_OF_INTEREST_NOT_FOUND: 'Point of interest not found',

  // Routes
  ROUTE_NOT_FOUND: 'Route not found',

  // Models
  MODEL_NOT_FOUND: 'Model not found',

  // Storage
  STORAGE_NO_FILE: 'No file uploaded',
  STORAGE_FILE_TYPE_NOT_ALLOWED: 'File type not allowed',
  STORAGE_FILE_TOO_LARGE: 'File too large. Maximum allowed size is 25 MB',
  STORAGE_INVALID_FILENAME: 'Invalid filename',
  STORAGE_FILE_NOT_FOUND: 'File not found',

  // Validation
  VALIDATION_ERROR: 'Validation error',
  VALIDATION_INVALID_ID: 'Invalid ID format',

  // Generic
  INTERNAL_ERROR: 'Internal Server Error',
  DUPLICATE_FIELD: (field) => `Duplicate value for ${field}`,
  MULTER_ERROR: (msg) => msg,
};

module.exports = MESSAGES;
