import { Component } from '@angular/core';
import { ClienteComponent } from "../cliente/cliente.component";

@Component({
  selector: 'app-ficha-establecimiento',
  standalone: true,
  imports: [ClienteComponent],
  templateUrl: './ficha-establecimiento.component.html',
  styleUrl: './ficha-establecimiento.component.css'
})
export class FichaEstablecimientoComponent {

}
