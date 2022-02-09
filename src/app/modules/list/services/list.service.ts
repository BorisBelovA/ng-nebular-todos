import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TodoList } from 'src/app/models/todo-list';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  constructor(
    private storageService: LocalStorageService
  ) { }

  public getListById(listId: number): Observable<TodoList | null> {
    const list = this.storageService.getDataByKey<TodoList[]>('todos');
    if (!list) {
      return of(null)
    }
    return of(list.find(i => i.id === listId) ?? null)
  }

  public saveList(list: TodoList): void {
    const listMap: Map<number, TodoList> = new Map();
    this.storageService.getDataByKey<TodoList[]>('todos')?.forEach(l => listMap.set(l.id, l));
    if (Array.from(listMap.keys()).length === 0) {
      this.storageService.setDataByKey('todos', JSON.stringify([{
        ...list,
        id: 1
      }]))
    } else {
      if (listMap.has(list.id)) {
        listMap.set(list.id, list);
        this.storageService.setDataByKey('todos', JSON.stringify(Array.from(listMap.values())));
      } else {
        this.storageService.setDataByKey('todos', JSON.stringify([
          ...Array.from(listMap.values()),
          {
            ...list,
            id: Array.from(listMap.keys()).length + 1
          }
        ]))
      }
    }
  }
}
