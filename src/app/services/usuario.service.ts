import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root' // Esto permite que el servicio esté disponible en toda la aplicación
})
export class UsuarioService {
  private apiUrl = environment.API_URL;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  
  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  login(credentials: {correo: string, contrasenia: string}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}auth/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.access_token);
        this.loggedIn.next(true);
      })
    );
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    this.loggedIn.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Obtener todos los usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener un usuario por ID
  getUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un usuario
  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  // Actualizar un usuario
  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
  }

  // Eliminar un usuario
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}