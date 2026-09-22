import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLog } from '../models/audit-log.model';

export interface AuditLogFiltres {
  userId?: number;
  action?: string;
  entite?: string;
  dateDebut?: string;
  dateFin?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogsService {
  private apiUrl = 'http://localhost:3000/audit-logs';

  constructor(private http: HttpClient) {}

  findAll(filtres: AuditLogFiltres = {}): Observable<AuditLog[]> {
    const params: any = {};
    if (filtres.userId) params.userId = filtres.userId;
    if (filtres.action) params.action = filtres.action;
    if (filtres.entite) params.entite = filtres.entite;
    if (filtres.dateDebut) params.dateDebut = filtres.dateDebut;
    if (filtres.dateFin) params.dateFin = filtres.dateFin;

    return this.http.get<AuditLog[]>(this.apiUrl, { params });
  }
}