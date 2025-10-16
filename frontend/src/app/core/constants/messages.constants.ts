export const MESSAGES = {
  // Success messages
  SUCCESS: {
    LOGIN: 'Login successful',
    LOGOUT: 'Logout successful',
    REGISTER: 'Registration successful',
    PASSWORD_RESET: 'Password reset email sent',
    PASSWORD_CHANGED: 'Password changed successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    SUPPLIER_ADDED: 'Supplier added successfully',
    SUPPLIER_UPDATED: 'Supplier updated successfully',
    SUPPLIER_DELETED: 'Supplier deleted successfully',
    INQUIRY_SENT: 'Inquiry sent successfully',
    FAVORITE_ADDED: 'Added to favorites',
    FAVORITE_REMOVED: 'Removed from favorites',
    RATING_SUBMITTED: 'Rating submitted successfully',
    REPORT_SUBMITTED: 'Report submitted successfully'
  },

  // Error messages
  ERROR: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTER_FAILED: 'Registration failed. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SUPPLIER_NOT_FOUND: 'Supplier not found.',
    PRODUCT_NOT_FOUND: 'Product not found.',
    ORDER_NOT_FOUND: 'Order not found.',
    INVENTORY_NOT_FOUND: 'Inventory not found.',
    ANALYSIS_FAILED: 'Analysis failed. Please try again.',
    INQUIRY_FAILED: 'Failed to send inquiry. Please try again.',
    FAVORITE_FAILED: 'Failed to update favorites. Please try again.',
    RATING_FAILED: 'Failed to submit rating. Please try again.',
    REPORT_FAILED: 'Failed to submit report. Please try again.'
  },

  // Info messages
  INFO: {
    LOADING: 'Loading...',
    NO_DATA: 'No data available',
    NO_RESULTS: 'No results found',
    TRY_AGAIN: 'Please try again',
    CONTACT_SUPPORT: 'Please contact support if the problem persists',
    INQUIRY_ALREADY_SENT: 'Inquiry already sent to this supplier',
    FILTERS_APPLIED: 'Filters applied',
    FILTERS_CLEARED: 'Filters cleared',
    SEARCH_UPDATED: 'Search updated',
    SORT_UPDATED: 'Sort updated',
    PAGE_CHANGED: 'Page changed'
  },

  // Warning messages
  WARNING: {
    UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
    DELETE_CONFIRMATION: 'Are you sure you want to delete this item?',
    LOGOUT_CONFIRMATION: 'Are you sure you want to logout?',
    RESET_CONFIRMATION: 'Are you sure you want to reset all filters?',
    CLEAR_CART_CONFIRMATION: 'Are you sure you want to clear your cart?',
    REMOVE_ITEM_CONFIRMATION: 'Are you sure you want to remove this item?'
  },

  // Validation messages
  VALIDATION: {
    REQUIRED: 'This field is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
    PASSWORD_MISMATCH: 'Passwords do not match',
    NAME_TOO_LONG: 'Name must be less than 100 characters',
    DESCRIPTION_TOO_LONG: 'Description must be less than 1000 characters',
    PHONE_INVALID: 'Please enter a valid phone number',
    URL_INVALID: 'Please enter a valid URL',
    DATE_INVALID: 'Please enter a valid date',
    NUMBER_INVALID: 'Please enter a valid number',
    MIN_VALUE: 'Value must be greater than or equal to {min}',
    MAX_VALUE: 'Value must be less than or equal to {max}',
    MIN_LENGTH: 'Must be at least {min} characters long',
    MAX_LENGTH: 'Must be no more than {max} characters long'
  },

  // Placeholder text
  PLACEHOLDERS: {
    SEARCH: 'Search...',
    EMAIL: 'Enter your email',
    PASSWORD: 'Enter your password',
    NAME: 'Enter your name',
    PHONE: 'Enter your phone number',
    ADDRESS: 'Enter your address',
    DESCRIPTION: 'Enter description',
    NOTES: 'Enter notes',
    COMMENTS: 'Enter comments',
    SELECT_OPTION: 'Select an option',
    SELECT_DATE: 'Select date',
    SELECT_TIME: 'Select time',
    UPLOAD_FILE: 'Upload file',
    DRAG_DROP: 'Drag and drop files here'
  },

  // Button text
  BUTTONS: {
    SAVE: 'Save',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    EDIT: 'Edit',
    VIEW: 'View',
    ADD: 'Add',
    REMOVE: 'Remove',
    CLEAR: 'Clear',
    RESET: 'Reset',
    SUBMIT: 'Submit',
    SEND: 'Send',
    CONFIRM: 'Confirm',
    BACK: 'Back',
    NEXT: 'Next',
    PREVIOUS: 'Previous',
    CLOSE: 'Close',
    OPEN: 'Open',
    EXPAND: 'Expand',
    COLLAPSE: 'Collapse',
    REFRESH: 'Refresh',
    SEARCH: 'Search',
    FILTER: 'Filter',
    SORT: 'Sort',
    EXPORT: 'Export',
    IMPORT: 'Import',
    UPLOAD: 'Upload',
    DOWNLOAD: 'Download',
    PRINT: 'Print',
    SHARE: 'Share',
    COPY: 'Copy',
    PASTE: 'Paste',
    CUT: 'Cut',
    UNDO: 'Undo',
    REDO: 'Redo'
  }
};
