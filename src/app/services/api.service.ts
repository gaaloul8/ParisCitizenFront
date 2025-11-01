import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://48.194.74.73:8083/api/v1';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // GET requests
  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // GET requests for paginated data
  getPage<T>(endpoint: string, params?: any): Observable<PageResponse<T>> {
    console.log('=== API getPage ===');
    console.log('Endpoint:', endpoint);
    console.log('Params:', params);
    
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    console.log('Headers:', this.getHeaders());
    console.log('URL complète:', `${this.baseUrl}${endpoint}`);

    return this.http.get<any>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        console.log('Réponse API paginée:', response);
        // L'API retourne directement { data, total, page, limit, totalPages }
        if (response.data && Array.isArray(response.data)) {
          const result = {
            content: response.data,
            totalElements: response.total || 0,
            page: response.page || 0,
            limit: response.limit || 10,
            totalPages: response.totalPages || 0
          };
          console.log('Résultat transformé:', result);
          return result;
        }
        // Fallback si la structure est différente
        console.log('Structure différente, fallback:', response);
        return response;
      }),
      catchError(error => {
        console.error('Erreur dans getPage:', error);
        return this.handleError(error);
      })
    );
  }

  // POST requests
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // PUT requests
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // PATCH requests
  patch<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // DELETE requests
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }
}
