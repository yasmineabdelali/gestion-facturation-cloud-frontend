import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardIndicateurs, RepartitionFactures } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/dashboard';

  constructor(private http: HttpClient) {}

  getIndicateurs(typePeriode: string = 'mensuelle'): Observable<DashboardIndicateurs> {
    return this.http.get<DashboardIndicateurs>(`${this.apiUrl}/indicateurs?typePeriode=${typePeriode}`);
  }

  getRepartitionFactures(): Observable<RepartitionFactures> {
    return this.http.get<RepartitionFactures>(`${this.apiUrl}/repartition-factures`);
  }

  getMontantParSociete(typePeriode: string = 'mensuelle'): Observable<RepartitionFactures> {
    return this.http.get<RepartitionFactures>(`${this.apiUrl}/montant-par-societe?typePeriode=${typePeriode}`);
  }
}