import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UiService } from '../../services/ui.service.service';

@Component({
  selector: 'app-toast-msg',
  standalone: false,
  templateUrl: './toast-msg.html',
  styleUrl: './toast-msg.scss',
  providers: [MessageService]
})
export class ToastMsg implements OnInit, OnDestroy {
  private toastSubscription: Subscription = new Subscription();

  constructor(
    private uiService: UiService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Subscribe to UI service toast messages
    this.toastSubscription = this.uiService.toastMessageQueue.subscribe((toast) => {
      this.messageService.add({
        severity: toast.type,
        summary: toast.summary,
        detail: toast.message
      });
    });
  }

  ngOnDestroy() {
    // Clean up the subscription to prevent memory leaks
    this.toastSubscription.unsubscribe();
  }
}
