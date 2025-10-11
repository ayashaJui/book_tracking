import { Component } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-footer',
    templateUrl: `./app.footer.html`,
})
export class AppFooter {
    currentYear: number = new Date().getFullYear();
}
