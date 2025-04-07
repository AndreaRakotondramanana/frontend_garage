import { Component } from '@angular/core';
import { Prestation, PrestationService } from '../../services/prestation.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-categorie',
  imports: [CommonModule],
  templateUrl: './detail-categorie.component.html',
  styleUrl: './detail-categorie.component.css'
})
export class DetailCategorieComponent {
  prestations: Prestation[] = [];
  categorieId = '';
  libelleCategorie = '';
  descriptionCategorie = '';

  constructor(private route: ActivatedRoute, private prestationService: PrestationService) {}

  ngOnInit(): void {
    this.categorieId = this.route.snapshot.paramMap.get('id') || '';

    this.prestationService.getByCategorie(this.categorieId).subscribe({
      next: data => {
        this.prestations = data;
        if (data.length > 0) {
          this.libelleCategorie = data[0].categorieId.libelle_categorie;
          this.descriptionCategorie = data[0].categorieId.description;
        }
      },
      error: err => console.error('Erreur:', err)
    });
  }
}
