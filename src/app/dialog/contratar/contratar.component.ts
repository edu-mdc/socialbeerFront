import { Component, ChangeDetectionStrategy, OnInit, Inject } from '@angular/core';
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


@Component({
  selector: 'app-contratar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatIconModule],
  templateUrl: './contratar.component.html',
  styleUrl: './contratar.component.css'
})
export class ContratarComponent implements OnInit{
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  grupoId: any;
  userId:any;
  fechaContratacion: Date | null = null;
  fechaContratacionValida :any;
  establecimientoId: any;
  establecimiento:any;
  grupo:any;

  constructor(
    public dialogRef: MatDialogRef<ContratarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string | null; grupoId: number, grupo: string },private grupoService: GrupoService, private establecimientoService: EstablecimientoService, private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    
    this.grupoId=this.data.grupoId;
    this.userId = this.data.userId;
    this.grupo = this.data.grupo;
    this.fechaContratacion = new Date();
    this.fechaContratacionValida = this.convertDateToString(this.fechaContratacion);
    this.obtenerEstablecimiento(Number(this.data.userId));
    console.log('userId:', this.data.userId, 'grupoId:', this.data.grupoId );
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
        fechaContratacion: this.convertDateToString(this.fechaContratacion!), // Convierte a 'dd-MM-yyyy'
        fechaEvento: fechaEventoFormatted,
        horaEvento: `${hora}:${minutos}`, // Formato 'HH:mm'
        estado: 'disponible',
        nombreGrupo: this.grupo,
        nombreEstablecimiento: this.establecimiento,
      };
  
      this.eventoService.createEvento(this.establecimientoId, this.grupoId, eventoData).subscribe({
        next: (response) => {
          Swal.fire({
            title: "Genial!",
            text: "el grupo y tu teneis 2 dias para cancelar el evento",
            imageUrl: "../../../assets/imagenes/logo.png",
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

  obtenerEstablecimiento(userId: number){
    this.establecimientoService.getEstablecimientoByUserId(userId).subscribe({
      next: (response) => {
        this.establecimientoId = response.id
        this.establecimiento = response.establecimiento
        console.log('EstablecimientoId obtenido:', this.establecimientoId);
      },
      error: (error) => console.error('Error al obtener los grupos', error)
    });     
  }
}


