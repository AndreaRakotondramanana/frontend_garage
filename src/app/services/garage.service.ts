import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GarageService {
  private apiUrl = 'http://localhost:5000/api/garage';

  constructor(private http: HttpClient) {}

  getGarages() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
