import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
// import { LoadingService } from '../services/loading.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(
    // private loadingService: LoadingService,
    private spinner: NgxSpinnerService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Afficher le spinner
    this.spinner.show();

    return next.handle(req).pipe(
      // Masquer le spinner une fois la requête terminée
      finalize(() => this.spinner.hide())
    );
  }
}
