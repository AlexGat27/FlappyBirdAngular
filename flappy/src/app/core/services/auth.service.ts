import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { User } from '../interfaces/userModel.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private user: User | null = null;
  public authenticated = signal(this.getToken() !== null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient,
              private router: Router){
  }

  login(userValue): Observable<{token: string}> {
    return this.http.post<any>("/api/v1/auth/login", userValue)
    .pipe(
        tap(data => {
          this.setToken(data.token)
          localStorage.setItem("auth-token", data.token);
          this.router.navigate(["home"]);
        }),//
        catchError(er => {
            console.log(er);
            return throwError(er);
        })
    );
  }

  register(userValue): Observable<void> {
    console.log(userValue)
    return this.http.post<any>("/api/v1/auth/register", userValue)
    .pipe(
        tap(() => {
            this.router.navigate(['auth', "login"]);
        }),
        catchError(er => {
          console.log(er);
          return throwError(er);
        })
    );
  }

  getUser(): Observable<User>{
    if (this.user !== null) { return of(this.user);}
    return this.http.get<User>("/api/v1/auth/getUser").pipe(
      map(userdata => {
        if (userdata === undefined || userdata === null) {
            this.logout();
            throw new Error('Пользователь не найден');
        }
        this.user = userdata;
        console.log(userdata)
        return this.user;
      }),
      catchError(err => {
        console.log(err);
        this.logout();
        return of(null); // возвращаем пустое значение в случае ошибки
      })
    );
  }
  setToken(token: string){
    this.token = token;
    this.authenticated.set(this.getToken() !== null);
}
  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean{
    return !!this.token;
  }

  logout() {
    this.setToken(null);
    localStorage.clear();
    this.user = null;
    this.router.navigate(["auth", "login"]);
  }
}
