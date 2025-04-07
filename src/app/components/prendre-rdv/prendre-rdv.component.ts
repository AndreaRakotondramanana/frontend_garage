import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { GarageService } from '../../services/garage.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RdvService } from '../../services/rdv.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prendre-rdv',
  templateUrl: './prendre-rdv.component.html',
  styleUrls: ['./prendre-rdv.component.css'],
  imports: [CommonModule, FormsModule]
})
export class PrendreRdvComponent implements OnInit, AfterViewInit {
  garages: any[] = [];
  garageSelectionne: any = null;
  afficherCarte: boolean = false;
  map: any;
  L: any;
  voitures: any[] = [];

  nouvelleVoiture = {
    marque: '',
    model: '',
    immatriculation: '',
    annee: null,
    type: '',
    taille: ''
  };

  formData = {
    voitureId: '',
    date_heure: '',
    note: ''
  };

  constructor(
    private garageService: GarageService,
    private rdvService: RdvService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() { 
    this.recupererVoitures();
  }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.L = await import('leaflet');
      this.loadGarageSelection();
      this.loadGarages();
    }
  }

  async getClientId(): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) return null; 
  
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const userId = decodedToken.userId;
  
    try {
      const data = await this.http.get<any>(`http://localhost:5000/api/client/${userId}`).toPromise();
  
      if (data && data.clientId) {
        console.log('Client ID récupéré:', data.clientId);
        return data.clientId; 
      } else {
        console.error('ClientId introuvable dans la réponse');
        return null; 
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du clientId:', err);
      return null; 
    }
  }

  // Récupérer la liste des voitures du client
  async recupererVoitures() {
    const clientId =await this.getClientId();

    this.http.get<any[]>(`http://localhost:5000/voitures?clientId=${clientId}`).subscribe({
      next: (data) => {
        this.voitures = data;
      },
      error: (err) => console.error("Erreur de récupération des voitures :", err)
    });
  }

  // Ajouter une nouvelle voiture
  async ajouterVoiture() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const clientId = await this.getClientId();

    const voitureData = { ...this.nouvelleVoiture, clientId };

    this.http.post('http://localhost:5000/voitures', voitureData, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    }).subscribe({
      next: (res) => {
        alert('Voiture ajoutée avec succès');
        this.recupererVoitures();
        this.nouvelleVoiture = { marque: '', model: '', immatriculation: '', annee: null, type: '', taille: '' };
        document.getElementById("ajoutVoitureModal")?.click(); 
      },
      error: (err) => alert(`Erreur : ${err.error?.message || "Impossible d'ajouter la voiture"}`)
    });
  }

  loadGarageSelection(): void {
    const saved = localStorage.getItem('garageSelectionne');
    if (saved) {
      this.garageSelectionne = JSON.parse(saved);
    }
  }

  loadGarages(): void {
    this.garageService.getGarages().subscribe((data) => {
      this.garages = data;
      if (this.afficherCarte) {
        setTimeout(() => this.initMap(), 0);
      }
    });
  }

  toggleCarte(): void {
    this.afficherCarte = !this.afficherCarte;

    if (
      this.afficherCarte &&
      this.garages.length > 0 &&
      isPlatformBrowser(this.platformId)
    ) {
      setTimeout(() => this.initMap(), 0);
    }
  }

  initMap(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.L) return;

    if (this.map) {
      this.map.remove();
    }

    const center = this.garages[0]
      ? [this.garages[0].latitude, this.garages[0].longitude]
      : [-18.9563819, 47.5215452];

    this.map = this.L.map('map').setView(center, 13);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(this.map);

    this.garages.forEach((garage) => {
      const marker = this.L.marker([garage.latitude, garage.longitude]).addTo(this.map);

      const popupContent = `
        <strong>${garage.localisation}</strong><br>
        Contact: ${garage.contact}<br>
        <button class="btn btn-sm btn-primary mt-1" id="select-${garage._id}">
          Choisir ce garage
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`select-${garage._id}`);
          if (btn) {
            btn.addEventListener('click', () => {
              this.garageSelectionne = garage;
              localStorage.setItem('garageSelectionne', JSON.stringify(garage));
              this.afficherCarte = false;
              if (this.map) {
                this.map.remove();
                this.map = null;
              }
            });
          }
        }, 0);
      });
    });
  }

  enregistrerRdv(): void {
    if (!this.garageSelectionne || !this.formData.voitureId || !this.formData.date_heure || !this.formData.note) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const body = {
      garageId: this.garageSelectionne._id,
      voitureId: this.formData.voitureId,
      date_heure: new Date(this.formData.date_heure),
      note: this.formData.note
    };

    this.rdvService.enregistrerRdv(body).subscribe({
      next: (res) => {
        alert('Rendez-vous enregistré avec succès !');
        this.router.navigate(['/']); // redirection home ou vers une page "mes RDV"
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l\'enregistrement du rendez-vous.');
      }
    });
  }
}
