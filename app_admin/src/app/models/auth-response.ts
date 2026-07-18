export class AuthResponse {
  message?: string;
  token?: string;
  user?: {
    id?: string;
    username?:string;
    email?: string;
  };
}
