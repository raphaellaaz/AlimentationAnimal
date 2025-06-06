import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list'; // Import MatListModule
import { MatIconModule } from '@angular/material/icon';   // Import MatIconModule
import { MatDividerModule } from '@angular/material/divider'; // Import MatDividerModule
import { RouterLink, RouterLinkActive } from '@angular/router'; // Import RouterLink and RouterLinkActive

@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    MatListModule,      // Add MatListModule
    MatIconModule,      // Add MatIconModule
    MatDividerModule,   // Add MatDividerModule
    RouterLink,         // Add RouterLink
    RouterLinkActive    // Add RouterLinkActive
  ],
  templateUrl: './sidenav.component.html',
  standalone: true,
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  isExpanded = false; // Sidenav starts collapsed

  mouseEnter() {
    if (!this.isExpanded) {
      this.isExpanded = true;
    }
  }

  mouseLeave() {
    if (this.isExpanded) {
      this.isExpanded = false;
    }
  }

  // Future: Could add logic here to handle sidenav events or properties
}


