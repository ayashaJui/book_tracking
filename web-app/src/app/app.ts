import { Component, OnInit, signal } from '@angular/core';
import { UiService } from './modules/shared/services/ui.service.service';
import { ColorScheme } from './layout/service/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('Biblioteca');
  color!: ColorScheme;

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.color = (
      localStorage.getItem('colorScheme')
        ? <string>localStorage.getItem('colorScheme')
        : 'light'
    ) as ColorScheme;
    this.uiService.changeColorScheme(this.color);
  }
}
