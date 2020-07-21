import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import * as moment from 'node_modules/moment/moment';
import { AppSettings } from 'src/app/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) { }


  /**
   * Returns a promise with the Cycle report for the specified subscription and date.
   */
  public getCycleReport(subscriptionUuid: string, date: Date) {
    const m = moment(date);
    const url = `${this.settingsService.settings.apiUrlDocker}`
      + `/reports/${subscriptionUuid}/cycle/${m.format(AppSettings.MOMENT_ISO_DATE_FORMAT)}Z/`;
    return this.http.get(url);
  }

  /**
   * Returns a promise with the Monthly report for the specified subscription and date.
   */
  public getMonthlyReport(subscriptionUuid: string, date: Date) {
    const m = moment(date);
    const url = `${this.settingsService.settings.apiUrlDocker}`
      + `/reports/${subscriptionUuid}/monthly/${m.format(AppSettings.MOMENT_ISO_DATE_FORMAT)}Z/`;
    return this.http.get(url);
  }
}
