import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WiFiZoneService {

  constructor(private http: HttpClient) {}
  
  getWiFiZones(): Observable<any> {
    return this.http.get(`${environment.API_URL}/wifizone`);
  }
  createWiFiZone(wifizone: any): Observable<any> {
    return this.http.post(`${environment.API_URL}/wifizone`, wifizone);
  }
  deleteWiFiZone(id): Observable<any>{
    return this.http.delete(`${environment.API_URL}/wifizone/${id}`);
  }
}
