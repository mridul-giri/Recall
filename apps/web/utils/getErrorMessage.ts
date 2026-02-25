import axios from "axios";

export const getErrorMessage = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data.message) {
      return error.response.data.message;
    }

    if (!error.response) {
      return "Network error. Please check your connection.";
    }

    return "Request Failed.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred.";
};
