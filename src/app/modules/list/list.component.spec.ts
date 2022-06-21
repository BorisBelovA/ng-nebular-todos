import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NbListModule,
  NbCardModule,
  NbCheckboxModule,
  NbButtonModule,
  NbInputModule,
  NbStatusService,
  NbFocusMonitor,
  NbLayoutModule,
  NbIconModule
} from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing'
import { of } from 'rxjs';
import { TodoListStub } from 'src/app/mocks/todo-mocks';

import { ListComponent } from './list.component';
import { ListService } from './services/list.service';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let listServiceSpy = jasmine.createSpyObj('ListService', ['getListById', 'saveList'])
  let router: Router;
  let route: ActivatedRoute;

  const getHeaderInput = () => fixture.debugElement.query(By.css('[data-id="list-header-input"]'))
  const getListItemByDataId = (id: number) => fixture.debugElement.query(By.css(`[data-id="item-${id}"]`));
  const getElementByDataId = (dataId: string) => fixture.debugElement.query(By.css(`[data-id="${dataId}"]`));
  const spyOnRouteId = (id: string) => spyOn(route.snapshot.paramMap, 'get').and.returnValue(id)
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        CommonModule,
        FormsModule,
        NbListModule,
        NbLayoutModule,
        NbCardModule,
        NbCheckboxModule,
        NbButtonModule,
        NbInputModule,
        RouterTestingModule.withRoutes([]),
        NbIconModule,
        NbEvaIconsModule
      ],
      providers: [
        { provide: ListService, useValue: listServiceSpy },
        NbStatusService,
        NbFocusMonitor
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router)
    route = TestBed.inject(ActivatedRoute)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Инициализация компонента', () => {
    it('Загрузить информацию о списке дел по id, если в url id !== 0', () => {
      spyOnRouteId('1');
      listServiceSpy.getListById.and.returnValue(of(TodoListStub[0]));
      fixture.detectChanges();

      expect(listServiceSpy.getListById).toHaveBeenCalledWith(1)
    })

    it('Создать пустой список дел, если в url id === 0', () => {
      spyOnRouteId('0');   
      fixture.detectChanges();

      expect(component.list).toEqual(component.newList())
    })
  })

  describe('Проверка заголовка для списка дел', () => {

    it('Заголовок должен содержать имя списка дел, если он был ранее создан', () => {
      fixture.detectChanges();
      spyOnRouteId('1');
      listServiceSpy.getListById.and.returnValue(of(TodoListStub[0])); 
      fixture.detectChanges();

      expect(getHeaderInput().nativeElement.value).toEqual(component.list.title)
    })

    it('Заголовок должен содержать пустую строку, если список новый', () => {
      spyOnRouteId('0');      
      fixture.detectChanges();

      expect(getHeaderInput().nativeElement.value).toEqual('')
    })
  })

  describe('Перечень дел из списка', () => {
    it('При загрузке списка дел, все его элементы должны быть отображены в качестве списка', () => {
      spyOnRouteId('1');
      listServiceSpy.getListById.and.returnValue(of(TodoListStub[0]));
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('.list-item')).length).toEqual(TodoListStub[0].items.length)
    });

    it('Если список новый, то должен быть один элемент в списке с пустым описанием', () => {
      spyOnRouteId('0');
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('.list-item')).length).toEqual(0);      
    })

    it('При клике на чекбокс у соответствеющего элемента, должно меняться состояние элемента', () => {
      spyOnRouteId('1');
      listServiceSpy.getListById.and.returnValue(of(TodoListStub[0]));
      fixture.detectChanges();

      component.list.items[0].done = false;
      component.list.items[1].done = false;
      fixture.detectChanges();

      expect(getListItemByDataId(component.list.items[0].id).classes).not.toContain('done')
      expect(getListItemByDataId(component.list.items[1].id).classes).not.toContain('done')
      
      getElementByDataId('checkbox_' + component.list.items[0].id).children[0].nativeElement.click()
      fixture.detectChanges();

      expect(getListItemByDataId(component.list.items[0].id).nativeElement).toHaveClass('done')
      expect(getListItemByDataId(component.list.items[1].id).nativeElement).not.toHaveClass('done')

      getElementByDataId('checkbox_' + component.list.items[0].id).children[0].nativeElement.click()
      fixture.detectChanges();

      expect(getListItemByDataId(component.list.items[0].id).nativeElement).not.toHaveClass('done')
      expect(getListItemByDataId(component.list.items[1].id).nativeElement).not.toHaveClass('done')
    })
  })

  describe('Добавление нового пункта в список', () => {
    it('Кнопка добавления записи должна быть заблокирована, если поле ввода не заполнено', () => {
      spyOnRouteId('0');
      fixture.detectChanges();

      component.inputValue = '';
      fixture.detectChanges();
      expect(getElementByDataId('add-item-btn').nativeElement).toHaveClass('btn-disabled');
    })

    it('Если поле ввода было заполнено и нажата кнопка "Добавить запись, то должен появится новый пункт в списке', () => {
      spyOnRouteId('0');
      fixture.detectChanges();

      component.inputValue = 'Тестовая запись';
      fixture.detectChanges();
      console.log(component.inputValue);
      
      getElementByDataId('add-item-btn').nativeElement.click()
      fixture.detectChanges()

      expect(component.list.items.length).toEqual(1);
      expect(component.list.items[0].description).toEqual('Тестовая запись');
    })
  })

  describe('Нажатие на кнопку "Вернуться ко всем спискам"', () => {


    it('Должен быть вызван метод router.navigate', () => {
      const spy = spyOn(router, 'navigate');
      getElementByDataId('back-to-all-lists').nativeElement.click()
      fixture.detectChanges()
      expect(spy).toHaveBeenCalledWith(['/gallery']);
    })

    it('Если к моменту возврата список не имел названия, то метод ListService.saveList вызываться не должен', () => {
      spyOnRouteId('0');
      fixture.detectChanges()
      getElementByDataId('back-to-all-lists').nativeElement.click()
      fixture.detectChanges()
      expect(listServiceSpy.saveList).not.toHaveBeenCalled()
    })

    it('При нажатии на кнопку "Вернуться ко всем спискам" должен быть вызван метод ListService.saveList с параметром this.list', () => {
      component.list.title = 'Тестовый список дел';
      component.list.items = [{ id: 1, description: 'Тестовое дело', done: false }];
      
      fixture.detectChanges();
      getElementByDataId('list-header-input').triggerEventHandler('ngModelChange', 'Тестовый список дел')
      fixture.detectChanges()
      getElementByDataId('back-to-all-lists').nativeElement.click()
      fixture.detectChanges()
      
      expect(listServiceSpy.saveList).toHaveBeenCalledWith(component.list);
    })
  })

  describe('Удаление элемента из списка дел', () => {
    it('При клике на кнопку удалить, элемент должен исчезнуть из списка', () => {
      component.list.title = 'Тестовый список дел';
      component.list.items = [{ id: 1, description: 'Тестовое дело', done: false }];
      component.remove(1);
      fixture.detectChanges();
      expect(component.list.items.length).toEqual(0);
    })
  })

});
