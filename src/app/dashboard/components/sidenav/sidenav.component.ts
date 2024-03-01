import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsersService } from '../../services/users.service';

interface MenuItem {
  texto: string;
  ruta: string
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  templateMenu :any[]
  userRole : any[];
  userId: any;
  
  private authService = inject( AuthService );
  private userService = inject( UsersService );
 
  //public user = computed(() => this.authService.currentUser() );
 
 ngOnInit() {
 const  user =  this.authService.currentUser() ;
  
    this.userRole = user.rol
    const userID = this.userService.getUserById(user.id).subscribe((user:any) => {
      this.userId = user.rol[0]
    })
   
    
    
    if (this.userRole[0] || this.userId === 'admin') {
      this.templateMenu = this.templateMenu2
     
      
    }else{
      this.templateMenu = this.templateMenu1
     
    }

    
  }

   
 
  templateMenu2: MenuItem[] = [

    {
     texto: 'Entradas de materiales',
     ruta: 'list-entries'
    },    
    {
     texto: 'Entradas de heramientas',
     ruta: 'list-entries-tools'
    },    
     {
      texto: 'Salidas de almacén',
      ruta: 'list-exit-materials'
     },    
     {
      texto: 'Listas salida de almacén',
      ruta: 'list-table-exit'
     },    
    {
      texto: 'Asignación de Pe al pe',
      ruta: 'list-assignment-pe-al-pe'
     },
    {
      texto: 'Asignación de materiales a vehiculos',
      ruta: 'list-assignment-materials-vehicles'
     },
     {
      texto: 'Asignación de herramientas',
      ruta: 'list-tools-assignment'
     },   
     {
      texto: 'Traslado de materiales',
      ruta: 'list-trasfers'
     },       
     {
      texto: 'Materiales de almacén',
      ruta: 'list-materials'
     },
     {
      texto: 'Medidores almacén',
      ruta: 'list-meters'
     },
     {
      texto: 'Herramientas',
      ruta: 'list-tools'
     },
     {
      texto: 'Contratos',
      ruta: 'list-work-register'
     },     
      {
      texto: 'Móviles',
      ruta: 'list-collaborators'
     }, 
     {
      texto: 'Porveedores',
      ruta: 'list-providers'
     },
     {
      texto: 'Vehículos',
      ruta: 'list-vehicles'
     },
     {
      texto: 'Cargas ecxel',
      ruta: 'load-file'
     },
     {
      texto: 'Bodegas',
      ruta: 'list-warehuses'
     },
     {
      texto: 'Proyectos',
      ruta: 'list-proyect'
     },
     {
      texto: 'Usuarios',
      ruta: 'list-users'
     },

   ]

  templateMenu1: MenuItem[] = [

    {
     texto: 'Entradas de materiales',
     ruta: 'list-entries'
    },    
    {
     texto: 'Entradas de herramientas',
     ruta: 'list-entries-tools'
    },    
     {
      texto: 'Salidas de almacén',
      ruta: 'list-exit-materials'
     },    
    {
      texto: 'Asignación de materiales a vehiculos',
      ruta: 'list-assignment-materials-vehicles'
     },
     {
      texto: 'Asignación de herramientas',
      ruta: 'list-tools-assignment'
     },   
     {
      texto: 'Traslado de materiales',
      ruta: 'list-trasfers'
     },       
     {
      texto: 'Materiales de almacén',
      ruta: 'list-materials'
     },
     {
      texto: 'Medidores almacén',
      ruta: 'list-meters'
     },
     {
      texto: 'Herramientas',
      ruta: 'list-tools'
     },
     {
      texto: 'Contratos',
      ruta: 'list-work-register'
     },     
      {
      texto: 'Móviles',
      ruta: 'list-collaborators'
     }, 
     {
      texto: 'Porveedores',
      ruta: 'list-providers'
     },
     {
      texto: 'Vehículos',
      ruta: 'list-vehicles'
     },
     {
      texto: 'Proyectos',
      ruta: 'list-proyect'
     },
     

   ]

}
