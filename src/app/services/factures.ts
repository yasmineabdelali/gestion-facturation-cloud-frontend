import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture, TypePeriode } from '../models/facture.model';
import { ComparaisonResultat } from '../models/comparaison.model';
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
  findAll(): Observable<Facture[]> {
  return this.http.get<Facture[]>(this.apiUrl);
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
  //telechargement de la facture en forme pdf
  downloadPdf(id: number): void {
  this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    },
    error: () => {
      alert('Erreur lors du téléchargement du PDF');
    }
  });
}


downloadExcel(id: number): void {
  this.http.get(`${this.apiUrl}/${id}/excel`, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${id}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    },
    error: () => {
      alert('Erreur lors du téléchargement du fichier Excel');
    }
  });
}


//fonctionalite de comparaison entre consommation prevu et reel 
getComparaison(projetId: number): Observable<ComparaisonResultat> {
  return this.http.get<ComparaisonResultat>(`${this.apiUrl}/projet/${projetId}/comparaison`);
}
}