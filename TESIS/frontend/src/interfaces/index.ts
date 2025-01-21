export interface Pedido {
    ID_Pedido?: number;
    ID_Cliente: number;
    ID_Proveedor: number;
    Tipo_Pedido: string;
    Fecha_Pedido: string;
    Fecha_Entrega: string;
    Comentarios: string;
    Estado: string;
  }