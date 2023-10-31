import { Injectable } from '@angular/core';
import {
  Firestore,
  QuerySnapshot,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Sub } from '../models/sub';

@Injectable({
  providedIn: 'root',
})
export class SubscribersService {
  constructor(private afs: Firestore) {}

  loadData(): Observable<Sub[]> {
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(
        collection(this.afs, 'subscribers'),
        (snapshot: QuerySnapshot) => {
          const data: Sub[] = [];
          snapshot.docs.forEach((doc) => {
            data.push({
              name: doc.data()['name'],
              email: doc.data()['email'],
              id: doc.id
            });
          });
          observer.next(data);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  async deleteData(id: string) {
    try {
      await deleteDoc(doc(this.afs, 'subscribers', id));
    } catch (error) {
      console.error('Error deleting data', error);
      throw new Error('Failed to delete data');
    }
  }
}
