import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
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
 
  login(user: string, password: string):Observable<boolean> {

    const url = `${ this.baseUrl }/auth/login`
    const body = {user, password};

    return this.http.post<LoginResponse>( url, body )
    .pipe(
      map(({ user, token }) => {       
        return this.setAuthentication(user, token);
      }),      
      catchError( err => throwError( () => err ))
  
      
    );
  }

  checkAuthStatus(): Observable<boolean> {

    const url = `${ this.baseUrl }/auth/check-token`
    const token = localStorage.getItem('token');

    if ( !token ) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);

      return this.http.get<CheckTokenResponse>(url, { headers })
        .pipe(
          map( ({ user, token }) => this.setAuthentication( user, token )),  
          catchError(() => {
            this._authStatus.set( AuthStatus.notAuthenticated );
            return of(false);
          })
        );
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );
    localStorage.clear();
    sessionStorage.clear();

  }
   
}


