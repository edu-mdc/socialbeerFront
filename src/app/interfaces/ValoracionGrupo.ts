export interface ValoracionDeGrupoDTO {
    id?: number;
    comentario: string;
    fechaValoracion: string;
    puntuacion: number;
    cliente: {
      id: number;
    };
    grupo: {
      id: number;
    };
  }
  