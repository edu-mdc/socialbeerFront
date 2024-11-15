import { Component, ChangeDetectionStrategy, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { GrupoService } from '../../services/grupo.service';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { EventoService } from '../../services/evento.service';
import Swal from 'sweetalert2';
import { Evento } from '../../interfaces/Evento';

@Component({
  selector: 'app-modificar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatIconModule],
  templateUrl: './modificar.component.html',
  styleUrl: './modificar.component.css'
})
export class ModificarComponent implements OnInit{
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
 
  evento: Evento | null = null;
  rol: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModificarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventoId: number | null, rol: string | null },private grupoService: GrupoService, private establecimientoService: EstablecimientoService, private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    this.rol = this.data.rol;
    console.log('Rol recibido:', this.rol);
    this.eventoService.getEventoById(Number(this.data.eventoId)).subscribe({
      next: (response) => {
        this.evento=response;
       
      },
      error: (error) => console.error('Error al obtener los grupos', error)
    });
  }
  onCancel(): void {
    this.dialogRef.close(); // Cierra el diálogo sin enviar datos
  }

  onPay(): void {
    if (this.selectedDate && this.selectedTime) {

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reinicia la hora a medianoche para comparar solo fechas
      const selectedDate = this.selectedDate;
      selectedDate.setHours(0, 0, 0, 0); // Reinicia la hora para comparar solo fechas

      if (selectedDate < today) {
        Swal.fire({
          icon: "error",
          title: "Fecha inválida",
          text: "No puedes seleccionar una fecha anterior a la actual.",
        });
        return;
      }
      const fechaEventoFormatted = this.convertDateToString(this.selectedDate); // Convierte a 'dd-MM-yyyy'
      const [hora, minutos] = this.selectedTime.split(':'); // Desglosa la hora
  
      const eventoData = {
        id: 0,
        fechaContratacion: this.evento?.fechaContratacion || '', // Convierte a 'dd-MM-yyyy'
        fechaEvento: fechaEventoFormatted,
        horaEvento: `${hora}:${minutos}`, // Formato 'HH:mm'
        estado: 'disponible',
        nombreGrupo: this.evento?.nombreGrupo || '',
        nombreEstablecimiento: this.evento?.nombreEstablecimiento || '',
      };
  
      this.eventoService.updateEvento(Number(this.evento?.id), eventoData).subscribe({
        next: (response) => {
          Swal.fire({
            title: "Genial!",
            text: "Evento modificado a disfrutar.!!",
            imageUrl: "../../../assets/imagenes/2547.jpg",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image"
          });
          console.log('Evento creado:', response);
        },
        error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Lo siento, ya hay un evento para este dia",   
        });
        console.error('Error al crear el evento:', error)
      }
      });
  
      this.dialogRef.close({ eventoModificado: true });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No has introducido el dia o la hora",
        
      });
      //alert('Por favor selecciona una fecha y hora antes de proceder con el pago');
    }
  }

  // Función para convertir una cadena 'dd-MM-yyyy' en un objeto Date
  convertStringToDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Función para convertir un objeto Date en una cadena 'dd-MM-yyyy'
  convertDateToString(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  eliminar() {
    Swal.fire({
      title: "¿Seguro que quieres eliminar el evento?",
      text: "No habrá vuelta atrás",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventoService.eliminarEvento(Number(this.evento?.id)).subscribe({
          next: (response) => {
            Swal.fire({
              title: "Deleted!",
              text: "El evento ha sido eliminado.",
              icon: "success"
            });
            // Actualizar la lista de eventos después de eliminar
            this.dialogRef.close({ eventoModificado: true });
          },
          error: (error) => {
            console.error('Error al eliminar el evento', error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error al eliminar el evento",
            });
          }
        });
      }
    });
  }
  
  
}
