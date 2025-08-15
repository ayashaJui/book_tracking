import { Component } from '@angular/core';

@Component({
  selector: 'app-user-settings',
  standalone: false,
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.scss',
})
export class UserSettings {
  // In a real app, bind these values from backend
  settings = {
    language: 'English',
    timezone: 'GMT+6 (Dhaka)',
    currency: 'BDT',
    theme: 'Auto',
    fontSize: 'Medium',
    showCovers: true,

    dailyReminder: '20:00',
    wishlistAlerts: true,

    quoteOfDay: true,
    priceDropThreshold: 20,

    accountPrivacy: 'Private',
    twoFA: false,

    defaultSort: 'Title (A→Z)',
    defaultView: 'Grid',
  };
}
