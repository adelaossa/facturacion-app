export interface IAuthLogin {
  email: string;
  password: string;
}

export interface IAuthRegister {
  nombre: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    nombre: string;
    rol: string;
  };
}

export interface ICreateCliente {
  nombre: string;
  rfc: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export interface IUpdateCliente {
  nombre?: string;
  rfc?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export interface IClienteResponse {
  id: string;
  nombre: string;
  rfc: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProducto {
  nombre: string;
  descripcion?: string;
  precio: number;
  unidad?: string;
  stock?: number;
  activo?: boolean;
}

export interface IUpdateProducto {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  unidad?: string;
  stock?: number;
  activo?: boolean;
}

export interface IProductoResponse {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  unidad?: string;
  stock: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILineaFactura {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface ICreateFactura {
  clienteId: string;
  fecha?: string;
  lineas: ILineaFactura[];
  observaciones?: string;
}

export interface IUpdateFactura {
  clienteId?: string;
  fecha?: string;
  observaciones?: string;
  estado?: string;
}

export interface IFacturaResponse {
  id: string;
  numero: string;
  clienteId: string;
  fecha: Date;
  subtotal: number;
  iva: number;
  total: number;
  estado: string;
  observaciones?: string;
  lineas: any[];
  createdAt: Date;
  updatedAt: Date;
}