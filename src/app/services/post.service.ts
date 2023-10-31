import { Injectable } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  uploadBytes,
} from '@angular/fire/storage';
import { getStorage, ref } from 'firebase/storage';
import { Post } from '../models/post';
import {
  DocumentData,
  Firestore,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CategoryArray } from '../models/category-array';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private afs: Firestore) {}

  async uploadImage(
    file: File,
    postData: Post,
    formStatus: string,
    id: string
  ) {
    try {
      const storage = getStorage();
      const filePath = `postIMG/${Date.now()}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      postData.postImgPath = await getDownloadURL(ref(storage, filePath));
      if (formStatus === 'Edit') {
        await this.updateData(id, postData);
      } else {
        await this.saveData(postData);
      }
    } catch (error) {
      console.error('Error saving data', error);
      throw new Error('Failed to update data');
    }
  }

  async saveData(postData: Post) {
    try {
      await addDoc(collection(this.afs, 'posts'), postData);
    } catch (error) {
      console.error('Error adding post: ', error);
      throw new Error('Failed to save data');
    }
  }

  loadData(): Observable<CategoryArray[]> {
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(
        collection(this.afs, 'posts'),
        (snapshot: QuerySnapshot) => {
          const data: { data: DocumentData; id: string }[] = [];
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

  loadOneData(id: string): Observable<DocumentData> {
    return new Observable((observer) => {
      onSnapshot(
        doc(this.afs, 'posts', id),
        (doc) => {
          observer.next(doc.data());
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  async updateData(id: string, postData: any) {
    try {
      const docSnap = await getDoc(doc(this.afs, 'posts', id));
      if (docSnap.exists()) {
        const postImgPath = docSnap.data()['postImgPath'];
        this.deleteImage(postImgPath);
        await updateDoc(doc(this.afs, 'posts', id), postData);
      }
    } catch (error) {
      console.error('Error updating document', error);
      throw new Error('Failed to update data');
    }
  }

  async deleteImage(postImgPath: string) {
    try {
      const storage = getStorage();
      await deleteObject(ref(storage, postImgPath));
    } catch (error) {
      console.error('Error deleting image: ', error);
      throw new Error('Failed to delete image');
    }
  }

  async deleteData(postImgPath: string, id: string) {
    try {
      await deleteDoc(doc(this.afs, 'posts', id));
      await this.deleteImage(postImgPath);
    } catch (error) {
      console.error('Error deleting data: ', error);
      throw new Error('Failed to delete data');
    }
  }

  async markFeatured(id: string, featuredData: { isFeatured: boolean }) {
    try {
      await updateDoc(doc(this.afs, 'posts', id), featuredData);
    } catch (error) {
      console.error('Error', error);
      throw new Error('Failed to mark post');
    }
  }
}
