import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-assignment-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h2>Angular week-09</h2>
   <nav>
      <a routerLink="/assignment/view" routerLinkActive="active">View</a> |
      <a routerLink="/assignment/form" routerLinkActive="active">Form</a>
    </nav>
    <router-outlet></router-outlet> 
  `,
  styles: [`
    .active { font-weight: bold; color: blue; text-decoration: underline; }
    nav { margin-bottom: 20px; }
  `]
})
export class AssignmentRootComponent {}
