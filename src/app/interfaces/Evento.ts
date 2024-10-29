import { Time } from "@angular/common"
import { Grupo } from "./Grupo"
import { Establecimiento } from "./Establecimiento"

export interface Evento{
    id:number,
    fechaContratacion:Date,
    fechaEvento:Date,
    horaEvento: Time,
    precio:number,
    ventas:number,
    estado:String,
    nombreGrupo:Grupo,
    nombreEstablecimiento:Establecimiento
    entradas:any
}