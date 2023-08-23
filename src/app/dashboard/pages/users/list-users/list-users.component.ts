import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../interfaces/usersInterface';
import Swal from 'sweetalert2';
import { SearchService } from 'src/app/dashboard/services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'list-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  
  public users: any[] = [];
  public usersCount: number = 0;  
  public usersTemp: User[] = [];
  public desde: number = 0;
  public loading: boolean = true;

  constructor(private userService: UsersService,
     private searchService: SearchService,
      private router: Router) { }

  ngOnInit(): void {
    this.loadingUsers();
  };

  loadingUsers() {
    this.loading = true;
    this.userService.LoadAllUsers(this.desde)
    .subscribe( ({ total, users }) => {
      this.usersCount = total;
      this.users = users;
      this.usersTemp = users;
      this.loading = false;
    } );
  }


 //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.users = this.usersTemp;
    return ;
  }
   this.searchService.search('users', term )
        .subscribe( resp => {
          this.users = resp;
        });
  }



  // Eliminar

  deleteUser(user: User) {

    // if ( user.id === this.userService.id ) {
    //   return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    // }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${ user.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {

        this.userService.deleteUser( user )
          .subscribe( resp => {

            this.loadingUsers();
            Swal.fire(
              'Usuario borrado',
              `${ user.name } fue eliminado correctamente`,
              'success'
            );

          });

      }
    })


  }


  addUser(){
    this.router.navigate(['dashboard/add-user']);
  }


// Editar

editUser(user: User) {
  this.router.navigate(['dashboard/edit-user', user.id]);
}


}


