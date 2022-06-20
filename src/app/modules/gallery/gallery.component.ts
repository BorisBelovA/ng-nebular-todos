import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TodoList } from 'src/app/models/todo-list';
import { GalleryService } from './services/gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  public items$!: Observable<TodoList[]>

  constructor(
    private galleryService: GalleryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.items$ = this.galleryService.getAllTodos();
  }

  public openTodo(id: number): void {
    this.router.navigate([`list/${id}`])
  }

  public newTodo(): void {
    this.router.navigate(['list/0'])
  }

}
