import { Injectable } from '@angular/core';
import { ColorScheme, LayoutService } from '../../../layout/service/layout.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { SessionKeys } from '../../../utilities/utilities';
import { ToastMessage } from '../models/toast.message';


@Injectable({
  providedIn: 'root',
})
export class UiService {
  private colorSchemeSubject: BehaviorSubject<ColorScheme> =
    new BehaviorSubject<ColorScheme>(
      (localStorage.getItem(SessionKeys.colorScheme) || 'light') as ColorScheme
    );

  toastMessageQueue: Subject<ToastMessage> = new Subject<ToastMessage>();

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

  setCustomError(summary: string, message: string) {
    let toast: ToastMessage = {
      message: message,
      summary: summary,
      type: 'error',
    };
    this.setNewMessage(toast);
  }

  private setNewMessage(toast: ToastMessage) {
    this.toastMessageQueue.next(toast);
  }
}
