/* Defines the user entity */
export interface User {
  id?: string;
  email?: string;
  token?: string;
}

export interface UserGroups {
  id: string;
}

export interface UserGroup {
  id: number;
  name: string;
  children: UserGroup[];
}
