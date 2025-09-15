import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  templateUrl: `./app.menu.html`,
})
export class AppMenu {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/dashboard'],
          },
        ],
      },
      {
        label: 'Tracking',
        items: [
          {
            label: 'Books',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/books'],
          },
          {
            label: 'Authors',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/authors'],
          },
          {
            label: 'Reading Logs',
            icon: 'fa fa-solid fa-book-open-reader',
            routerLink: ['/reading-logs'],
          },
          {
            label: 'Wishlist',
            icon: 'fa-solid fa-heart-circle-plus',
            routerLink: ['/wishlist'],
          },
          {
            label: 'Series Tracking',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/series'],
          },
          {
            label: 'Quotes',
            icon: 'fa-solid fa-quote-left',
            class: 'rotated-icon',
            routerLink: ['/quotes'],
          },
          {
            label: 'Reviews',
            icon: 'pi pi-fw pi-comments',
            routerLink: ['/reviews'],
          },
          {
            label: 'Spending',
            icon: 'pi pi-fw pi-money-bill',
            routerLink: ['/spendings'],
          },
          {
            label: 'Analytics',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: ['/analytics'],
          },
        ],
      },
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        // routerLink: ['/pages'],
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            routerLink: ['/profile'],
          },
          {
            label: 'Settings',
            icon: 'pi pi-fw pi-cog',
            routerLink: ['/settings'],
          },
          //   {
          //     label: 'Auth',
          //     icon: 'pi pi-fw pi-user',
          //     items: [
          //       {
          //         label: 'Login',
          //         icon: 'pi pi-fw pi-sign-in',
          //         routerLink: ['/auth/login'],
          //       },
          //       {
          //         label: 'Error',
          //         icon: 'pi pi-fw pi-times-circle',
          //         routerLink: ['/auth/error'],
          //       },
          //       {
          //         label: 'Access Denied',
          //         icon: 'pi pi-fw pi-lock',
          //         routerLink: ['/auth/access'],
          //       },
          //     ],
          //   },
          //   {
          //     label: 'Crud',
          //     icon: 'pi pi-fw pi-pencil',
          //     routerLink: ['/pages/crud'],
          //   },
          //   {
          //     label: 'Not Found',
          //     icon: 'pi pi-fw pi-exclamation-circle',
          //     routerLink: ['/pages/notfound'],
          //   },
          //   {
          //     label: 'Empty',
          //     icon: 'pi pi-fw pi-circle-off',
          //     routerLink: ['/pages/empty'],
          //   },
        ],
      },
    ];
  }
}
