import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OffreFinanciere } from '../models/offre.model';

@Injectable({
  providedIn: 'root'
})
export class OffresService {
  private apiUrl = 'http://localhost:3000/offres';

  constructor(private http: HttpClient) {}

  importOffre(projetId: number, file: File): Observable<OffreFinanciere> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<OffreFinanciere>(`${this.apiUrl}/import/${projetId}`, formData);
  }

  findActive(projetId: number): Observable<OffreFinanciere | null> {
    return this.http.get<OffreFinanciere | null>(`${this.apiUrl}/projet/${projetId}/active`);
  }

  findHistorique(projetId: number): Observable<OffreFinanciere[]> {
    return this.http.get<OffreFinanciere[]>(`${this.apiUrl}/projet/${projetId}/historique`);
  }

  findOne(id: number): Observable<OffreFinanciere> {
    return this.http.get<OffreFinanciere>(`${this.apiUrl}/${id}`);
  }
}