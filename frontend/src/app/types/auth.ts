export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSessionResponse {
  success: true;
  accessToken: string;
  user: AuthUser;
}

export interface AuthUserResponse {
  success: true;
  user: AuthUser;
}

export interface AuthSuccessResponse {
  success: true;
}
