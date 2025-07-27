import type { IClientResponse } from "./client.interface";

export interface ISale {
  id?: number;
  cliente_id: number;
  monto_total: number;
  nombre_compra: string;
  fecha_compra: string;
  pagado: boolean;
  client?: IClientResponse;
}

export interface ISaleResponse extends ISale {
  id: number;
  client: IClientResponse;
  monto_total: number;
  cliente_id: number;
}

export interface IUpdateCompra {
  cliente_id?: number;
  monto_total?: number;
  nombre_compra?: string;
  fecha_compra?: string;
  pagado?: boolean;
  client?: IClientResponse;
}
