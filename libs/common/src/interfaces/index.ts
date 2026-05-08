export interface IAuthService {
  login(data: { email: string; password: string });
  register(data: { nombre: string; email: string; password: string });
  validateToken(token: string);
}

export interface IClientesService {
  findAll();
  findOne(id: string);
  create(data: any);
  update(id: string, data: any);
  remove(id: string);
}

export interface IProductosService {
  findAll();
  findOne(id: string);
  create(data: any);
  update(id: string, data: any);
  remove(id: string);
}

export interface IFacturasService {
  findAll();
  findOne(id: string);
  create(data: any);
  update(id: string, data: any);
  remove(id: string);
}

export const AUTH_SERVICE = 'AUTH_SERVICE';
export const CLIENTES_SERVICE = 'CLIENTES_SERVICE';
export const PRODUCTOS_SERVICE = 'PRODUCTOS_SERVICE';
export const FACTURAS_SERVICE = 'FACTURAS_SERVICE';