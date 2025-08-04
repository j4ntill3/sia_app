export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type ApiError = {
  error: string;
};
