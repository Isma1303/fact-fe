export interface IClient {
  id?: number;
  nombre: string;
  telefono: string;
  creado_en?: string;
}

export interface IClientResponse extends IClient {
  id: number;
  creado_en: string;
}

export interface IUpdateClient {
  nombre?: string;
  telefono?: string;
}
