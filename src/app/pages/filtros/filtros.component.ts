import {ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatToolbarModule],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.css'
})
export class FiltrosComponent implements OnInit{
  showFilters = false;  // Para controlar la visibilidad del contenedor
  isMobile = false;     // Para detectar si es un dispositivo móvil

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768; // Ajustar el umbral para móviles
    if (!this.isMobile) {
      this.showFilters = true;  // Mostrar siempre los filtros en pantallas grandes
    } else {
      this.showFilters = false; // Ocultar filtros en pantallas pequeñas por defecto
    }
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;  // Alternar entre mostrar y ocultar
  }
}
