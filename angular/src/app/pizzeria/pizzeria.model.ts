export interface IPizzaDetalle {
  id?: number;
  tamano: string;
  ingredientes: string;
  numPizzas: number;
  subtotal: number;
}

export interface IPedido {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  fecha: string;
  total: number;
  detalles?: IPizzaDetalle[];
}
