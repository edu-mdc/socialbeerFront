import {Component, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common'; 
import { provinciasEspana } from '../../settings/provincias';
import { FiltrosService } from '../../services/filtros.service';
import { FormsModule } from '@angular/forms';
import { estilosMusicales } from '../../settings/estilos';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatToolbarModule, FormsModule,MatProgressSpinnerModule],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.css'
})
export class FiltrosComponent implements OnInit{
  spinner: boolean = false;
  provincias: string[] = [];
  grupo: string = '';
  establecimiento: string = '';
  provincia: string = '';
  estilos: string[] = [];
  estilosMusicales: string [] = [];

constructor(private filtroService: FiltrosService) {
  
}

  ngOnInit(): void {
this.provincias = provinciasEspana;
this.estilosMusicales = estilosMusicales;
  }


  enviarFiltros(){
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false; 
    }, 300); 
    const filtros = {
      grupo: this.grupo,
      establecimiento: this.establecimiento,
      provincia: this.provincia,
      estilos: this.estilos
    };

    console.log('Filtros enviados:', filtros); 
    this.filtroService.setFiltros(filtros);

    this.grupo = '';
    this.establecimiento = '';
    this.provincia = '';
    this.estilos = [];

    // Restablecer los checkboxes manualmente
    const checkboxes = document.querySelectorAll<HTMLInputElement>('.check');
    checkboxes.forEach(checkbox => checkbox.checked = false);

     
  }
  
  
  limpiarFiltros(){
    this.grupo = '';
    this.establecimiento = '';
    this.provincia = '';
    this.estilos = [];

    console.log('Filtros limpiados:', {
      grupo: this.grupo,
      establecimiento: this.establecimiento,
      provincia: this.provincia,
      estilos: this.estilos
    });
    this.enviarFiltros();
  
  }

  toggleEstilo(estilo: string, event: any): void {
    if (event.target.checked) {
      this.estilos.push(estilo);
    } else {
      this.estilos = this.estilos.filter(e => e !== estilo);
    }
  }
}
