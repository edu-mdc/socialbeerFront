import { Cliente } from "./Cliente";
import { Establecimiento } from "./Establecimiento";


export interface ValoracionDeEstablecimientoDTO {
    id?: number;
    comentario: string;
    fechaValoracion: string;
    puntuacion: number;
    cliente?:Cliente;
    establecimiento?:Establecimiento; 
  }
  