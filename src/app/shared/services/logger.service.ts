import { Inject, Injectable } from '@angular/core';
import { APIResources } from 'src/app/app.constant';
import { HttpWrapperService } from './Http-services/http-wrapper.service';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from './global-error-handler.service';

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical',
}

export class log {
  constructor(
    public pPageCode?: string,
    public pMessage?: string
  ) { }
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(private httpClient: HttpClient) {}
  private logLevel: LogLevel = LogLevel.Info; // Set the default log level

  public setLogLevel(logLevel: LogLevel): void {
    this.logLevel = logLevel;
  }

  private log(logLevel: LogLevel, payload: any): void {
    if (this.isLogLevelEnabled(logLevel)) {
      const timestamp = new Date().toISOString();
      console.log(`${logLevel} [${timestamp}]:`, payload);
    }
  }

  public debug(payload: any): void {
    this.log(LogLevel.Debug, payload);
  }

  public info(payload: any): void {
    this.log(LogLevel.Info, payload);
  }

  public warning(payload: any): void {
    this.log(LogLevel.Warning, payload);
  }

  public error(payload: any): void {
    let objLogError = {
      message: payload?.error?.message,
      filename: payload?.error?.filename,
      lineno: payload?.error?.lineno,
      logLevel: LogLevel.Error,
      timestamp: new Date().toISOString()
    }
    const str = JSON.stringify(objLogError);
    this.logToDB(str);
  }

  public critical(payload: any): void {
    this.log(LogLevel.Critical, payload);
  }

  private isLogLevelEnabled(logLevel: LogLevel): boolean {
    const logLevelOrder = [
      LogLevel.Debug,
      LogLevel.Info,
      LogLevel.Warning,
      LogLevel.Error,
      LogLevel.Critical,
    ];
    const currentLogLevelIndex = logLevelOrder.indexOf(this.logLevel);
    const targetLogLevelIndex = logLevelOrder.indexOf(logLevel);
    return targetLogLevelIndex >= 0 && targetLogLevelIndex >= currentLogLevelIndex;
  }

  post(url: string, body: any, headers?: any): Observable<any> {
    return this.httpClient.post(url, body, {
      headers: headers,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle the error here
        console.error('An error occurred:', error);        
        // Optionally, you can rethrow the error to propagate it to the subscriber
        return throwError(error.message);
      })
    );
  }


  public logToDB(pMessage: string) {
    if (pMessage !== '') {
      let body = new log()
      body.pMessage = pMessage;
      body.pPageCode = LogLevel.Error;
      this.post(APIResources.log, body)
        .subscribe(async (result) => {
          //debugger
        },
          (err: any) => {
            console.log(err?.message);
          })

    }
  }
}
