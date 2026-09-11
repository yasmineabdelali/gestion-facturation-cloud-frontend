import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FactureConsolidee } from '../models/facture-consolidee.model';
import { TypePeriode } from '../models/facture.model';

export interface CreateFactureConsolideePayload {
  societe_id: number;
  type_periode: TypePeriode;
  annee: number;
  numero_periode: number;
}

@Injectable({
  providedIn: 'root'
})
export class FacturesConsolideesService {
  private apiUrl = 'http://localhost:3000/factures-consolidees';

  constructor(private http: HttpClient) {}

  create(payload: CreateFactureConsolideePayload): Observable<FactureConsolidee> {
    return this.http.post<FactureConsolidee>(this.apiUrl, payload);
  }

  findBySociete(societeId: number): Observable<FactureConsolidee[]> {
    return this.http.get<FactureConsolidee[]>(`${this.apiUrl}/societe/${societeId}`);
  }

  findOne(id: number): Observable<FactureConsolidee> {
    return this.http.get<FactureConsolidee>(`${this.apiUrl}/${id}`);
  }
}