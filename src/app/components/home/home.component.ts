import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GarageService } from '../../services/garage.service'; // adapte le chemin
import { CategorieService } from '../../services/categorie.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements AfterViewInit {
  private map: any;
  private L: any;
  categories: any[] = [];
  garages: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private categorieService: CategorieService,
    private garageService: GarageService,
    private router: Router
  ) { }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.L = await import('leaflet');
      this.initializeMap();
      this.loadGarages();
    }
    this.loadCategories();
  }

  loadCategories(): void {
    this.categorieService.getCategories().subscribe(data => this.categories = data);
  }

  loadGarages(): void {
    this.garageService.getGarages().subscribe(data => {
      this.garages = data;
      this.addGarageMarkers();
    });
  }

  private initializeMap(): void {
    this.map = this.L.map('map').setView([-18.9563819, 47.5215452], 8);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private addGarageMarkers(): void {
    this.garages.forEach(garage => {
      const marker = this.L.marker([garage.latitude, garage.longitude]).addTo(this.map);

      const popupContent = `
        <strong>${garage.localisation}</strong><br>
        Contact: ${garage.contact}<br>
        <button class="btn btn-primary btn-sm mt-1" id="btn-garage-${garage._id}">
          Prendre rendez-vous
        </button>
      `;

      marker.bindPopup(popupContent);

      // Quand le popup s'ouvre, on peut écouter le clic sur le bouton
      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`btn-garage-${garage._id}`);
          if (btn) {
            btn.addEventListener('click', () => {
              // Stocker le garage dans localStorage
              localStorage.setItem('garageSelectionne', JSON.stringify(garage));
              // Rediriger
              this.router.navigate(['/prendre-rdv']);
            });
          }
        }, 0);
      });
    });
  }
}
