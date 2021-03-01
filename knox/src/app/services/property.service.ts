import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StyleCompiler } from '@angular/compiler';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { IProperty, Property } from '../models/property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  zId: string = 'X1-ZWz16rvsi73mrv_64j9s';

  constructor(private afs: AngularFirestore, private http: HttpClient) {}

  async getProperties(uid: string) {
    let snapshot = await this.afs
      .collection('properties', (ref) => ref.where('uid', '==', uid))
      .get()
      .toPromise();

    var properties: Property[] = [];
    snapshot.forEach((doc) => {
      properties.push(<Property>doc.data());
    });
    return properties;
  }
  async saveProperty(src: Property) {
    let properties = await this.fetchProperties(src);
    src = {
      ...src,
      properties: <IProperty[]>(properties || []),
    };

    let propertyRef = this.afs.collection(`properties`);
    return await propertyRef.doc().set(src, { merge: true });
  }

  async fetchProperties(src: Property) {
    return await this.http
      .get(`https://us-central1-knox-306023.cloudfunctions.net/properties`, {
        params: {
          address: src.address,
          citystate_zip: src.zipCode,
        },
      })
      .toPromise();
  }

  async fetchPropertyInfoById(id: string) {
    return await this.http
      .get(`https://us-central1-knox-306023.cloudfunctions.net/info`, {
        params: {
          id: id,
        },
      })
      .toPromise();
  }

  parseProperty(property: any) {}
}
