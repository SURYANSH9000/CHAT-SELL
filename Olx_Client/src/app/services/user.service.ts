import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from './local-storage-service.service';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  getCurrentUser() {
    throw new Error('Method not implemented.');
  }
  arrUser: User[] = [];
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.arrUser = [];
  }

  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(`${this.baseUrl}/user`, this.httpHeader)
      .pipe(catchError(this.handleError));
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/${id}`).pipe(
      catchError(this.handleError)
    );
  }  
  
  register(user: User): Observable<any> {
    return this.httpClient
      .post<any>(`${this.baseUrl}/register`, JSON.stringify(user), this.httpHeader)
      .pipe(catchError(this.handleError));
  }

  addUser(user: User): Observable<User> {
    return this.httpClient
      .post<User>(`${this.baseUrl}/user`, user, this.httpHeader)
      .pipe(catchError(this.handleError));
  }

  updateUserProfile(id: number, user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  getUserProfile(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/user/profile`);
  }

  deleteUser(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/user/${id}`, this.httpHeader)
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(`${this.baseUrl}/login`, { email, password }, this.httpHeader)
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    this.localStorageService.removeItem('token');
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
}
