import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar implements OnInit {
  isCollapsed = false;
  profileMenuOpen = false;
  notificationsCount = 3;

  ngOnInit(): void {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu() {
    this.profileMenuOpen = false;
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }

  logout() {
    // Add logout logic (like clearing token & navigating to login)
    console.log('Logged out');
  }
}
