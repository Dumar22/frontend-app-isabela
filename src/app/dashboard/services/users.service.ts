import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { LoadUser, User, UserForm } from '../interfaces/usersInterface';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';


@Injectable({
  providedIn: 'root'
})
export class UsersService {



  baseUrl=environment.base_url


  constructor(private http: HttpClient,
    private createHeaders: WarehousesService) { }

   getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/auth`, this.createHeaders.createHeaders());
  }
   getUserPrivate(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/auth/private3`, this.createHeaders.createHeaders());
  }


 getUserById(id:string): Observable<UserForm> {
    return this.http.get<UserForm>(`${this.baseUrl}/auth/${id}`, this.createHeaders.createHeaders());
  }


  register(user : UserForm):Observable<UserForm> {
    return this.http.post<UserForm>( `${this.baseUrl}/auth/register`, user, this.createHeaders.createHeaders())
    
  }
 

  get token(): string {
    return sessionStorage.getItem('token') || '';
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

  
  deleteUser(user: User) {
    const url = `${this.baseUrl}/auth/${ user.id }`;
    return this.http.delete(url, this.headers);
  }

  updateUser(id: string, user: UserForm): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/auth/${id}`, user);
  }


}
