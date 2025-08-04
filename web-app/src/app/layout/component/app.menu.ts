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
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        ],
      },
      {
        label: 'Tracking',
        items: [
          {
            label: 'Books',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/uikit/formlayout'],
          },
          {
            label: 'Wishlist',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: ['/uikit/input'],
          },
          {
            label: 'Quotes',
            icon: 'pi pi-fw pi-comment',
            class: 'rotated-icon',
            routerLink: ['/uikit/button'],
          },
          {
            label: 'Reviews',
            icon: 'pi pi-fw pi-comments',
            routerLink: ['/uikit/table'],
          },
          {
            label: 'Analytics',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: ['/uikit/list'],
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
