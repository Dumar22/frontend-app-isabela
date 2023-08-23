import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { LoadUser, User, UserForm } from '../interfaces/usersInterface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {



  baseUrl=environment.base_url


  constructor(private http: HttpClient) { }

   getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }


 getUser(id:string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/${id}`);
  }


  register(formValue: any) {
    return firstValueFrom(
      this.http.post( `${this.baseUrl}/user`, formValue)
    )
  }

  addUser(user: UserForm): Observable<UserForm>{
    return this.http.post<UserForm>( `${this.baseUrl}/user`, user)

  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }


  get id():string {
    return this.id || '';
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  LoadAllUsers( desde: number = 0 ) {
    const url = `${ this.baseUrl }/users?desde=${ desde }`;

    return this.http.get<LoadUser>( url )
            .pipe(
              map( resp => {
                const users = resp.users.map(
                  user => new User(user.id, user.name, user.user,user.status, user.rol, user.warehouse )
                );
                return {
                  users,
                  total: resp.total
                };

              })
            )
  }


  deleteUser(user: User) {
    const url = `${this.baseUrl}/user/${ user.id }`;
    return this.http.delete(url, this.headers);
  }

  updateUser(id: string, user: UserForm): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/user/${user.id}`, user);
  }


}
