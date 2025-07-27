export interface Login {
  userName: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    userName: string;
  };
}
