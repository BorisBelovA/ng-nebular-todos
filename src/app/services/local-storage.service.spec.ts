import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let store: Record<string, string | null> = {};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    const mockLocalStorage = {
      getItem: (key: string): any => {
        return store[key] ?? null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Должно сохранить данные в local storage по ключу', () => {
    const mockJson = [{name: "test data"}];
    service.setDataByKey('testKey', JSON.stringify(mockJson));
    expect(JSON.parse(store['testKey']!)).toEqual(mockJson);
  })

  it('Должно вернуть данные по ключу или null', () => {
    const mockJson = [{name: "test data"}];
    store['testKey'] = JSON.stringify(mockJson);
    expect(service.getDataByKey<Array<any>>('testKey')).toEqual(mockJson);
    expect(service.getDataByKey<Array<any>>('awdw')).toEqual(null);
  })
});
