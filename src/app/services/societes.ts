import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Societe } from '../models/societe.model';

export interface SocietePayload {
  nom: string;
  adresse?: string;
  telephone: string;
  email: string;
  personne_contact?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocietesService {
  private apiUrl = 'http://localhost:3000/societes';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Societe> {
    return this.http.get<Societe>(`${this.apiUrl}/${id}`);
  }

  create(payload: SocietePayload): Observable<Societe> {
    return this.http.post<Societe>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<SocietePayload>): Observable<Societe> {
    return this.http.patch<Societe>(`${this.apiUrl}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}