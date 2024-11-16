import { Component } from '@angular/core';

import { FiltrosComponent } from "../../pages/filtros/filtros.component";
import { MostrarComponent } from "../../pages/mostrar/mostrar.component";
import { EstablecimientoComponent } from "../../pages/establecimiento/establecimiento.component";
import { Establecimiento } from '../../interfaces/Establecimiento';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vista-establecimiento',
  standalone: true,
  imports: [EstablecimientoComponent, FiltrosComponent, MostrarComponent, EstablecimientoComponent, MatProgressSpinnerModule],
  templateUrl: './vista-establecimiento.component.html',
  styleUrl: './vista-establecimiento.component.css'
})
export class VistaEstablecimientoComponent {

  userId:string | null = null;
  establecimiento: Establecimiento | null = null;
  spinner: boolean = false;

  constructor(private establecimientoService: EstablecimientoService, private router: Router){}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.obtenerEstablecimiento(Number(this.userId));
    }
  }
  
  obtenerEstablecimiento(userId: number): void {
    this.establecimientoService.getEstablecimientoByUserId(userId).subscribe({
      next: (response) => {
        console.log('Grupos:', response);
        this.establecimiento = response;
      },
      error: (error) => console.error('Error al obtener los grupos', error)
    });
  }
  
    verFicha():void{
      // Evitar que el evento de click siga hacia otros elementos
      this.spinner = true;
      setTimeout(() => {
        this.router.navigate(['/fichaEstablecimiento', this.establecimiento?.id]).then(() => {
          this.spinner = false;
        });
      }, 1000); 
  
  
    }
}
