import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TodoList } from 'src/app/models/todo-list';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(
    private storageService: LocalStorageService
  ) { }

  public getAllTodos(): Observable<TodoList[]> {
    return of(this.storageService.getDataByKey<TodoList[]>('todos') ?? [])
  }
}
