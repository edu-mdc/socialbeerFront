import { Component, OnInit, inject  } from '@angular/core';
import { ClienteComponent } from "../cliente/cliente.component";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Evento } from '../../interfaces/Evento';
import { Grupo } from '../../interfaces/Grupo';
import { EventoService } from '../../services/evento.service';
import { GrupoService } from '../../services/grupo.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Establecimiento } from '../../interfaces/Establecimiento';
import { EstablecimientoService } from '../../services/establecimiento.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ValoracionDeGrupoService } from '../../services/valoracion-de-grupo.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/Cliente';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-ficha-grupo',
  standalone: true,
  imports: [ClienteComponent, MatButtonModule, MatCardModule, MatIconModule, MatFormFieldModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './ficha-grupo.component.html',
  styleUrl: './ficha-grupo.component.css'
})
export class FichaGrupoComponent implements OnInit{
  spinner: boolean = false;
  eventos: Evento[] = [];
  grupo: Grupo | null = null;
  grupoId: number = 0; // Guardaremos el id del grupo
  establecimientos: Establecimiento[]= [];
  currentDate: Date = new Date(); // Fecha actual
  clienteId:number = 0;
  userId: string | null = null;

  comentario  = '';
  puntuacion: number = 0;
  estrellas: number[] = [1, 2, 3, 4, 5];

  private clienteService = inject(ClienteService);
  private valoracionService = inject(ValoracionDeGrupoService); 
  private eventoService = inject(EventoService); // Inyectamos el servicio de eventos
  private grupoService = inject(GrupoService);
  private route = inject(ActivatedRoute); // Inyectamos ActivatedRoute para obtener el grupoId
  private establecimientoService = inject(EstablecimientoService); // Inyectamos el servicio de eventos

  constructor(private router: Router){};

  ngOnInit(): void {
    // Obtener el grupoId de la URL
    this.grupoId = +this.route.snapshot.paramMap.get('id')!; // Extraemos el id de la URL
console.log("grupoId", this.grupoId)
    this.userId= localStorage.getItem("userId");
    console.log("userId", this.userId)
    // Llamamos al servicio para obtener los eventos del grupo
    this.eventoService.getEventosPorGrupo(this.grupoId).subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
      },
      error: (error) => {
        console.error('Error al obtener los eventos del grupo:', error);
      }
    });

    this.grupoService.getGrupoByUserId(Number(this.userId)).subscribe({
      next: (grupo: Grupo) => {
        this.grupo = grupo;
      },
      error: (error) => {
        console.error('Error al obtener los detalles del grupo:', error);
      }
    });

    this.clienteService.getClienteByUserId(Number(localStorage.getItem("userId"))).subscribe({
      next:(cliente: Cliente) =>{
        this.clienteId = cliente.id;
      }
    })

    this.establecimientoService.getEstablecimientos().subscribe({
      next: (response: any) => {
        this.establecimientos = response.contenido || []; // Asegúrate de obtener el array de contenido
        
      },
      error: (error) => {
        console.error('Error al obtener los establecimientos', error);
      }
    });
  }

  seleccionarPuntuacion(valor: number): void {
    this.puntuacion = valor;
    // Selecciona todas las estrellas y aplica o quita la clase 'selected'
    const estrellas = document.querySelectorAll('.star');
    estrellas.forEach((estrella, index) => {
      if (index < valor) {
        estrella.classList.add('selected');
      } else {
        estrella.classList.remove('selected');
      }
    });
  }

  obtenerDireccion(nombreEstablecimiento: string): string {
   
    const establecimiento = this.establecimientos.find(e => {
    
      return e.establecimiento === nombreEstablecimiento;
    });
    return establecimiento ? establecimiento.direccion : 'Dirección no disponible';
  }

  obtenerEstablecimientoId(nombreEstablecimiento: string): number | null {
    const establecimiento = this.establecimientos.find(e => e.establecimiento === nombreEstablecimiento);
    return Number(establecimiento?.id)
  }

  convertirFecha(fecha: string): Date {
    const [dia, mes, anio] = fecha.split('-').map(Number);
    return new Date(anio, mes - 1, dia); // Meses en JavaScript van de 0 a 11
  }

  esFechaFutura(fechaEvento: string): boolean {
    const fechaEventoDate = this.convertirFecha(fechaEvento);
    return fechaEventoDate >= this.currentDate;
  }

  verEstablecimiento(establecimientoId: number | null , event: Event){
    event.stopPropagation();
    this.spinner = true;
    setTimeout(() => {
      this.router.navigate(['/fichaEstablecimiento', establecimientoId]).then(() => {
        this.spinner = false;
      });
    }, 1000);
  }

  enviarValoracion(): void {
    if (!this.clienteId || !this.grupoId) {
      console.error('Error: Cliente ID o Grupo ID no están disponibles');
      return;
    }
  
    const fechaValoracion = this.formatDate(new Date());
    const valoracion = {
      comentario: this.comentario,
      fechaValoracion: fechaValoracion,
      puntuacion: this.puntuacion,
      cliente: { id: this.clienteId }, // Usa un objeto anidado para cliente
      grupo: { id: this.grupoId }
    };
  
    this.valoracionService.guardarValoracionDeGrupo(this.grupoId, this.clienteId, valoracion).subscribe({
      next: (response) => {
        console.log('Valoración enviada con éxito:', response);
        // Aquí puedes mostrar un mensaje de éxito o realizar alguna acción adicional
        this.comentario ="";
      },
      error: (error) => {
        console.error('Error al enviar la valoración:', error);
      }
    });
  }
  

  private formatDate(date: Date): string {
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }
}
