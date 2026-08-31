import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projet, StatutProjet } from '../models/projet.model';

export interface ProjetPayload {
  numero_so: string;
  nom_projet: string;
  date_debut: string;
  statut: StatutProjet;
  societe_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProjetsService {
  private apiUrl = 'http://localhost:3000/projets';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.apiUrl);
  }

  findBySociete(societeId: number): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.apiUrl, { params: { societe_id: societeId } });
  }

  findOne(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.apiUrl}/${id}`);
  }

  create(payload: ProjetPayload): Observable<Projet> {
    return this.http.post<Projet>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<ProjetPayload>): Observable<Projet> {
    return this.http.patch<Projet>(`${this.apiUrl}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}