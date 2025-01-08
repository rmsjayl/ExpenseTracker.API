var commonConstants = {
  // Error messages
  ERROR_MESSAGE: {
    INVALID_REQUEST: "Invalid request.",
    PROVIDE_ALL_FIELDS: "Please provide all required fields.",
    UNAUTHORIZED: "Unauthorized to access the resource.",
    FORBIDDEN: "Forbidden request. You are unauthorized to access the resource.",
    NOT_FOUND: "Resource not found.",
    INTERNAL_SERVER_ERROR: "Internal server error.",
    BAD_GATEWAY: "Bad gateway.",
    SERVICE_UNAVAILABLE: "Service unavailable.",
    GATEWAY_TIMEOUT: "Gateway timeout.",
    TOKEN_INVALID: "Token is invalid. You are unauthorized to access the resource.",
    NO_TOKEN: "No token provided. You are unauthorized to access the resource.",
  },

  // Success messages
  SUCCESS_MESSAGE: {
    DATA_REQUESTED: "Data requested successfully.",
    DATA_CREATED: "Data created successfully.",
    DATA_UPDATED: "Data updated successfully.",
    DATA_DELETED: "Data deleted successfully.",
  },

  // Status codes
  STATUS_CODE: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  },

  // Pagination defaults
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
    INVALID_PAGE_NUMBER: "Invalid page number. Max page number is ",
  },

  // Database connection
  DATABASE_CONNECTION: {
    SUCCESS: "Database connection established successfully.",
    ERROR: "Unable to connect to the database.",
  },

  // Objects for the database
  DATABASE_TABLES: {
    EXPENSE: "EXPENSE ",
    USER: "USER ",
    CATEGORY: "CATEGORY ",
  },

  // Response for database table creation
  DATABASE_TABLE_CREATION: {
    SUCCESS: "Table created successfully.",
  },

  // Server connection
  SERVER: {
    CONNECTION_SUCCESS: "Server is running on port",
    CONNECTION_ERROR: "Unable to run the server.",
  },

  // Environment variables
  ENVIRONMENT: {
    DEVELOPMENT: "development",
    PRODUCTION: "production",
  },

  // Token
  TOKEN: {
    INVALID: "Invalid token. Please login again",
    UNAUTHORIZED: "Unauthorized request. Please login again",
    REQUEST_GRANTED: "Token is valid. Please proceed with the request",
    ROLE_NOT_AUTHORIZED: "You are not authorized to access this resource. Only Admins can access this resource.",
    TOKEN_EXPIRED: "Token has expired. Please login again.",
  },

  // Validation
  VALIDATION: {
    PRICE_NOT_A_NUMBER: "Price should be a number.",
    KEY_NOT_PROVIDED: "Request is invalid.",
    PRICE_INVALID: "Price should be greater than 0.",
    PAYLOAD_EMPTY: "Payload is empty.",
    EMAIL_INVALID: "Email is invalid.",
    CONTACT_NUMBER_INVALID: "Contact number is invalid.",
    PAYMENT_MODE_INVALID: "Please provide a valid payment mode.",
  },

  // Category
  CATEGORY: {
    NO_CATEGORY_FOUND: "No category found",
    CATEGORY_RETRIEVED: "Category retrieved successfully",
    CATEGORY_CREATED: "Category created successfully",
    CATEGORY_UPDATED: "Category updated successfully",
    CATEGORY_DELETED: "Category deleted successfully",
    CATEGORY_ALREADY_EXIST: "Category already exists. Please try again.",
    INVALID_STATUS: "Invalid status provided.",
    NO_CHANGES: "No changes made to the category.",
  },

  CATEGORY_STATUS: {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
  },

  // Expense
  EXPENSE: {
    NO_EXPENSE_FOUND: "No expense found",
    EXPENSE_FOUND: "Expense found",
    EXPENSE_RETRIEVED: "Expense retrieved successfully",
    EXPENSE_CREATED: "Expense created successfully",
    EXPENSE_UPDATED: "Expense updated successfully",
    EXPENSE_DELETED: "Expense deleted successfully",
  },

  // User
  USER: {
    USER_EXISTS: "User already exists. Please try again.",
    USERNAME_EXISTS: "Username already exists. Please try again.",
    NO_USER_FOUND: "No user found",
    USER_FOUND: "User found",
    USER_RETRIEVED: "User retrieved successfully",
    USER_CREATED: "User created successfully",
    USER_UPDATED: "User updated successfully",
    USER_DELETED: "User deleted successfully",
    USER_AND_SEND_EMAIL_RESPONSE: "User created successfully. Account verification email sent.",
    ERROR_CREATING_USER_SEND_EMAIL: "Error in creating user and sending email.",
    INVALID_CREDENTIALS: "Invalid credentials. Please try again.",
    INVALID_ACCOUNT_VERIFICATION_TOKEN: "Invalid account verification token.",
    VALID_ACCOUNT_VERIFICATION_TOKEN: "Account verification token is valid. Please proceed.",
    ACCOUNTVERIFICATION_EXPIRED: "Account verification token has expired. New token has been sent to your email.",
    ACCOUNT_NOT_VERIFIED: "Account is not verified. Please verify your account.",
    ACCOUNT_VERIFIED: "Account verified successfully.",
    ALREADY_VERIFIED: "User is already verified. No need for further verification.",
    LOGIN_SUCCESS: "User logged in successfully.",
    FORGOT_PASSWORD_EMAIL_SENT: "Forgot password email sent successfully.",
    PASSWORD_REQUIRED: "Password is required.",
    PASSWORD_RESET_SUCCESS: "Password reset successfully.",
    PASSWORD_MISMATCH: "Password does not match.",
    INVALID_RESET_PASSWORD_TOKEN: "Invalid reset password token.",
    RESET_PASSWORD_EXPIRED: "Reset password token has expired. Please request a new one.",
    PASSWORD_SAME: "New password cannot be the same as the old password.",
    NO_UPDATE_MADE: "No update made to the user.",
    PROFILE_UPDATED: "Profile updated successfully.",
    UNAUTHORIZED_TO_UPDATE: "Unauthorized to update the user.",
  },

  USER_ATTRIBUTES: ["id", "firstName", "lastName", "email", "username", "role", "isVerified", "createdAt", "updatedAt"],

  USER_ROLE: {
    SUPERADMIN: "Super Admin",
    ADMIN: "Admin",
    USER: "User",
  },

  // paid via
  PAID_VIA: {
    CASH: "Cash",
    DEBIT_CARD: "Debit Card",
    CREDIT_CARD: "Credit Card",
    ONLINE_BANKING: "Online Banking",
  },

  EMAIL_RESPONSE: {
    SUCCESS: "Email sent successfully.",
    ERROR: "Unsuccessful in sending email.",
  },

  EMAIL_SUBJECT: {
    SUBJECT_ACCOUNT_VERIFICATION: "Expense Tracker - Account Verification",
    SUBJECT_RESEND_TOKEN_VERIFICATION: "Expense Tracker - Request new token Verification",
    SUBJECT_FORGOT_PASSWORD: "Expense Tracker - Account Forgot Password",
  },

  EMAIL_TYPE: {
    ACCOUNT_VERIFICATION: "Account Verification",
    FORGOT_PASSWORD: "Forgot Password",
    RESEND_TOKEN_VERIFICATION: "Request New Token Verification",
  },
};

module.exports = commonConstants;
