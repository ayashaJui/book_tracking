import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
    itemsPerPage: 25,
    tags: ['Fiction', 'Non-Fiction', 'Philosophy'],
  };

  constructor(private router: Router, private messageService: MessageService) {}

  // === Settings Management ===
  saveAllSettings() {
    // In a real app, this would make an API call to save settings
    this.messageService.add({
      severity: 'success',
      summary: 'Settings Saved Successfully!',
      detail:
        'All your preferences have been saved and will be synced across your devices.',
      life: 5000,
    });
  }

  resetToDefaults() {
    // Reset all settings to default values
    this.settings = {
      language: 'English',
      timezone: 'GMT+6 (Dhaka)',
      currency: 'BDT',
      theme: 'Auto',
      fontSize: 'Medium',
      showCovers: true,
      dailyReminder: '20:00',
      wishlistAlerts: true,
      goalAlerts: true,
      backupFrequency: 'Weekly',
      exportEnabled: true,
      importEnabled: true,
      accountPrivacy: 'Private',
      twoFA: false,
      passwordLastUpdated: 'Mar 2024',
      connectedDevices: [
        { id: 1, name: 'Chrome on Windows', lastActive: 'Aug 18, 2025' },
        { id: 2, name: 'Android Phone', lastActive: 'Aug 15, 2025' },
      ],
      integrations: {
        goodreads: true,
        googleDrive: false,
        calendar: true,
      },
      defaultSort: 'Title (A→Z)',
      defaultView: 'Grid',
      itemsPerPage: 25,
      tags: ['Fiction', 'Non-Fiction', 'Philosophy'],
    };

    this.messageService.add({
      severity: 'info',
      summary: 'Settings Reset',
      detail:
        "All settings have been reset to their default values. Don't forget to save if you want to keep these changes!",
      life: 4000,
    });
  }

  // === Advanced Features ===
  exportData(format: 'csv' | 'json') {
    // In a real app, this would generate and download the file
    this.messageService.add({
      severity: 'info',
      summary: `${format.toUpperCase()} Export Started`,
      detail: `Your data export in ${format.toUpperCase()} format will begin shortly.`,
      life: 3000,
    });
  }

  importData() {
    // In a real app, this would open a file picker
    this.messageService.add({
      severity: 'info',
      summary: 'Import Data',
      detail: 'Please select a file to import your reading data.',
      life: 3000,
    });
  }

  connectIntegration(service: string) {
    // In a real app, this would handle OAuth or API connections
    this.messageService.add({
      severity: 'info',
      summary: `Connect to ${service}`,
      detail: `Opening ${service} connection dialog...`,
      life: 3000,
    });
  }

  // === Device Management ===
  disconnectDevice(index: number) {
    this.settings.connectedDevices.splice(index, 1);
  }

  addDevice(device: { id: number; name: string; lastActive: string }) {
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
    this.settings.tags = this.settings.tags.filter((t) => t !== tag);
  }

  // === Navigation Helper ===
  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}
