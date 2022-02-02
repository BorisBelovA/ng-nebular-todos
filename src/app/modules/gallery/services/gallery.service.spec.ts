import { TestBed } from '@angular/core/testing';
import { TodoListStub } from 'src/app/mocks/todo-mocks';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { GalleryService } from './gallery.service';

describe('GalleryService', () => {
  let localStorageService: LocalStorageService;
  let service: GalleryService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService
      ]
    });
    service = TestBed.inject(GalleryService);
    localStorageService = TestBed.inject(LocalStorageService)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Плучение всех списков дел', () => {
    it('метод getAllTodos должен вернуть Observable<TodoList[]>', () => {
      spyOn(localStorageService, 'getDataByKey').and.returnValue(TodoListStub);
      service.getAllTodos().subscribe(
        todos => expect(todos).toEqual(TodoListStub)
      )
    })

    it('метод getAllTodos должен вернуть Observable<[]> если из стора пришел null', () => {
      spyOn(localStorageService, 'getDataByKey').and.returnValue(null);
      service.getAllTodos().subscribe(
        todos => expect(todos).toEqual([])
      )
    })

  })
});
