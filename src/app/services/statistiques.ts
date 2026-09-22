import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsommationParClient, ConsommationParRessource } from '../models/statistiques.model';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private apiUrl = 'http://localhost:3000/statistiques';

  constructor(private http: HttpClient) {}

  getConsommationParClient(typePeriode?: string): Observable<ConsommationParClient[]> {
    let params = new HttpParams();
    if (typePeriode) params = params.set('typePeriode', typePeriode);
    return this.http.get<ConsommationParClient[]>(`${this.apiUrl}/consommation-par-client`, { params });
  }

  getConsommationParRessource(typePeriode?: string): Observable<ConsommationParRessource[]> {
    let params = new HttpParams();
    if (typePeriode) params = params.set('typePeriode', typePeriode);
    return this.http.get<ConsommationParRessource[]>(`${this.apiUrl}/consommation-par-ressource`, { params });
  }
}