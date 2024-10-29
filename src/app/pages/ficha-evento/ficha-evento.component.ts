import { Component } from '@angular/core';
import { ClienteComponent } from "../cliente/cliente.component";

@Component({
  selector: 'app-ficha-evento',
  standalone: true,
  imports: [ClienteComponent],
  templateUrl: './ficha-evento.component.html',
  styleUrl: './ficha-evento.component.css'
})
export class FichaEventoComponent {

}
