import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApixuService {
  private readonly baseUrl = environment.production
    ? 'https://api.weatherstack.com/current'
    : '/api/current';

  constructor(private http: HttpClient) {}

  getWeather(location: string): Observable<unknown> {
    let params = new HttpParams().set('query', location);
    if (environment.production) {
      params = params.set('access_key', environment.weatherstackApiKey);
    }
    return this.http.get(this.baseUrl, { params });
  }
}
