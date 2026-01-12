import { UserRole } from "../enum/enum";


export interface UserCreate {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  address: string;
  flat_no: string;
  tower: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  address: string;
  flat_no: string;
  tower: string;
}
export interface UserCount {
  Owner: number;
  Gatekeeper: number;
}

