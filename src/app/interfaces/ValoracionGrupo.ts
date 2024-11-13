import { Cliente } from "./Cliente";
import { Grupo } from "./Grupo";

export interface ValoracionDeGrupoDTO {
    id?: number;
    comentario: string;
    fechaValoracion: string;
    puntuacion: number;
    cliente?:Cliente;
    grupo?:Grupo; 
  }
  