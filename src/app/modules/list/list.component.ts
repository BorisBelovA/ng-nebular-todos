import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { TodoList } from 'src/app/models/todo-list';
import { ListService } from './services/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public list: TodoList = this.newList();

  public inputValue = '';

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId && +listId > 0) {
      this.getTodoById(+listId).pipe(
        tap(todo => {
          this.list = todo ?? this.newList();
        })
      ).subscribe();
    }
  }

  public addNewitem(): void {
    this.list.items.push({
      id: this.list.items.length + 1,
      description: this.inputValue,
      done: false
    });
    this.inputValue = '';
  }

  public getTodoById(listId: number): Observable<TodoList | null> {
    return this.listService.getListById(listId);
  }

  public newList(): TodoList {
    return {
      id: 0,
      title: '',
      items: []
    }
  }

  public backToGallery(): void {
    this.trySaveList();
    this.router.navigate(['/gallery'])
  }

  public remove(id: number): void {
    this.list = {
      ...this.list,
      items: this.list.items.filter(i => i.id !== id)
    }
  }

  public ngOnDestroy(): void {
    this.trySaveList();
  }

  private trySaveList(): void {
    if (this.list.title) {
      this.listService.saveList(this.list);
    }
  }
}
