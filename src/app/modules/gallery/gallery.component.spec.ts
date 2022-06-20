import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NbButtonModule, NbCardModule, NbFocusMonitor, NbListModule, NbStatusService } from '@nebular/theme';
import { of } from 'rxjs';
import { TodoListItems, TodoListStub } from 'src/app/mocks/todo-mocks';

import { GalleryComponent } from './gallery.component';
import { GalleryService } from './services/gallery.service';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  const galleryServiceSpy = jasmine.createSpyObj('GalleryService', ['getAllTodos'])
  let router: Router;
  const getOneElementByDataId = (dataId: string) => fixture.debugElement.query(By.css(`[data-id="${dataId}"]`));
  const getAllElemtnsByDataId = (dataId: string) => fixture.debugElement.queryAll(By.css(`[data-id="${dataId}"]`));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalleryComponent],
      providers: [
        { provide: GalleryService, useValue: galleryServiceSpy },
        NbStatusService,
        NbFocusMonitor
      ],
      imports: [
        CommonModule,
        NbButtonModule,
        NbCardModule,
        NbListModule,
        RouterTestingModule.withRoutes([])
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router)
    galleryServiceSpy.getAllTodos.and.returnValue(of(TodoListStub))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Получение списка дел', () => {
    it('При инициализации компонента должен вызваться метод GalleryService.getAllTodos', () => {
      expect(galleryServiceSpy.getAllTodos).toHaveBeenCalled();
    });
  })

  describe('Оторажение списка дел', () => {
    it('Если есть дела в списке, то кол-во карточек должно быть равно их количеству', () => {
      expect(getAllElemtnsByDataId('todo-list-card').length).toEqual(TodoListStub.length)
    });

    it('Если списко дел пустой, то должна быть надпись "Все деля сделаны...."', () => {
      galleryServiceSpy.getAllTodos.and.returnValue(of([]));
      component.ngOnInit()
      fixture.detectChanges()
      expect(getAllElemtnsByDataId('todo-list-card').length).toEqual(0)
      expect(getOneElementByDataId('no-todos').nativeElement.innerText).toEqual('Все ваши дела сделаны')
    });
  })

  describe('Проверка одной карточки из списка дел', () => { 
    beforeEach(() => {
      galleryServiceSpy.getAllTodos.and.returnValue(of(TodoListStub));
      fixture.detectChanges();
    })

    it('Карточка должна содержать заголовок', () => {
      const card = getOneElementByDataId('todo-list-card');
      const header = card.query(By.css('[data-id="todo-lict-card-header"]'));
      expect(header.nativeElement.innerText).toEqual(TodoListStub[0].title)
    });

    it('Карточка должна содержать в перечне дел не более 5 элементов, остальные должны быть скрыты', () => {
      galleryServiceSpy.getAllTodos.and.returnValue(of([
        {
          id: 3,
          title: 'Очень длинный список',
          items: [
            { id: 1, description: 'Купить творожок', done: false },
            { id: 2, description: 'Купить творожок', done: false },
            { id: 3, description: 'Купить творожок', done: false },
            { id: 4, description: 'Купить творожок', done: false },
            { id: 5, description: 'Не видно на карточке', done: false },
            { id: 6, description: 'Не видно на карточке', done: false },
          ]
        }
      ]))
      component.ngOnInit();
      fixture.detectChanges();

      const card = getAllElemtnsByDataId('todo-list-card')[0];
      const visibleItems = card.queryAll(By.css('[data-id="todo-list-item"]'));
      expect(visibleItems.length).toEqual(5)
    });

    it('Если элемент в перечне дел имеет флаг done=true, то он должен иметь класс done', () => {
      galleryServiceSpy.getAllTodos.and.returnValue(of([
        ...TodoListStub,
        { 
          id: 3,
          title: 'Test',
          items: [
            { id: 1, description: 'Test test', done: false },
            { id: 2, description: 'Test test test', done: true }
          ]
        }
      ]));

      component.ngOnInit();
      fixture.detectChanges();

      const card = getAllElemtnsByDataId('todo-list-card')[2];
      const doneElement = card.query(By.css('[data-id="todo-list-item"].done'))
      const undoneElement = card.queryAll(By.css('[data-id="todo-list-item"]'))[0]
      
      expect(doneElement.nativeElement).toHaveClass('done')
      expect(undoneElement.nativeElement).not.toHaveClass('done');
    });
  })

  describe('Навигация по спискам дел', () => {
    beforeEach(() => {
      spyOn(router, 'navigate').and.callFake(() => new Promise(() => true));
    })

    it('При клике на список дел, должны перейти по адресу /list/id', () => {
      getOneElementByDataId('todo-list-card').triggerEventHandler('click', { id: 1 });
      expect(router.navigate).toHaveBeenCalledWith(['list/1'])
    });

    it('При нажатии на кнопку "Новый список", должны перейти по адресу /list/0', () => {
      getOneElementByDataId('add-item-list').triggerEventHandler('click', {});
      expect(router.navigate).toHaveBeenCalledWith(['list/0'])
    })
  })
});
