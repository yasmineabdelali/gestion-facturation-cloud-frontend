import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardIndicateurs } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/dashboard';

  constructor(private http: HttpClient) {}

  getIndicateurs(): Observable<DashboardIndicateurs> {
    return this.http.get<DashboardIndicateurs>(`${this.apiUrl}/indicateurs`);
  }
}