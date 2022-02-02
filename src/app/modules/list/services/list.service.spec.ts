import { TestBed } from '@angular/core/testing';
import { TodoListStub } from 'src/app/mocks/todo-mocks';
import { TodoList } from 'src/app/models/todo-list';
import { LocalStorageService } from 'src/app/services/local-storage.service';

import { ListService } from './list.service';

describe('ListService', () => {
  let service: ListService;
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService
      ]
    });
    service = TestBed.inject(ListService);
    localStorageService = TestBed.inject(LocalStorageService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Получение списка дел по id', () => {
    it('Метод getListById должен вернуть всю информацию по списку дел c заданным id', () => {
      spyOn(localStorageService, 'getDataByKey').and.returnValue(TodoListStub);
      service.getListById(1).subscribe(
        todo => expect(todo).toEqual(TodoListStub[0])
      )
    });

    it('Метод getListById должен вернуть null, если в сторе нету данных по этому ключу', () => {
      spyOn(localStorageService, 'getDataByKey').and.returnValue(null);
      service.getListById(1).subscribe(
        todo => expect(todo).toEqual(null)
      ) 
    })

    it('Метод getListById должен вернуть null если по указанному id нету записей', () => {
      spyOn(localStorageService, 'getDataByKey').and.returnValue(TodoListStub);
      service.getListById(3).subscribe(
        todo => expect(todo).toEqual(null)
      )
    })
  })

  describe('Сохранение информации по списку дел', () => {
    const newTodoList: TodoList = {
      id: 0,
      title: 'Учеба',
      items: [
        { id: 1, description: 'Сделать матан', done: false }
      ]
    }

    it('Метод saveList должен сохранить новый список в стор, если такого еще не было', () => {
      spyOn(localStorageService, 'getDataByKey').and.returnValue(TodoListStub);
      spyOn(localStorageService, 'setDataByKey').and.callFake(() => {})
      service.saveList(newTodoList)
      expect(localStorageService.setDataByKey).toHaveBeenCalledWith('todos', JSON.stringify(
        [
          ...TodoListStub,
          {
            ...newTodoList,
            id: TodoListStub.length + 1
          }
        ]
      ));
    })

    it('Метод saveList должен обновить имеющийся список в сторе, если с таким id список присутстует', () => {
      const updatedList = {
        ...newTodoList,
        id: 3,
        items: [
          { id: 1, description: 'Сделать матан', done: true }
        ]
      }
      spyOn(localStorageService, 'getDataByKey').and.returnValue([
        ...TodoListStub,
        {
          id: 3,
          items: [
            { id: 1, description: 'Сделать матан', done: true }
          ]
        }
      ]);
      spyOn(localStorageService, 'setDataByKey').and.callFake(() => {})
      service.saveList(updatedList)
      expect(localStorageService.setDataByKey).toHaveBeenCalledWith('todos', JSON.stringify([
        ...TodoListStub,
        updatedList
      ]));
    })
  })
});
