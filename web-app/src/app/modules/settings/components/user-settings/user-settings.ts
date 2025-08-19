import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

    // Appearance
    theme: 'Auto',
    fontSize: 'Medium',
    showCovers: true,

    // Notifications
    dailyReminder: '20:00',
    wishlistAlerts: true,
    goalAlerts: true, // milestone/progress alerts

    // Data & Backup
    backupFrequency: 'Weekly',
    exportEnabled: true,
    importEnabled: true,

    // Privacy & Security
    accountPrivacy: 'Private',
    twoFA: false,
    passwordLastUpdated: 'Mar 2024',
    connectedDevices: [
      { id: 1, name: 'Chrome on Windows', lastActive: 'Aug 18, 2025' },
      { id: 2, name: 'Android Phone', lastActive: 'Aug 15, 2025' },
    ],

    // Integrations
    integrations: {
      goodreads: true,
      googleDrive: false,
      calendar: true,
    },

    // Advanced Preferences
    defaultSort: 'Title (A→Z)',
    defaultView: 'Grid',
    tags: ['Fiction', 'Non-Fiction', 'Philosophy'],
  };

  constructor(private router: Router) {}

  // === Device Management ===
  disconnectDevice(index: number) {
    this.settings.connectedDevices.splice(index, 1);
  }


  addDevice(device: { id: number, name: string; lastActive: string }) {
    this.settings.connectedDevices.push(device);
  }

  removeDevice(index: number) {
    this.settings.connectedDevices.splice(index, 1);
  }

  addTag(tag: string) {
    if (!this.settings.tags.includes(tag)) {
      this.settings.tags.push(tag);
    }
  }

  removeTag(tag: string) {
    this.settings.tags = this.settings.tags.filter(t => t !== tag);
  }

  // === Navigation Helper ===
  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}
