import { Time } from "@angular/common"
import { Grupo } from "./Grupo"
import { Establecimiento } from "./Establecimiento"

export interface Evento{
    id:number,
    fechaContratacion:string,
    fechaEvento:string,
    horaEvento: string,
    estado:string,
    nombreGrupo:string,
    nombreEstablecimiento:string
  
}