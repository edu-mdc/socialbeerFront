import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { EstablecimientoComponent } from './pages/establecimiento/establecimiento.component';
import { GrupoComponent } from './pages/grupo/grupo.component';
import { VistaClienteComponent } from './vistas/vista-cliente/vista-cliente.component';
import { FichaGrupoComponent } from './pages/ficha-grupo/ficha-grupo.component';
import { FichaEstablecimientoComponent } from './pages/ficha-establecimiento/ficha-establecimiento.component';
import { FichaEventoComponent } from './pages/ficha-evento/ficha-evento.component';
import { authGuard } from './custom/auth.guard';
import { VistaEstablecimientoComponent } from './vistas/vista-establecimiento/vista-establecimiento.component';
import { VistaGrupoComponent } from './vistas/vista-grupo/vista-grupo.component';

export const routes: Routes = [
    {path:"",component:LoginComponent},
    {path:"registro",component:RegistroComponent},
    {path:"inicio", component:InicioComponent},
    {path:"cliente", component:VistaClienteComponent, canActivate:[authGuard]},
    {path:"establecimiento", component:VistaEstablecimientoComponent, canActivate:[authGuard]},
    {path:"grupo", component:VistaGrupoComponent, canActivate:[authGuard]},
    {path:"fichaGrupo/:id", component:FichaGrupoComponent},
    {path:"fichaEstablecimiento/:id", component:FichaEstablecimientoComponent},
    {path:"fichaEvento/:id", component: FichaEventoComponent}
];
