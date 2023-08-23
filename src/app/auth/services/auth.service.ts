import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { LoginResponse, Userlog } from '../interfaces/login-response.interface';
import { Observable, of,  throwError, BehaviorSubject } from 'rxjs';
import { CheckTokenResponse } from '../interfaces/chek-token.response';

@Injectable({
  providedIn: 'root'
})



export class AuthService {  
  private readonly baseUrl = environment.base_url
  private http = inject( HttpClient ) ;
  
  private _currentUser = signal<Userlog | null>(null);
  private _authStatus  = signal<AuthStatus>(AuthStatus.checking);
  
// Public methods

public currentUser = computed( () => this._currentUser())
public authStatus = computed( () => this._authStatus())


constructor() {
  this.checkAuthStatus().subscribe();
}

private setAuthentication(user: Userlog, token:string): boolean {

  this._currentUser.set( user );
  this._authStatus.set( AuthStatus.authenticated );
  localStorage.setItem('token', token);

   // Actualiza la hora de inicio de sesión
   

  return true;
}



   checkAuthStatus(): Observable<boolean> {

    const url = `${ this.baseUrl }/renew`
    const token = localStorage.getItem('token');

    if ( !token ) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    })

      return this.http.get<CheckTokenResponse>(url, { headers })
        .pipe(
          map( ({ userexist, token }) => this.setAuthentication( userexist, token )),  
          catchError(() => {
            this._authStatus.set( AuthStatus.notAuthenticated );
            return of(false);
          })
        );
  }

  login(user: string, password: string):Observable<boolean> {

    const url = `${ this.baseUrl }/login`
    const body = {user, password};

    return this.http.post<LoginResponse>( url, body)
    .pipe(
        tap( ({ userexist, token}) => {
          this._currentUser.set( userexist );
          this._authStatus.set( AuthStatus.authenticated )
          localStorage.setItem('token', token); 
          
                          
        } ),
        map( () => true),

        catchError( err => throwError( () => err.error.message ) )
        )     
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );

  }
   
}


