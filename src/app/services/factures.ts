import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture, TypePeriode } from '../models/facture.model';

export interface CreateFacturePayload {
  projet_id: number;
  type_periode: TypePeriode;
  annee: number;
  numero_periode: number;
}

export interface UpdateLignePayload {
  id: number;
  quantite_consommee: number;
}

@Injectable({
  providedIn: 'root'
})
export class FacturesService {
  private apiUrl = 'http://localhost:3000/factures';

  constructor(private http: HttpClient) {}

  create(payload: CreateFacturePayload): Observable<Facture> {
    return this.http.post<Facture>(this.apiUrl, payload);
  }

  findByProjet(projetId: number): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/projet/${projetId}`);
  }

  findOne(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/${id}`);
  }

  updateLignes(id: number, lignes: UpdateLignePayload[]): Observable<Facture> {
    return this.http.patch<Facture>(`${this.apiUrl}/${id}/lignes`, { lignes });
  }

  valider(id: number): Observable<Facture> {
    return this.http.patch<Facture>(`${this.apiUrl}/${id}/valider`, {});
  }

  devalider(id: number): Observable<Facture> {
    return this.http.patch<Facture>(`${this.apiUrl}/${id}/devalider`, {});
  }
}