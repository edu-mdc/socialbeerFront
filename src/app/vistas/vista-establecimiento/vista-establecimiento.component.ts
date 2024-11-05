import { Component } from '@angular/core';

import { FiltrosComponent } from "../../pages/filtros/filtros.component";
import { MostrarComponent } from "../../pages/mostrar/mostrar.component";
import { EstablecimientoComponent } from "../../pages/establecimiento/establecimiento.component";

@Component({
  selector: 'app-vista-establecimiento',
  standalone: true,
  imports: [EstablecimientoComponent, FiltrosComponent, MostrarComponent, EstablecimientoComponent],
  templateUrl: './vista-establecimiento.component.html',
  styleUrl: './vista-establecimiento.component.css'
})
export class VistaEstablecimientoComponent {

}
