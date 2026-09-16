import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RechercheFiltres, RechercheResultats } from '../models/recherche.model';

@Injectable({
  providedIn: 'root'
})
export class RechercheService {
  private apiUrl = 'http://localhost:3000/recherche';

  constructor(private http: HttpClient) {}

  rechercher(filtres: RechercheFiltres): Observable<RechercheResultats> {
    let params = new HttpParams();

    if (filtres.client) params = params.set('client', filtres.client);
    if (filtres.so) params = params.set('so', filtres.so);
    if (filtres.typePeriode) params = params.set('typePeriode', filtres.typePeriode);
    if (filtres.annee) params = params.set('annee', filtres.annee);
    if (filtres.numeroPeriode) params = params.set('numeroPeriode', filtres.numeroPeriode);

    return this.http.get<RechercheResultats>(this.apiUrl, { params });
  }
}