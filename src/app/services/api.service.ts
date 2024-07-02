import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl:string="https://localhost:7073/api/";

  constructor(private http: HttpClient) { }

 
  public getRequest(url: string, options?:{ headers?: HttpHeaders }): Observable<any> {
    return this.http.get<any>(this.baseUrl + url,options);
  }

  public postRequest(url: string, param: {}, options?:{ headers?: HttpHeaders }) {
    return this.http.post(this.baseUrl + url, param,options)
      .pipe(
        catchError(this.errorHandler.bind(this)) // then handle the error
      );
  }

  public putRequest(url: string, param: {}, options?:{ headers?: HttpHeaders }): Observable<any> {
    return this.http.put<any>(this.baseUrl + url, param, options).pipe(
      catchError(this.errorHandler)
    );
  }

  login(email: string, pass: string): Observable<any> {
    let data={
      userEmail:email,
      password:pass
    }
    
    const url=this.baseUrl+"User/Login";
    return this.http.post<any>(url, data);
  } 


  logout(url: string, options?: { headers?: HttpHeaders }): Observable<any> {
    return this.http.post<any>(this.baseUrl + url, null, options);
  }
  

  public getPageRequest(url: string, page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.http.get<any>(this.baseUrl + url, { params });
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    }
    else {
      errorMessage = 'error code :$(error.status)\nMessage:${error.message}'
    }
    console.log(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
