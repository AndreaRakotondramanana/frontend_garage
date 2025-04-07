import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {
  private apiUrl = 'http://localhost:5000/api/voiture'; 

  constructor() { }
}
