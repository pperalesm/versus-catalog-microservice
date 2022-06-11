export class AuthUser {
  username?: string;
  role?: string;
  active?: boolean;

  constructor({
    username,
    role,
    active,
  }: {
    username?: string;
    role?: string;
    active?: boolean;
  }) {
    this.username = username;
    this.role = role;
    this.active = active;
  }
}
