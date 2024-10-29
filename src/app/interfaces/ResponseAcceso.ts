export interface ResponseAcceso {
    tokenDeAcceso: string;
    tipoDeToken: string;
    isSuccess: boolean;
    rol: string;
    userId:number;
    nombreUsuario:string;
}