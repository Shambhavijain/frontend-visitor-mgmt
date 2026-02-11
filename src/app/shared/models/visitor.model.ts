import { VisitorStatus } from "../enum/enum";

export interface CreateVisitorRequest {
    name: string;
    email: string;
    tower: string;
    flat_no: string;
}

export interface Visitor {
    id: string;
    name: string;
    email: string;
    tower: string;
    flat_no: string;
    status: VisitorStatus;
    created_at?: string;   
}

export interface UpdateVisitorRequest {
    visitor_id: string;
    status: VisitorStatus;
}

export interface VisitorCount {
    count: number;
}