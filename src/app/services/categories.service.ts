import { Injectable } from '@angular/core';
import {
  Firestore,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Category } from '../models/category';
import { Observable } from 'rxjs';
import { CategoryArray } from '../models/category-array';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private afs: Firestore) {}

  async saveData(data: Category) {
    try {
      await addDoc(collection(this.afs, 'categories'), data);
    } catch (error) {
      console.error('Error saving data: ', error);
      throw new Error('Failed to save data');
    }
  }

  loadData(): Observable<CategoryArray[]> {
    return new Observable<CategoryArray[]>((observer) => {
      const unsubscribe = onSnapshot(
        collection(this.afs, 'categories'),
        (snapshot: QuerySnapshot) => {
          const data: CategoryArray[] = [];
          snapshot.docs.forEach((doc) => {
            data.push({
              data: doc.data(),
              id: doc.id,
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

  async updateData(id: string, editData: { category: string }) {
    try {
      await updateDoc(doc(this.afs, 'categories', id), editData);
    } catch (error) {
      console.error('Error updating data', error);
      throw new Error('Failed to update data');
    }
  }

  async deleteData(id: string) {
    try {
      await deleteDoc(doc(this.afs, 'categories', id));
    } catch (error) {
      console.error('Error deleting data', error);
      throw new Error('Failed to delete data');
    }
  }
}
