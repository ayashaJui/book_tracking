import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PublisherService } from '../../../publishers/services/publisher.service';
import { Publisher } from '../../../publishers/models/publisher.model';

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

  // Tag management properties
  showAddTagDialog = false;
  newTagName = '';
  editingTagIndex = -1;
  editingTagName = '';

  // Publisher management properties
  showPublisherManagement = false;
  publishers: Publisher[] = [];
  showAddPublisherDialog = false;
  showEditPublisherDialog = false;
  editingPublisher: Publisher | null = null;
  newPublisherData = {
    name: '',
    location: '',
    website: '',
    description: ''
  };

  constructor(
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private publisherService: PublisherService
  ) {
    this.loadPublishers();
  }

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
    this.confirmationService.confirm({
      message:
        'Are you sure you want to reset all settings to default values? This action cannot be undone.',
      header: 'Reset to Defaults',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      accept: () => {
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
      },
    });
  }

  // === Password Management ===
  changePassword() {
    this.messageService.add({
      severity: 'info',
      summary: 'Change Password',
      detail: 'Opening password change dialog...',
      life: 3000,
    });

    // In a real app, this would open a password change modal/dialog
    // For now, we'll simulate the action
    setTimeout(() => {
      this.settings.passwordLastUpdated = new Date().toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'short',
        }
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Password Updated',
        detail: 'Your password has been successfully changed.',
        life: 3000,
      });
    }, 2000);
  }

  // === Two-Factor Authentication ===
  toggleTwoFA() {
    if (!this.settings.twoFA) {
      // Enabling 2FA
      this.messageService.add({
        severity: 'info',
        summary: 'Setting up Two-Factor Authentication',
        detail: 'Please scan the QR code with your authenticator app...',
        life: 5000,
      });

      // Simulate 2FA setup
      setTimeout(() => {
        this.settings.twoFA = true;
        this.messageService.add({
          severity: 'success',
          summary: '2FA Enabled',
          detail:
            'Two-factor authentication has been successfully enabled for your account.',
          life: 4000,
        });
      }, 3000);
    } else {
      // Disabling 2FA
      this.confirmationService.confirm({
        message:
          'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
        header: 'Disable 2FA',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.settings.twoFA = false;
          this.messageService.add({
            severity: 'warn',
            summary: '2FA Disabled',
            detail: 'Two-factor authentication has been disabled.',
            life: 3000,
          });
        },
      });
    }
  }

  // === Theme Management ===
  onThemeChange(theme: string) {
    this.settings.theme = theme;
    // Apply theme immediately
    this.applyTheme(theme);
    this.messageService.add({
      severity: 'info',
      summary: 'Theme Changed',
      detail: `Theme changed to ${theme}`,
      life: 2000,
    });
  }

  private applyTheme(theme: string) {
    // In a real app, this would change the actual theme
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');

    if (theme === 'Dark') {
      body.classList.add('dark-theme');
    } else if (theme === 'Light') {
      body.classList.add('light-theme');
    } else {
      // Auto theme - detect system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    }
  }

  // === Font Size Management ===
  onFontSizeChange(fontSize: string) {
    this.settings.fontSize = fontSize;
    this.applyFontSize(fontSize);
    this.messageService.add({
      severity: 'info',
      summary: 'Font Size Changed',
      detail: `Font size changed to ${fontSize}`,
      life: 2000,
    });
  }

  private applyFontSize(fontSize: string) {
    const body = document.body;
    body.classList.remove('font-small', 'font-medium', 'font-large');

    switch (fontSize) {
      case 'Small':
        body.classList.add('font-small');
        break;
      case 'Large':
        body.classList.add('font-large');
        break;
      default:
        body.classList.add('font-medium');
    }
  }

  // === Notification Settings ===
  onReminderTimeChange(time: string) {
    this.settings.dailyReminder = time;
    this.messageService.add({
      severity: 'info',
      summary: 'Reading Reminder Updated',
      detail: `Daily reading reminder set for ${time}`,
      life: 3000,
    });
  }

  toggleNotification(type: 'wishlistAlerts' | 'goalAlerts') {
    const isEnabled = this.settings[type];
    const notificationType =
      type === 'wishlistAlerts' ? 'Price Alerts' : 'Goal Alerts';

    this.messageService.add({
      severity: isEnabled ? 'success' : 'info',
      summary: `${notificationType} ${isEnabled ? 'Enabled' : 'Disabled'}`,
      detail: `${notificationType} have been ${
        isEnabled ? 'enabled' : 'disabled'
      }`,
      life: 3000,
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

    // Simulate file generation and download
    setTimeout(() => {
      const data = this.generateExportData(format);
      this.downloadFile(
        data,
        `book-data.${format}`,
        format === 'json' ? 'application/json' : 'text/csv'
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Export Complete',
        detail: `Your data has been exported as ${format.toUpperCase()} file.`,
        life: 3000,
      });
    }, 2000);
  }

  private generateExportData(format: 'csv' | 'json'): string {
    // Sample data structure for export
    const sampleData = {
      books: [
        {
          title: 'Sample Book 1',
          author: 'Author 1',
          rating: 5,
          dateRead: '2025-01-15',
        },
        {
          title: 'Sample Book 2',
          author: 'Author 2',
          rating: 4,
          dateRead: '2025-02-20',
        },
      ],
      settings: this.settings,
      exportDate: new Date().toISOString(),
    };

    if (format === 'json') {
      return JSON.stringify(sampleData, null, 2);
    } else {
      // Convert to CSV format
      let csv = 'Title,Author,Rating,Date Read\n';
      sampleData.books.forEach((book) => {
        csv += `"${book.title}","${book.author}",${book.rating},"${book.dateRead}"\n`;
      });
      return csv;
    }
  }

  private downloadFile(content: string, filename: string, contentType: string) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  importData() {
    // In a real app, this would open a file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.processImportFile(file);
      }
    };
    input.click();
  }

  private processImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const content = e.target.result;
        // Basic validation
        if (file.name.endsWith('.json')) {
          JSON.parse(content);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Import Successful',
          detail: `Data from ${file.name} has been imported successfully.`,
          life: 4000,
        });
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Import Failed',
          detail: 'The selected file is not valid or corrupted.',
          life: 4000,
        });
      }
    };
    reader.readAsText(file);
  }

  // === Backup Management ===
  onBackupFrequencyChange(frequency: string) {
    this.settings.backupFrequency = frequency;
    this.messageService.add({
      severity: 'info',
      summary: 'Backup Frequency Updated',
      detail: `Automatic backup frequency set to ${frequency}`,
      life: 3000,
    });
  }

  createManualBackup() {
    this.messageService.add({
      severity: 'info',
      summary: 'Creating Backup',
      detail: 'Creating a manual backup of your data...',
      life: 3000,
    });

    // Simulate backup creation
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Backup Created',
        detail: 'Manual backup has been created successfully.',
        life: 3000,
      });
    }, 2000);
  }

  restoreFromBackup() {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to restore from backup? This will overwrite your current data.',
      header: 'Restore from Backup',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Restoring Data',
          detail: 'Restoring your data from the latest backup...',
          life: 3000,
        });

        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Restore Complete',
            detail: 'Your data has been restored from backup.',
            life: 3000,
          });
        }, 3000);
      },
    });
  }

  connectIntegration(service: string) {
    const serviceLower = service.toLowerCase().replace(' ', '');
    const isConnected =
      this.settings.integrations[
        serviceLower as keyof typeof this.settings.integrations
      ];

    if (isConnected) {
      // Disconnect service
      this.confirmationService.confirm({
        message: `Are you sure you want to disconnect from ${service}?`,
        header: `Disconnect ${service}`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.settings.integrations[
            serviceLower as keyof typeof this.settings.integrations
          ] = false;
          this.messageService.add({
            severity: 'info',
            summary: `Disconnected from ${service}`,
            detail: `Your ${service} integration has been disconnected.`,
            life: 3000,
          });
        },
      });
    } else {
      // Connect service
      this.messageService.add({
        severity: 'info',
        summary: `Connecting to ${service}`,
        detail: `Opening ${service} authorization window...`,
        life: 3000,
      });

      // Simulate OAuth connection
      setTimeout(() => {
        this.settings.integrations[
          serviceLower as keyof typeof this.settings.integrations
        ] = true;
        this.messageService.add({
          severity: 'success',
          summary: `Connected to ${service}`,
          detail: `Successfully connected to ${service}. Data sync is now enabled.`,
          life: 4000,
        });
      }, 2000);
    }
  }

  // === Integration Sync ===
  syncIntegrationData(service: string) {
    this.messageService.add({
      severity: 'info',
      summary: `Syncing ${service}`,
      detail: `Synchronizing data with ${service}...`,
      life: 3000,
    });

    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sync Complete',
        detail: `Data synchronization with ${service} completed successfully.`,
        life: 3000,
      });
    }, 3000);
  }

  // === Privacy Settings ===
  onPrivacyChange(privacy: string) {
    this.settings.accountPrivacy = privacy;
    this.messageService.add({
      severity: 'info',
      summary: 'Privacy Setting Updated',
      detail: `Account privacy set to ${privacy}`,
      life: 3000,
    });
  }

  // === Advanced Preferences ===
  onSortingChange(sortOption: string) {
    this.settings.defaultSort = sortOption;
    this.messageService.add({
      severity: 'info',
      summary: 'Default Sorting Updated',
      detail: `Default sorting changed to ${sortOption}`,
      life: 2000,
    });
  }

  onViewChange(view: string) {
    this.settings.defaultView = view;
    this.messageService.add({
      severity: 'info',
      summary: 'Default View Updated',
      detail: `Default view changed to ${view}`,
      life: 2000,
    });
  }

  onItemsPerPageChange(items: number) {
    this.settings.itemsPerPage = items;
    this.messageService.add({
      severity: 'info',
      summary: 'Items Per Page Updated',
      detail: `Items per page set to ${items}`,
      life: 2000,
    });
  }

  // === Language and Locale ===
  onLanguageChange(language: string) {
    this.settings.language = language;
    this.messageService.add({
      severity: 'info',
      summary: 'Language Changed',
      detail: `Interface language changed to ${language}`,
      life: 3000,
    });

    // In a real app, this would trigger language loading
    this.loadLanguage(language);
  }

  private loadLanguage(language: string) {
    // Simulate language loading
    console.log(`Loading language: ${language}`);
  }

  onTimezoneChange(timezone: string) {
    this.settings.timezone = timezone;
    this.messageService.add({
      severity: 'info',
      summary: 'Timezone Updated',
      detail: `Timezone changed to ${timezone}`,
      life: 3000,
    });
  }

  onCurrencyChange(currency: string) {
    this.settings.currency = currency;
    this.messageService.add({
      severity: 'info',
      summary: 'Currency Updated',
      detail: `Currency changed to ${currency}`,
      life: 3000,
    });
  }

  // === Cover Display ===
  onShowCoversChange(showCovers: boolean) {
    this.settings.showCovers = showCovers;
    this.messageService.add({
      severity: 'info',
      summary: 'Cover Display Updated',
      detail: `Book covers are now ${showCovers ? 'enabled' : 'disabled'}`,
      life: 2000,
    });
  }

  // === Device Management ===
  disconnectDevice(index: number) {
    const device = this.settings.connectedDevices[index];
    this.confirmationService.confirm({
      message: `Are you sure you want to disconnect "${device.name}"?`,
      header: 'Disconnect Device',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.settings.connectedDevices.splice(index, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Device Disconnected',
          detail: `"${device.name}" has been disconnected from your account.`,
          life: 3000,
        });
      },
    });
  }

  addDevice(device: { id: number; name: string; lastActive: string }) {
    this.settings.connectedDevices.push(device);
    this.messageService.add({
      severity: 'success',
      summary: 'Device Added',
      detail: `"${device.name}" has been added to your connected devices.`,
      life: 3000,
    });
  }

  removeDevice(index: number) {
    const device = this.settings.connectedDevices[index];
    this.confirmationService.confirm({
      message: `Are you sure you want to remove "${device.name}"? This will sign out the device from your account.`,
      header: 'Remove Device',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.settings.connectedDevices.splice(index, 1);
        this.messageService.add({
          severity: 'warn',
          summary: 'Device Removed',
          detail: `"${device.name}" has been removed and signed out.`,
          life: 3000,
        });
      },
    });
  }

  refreshDeviceList() {
    this.messageService.add({
      severity: 'info',
      summary: 'Refreshing Device List',
      detail: 'Updating connected devices...',
      life: 2000,
    });

    // Simulate refresh
    setTimeout(() => {
      // Update last active times
      this.settings.connectedDevices.forEach((device) => {
        if (device.name.includes('Chrome')) {
          device.lastActive = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        }
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Device List Updated',
        detail: 'Connected devices have been refreshed.',
        life: 2000,
      });
    }, 1000);
  }

  // === Tag Management ===
  addTag(tag: string) {
    if (!tag || tag.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Tag',
        detail: 'Tag name cannot be empty.',
        life: 2000,
      });
      return;
    }

    if (!this.settings.tags.includes(tag.trim())) {
      this.settings.tags.push(tag.trim());
      this.messageService.add({
        severity: 'success',
        summary: 'Tag Added',
        detail: `Tag "${tag}" has been added.`,
        life: 2000,
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Tag Exists',
        detail: `Tag "${tag}" already exists.`,
        life: 2000,
      });
    }
  }

  addNewTag() {
    if (this.newTagName && this.newTagName.trim()) {
      this.addTag(this.newTagName.trim());
      this.newTagName = '';
      this.showAddTagDialog = false;
    }
  }

  cancelAddTag() {
    this.newTagName = '';
    this.showAddTagDialog = false;
  }

  editTagInline(index: number, currentTag: string) {
    this.editingTagIndex = index;
    this.editingTagName = currentTag;
  }

  saveEditedTag() {
    if (this.editingTagName && this.editingTagName.trim()) {
      const oldTag = this.settings.tags[this.editingTagIndex];
      const newTag = this.editingTagName.trim();

      if (oldTag !== newTag) {
        // Check if new tag name already exists
        if (this.settings.tags.includes(newTag)) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Tag Exists',
            detail: `Tag "${newTag}" already exists.`,
            life: 2000,
          });
          return;
        }

        this.settings.tags[this.editingTagIndex] = newTag;
        this.messageService.add({
          severity: 'success',
          summary: 'Tag Updated',
          detail: `Tag "${oldTag}" has been renamed to "${newTag}".`,
          life: 2000,
        });
      }

      this.cancelEditTag();
    }
  }

  cancelEditTag() {
    this.editingTagIndex = -1;
    this.editingTagName = '';
  }

  removeTag(tag: string) {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove the tag "${tag}"? This will remove it from all associated books.`,
      header: 'Remove Tag',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.settings.tags = this.settings.tags.filter((t) => t !== tag);
        this.messageService.add({
          severity: 'info',
          summary: 'Tag Removed',
          detail: `Tag "${tag}" has been removed.`,
          life: 2000,
        });
      },
    });
  }

  editTag(oldTag: string, newTag: string) {
    if (!newTag || newTag.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Tag',
        detail: 'Tag name cannot be empty.',
        life: 2000,
      });
      return;
    }

    const index = this.settings.tags.indexOf(oldTag);
    if (index !== -1) {
      this.settings.tags[index] = newTag.trim();
      this.messageService.add({
        severity: 'success',
        summary: 'Tag Updated',
        detail: `Tag "${oldTag}" has been renamed to "${newTag}".`,
        life: 2000,
      });
    }
  }

  // === Account Management ===
  deleteAccount() {
    this.confirmationService.confirm({
      message:
        'Are you absolutely sure you want to delete your account? This action is irreversible and will permanently delete all your data.',
      header: 'Delete Account',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-trash',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Account Deletion Initiated',
          detail:
            'Your account deletion request has been submitted. You will receive a confirmation email.',
          life: 5000,
        });
      },
    });
  }

  downloadAccountData() {
    this.messageService.add({
      severity: 'info',
      summary: 'Preparing Account Data',
      detail: 'Compiling all your account data for download...',
      life: 3000,
    });

    setTimeout(() => {
      const accountData = {
        profile: {
          /* user profile data */
        },
        books: {
          /* all book data */
        },
        settings: this.settings,
        activity: {
          /* reading activity */
        },
        exportDate: new Date().toISOString(),
      };

      const dataString = JSON.stringify(accountData, null, 2);
      this.downloadFile(dataString, 'my-account-data.json', 'application/json');

      this.messageService.add({
        severity: 'success',
        summary: 'Account Data Downloaded',
        detail: 'Your complete account data has been downloaded.',
        life: 3000,
      });
    }, 2000);
  }

  // === Publisher Management ===
  loadPublishers() {
    this.publishers = this.publisherService.getPublishers();
  }

  openAddPublisherDialog() {
    this.newPublisherData = {
      name: '',
      location: '',
      website: '',
      description: ''
    };
    this.showAddPublisherDialog = true;
  }

  createPublisher() {
    if (this.newPublisherData.name.trim()) {
      const newPublisher = this.publisherService.createPublisher(this.newPublisherData);
      if (newPublisher) {
        this.loadPublishers();
        this.showAddPublisherDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Publisher Added',
          detail: `${newPublisher.name} has been added successfully.`,
          life: 3000,
        });
      }
    }
  }

  editPublisher(publisher: Publisher) {
    this.editingPublisher = { ...publisher };
    this.showEditPublisherDialog = true;
  }

  updatePublisher() {
    if (this.editingPublisher && this.editingPublisher.id) {
      const updated = this.publisherService.updatePublisher(this.editingPublisher as any);
      if (updated) {
        this.loadPublishers();
        this.showEditPublisherDialog = false;
        this.editingPublisher = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Publisher Updated',
          detail: `${updated.name} has been updated successfully.`,
          life: 3000,
        });
      }
    }
  }

  deletePublisher(publisher: Publisher) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${publisher.name}? This action cannot be undone.`,
      header: 'Delete Publisher',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.publisherService.deletePublisher(publisher.id!);
        this.loadPublishers();
        this.messageService.add({
          severity: 'success',
          summary: 'Publisher Deleted',
          detail: `${publisher.name} has been deleted.`,
          life: 3000,
        });
      }
    });
  }

  cancelPublisherDialog() {
    this.showAddPublisherDialog = false;
    this.showEditPublisherDialog = false;
    this.editingPublisher = null;
  }

  // === Navigation Helper ===
  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  navigateToPublishers() {
    this.router.navigate(['/publishers']);
  }
}
