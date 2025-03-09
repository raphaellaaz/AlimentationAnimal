import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  imports: [MatSidenavModule],
  templateUrl: './sidenav.component.html',
  standalone: true,
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

}


