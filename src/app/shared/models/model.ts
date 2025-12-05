export interface user {
  id: string;  
  name: string;
  email: string
  role: string;
  address: string;
  flat_no: string;
  tower: string
}

export interface gatekeeper {
  name: string;
  email: string;
  password: string;
  address: string;

}

export interface requestUser {
  name: string;
  email: string;
  password: string;
  address: string;
  flat_no: string;
  tower: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
export interface visitor {
  id: string;
  name: string,
  email: string,
  tower: string,
  flat_no: string,
  status: string,
  created_at?: string;

}
export type usercount= {
  owner: number,
  gatekeeper:number;
}