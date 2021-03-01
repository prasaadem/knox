import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/analytics';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  analytics = firebase.analytics();

  constructor() {}

  logEvent(name: string = '') {
    this.analytics.logEvent(name);
  }
}
