import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Prestation {
  _id: string;
  libelle_prestation: string;
  prix_unitaire_base: number;
  duree: number;
  categorieId: {
    _id: string;
    libelle_categorie: string;
    description: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PrestationService {
  private apiUrl = 'http://localhost:5000/api/prestation';

  constructor(private http: HttpClient) {}

  getByCategorie(categorieId: string): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(`${this.apiUrl}/${categorieId}`);
  }
}
