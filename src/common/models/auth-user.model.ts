export class AuthUser {
  id?: string;
  username?: string;
  role?: string;
  active?: boolean;

  constructor({
    id,
    username,
    role,
    active,
  }: {
    id?: string;
    username?: string;
    role?: string;
    active?: boolean;
  }) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.active = active;
  }
}
