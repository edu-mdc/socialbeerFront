import { Component, ElementRef, inject, OnInit, Renderer2, viewChild, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms';
import { Usuario } from '../../interfaces/Usuario';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { MatNativeDateModule } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/Cliente';
import Swal from 'sweetalert2';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AccesoService } from '../../services/acceso.service';
import { provinciasEspana } from '../../settings/provincias';
import { poblacionesEspana } from '../../settings/poblaciones';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [MatProgressSpinnerModule,MatSelectModule, ReactiveFormsModule, MatExpansionModule, MatDatepickerModule, MatAccordion,MatFormFieldModule,MatIconModule,MatInputModule, MatNativeDateModule, MatButtonModule ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit{
  provinciasEspana:any;
  poblacionesEspana: any;
  private renderer = inject(Renderer2); // Inyectamos Renderer2 para manejar eventos del DOM
  private elementRef = inject(ElementRef);

  spinner: boolean=false;
  accordion = viewChild.required(MatAccordion);  // Uso correcto de ViewChild para MatAccordion
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  public nombreUsuario: string = '';
  public email: string = '';
  public clienteForm: FormGroup;
  public clienteId: number | null = null;
  userId: string | null = null;

  private usuarioService = inject(UsuarioService);
  private clienteService = inject(ClienteService);
  private accesoService = inject(AccesoService);
  constructor() {
    // Inicializamos el formulario usando FormBuilder
    this.clienteForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido_1: ['', Validators.required],
      apellido_2: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      fechaNacimiento: [null, Validators.required],
      direccion: ['', Validators.required],
      provincia: ['', Validators.required],
      poblacion: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.provinciasEspana = provinciasEspana;
    this.poblacionesEspana = poblacionesEspana;
    this.userId = localStorage.getItem('userId');

    if (this.userId) {
      // Obtener los datos del usuario
      this.usuarioService.getUsuario(+this.userId).subscribe({
        next: (usuario: Usuario) => {
          this.nombreUsuario = usuario.nombreUsuario;
          this.email = usuario.email;
        },
        error: (error) => {
          console.log('Error al obtener el usuario: ', error);
        }
      });
  
      // Obtener los datos del cliente
      this.clienteService.getClienteByUserId(+this.userId).subscribe({
        next: (cliente: Cliente) => {

          this.clienteId = cliente.id;
          // Convertir la fecha de nacimiento que recibes como string (formato "dd-MM-yyyy") a un objeto Date
          const fechaNacimiento = typeof cliente.fechaNacimiento === 'string'
            ? this.convertStringToDate(cliente.fechaNacimiento)
            : cliente.fechaNacimiento;

          // Actualizar el formulario con los datos del cliente
          this.clienteForm.patchValue({
            nombre: cliente.nombre,
            apellido_1: cliente.apellido_1,
            apellido_2: cliente.apellido_2,
            dni: cliente.dni,
            telefono: cliente.telefono,
            fechaNacimiento: fechaNacimiento,  // Usar Date si está disponible
            direccion: cliente.direccion,
            provincia: cliente.provincia,
            poblacion: cliente.poblacion
          });
        },
        error: (error) => {
          console.log('Error al obtener el cliente: ', error);
        }
      });
    }
    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.accordion().closeAll(); // Cerrar el accordion si el clic es fuera de él
      }
    });
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

  guardar() {
    Object.keys(this.clienteForm.controls).forEach(field => {
      const control = this.clienteForm.get(field);
      control?.markAsTouched({ onlySelf: true });
      control?.markAsDirty({ onlySelf: true });
      control?.updateValueAndValidity(); // Fuerza la validación y actualización del valor
    });
    if (this.clienteForm.valid) {
      this.spinner = true;
      const clienteData = this.clienteForm.value;
  
      if (clienteData.fechaNacimiento) {
        clienteData.fechaNacimiento = this.convertDateToString(clienteData.fechaNacimiento);
      }
  
      this.clienteService.updateCliente(+this.userId!, clienteData).subscribe({
        next: (response) => {
          this.spinner = false;
          this.accordion().closeAll();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Datos guardados con éxito",
            showConfirmButton: false,
            timer: 900,
          });
        },
        error: (error) => {
          this.spinner = false;
          if (error.status === 409) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'El DNI ya está registrado en otro cliente.',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al guardar los datos',
            });
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor revisa los campos',
      });
    }
  }

  eliminarCliente() {
    if (this.clienteId !== null) {  // Verifica que clienteId no es null
      Swal.fire({
        title: '¿Quieres darte de baja realmente?',
        text: 'No podrás revertir esto una vez eliminado!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, darse de baja',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Mostrar el spinner durante el proceso de eliminación
          this.spinner = true;
          
          this.clienteService.eliminarCliente(this.clienteId!).subscribe({
            next: (response) => {
              setTimeout(() => {
                this.spinner = false; // Ocultar el spinner después de la operación
                Swal.fire('Baja generada', 'Te has dado de baja con éxito.', 'success');
                
                // Limpiar token y redirigir al login
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                this.router.navigate(['/']);
              }, 500);  // Simular un pequeño retraso para el spinner
            },
            error: (error) => {
              console.error('Error al eliminar el cliente:', error);
              setTimeout(() => {
                this.spinner = false; // Ocultar el spinner después del error
                Swal.fire('Error', 'Ocurrió un error al eliminar el cliente.', 'error');
              }, 900); // Simular un pequeño retraso para el spinner
            }
          });
        }
      });
    } else {
      console.error('No se pudo obtener el ID del cliente para eliminar.');
    }
  }

  desconectar() {
    // Mostrar la alerta de confirmación antes de desconectar
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Tendrás que iniciar sesión nuevamente si te desconectas!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, desconectar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar el spinner mientras se procesa la desconexión
        this.spinner = true;

        // Simular el proceso de desconexión con un timeout
        setTimeout(() => {
          // Eliminar la información de autenticación
          this.accesoService.logout();
          
          // Ocultar el spinner
          this.spinner = false;

          // Mostrar la alerta de éxito
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Desconectado",
            showConfirmButton: false,
            timer: 900,
          }).then(() => {
            // Redirigir al usuario a la página de inicio de sesión
            this.router.navigate(['/']);
          });
        }, 900); // Simular un tiempo de espera de 1.5 segundos
      }
    });
  }


  irInicio(){
    this.spinner = true;
    setTimeout(() => {
      this.router.navigate(['/cliente']).then(() => {
        this.spinner = false;
      });
    }, 1000);
  }
  
}
