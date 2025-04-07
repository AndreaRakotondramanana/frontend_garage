import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RdvService {
  private apiUrl = 'http://localhost:5000/api/rdv';

  constructor(private http: HttpClient) {}

  enregistrerRdv(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }
}
