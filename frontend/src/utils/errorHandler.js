export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';
  
  if (error.response) {
    const status = error.response.status;
    const backendMessage = error.response.data?.message;

    // If backend returns a specific validation or business logic message, prefer it
    if (backendMessage) {
      return backendMessage;
    }

    switch (status) {
      case 400:
        return 'Please check the information entered.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return 'The requested item was not found.';
      case 409:
        return 'This information already exists.';
      case 500:
        return 'Something went wrong on the server.';
      default:
        return `Error: ${status}. Something went wrong.`;
    }
  } else if (error.request) {
    return 'Unable to connect to DentalStock server.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
};
