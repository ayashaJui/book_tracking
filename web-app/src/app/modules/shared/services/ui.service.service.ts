import { Injectable } from '@angular/core';
import { ColorScheme, LayoutService } from '../../../layout/service/layout.service';
import { BehaviorSubject } from 'rxjs';
import { SessionKeys } from '../../../utilities/utilities';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private colorSchemeSubject: BehaviorSubject<ColorScheme> =
    new BehaviorSubject<ColorScheme>(
      (localStorage.getItem(SessionKeys.colorScheme) || 'light') as ColorScheme
    );

  colorScheme$ = this.colorSchemeSubject.asObservable();

  constructor(private layoutService: LayoutService) {}

  setColorScheme(newColorScheme: ColorScheme) {
    localStorage.setItem(SessionKeys.colorScheme, newColorScheme);
    this.colorSchemeSubject.next(newColorScheme);
  }

  changeColorScheme(colorScheme: ColorScheme) {
    this.layoutService.layoutConfig.update((state) => {
      const newDarkTheme = colorScheme === 'dark';
      return {
        ...state,
        darkTheme: newDarkTheme,
      };
    });
  }
}
