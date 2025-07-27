import type { IClientResponse } from "./client.interface";
import type { ISaleResponse } from "./sales.interface";

export interface IAbono {
  compra_id: ISaleResponse | number;
  monto_abono: number;
  fecha_abono: string;
  cliente?: IClientResponse;
  description?: string;
}

export interface IAbonoResponse extends IAbono {
  id: number;
  cliente_id: number;
}

export interface IUpdateAbono {
  compra_id?: ISaleResponse | number;
  monto_abono?: number;
  fecha_abono?: string;
  cliente?: IClientResponse;
  description?: string;
}
