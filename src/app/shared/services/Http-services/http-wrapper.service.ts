import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { DataStorageService } from '../data-storage.service';
import { GlobalErrorHandlerService } from '../global-error-handler.service';
@Injectable({
  providedIn: 'root'
})
export class HttpWrapperService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private httpClient: HttpClient,
    public dataStorageService: DataStorageService,
    private globalErrorHandleService: GlobalErrorHandlerService
  ) {}

  get(url: string, headers?: any): Observable<any> {
    return this.httpClient.get(url, { headers: headers || this.httpOptions.headers }).pipe(
      catchError(this.globalErrorHandleService.handleError)
    );
  }

  post(url: string, body: any, headers?: any): Observable<any> {
    return this.httpClient.post(url, body, {
      headers: headers,
    }).pipe(
      catchError(this.globalErrorHandleService.handleError)
    );
  }

  delete(url: string, headers?: any): Observable<any> {
    return this.httpClient.delete(url, {
      headers: headers
    }).pipe(
      catchError(this.globalErrorHandleService.handleError)
    );
  }


}
