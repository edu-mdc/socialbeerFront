import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { GrupoService } from '../../services/grupo.service';
import { Grupo } from '../../interfaces/Grupo';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { Establecimiento } from '../../interfaces/Establecimiento';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../interfaces/Evento';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ContratarComponent } from '../../dialog/contratar/contratar.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ModificarComponent } from '../../dialog/modificar/modificar.component';
import { Subject } from 'rxjs';
import { ValoracionDeEstablecimientoDTO } from '../../interfaces/ValoracionEstablecimiento';
import { ValoracionDeEstablecimientoService } from '../../services/valoracion-de-establecimiento.service';
import { ValoracionDeGrupoService } from '../../services/valoracion-de-grupo.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mostrar',
  standalone: true,
  imports: [CommonModule,MatProgressSpinnerModule,MatTabsModule, MatCardModule, MatButtonModule, MatPaginatorModule, MatIconModule,FormsModule ],
  templateUrl: './mostrar.component.html',
  styleUrl: './mostrar.component.css'
})
export class MostrarComponent implements OnInit {
  rol: string | null = null;
  spinner: boolean = false;
  userId:string | null = null;
  grupo: Grupo | null = null;
  
  establecimiento: Establecimiento | null = null;
  

  valoracionesEstablecimiento: ValoracionDeEstablecimientoDTO[] = [];
  puntuacionesMediasEstablecimientos: { [key: string]: number } = {};

  valoracionesGrupos: ValoracionDeEstablecimientoDTO[] = [];
  puntuacionesMediasGrupos: { [key: string]: number } = {};

  estrellas: number[] = [1, 2, 3, 4, 5];
  
  grupos: Grupo[] = [];
  totalItems: number = 0;
  pageSize: number = 6;
  currentPage: number = 0;

  
  establecimientos: Establecimiento[] = [];
  totalEstablecimientos: number = 0;
  pageSizeEstablecimientos: number = 6;
  currentPageEstablecimientos: number = 0;

  // Eventos para grupos
  eventosGrupo: Evento[]=[];
  eventosGrupoPaginados: Evento[] = [];
  totalEventosGrupo: number = 0;
  pageSizeEventosGrupo: number = 6;
  currentPageEventosGrupo: number = 0;

  // Eventos para establecimientos
  eventosEstablecimiento: Evento[]=[];
  eventosEstablecimientoPaginados: Evento[] = [];
  totalEventosEstablecimiento: number = 0;
  pageSizeEventosEstablecimiento: number = 6;
  currentPageEventosEstablecimiento: number = 0;

  eventos: Evento[] = [];
  totalEventos: number = 0;
  pageSizeEventos: number = 6;
  currentPageEventos: number = 0;

  updateSubject: Subject<void> = new Subject<void>();

  constructor(private dialog: MatDialog,private valoracionGrupoService:ValoracionDeGrupoService , private valoracionEstablecimientoService: ValoracionDeEstablecimientoService, private router: Router, private grupoService: GrupoService, private establecimientoService: EstablecimientoService, private eventoService: EventoService) {}

  ngOnInit(): void {
    this.updateSubject.subscribe(() => {
    this.obtenerGrupos();
    this.obtenerEstablecimientos();
    this.obtenerEventos();
    this.rol = localStorage.getItem('rol');  // Obtener eventos también
    this.userId = localStorage.getItem('userId');
    console.log('userId desde localStorage:', this.userId);
    this.obtenerGrupoLoginYSusEventos(Number(this.userId));
    this.obtenerEstablecimientoLoginYSusEventos(Number(this.userId));
    });
    this.updateSubject.next();
  }


  // Obtener Grupos
  obtenerGrupos(page: number = this.currentPage, size: number = this.pageSize): void {
    this.grupoService.getGrupos(page, size).subscribe({
      next: (response) => {
        console.log('Grupos:', response);
        this.grupos = response.contenido;
        this.totalItems = response.totalElementos;

        this.grupos.forEach(grupo => {
          this.obtenerValoracionesYCalcularMediaGrupo(grupo.id);
        });
      },
      error: (error) => console.error('Error al obtener los grupos', error)
    });
  }

  obtenerGrupoLoginYSusEventos(userId: number): void {
    if (!userId || isNaN(userId)) {
      console.error('userId no es válido:', userId);
      return;
    }
    console.log('Llamando a getGrupoByUserId con userId:', userId);
    this.grupoService.getGrupoByUserId(userId).subscribe({
      next: (grupo: Grupo) => {
        if (grupo && grupo.id) {
          this.grupo = grupo;
          console.log('Grupo recibido:', grupo);
          this.eventoService.getEventosPorGrupo(grupo.id).subscribe({
            next: (eventos: Evento[]) => {
              this.eventosGrupo = eventos;
              this.totalEventosGrupo = eventos.length;
              this.actualizarEventosGrupoPaginados();
              console.log('Eventos del grupo:', eventos);
            },
            error: (error) => {
              console.error('Error al obtener los eventos del grupo:', error);
            }
          });
        } else {
          console.error('Grupo no encontrado o el ID es inválido:', grupo);
        }
      },
      error: (error) => {
        console.error('Error al obtener los detalles del grupo:', error);
      }
    });
  }
  actualizarEventosGrupoPaginados(): void {
    const startIndex = this.currentPageEventosGrupo * this.pageSizeEventosGrupo;
    const endIndex = startIndex + this.pageSizeEventosGrupo;
    this.eventosGrupoPaginados = this.eventosGrupo.slice(startIndex, endIndex);
  }
  
  obtenerEstablecimientoLoginYSusEventos(userId: number): void {
    if (!userId || isNaN(userId)) {
      console.error('userId no es válido:', userId);
      return;
    }
  
    console.log('Llamando a getEstablecimientoByUserId con userId:', userId);
    this.establecimientoService.getEstablecimientoByUserId(userId).subscribe({
      next: (establecimiento: Establecimiento) => {
        if (establecimiento && establecimiento.id) {
          this.establecimiento = establecimiento;
          console.log('Establecimiento recibido:', establecimiento);
          this.eventoService.getEventosPorEstablecimiento(establecimiento.id).subscribe({
            next: (eventos: Evento[]) => {
              this.eventosEstablecimiento = eventos;
              this.totalEventosEstablecimiento = eventos.length;
              this.actualizarEventosEstablecimientoPaginados();
              console.log('Eventos del establecimiento:', eventos);
            },
            error: (error) => {
              console.error('Error al obtener los eventos del establecimiento:', error);
            }
          });
        } else {
          console.error('Establecimiento no encontrado o el ID es inválido:', establecimiento);
        }
      },
      error: (error) => {
        console.error('Error al obtener los detalles del establecimiento:', error);
      }
    });
  }
  
  actualizarEventosEstablecimientoPaginados(): void {
    const startIndex = this.currentPageEventosEstablecimiento * this.pageSizeEventosEstablecimiento;
    const endIndex = startIndex + this.pageSizeEventosEstablecimiento;
    this.eventosEstablecimientoPaginados = this.eventosEstablecimiento.slice(startIndex, endIndex);
  }

  // Obtener Establecimientos
  obtenerEstablecimientos(page: number = this.currentPageEstablecimientos, size: number = this.pageSizeEstablecimientos): void {
    this.establecimientoService.getEstablecimientos(page, size).subscribe({
      next: (response) => {
        console.log('Establecimientos:', response);
        this.establecimientos = response.contenido;
        this.totalEstablecimientos = response.totalElementos;

        this.establecimientos.forEach(establecimiento => {
          this.obtenerValoracionesYCalcularMediaEstablecimiento(establecimiento.id);
        });
      
      },
      error: (error) => console.error('Error al obtener los establecimientos', error)
    });
  }

  obtenerValoracionesYCalcularMediaEstablecimiento(establecimientoId: number): void {
    this.valoracionEstablecimientoService.listarValoracionesDeEstablecimientoPorEstablecimientoId(establecimientoId).subscribe({
      next: (valoraciones) => {
        if (valoraciones.length > 0) {
          const sumaPuntuaciones = valoraciones.reduce((sum, valoracion) => sum + valoracion.puntuacion, 0);
          this.puntuacionesMediasEstablecimientos[establecimientoId] = sumaPuntuaciones / valoraciones.length;
        } else {
          this.puntuacionesMediasEstablecimientos[establecimientoId] = 0;
        }
      },
      error: (error) => console.error('Error al obtener las valoraciones', error)
    });
  }

  obtenerValoracionesYCalcularMediaGrupo(grupoId: number): void {
    this.valoracionGrupoService.listarValoracionesDeGrupoPorGrupoId(grupoId).subscribe({
      next: (valoraciones) => {
        if (valoraciones.length > 0) {
          const sumaPuntuaciones = valoraciones.reduce((sum, valoracion) => sum + valoracion.puntuacion, 0);
          this.puntuacionesMediasGrupos[grupoId] = sumaPuntuaciones / valoraciones.length;
        } else {
          this.puntuacionesMediasGrupos[grupoId] = 0;
        }
      },
      error: (error) => console.error('Error al obtener las valoraciones', error)
    });
  }

  // Obtener Eventos
  obtenerEventos(page: number = this.currentPageEventos, size: number = this.pageSizeEventos): void {
    this.eventoService.getEventos(page, size).subscribe({
      next: (response) => {
        this.eventos = response.contenido;
        this.totalEventos = response.totalElementos;
      },
      error: (error) => console.error('Error al obtener los eventos', error)
    });
  }

  // Manejar la paginación para grupos
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.obtenerGrupos(this.currentPage, this.pageSize);
  }

  // Manejar la paginación para establecimientos
  onPageChangeEstablecimientos(event: PageEvent): void {
    this.currentPageEstablecimientos = event.pageIndex;
    this.pageSizeEstablecimientos = event.pageSize;
    this.obtenerEstablecimientos(this.currentPageEstablecimientos, this.pageSizeEstablecimientos);
  }

  // Manejar la paginación para eventos
  onPageChangeEventos(event: PageEvent): void {
    this.currentPageEventos = event.pageIndex;
    this.pageSizeEventos = event.pageSize;
    this.obtenerEventos(this.currentPageEventos, this.pageSizeEventos);
  }

  onPageChangeEventosGrupo(event: PageEvent): void {
    this.currentPageEventosGrupo = event.pageIndex;
    this.pageSizeEventosGrupo = event.pageSize;
    this.actualizarEventosGrupoPaginados();
  }

  onPageChangeEventosEstablecimiento(event: PageEvent): void {
    this.currentPageEventosEstablecimiento = event.pageIndex;
    this.pageSizeEventosEstablecimiento = event.pageSize;
    this.actualizarEventosEstablecimientoPaginados();
  }

  verGrupo(grupoId: number, event: Event):void{
    event.stopPropagation(); // Evitar que el evento de click siga hacia otros elementos
    this.spinner = true;
    setTimeout(() => {
      this.router.navigate(['/fichaGrupo', grupoId]).then(() => {
        this.spinner = false;
      });
    }, 1000); 
  }

  verEstablecimiento(establecimientoId: number, event: Event){
    event.stopPropagation();
    this.spinner = true;
    setTimeout(() => {
      this.router.navigate(['/fichaEstablecimiento', establecimientoId]).then(() => {
        this.spinner = false;
      });
    }, 1000);
  }

  obtenerGrupoPorNombre(nombre: string, event: Event) {
    event.stopPropagation();

  // Encontrar el grupo que coincida con el nombre proporcionado
  const grupoEncontrado = this.grupos.find(grupo => grupo.grupo === nombre);

  // Si encontramos el grupo, redirigimos
  if (grupoEncontrado) {
    this.spinner = true; // Mostrar el spinner
    setTimeout(() => {
      this.router.navigate(['/fichaGrupo', grupoEncontrado.id]).then(() => {
        this.spinner = false; // Ocultar el spinner después de la navegación
      });
    }, 1000);
  } else {
    console.error('No se encontró un grupo con el nombre proporcionado');
  }
  }

  obtenerEstablecimientoPorNombre(nombre: string, event: Event): void {
    // Detenemos la propagación del evento para evitar comportamientos no deseados
    event.stopPropagation();
  
    // Encontrar el establecimiento que coincida con el nombre proporcionado
    const establecimientoEncontrado = this.establecimientos.find(establecimiento => establecimiento.establecimiento === nombre);
  
    // Si encontramos el establecimiento, redirigimos
    if (establecimientoEncontrado) {
      this.spinner = true; // Mostrar el spinner
      setTimeout(() => {
        this.router.navigate(['/fichaEstablecimiento', establecimientoEncontrado.id]).then(() => {
          this.spinner = false; // Ocultar el spinner después de la navegación
        });
      }, 1000);
    } else {
      console.error('No se encontró un establecimiento con el nombre proporcionado');
    }
  }

  verEvento(eventoId: number, event: Event){
    event.stopPropagation();
    this.spinner = true;
    setTimeout(() => {
      this.router.navigate(['/fichaEvento', eventoId]).then(() => {
        this.spinner = false;
      });
    }, 1000);
  }

  openDialog(grupoId: number, grupo: string): void {
    const dialogRef = this.dialog.open(ContratarComponent, {
      width: '550px',
      height: '250px',
      data: { 
        userId: localStorage.getItem('userId'),
        grupoId: grupoId
       } // Puedes ajustar el tamaño según prefieras
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.eventoModificado) {
        // Realiza las actualizaciones necesarias
        this.updateSubject.next();
      }
    });
}

openDialog2(eventoId: number): void {
  const dialogRef = this.dialog.open(ModificarComponent, {
    width: '550px',
    height: '250px',
    data: {     
      eventoId:eventoId, 
      rol: this.rol
     } // Puedes ajustar el tamaño según prefieras
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.eventoModificado) {
      // Realiza las actualizaciones necesarias
      this.updateSubject.next();
    }
  });
}
}
