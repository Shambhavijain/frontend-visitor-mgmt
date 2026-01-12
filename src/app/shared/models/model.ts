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
  username: string;
  email: string;
  password: string;
  address: string;

}
export interface RespGatekeeper {
  id: string;     
  name: string;   
  email: string;
  address: string;
}
export interface GatekeeperApiModel {
  userid: string;
  username: string;
  role: string;
  email: string;
  address: string;
  flat_no: string;
  tower: string;
}

export interface GatekeeperApiResponse {
  gatekeepers: GatekeeperApiModel[];
  message: string;
}


export interface requestUser {
  Name: string;
  Email: string;
  Password: string;
  Address: string;
  FlatNo: string;
  Tower: string;
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
  Owner: number,
  Gatekeeper:number;
}