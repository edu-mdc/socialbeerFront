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
import { palabrasProhibidas } from '../../settings/palabrasProhibidas';
import { ValoracionDeGrupoDTO } from '../../interfaces/ValoracionGrupo';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { Subject } from 'rxjs';

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
  grupoId: number = 0;
  establecimientos: Establecimiento[] = [];
  currentDate: Date = new Date();
  clienteId: number = 0;
  userId: string | null = null;
  cliente:Cliente |null = null;

  valoraciones: ValoracionDeGrupoDTO[] = [];
  puntuacionMedia: number = 0;

  comentario = '';
  puntuacion: number = 0;
  estrellas: number[] = [1, 2, 3, 4, 5];

  palabrasProhibidas: string[] = [];
  updateSubject: Subject<void> = new Subject<void>(); // Define el Subject

  private clienteService = inject(ClienteService);
  private valoracionService = inject(ValoracionDeGrupoService);
  private eventoService = inject(EventoService);
  private grupoService = inject(GrupoService);
  private route = inject(ActivatedRoute);
  private establecimientoService = inject(EstablecimientoService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.palabrasProhibidas = palabrasProhibidas;
    this.grupoId = +this.route.snapshot.paramMap.get('id')!;
    this.userId = localStorage.getItem("userId");

    // Suscribe a updateSubject para actualizar datos
    this.updateSubject.subscribe(() => {
      this.cargarDatosIniciales();
    });

    this.updateSubject.next(); // Llama la primera carga
  }

  // Método separado para cargar datos iniciales
  private cargarDatosIniciales(): void {
    this.obtenerEventos();
    this.obtenerGrupo();
    this.obtenerCliente();
    this.obtenerEstablecimientos();
    this.obtenerValoraciones();
  }

  private obtenerEventos(): void {
    this.eventoService.getEventosPorGrupo(this.grupoId).subscribe({
      next: (eventos) => { this.eventos = eventos; },
      error: (error) => { console.error('Error al obtener los eventos del grupo:', error); }
    });
  }

  private obtenerGrupo(): void {
    this.grupoService.getGrupoById(Number(this.userId)).subscribe({
      next: (grupo) => { this.grupo = grupo; },
      error: (error) => { console.error('Error al obtener los detalles del grupo:', error); }
    });
  }

  private obtenerCliente(): void {
    this.clienteService.getClienteByUserId(Number(localStorage.getItem("userId"))).subscribe({
      next: (cliente) => { 
        this.clienteId = cliente.id;
        this.cliente = cliente;
       }
    });
  }

  private obtenerEstablecimientos(): void {
    this.establecimientoService.getEstablecimientos().subscribe({
      next: (response) => { this.establecimientos = response.contenido || []; },
      error: (error) => { console.error('Error al obtener los establecimientos', error); }
    });
  }

  private obtenerValoraciones(): void {
    this.valoracionService.listarValoracionesDeGrupoPorGrupoId(this.grupoId).subscribe({
      next: (valoraciones) => {
        this.valoraciones = valoraciones.sort((a, b) => {
          const [diaA, mesA, anioA] = a.fechaValoracion.split('-').map(Number);
          const [diaB, mesB, anioB] = b.fechaValoracion.split('-').map(Number);
  
          // Crear objetos Date con el año, mes y día
          const fechaA = new Date(anioA, mesA - 1, diaA); // Meses van de 0 a 11
          const fechaB = new Date(anioB, mesB - 1, diaB);
  
          return fechaB.getTime() - fechaA.getTime(); // Orden descendente
        });
        console.log(this.valoraciones);
        this.calcularPuntuacionMedia()
      },
      error: (error) => { console.error('Error al obtener las valoraciones del grupo:', error); }
    });
  }

  private calcularPuntuacionMedia(): void {
    if (this.valoraciones.length > 0) {
      const sumaPuntuaciones = this.valoraciones.reduce((sum, valoracion) => sum + valoracion.puntuacion, 0);
      this.puntuacionMedia = parseFloat((sumaPuntuaciones / this.valoraciones.length).toFixed(1)); // Redondea a un decimal
    } else {
      this.puntuacionMedia = 0; // Si no hay valoraciones, la puntuación media es 0
    }
  }

  enviarValoracion(): void {
    if (this.comentarioContienePalabrasProhibidas()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No puedes utilizar ese vocabulario para dejar una valoración",
      });
      return;
    }

    if (!this.clienteId || !this.grupoId || !this.cliente || !this.grupo) {
      console.error('Error: Cliente o Grupo no están disponibles');
      return;
    }

    const hoy = new Date();
    const fechaHoy = `${hoy.getDate().toString().padStart(2, '0')}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getFullYear()}`;
  
    const yaHaDejadoValoracionHoy = this.valoraciones.some(valoracion => {
      return (
        valoracion.cliente?.id === this.clienteId &&
        valoracion.fechaValoracion === fechaHoy
      );
    });
  
    if (yaHaDejadoValoracionHoy) {
      Swal.fire({
        icon: "warning",
        title: "Valoración ya enviada",
        text: "Solo puedes dejar una valoración por día.",
      });
      this.comentario = "";
      this.puntuacion = 0;
      return;
    }

    const fechaValoracion = this.formatDate(new Date());
    const valoracion = {
      comentario: this.comentario,
      fechaValoracion: fechaValoracion,
      puntuacion: this.puntuacion,
      cliente:this.cliente,
      grupo: this.grupo
    };
console.log(this.cliente)
    this.valoracionService.guardarValoracionDeGrupo(this.grupoId, this.clienteId, valoracion).subscribe({
      next: (response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Valoración enviada",
          showConfirmButton: false,
          timer: 1500
        });

        // Añade la nueva valoración y actualiza la lista
        this.valoraciones.push(response);
       
        this.calcularPuntuacionMedia();
        this.comentario = "";
        this.puntuacion = 0;

        // Emite el evento para actualizar los datos
        this.updateSubject.next();
      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se ha podido dejar la valoración!",
          footer: '<a href="#">Why do I have this issue?</a>'
        });
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

  private comentarioContienePalabrasProhibidas(): boolean {
    return this.palabrasProhibidas.some(palabra =>
      this.comentario.toLowerCase().includes(palabra.toLowerCase())
    );
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

  cerrarFicha() { /* Cierra la ficha */ }
}
