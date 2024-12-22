import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  getProfiles(): Observable<any> {
    return this.http.get(`${environment.API_URL}/profile`);
  }

  getProfile(id): Observable<any> {
    return this.http.get(`${environment.API_URL}/profile/${id}`);
  }

  createProfile(profileData: any): Observable<any> {
    return this.http.post(`${environment.API_URL}/profile`, profileData);
  }

  getWiFiZones(): Observable<any> {
    return this.http.get(`${environment.API_URL}/wifizone`);
  }

  deleteProfile(id): Observable<any>{
    return this.http.delete(`${environment.API_URL}/profile/${id}`);
  }

  buyTiket(tiket: any): Observable<any>{
    return this.http.put(`${environment.API_URL}/tiket/${tiket.id}`,tiket);
  }

  importTikets(tikets: any){
    return this.http.post(`${environment.API_URL}/tiket`, tikets);
  }
}
