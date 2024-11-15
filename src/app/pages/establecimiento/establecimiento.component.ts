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
import { EstablecimientoService } from '../../services/establecimiento.service';
import { Establecimiento } from '../../interfaces/Establecimiento';
import { AccesoService } from '../../services/acceso.service';

@Component({
  selector: 'app-establecimiento',
  standalone: true,
  imports: [MatProgressSpinnerModule, ReactiveFormsModule, MatExpansionModule, MatDatepickerModule, MatAccordion,MatFormFieldModule,MatIconModule,MatInputModule, MatNativeDateModule, MatButtonModule ],
  templateUrl: './establecimiento.component.html',
  styleUrl: './establecimiento.component.css'
})
export class EstablecimientoComponent implements OnInit{

  private renderer = inject(Renderer2); // Inyectamos Renderer2 para manejar eventos del DOM
  private elementRef = inject(ElementRef);

  spinner: boolean=false;
  accordion = viewChild.required(MatAccordion);  // Uso correcto de ViewChild para MatAccordion
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  public nombreUsuario: string = '';
  public email: string = '';
  public establecimientoForm: FormGroup;
  public establecimientoId: number | null = null;
  userId: string | null = null;

  private usuarioService = inject(UsuarioService);
  private establecimientoService = inject(EstablecimientoService);
  private accesoService = inject(AccesoService);

  constructor() {
    // Inicializamos el formulario usando FormBuilder
    this.establecimientoForm = this.formBuilder.group({
      establecimiento: ['', Validators.required],
      cif: ['', Validators.required],
      aforo: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      provincia: ['', Validators.required],
      poblacion: ['', Validators.required]
    });
  }

  ngOnInit() {
    
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
  
      // Obtener los datos del establecimiento
      this.establecimientoService.getEstablecimientoByUserId(+this.userId).subscribe({
        next: (establecimiento: Establecimiento) => {

          this.establecimientoId = establecimiento.id;
          // Convertir la fecha de nacimiento que recibes como string (formato "dd-MM-yyyy") a un objeto Date
        

          // Actualizar el formulario con los datos del cliente
          this.establecimientoForm.patchValue({
            establecimiento: establecimiento.establecimiento,
            cif: establecimiento.cif,
            aforo: establecimiento.aforo,
            telefono: establecimiento.telefono,
            direccion: establecimiento.direccion,
            provincia: establecimiento.provincia,
            poblacion: establecimiento.poblacion
          });
        },
        error: (error) => {
          console.log('Error al obtener el establecimiento: ', error);
        }
      });
    }
    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.accordion().closeAll(); // Cerrar el accordion si el clic es fuera de él
      }
    });
  }



  guardar() {
    Object.keys(this.establecimientoForm.controls).forEach(field => {
      const control = this.establecimientoForm.get(field);
      control?.markAsTouched({ onlySelf: true });
      control?.markAsDirty({ onlySelf: true });
      control?.updateValueAndValidity(); // Fuerza la validación y actualización del valor
    });
    if (this.establecimientoForm.valid) {
      this.spinner = true;
      const establecimientoData = this.establecimientoForm.value;
  
  
      this.establecimientoService.updateEstablecimiento(+this.userId!, establecimientoData).subscribe({
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
    if (this.establecimientoId !== null) {  // Verifica que clienteId no es null
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
          
          this.establecimientoService.eliminarEstablecimiento(this.establecimientoId!).subscribe({
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
              console.error('Error al eliminar el establecimiento:', error);
              setTimeout(() => {
                this.spinner = false; // Ocultar el spinner después del error
                Swal.fire('Error', 'Ocurrió un error al eliminar el establecimiento.', 'error');
              }, 900); // Simular un pequeño retraso para el spinner
            }
          });
        }
      });
    } else {
      console.error('No se pudo obtener el ID del establecimiento para eliminar.');
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
