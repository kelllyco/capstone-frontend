import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faRightFromBracket, faHouse, faComment } from '@fortawesome/free-solid-svg-icons';
import { ProjectsHttpService } from '../../services/projects.service';
import { take } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private router: Router, private projectsHttp: ProjectsHttpService) {}

  comment = faComment;
  logout = faRightFromBracket;
  house = faHouse;
  
  openChatbot = false;

  navDashboard() {
    this.router.navigate(['/dashboard']);
  }

  clickChatbot() {
    this.openChatbot = !this.openChatbot;
  }

  navLogout() {
    window.location.href = '/.auth/logout';
  }
  
}
