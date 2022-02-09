import { ListItem } from '../models/list-item';
import { TodoList } from '../models/todo-list';

export const TodoListItems: ListItem[] = [
  {
    id: 1,
    description: 'Купить творожок',
    done: false
  },
  {
    id: 2,
    description: 'Купить молоко',
    done: false
  }
]

export const AnotherTodoListItems: ListItem[] = [
  {
    id: 1,
    description: 'Повесить полку',
    done: false
  },
  {
    id: 2,
    description: 'Вынести мусор',
    done: false
  }
]

export const TodoListStub: TodoList[] = [
  {
    id: 1,
    title: 'Покупочки в магазине',
    items: TodoListItems
  },
  {
    id: 2,
    title: 'Дела по дому',
    items: AnotherTodoListItems
  }
];
