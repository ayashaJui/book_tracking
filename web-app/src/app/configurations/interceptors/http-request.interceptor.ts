import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { AuthenticationService } from '../../modules/shared/services/authentication.service';
import { UiService } from '../../modules/shared/services/ui.service.service';
import {
  AlertMessage,
  AlertType,
  ErrorCode,
  ErrorMessage,
} from '../../utilities/utilities';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private unauthorizedError$ = new Subject<void>();
  private logoutTriggered = false;

  constructor(
    private oauthService: OAuthService,
    private authService: AuthenticationService,
    private uiService: UiService
  ) {
    // if unauthorized error occurs, trigger logout only once
    this.unauthorizedError$
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        switchMap(() => {
          if (!this.logoutTriggered) {
            this.logoutTriggered = true;
            this.authService.logout();
          }
          return [];
        })
      )
      .subscribe(() => (this.logoutTriggered = false));
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      this.oauthService.getAccessToken() &&
      req.url.toString().indexOf('token') < 0
    ) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return next.handle(req).pipe(
      tap(),
      catchError((err: HttpErrorResponse) => {
        if (
          err.status === ErrorCode.INTERNAL_SERVER_ERROR &&
          err.error.error === ErrorMessage.SERVER_ERROR
        ) {
          this.uiService.setCustomError(AlertType.FAILED, AlertMessage.FAILED);
        }

        throw err.statusText;
      })
    );
  }
}
