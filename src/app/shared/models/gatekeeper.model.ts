import { UserRole } from "../enum/enum";

export interface GatekeeperCreate {
    username: string;
    email: string;
    password: string;
    address: string;
}

export interface Gatekeeper {
    id: string;
    username: string;
    email: string;
    address: string;
    role: UserRole.GATEKEEPER;
}
