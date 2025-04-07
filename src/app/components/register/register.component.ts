import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: '',
    pseudo: '',       
    nom: '',          
    prenom: '',       
    dtn: ''           
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // Envoi des données au backend
    this.authService.register(this.user).subscribe({
      next: (res) => {
        alert('Inscription réussie !');
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        alert('Erreur : ' + err.error.message);
      }
    });
  }
}