import { Component, OnInit } from '@angular/core';
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
    private galleryService: GalleryService
  ) { }

  ngOnInit(): void {
    this.items$ = this.galleryService.getAllTodos();
  }

}
